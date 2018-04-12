import { Drawer } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { componentType } from '../services'
import { RootReducerType, setActivePages } from '../store'
import { PageList } from './'

const mapStateToProps = (state: RootReducerType) => {
    return {
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        zoomMode: state.sensenetDocumentViewer.viewer.zoomMode,
        customZoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
    }
}

const mapDispatchToProps = {
    setActivePages,
}

export interface DocumentLayoutState {
    showThumbnails: boolean
    activePage?: number
}

class DocumentViewerLayoutComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>, DocumentLayoutState> {
    public state = { showThumbnails: true, activePage: 1 }
    public viewPort: HTMLDivElement | null = null

    public scrollTo(index: number) {
        this.setState({ ...this.state, activePage: index }, () => {
            scroller.scrollTo(`Page-${index}`, {
                containerId: 'sn-document-viewer-pages',
                smooth: 'easeInOutQuint',
                duration: 600,
                offset: -8,
            })

            if (this.state.showThumbnails) {
                scroller.scrollTo(`Thumbnail-${index}`, {
                    containerId: 'sn-document-viewer-thumbnails',
                    smooth: 'easeInOutQuint',
                    duration: 600,
                    offset: -8,
                })
            }

            if (this.props.activePages[0] !== index) {
                this.props.setActivePages([index])
            }

        })

    }

    public componentWillReceiveProps(newProps: this['props']) {
        if (this.props.activePages[0] !== newProps.activePages[0]) {
            this.scrollTo(newProps.activePages[0])
        }
    }

    private onResize() {
        const showThumbnails = innerWidth > 800
        if (this.state.showThumbnails !== showThumbnails) {
            this.setState({
                ...this.state,
                showThumbnails,
            })
        }
    }

    private resizeWatcher = this.onResize.bind(this)

    public componentWillMount() {
        addEventListener('resize', this.resizeWatcher)
    }

    public componentDidMount() {
        this.onResize()

    }

    public componentWillUnmount() {
        removeEventListener('resize', this.resizeWatcher)
    }

    public render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {this.props.children}
                <div style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    zIndex: 0,
                    position: 'relative',
                }}>
                    <PageList
                        showWidgets={true}
                        id="sn-document-viewer-pages"
                        zoomMode={this.props.zoomMode}
                        zoomLevel={this.props.customZoomLevel}
                        onPageClick={(ev, index) => this.scrollTo(index)}
                        elementNamePrefix="Page-"
                        images="preview"
                        tolerance={0}
                        padding={8}
                        activePage={this.state.activePage}
                    />

                    {this.state.showThumbnails ?
                        <Drawer variant={'persistent'} open anchor="right" PaperProps={{ style: { position: 'relative', width: '200px', height: '100%' } }}>
                            <PageList
                                showWidgets={false}
                                style={{ minWidth: 160 }}
                                id="sn-document-viewer-thumbnails"
                                zoomMode="fit"
                                zoomLevel={1}
                                onPageClick={(ev, index) => this.scrollTo(index)}
                                elementNamePrefix="Thumbnail-"
                                images="thumbnail"
                                tolerance={0}
                                padding={8}
                                activePage={this.state.activePage}
                            />
                        </Drawer>
                        : null
                    }
                </div>
            </div >
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayoutComponent)

export { connectedComponent as DocumentViewerLayout }
