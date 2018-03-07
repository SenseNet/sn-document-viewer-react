import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { Action, Dispatch } from 'redux'
import { DocumentData, PreviewImageData } from '../models'
import { ImageUtil } from '../services/ImageUtils'
import { RootReducerType } from '../store/RootReducer'
import { setActivePages, ViewerStateType } from '../store/Viewer'
import LayoutAppBar from './LayoutAppBar'
import PageList from './PageList'

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        document: state.documentState.document,
        images: state.previewImages.AvailableImages,
        viewer: state.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setActivePages: (pages: number[]) => dispatch(setActivePages(pages)),
    },
})

export interface DocumentLayoutProps {
    document: DocumentData
    images: PreviewImageData[]
    viewer: ViewerStateType
    actions: { setActivePages: (pages: number[]) => Action }
}

export interface DocumentLayoutState {
    showThumbnails: boolean
    activePage?: number
}

class DocumentViewerLayout extends React.Component<DocumentLayoutProps, DocumentLayoutState> {

    public canvas!: HTMLCanvasElement | null
    private imageUtils: ImageUtil = new ImageUtil()
    constructor(props: DocumentLayoutProps) {
        super(props)
        this.state = {
            showThumbnails: true,
        }
    }

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
            if (ev.ctrlKey) {
                this.props.actions.setActivePages([...this.props.viewer.activePages, index])
            } else {
                this.props.actions.setActivePages([index])
            }
        })

    }

    private onResize(ev: Event) {
        const showThumbnails = innerWidth > 800
        if (this.state.showThumbnails !== showThumbnails) {
            this.setState({
                ...this.state,
                showThumbnails: innerWidth > 800,
            })
        }
    }

    public componentWillMount() {
        addEventListener('resize', this.onResize.bind(this))
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
                <canvas ref={((c) => this.canvas = c)} style={{ display: 'none' }} />
                <LayoutAppBar />
                <div style={{
                    display: 'flex',
                    height: 'calc(100% - 64px)',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    <PageList
                        id="sn-document-viewer-pages"
                        canvas={this.canvas as HTMLCanvasElement}
                        zoomMode={this.props.viewer.zoomMode}
                        onPageClick={(ev, index) => this.scrollTo(ev, index)}
                        elementNamePrefix="Page-"
                        images="preview"
                        tolerance={256}
                        padding={8}
                        activePage={this.state.activePage}
                        imageUtil={this.imageUtils}
                    />

                    {this.state.showThumbnails ?
                        <div style={{ maxWidth: 180 }}>
                            <PageList
                                id="sn-document-viewer-thumbnails"
                                canvas={this.canvas as HTMLCanvasElement}
                                zoomMode="fit"
                                onPageClick={(ev, index) => this.scrollTo(ev, index)}
                                elementNamePrefix="Thumbnail-"
                                images="thumbnail"
                                tolerance={256}
                                padding={8}
                                activePage={this.state.activePage}
                                imageUtil={this.imageUtils}
                            />
                        </div>
                        : null
                    }

                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayout)
