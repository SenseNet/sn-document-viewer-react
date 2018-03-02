import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { Action, Dispatch } from 'redux'
import { DocumentData, PreviewImageData } from '../models'
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
    pagesViewPortWidth: number
    pagesViewPortHeight: number
    showThumbnails: boolean
}

class DocumentViewerLayout extends React.Component<DocumentLayoutProps, DocumentLayoutState> {

    public canvas!: HTMLCanvasElement | null
    constructor(props: DocumentLayoutProps) {
        super(props)
        this.state = {
            pagesViewPortHeight: 0,
            pagesViewPortWidth: 0,
            showThumbnails: true,
        }
    }

    public viewPort: HTMLDivElement | null = null

    public scrollTo(ev: React.MouseEvent<HTMLElement>, index: number) {
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
                    />
                    {/* <Grid item style={{ flexGrow: 1, flexShrink: 1, overflow: 'auto', height: '100%', padding: '1rem' }} id="sn-document-viewer-pages">
                        <Grid container direction="column">
                            {this.props.images.slice(0, 100).map((value) => (
                                <Page
                                    canvas={this.canvas as HTMLCanvasElement}
                                    viewportWidth={this.state.pagesViewPortWidth}
                                    viewportHeight={this.state.pagesViewPortHeight}
                                    key={value.Index}
                                    imageIndex={value.Index}
                                    onClick={(ev) => this.scrollTo(value.Index, ev)}
                                    zoomMode={this.props.viewer.zoomMode}
                                    elementNamePrefix="Page-"
                                />
                            ))}
                        </Grid>
                    </Grid> */}

                    {this.state.showThumbnails ?
                        <div style={{ maxWidth: 180 }}>
                            <PageList
                                id="sn-document-viewer-thumbnails"
                                canvas={this.canvas as HTMLCanvasElement}
                                zoomMode="fit"
                                onPageClick={(ev, index) => this.scrollTo(ev, index)}
                                elementNamePrefix="Thumbnail-"
                                images="thumbnail"
                            />
                        </div>
                        // (<Grid item style={{ flexGrow: 0, overflowX: 'hidden', overflowY: 'auto', height: '100%', padding: '.5rem' }} id="sn-document-viewer-previews">
                        //     <Grid container direction="column">
                        //         {this.props.images.slice(0, 100).map((value) => (
                        //             <Page
                        //                 canvas={this.canvas as HTMLCanvasElement}
                        //                 viewportWidth={180}
                        //                 viewportHeight={this.state.pagesViewPortHeight}
                        //                 key={value.Index}
                        //                 imageIndex={value.Index}
                        //                 onClick={(ev) => this.scrollTo(ev, value.Index)}
                        //                 zoomMode="fit"
                        //                 elementNamePrefix="Preview-"
                        //             />))}
                        //     </Grid>
                        // </Grid>)
                        : null
                    }

                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayout)
