import { Grid } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { Action, Dispatch } from 'redux'
import { DocumentData } from '../models'
import { PreviewImagesStateType } from '../store/PreviewImages'
import { RootReducerType } from '../store/RootReducer'
import { setPage, ViewerStateType } from '../store/Viewer'
import { DocumentPage } from './DocumentPage'
import LayoutAppBar from './LayoutAppBar'

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        document: state.documentState.document,
        images: state.previewImages,
        viewer: state.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setPage: (page: number) => dispatch(setPage(page)),
    },
})

export interface DocumentLayoutProps {
    document: DocumentData
    images: PreviewImagesStateType
    viewer: ViewerStateType
    actions: { setPage: (pageNo: number) => Action }
}

export interface DocumentLayoutState {
    pagesViewPortWidth: number
    pagesViewPortHeight: number
    showThumbnails: boolean
}

class DocumentViewerLayout extends React.Component<DocumentLayoutProps, DocumentLayoutState> {

    constructor(props: DocumentLayoutProps) {
        super(props)
        this.state = {
            pagesViewPortHeight: 0,
            pagesViewPortWidth: 0,
            showThumbnails: true,
        }
    }

    public viewPort: HTMLDivElement | null = null
    public componentWillMount() {
        addEventListener('resize', this.onResize.bind(this))
    }

    public componentWillUnmount() {
        removeEventListener('resize', this.onResize.bind(this))
    }

    public scrollTo(index: number, ev: React.MouseEvent<HTMLElement>) {
        scroller.scrollTo(`Page-${index}`, {
            containerId: 'sn-document-viewer-pages',
            smooth: 'easeInOutQuint',
            duration: 600,
            offset: -8,
        })
        scroller.scrollTo(`Preview-${index}`, {
            containerId: 'sn-document-viewer-previews',
            smooth: 'easeInOutQuint',
            duration: 600,
            offset: -8,
        })
        this.props.actions.setPage(index)
    }

    private onResize(ev: Event) {
        this.setupViewPort(null)
    }

    private setupViewPort(viewPort: HTMLDivElement | null) {
        if (viewPort) {
            this.viewPort = viewPort.querySelector('#sn-document-viewer-pages')
        }
        if (this.viewPort) {
            const newHeight = this.viewPort.clientHeight - 32
            const newWidth = this.viewPort.clientWidth - 32
            if (!this.state || newHeight !== this.state.pagesViewPortHeight || newWidth !== this.state.pagesViewPortWidth) {
                this.setState({
                    ...this.state,
                    pagesViewPortHeight: newHeight,
                    pagesViewPortWidth: newWidth,
                    showThumbnails: innerWidth > 800,
                })
            }
        }
    }

    public render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
            }}>
                <LayoutAppBar />
                <div ref={(viewPort) => this.setupViewPort(viewPort)} style={{
                    display: 'flex',
                    height: 'calc(100% - 64px)',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    <Grid item style={{ flexGrow: 1, flexShrink: 1, overflowX: 'hidden', overflowY: 'auto', height: '100%', padding: '1rem' }} id="sn-document-viewer-pages">
                        <Grid container direction="column">
                            {this.props.images.AvailableImages.map((value) => (
                                <DocumentPage
                                    viewportWidth={this.state.pagesViewPortWidth}
                                    viewportHeight={this.state.pagesViewPortHeight}
                                    key={value.Index}
                                    page={value}
                                    onClick={(ev) => this.scrollTo(value.Index, ev)}
                                    activePage={this.props.viewer.activePage}
                                    zoomMode={this.props.viewer.zoomMode}
                                    customZoomLevel={this.props.viewer.customZoomLevel}
                                    elementNamePrefix="Page-"
                                />
                            ))}
                        </Grid>
                    </Grid>

                    {this.state.showThumbnails ?
                        (<Grid item style={{ flexGrow: 0, overflowX: 'hidden', overflowY: 'auto', height: '100%', padding: '.5rem' }} id="sn-document-viewer-previews">
                            <Grid container direction="column">
                                {this.props.images.AvailableImages.map((value) => (
                                    <DocumentPage
                                        viewportWidth={180}
                                        viewportHeight={this.state.pagesViewPortHeight}
                                        key={value.Index}
                                        page={value}
                                        onClick={(ev) => this.scrollTo(value.Index, ev)}
                                        activePage={this.props.viewer.activePage}
                                        zoomMode="fit"
                                        customZoomLevel={this.props.viewer.customZoomLevel}
                                        elementNamePrefix="Preview-"
                                    />))}
                            </Grid>
                        </Grid>)
                        : null
                    }

                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayout)
