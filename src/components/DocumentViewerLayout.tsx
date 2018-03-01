import { Grid } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { scroller } from 'react-scroll'
import { Action, Dispatch } from 'redux'
import { DocumentData, PreviewImageData } from '../models'
import { RootReducerType } from '../store/RootReducer'
import { setActivePages, ViewerStateType } from '../store/Viewer'
import DocumentPage from './DocumentPage'
import LayoutAppBar from './LayoutAppBar'

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

        const observerke = new IntersectionObserver((entries, observer) => {
            // tslint:disable-next-line:no-console
            console.log('IntersectionObserverHeeee', entries)
            /** */
        }, {
            root: this.viewPort,
            rootMargin: '0px',
            threshold: 1.0,
        })

        observerke.thresholds.keys()
        // observerke.observe(document.querySelector('img') as HTMLElement)
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
        if (ev.ctrlKey) {
            this.props.actions.setActivePages([...this.props.viewer.activePages, index])
        } else {
            this.props.actions.setActivePages([index])
        }
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
                <canvas ref={((c) => this.canvas = c)} style={{ display: 'none' }} />
                <LayoutAppBar />
                <div ref={(viewPort) => this.setupViewPort(viewPort)} style={{
                    display: 'flex',
                    height: 'calc(100% - 64px)',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    <Grid item style={{ flexGrow: 1, flexShrink: 1, overflowX: 'hidden', overflowY: 'auto', height: '100%', padding: '1rem' }} id="sn-document-viewer-pages">
                        <Grid container direction="column">
                            {this.props.images.map((value) => (
                                <DocumentPage
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
                    </Grid>

                    {this.state.showThumbnails ?
                        (<Grid item style={{ flexGrow: 0, overflowX: 'hidden', overflowY: 'auto', height: '100%', padding: '.5rem' }} id="sn-document-viewer-previews">
                            <Grid container direction="column">
                                {this.props.images.map((value) => (
                                    <DocumentPage
                                        canvas={this.canvas as HTMLCanvasElement}
                                        viewportWidth={180}
                                        viewportHeight={this.state.pagesViewPortHeight}
                                        key={value.Index}
                                        imageIndex={value.Index}
                                        onClick={(ev) => this.scrollTo(value.Index, ev)}
                                        zoomMode="fit"
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
