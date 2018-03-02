import * as _ from 'lodash'
import { Grid } from 'material-ui'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { PreviewImageData } from '../models'
import { RootReducerType } from '../store/RootReducer'
import { ZoomMode } from '../store/Viewer'
import Page from './Page'

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        pages: state.previewImages.AvailableImages || [],
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {},
})

export interface PageListProps {
    pages: PreviewImageData[]
    id: string
    elementNamePrefix: string
    actions: {}
    zoomMode: ZoomMode
    canvas: HTMLCanvasElement
    images: 'preview' | 'thumbnail'
    onPageClick: (ev: React.MouseEvent<HTMLElement>, pageIndex: number) => void
}

export interface PageListState {
    scrollState: number
    viewportWidth: number
    viewportHeight: number
}

class PageList extends React.Component<PageListProps, PageListState> {

    constructor(props: PageListProps) {
        super(props)
        this.state = {
        } as any
    }

    public viewPort: any
    private onResize!: () => void

    public componentWillMount() {
        this.onResize = _.debounce(() => this.setupViewPort(), 100).bind(this)
        addEventListener('resize', this.onResize)
    }

    public componentDidMount() {
        this.onResize()
    }

    public componentWillUnmount() {
        removeEventListener('resize', this.onResize)
    }

    private setupViewPort() {
        if (!this.viewPort) {
            this.viewPort = document.querySelector(`#${this.props.id}`)
        }
        if (this.viewPort) {

            const newHeight = this.viewPort.clientHeight - 32
            const newWidth = this.viewPort.clientWidth - 32
            if (!this.state || newHeight !== this.state.viewportHeight || newWidth !== this.state.viewportWidth) {
                this.setState({
                    ...this.state,
                    viewportHeight: newHeight,
                    viewportWidth: newWidth,
                })
                this.forceUpdate()
            }
        }
    }

    public render() {
        return (
            <Grid item style={{ flexGrow: 1, flexShrink: 1, overflow: 'auto', height: '100%', padding: '1rem' }} id={this.props.id}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.pages.map((value) => (
                        <Page
                            canvas={this.props.canvas as HTMLCanvasElement}
                            viewportWidth={this.state.viewportWidth}
                            viewportHeight={this.state.viewportHeight}
                            key={value.Index}
                            imageIndex={value.Index}
                            onClick={(ev) => this.props.onPageClick(ev, value.Index)}
                            zoomMode={this.props.zoomMode}
                            elementNamePrefix={this.props.elementNamePrefix}
                            image={this.props.images}
                        />
                    ))}
                </div>
            </Grid>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageList)
