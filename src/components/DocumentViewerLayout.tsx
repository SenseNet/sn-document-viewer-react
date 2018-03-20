import { Drawer } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { Action } from 'redux'
import { Dispatch } from 'redux'
import { DocumentData, DocumentWidget, PageWidget, PreviewImageData } from '../models'
import { ImageUtil } from '../services/ImageUtils'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store/RootReducer'
import { setActivePages, ViewerStateType } from '../store/Viewer'
import LayoutAppBar from './LayoutAppBar'
import PageList from './PageList'

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        images: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
        viewer: state.sensenetDocumentViewer.viewer as ViewerStateType,
    }
}

const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => { actions: { setActivePages: (pages: number[]) => Action } }
    = (dispatch: Dispatch<RootReducerType>) => ({
        actions: {
            setActivePages: (pages: number[]) => dispatch(setActivePages(pages)),
        },
    })

export interface OwnProps {
    documentWidgets: DocumentWidget[]
    pageWidgets: PageWidget[]
}

export interface DocumentLayoutState {
    showThumbnails: boolean
    activePage?: number
}

class DocumentViewerLayout extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, DocumentLayoutState> {
    public state = { showThumbnails: true, activePage: 1 }
    private imageUtils: ImageUtil = new ImageUtil()
    public viewPort: HTMLDivElement | null = null

    public scrollTo(ev: React.MouseEvent<HTMLElement>, index: number) {
        ev.persist()
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
            if (ev.ctrlKey && this.props.viewer.activePages.indexOf(index) === -1) {
                this.props.actions.setActivePages([...this.props.viewer.activePages, index])
            } else {
                if (this.props.viewer.activePages[0] !== index) {
                    this.props.actions.setActivePages([index])
                }
            }
        })

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

    public componentWillMount() {
        addEventListener('resize', this.onResize.bind(this))
    }

    public componentDidMount() {
        this.onResize()

    }

    public componentWillUnmount() {
        removeEventListener('resize', this.onResize.bind(this))
    }

    public render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
            }}>
                <LayoutAppBar documentWidgets={this.props.documentWidgets} />
                <div style={{
                    display: 'flex',
                    height: 'calc(100% - 64px)',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    <PageList
                        id="sn-document-viewer-pages"
                        pageWidgets={this.props.pageWidgets}
                        zoomMode={this.props.viewer.zoomMode}
                        zoomLevel={this.props.viewer.customZoomLevel}
                        onPageClick={(ev, index) => this.scrollTo(ev, index)}
                        elementNamePrefix="Page-"
                        images="preview"
                        tolerance={0}
                        padding={8}
                        activePage={this.state.activePage}
                        imageUtil={this.imageUtils}
                    />

                    {this.state.showThumbnails ?
                        <Drawer variant={'permanent'} open anchor="right" PaperProps={{style: {position: 'inherit', height: '100%'}}}>
                                <PageList
                                    pageWidgets={[]}
                                    style={{ minWidth: 160 }}
                                    id="sn-document-viewer-thumbnails"
                                    zoomMode="fit"
                                    zoomLevel={1}
                                    onPageClick={(ev, index) => this.scrollTo(ev, index)}
                                    elementNamePrefix="Thumbnail-"
                                    images="thumbnail"
                                    tolerance={0}
                                    padding={8}
                                    activePage={this.state.activePage}
                                    imageUtil={this.imageUtils}
                                />
                        </Drawer>
                        : null
                    }

                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayout)
