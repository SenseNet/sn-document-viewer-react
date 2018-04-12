import * as _ from 'lodash'
import { Grid } from 'material-ui'
import * as React from 'react'
import { connect } from 'react-redux'
import { PreviewImageData } from '../models'
import { componentType, ImageUtil } from '../services'
import { RootReducerType, ZoomMode } from '../store'
import { Page } from './'

const mapStateToProps = (state: RootReducerType) => {
    return {
        pages: state.sensenetDocumentViewer.previewImages.AvailableImages || [],
    }
}

const mapDispatchToProps = {
}

export interface PageListProps {
    tolerance: number
    padding: number
    id: string
    elementNamePrefix: string
    zoomMode: ZoomMode
    zoomLevel: number
    images: 'preview' | 'thumbnail'
    activePage?: number
    onPageClick: (ev: React.MouseEvent<HTMLElement>, pageIndex: number) => void
    style?: React.CSSProperties
    showWidgets: boolean
}

export interface PageListState {
    marginTop: number
    marginBottom: number
    scrollState: number
    pagesToSkip: number
    pagesToTake: number
    viewportWidth: number
    viewportHeight: number
    visiblePages: PreviewImageData[]
}

class PageList extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, PageListProps>, PageListState> {

    public state: PageListState = {
        marginTop: 0,
        marginBottom: 0,
        scrollState: 0,
        pagesToSkip: 0,
        viewportWidth: 110,
        viewportHeight: 110,
        pagesToTake: 32,
        visiblePages: this.props.pages.slice(0, 3),
    }

    public canUpdate: boolean = false
    public viewPort: any
    private onResize!: () => void
    private onScroll!: () => void

    public componentWillMount() {
        this.onResize = _.debounce(() => this.setupViewPort(), 50).bind(this)
        addEventListener('resize', this.onResize)
        this.onResize()
        this.canUpdate = true
    }

    public componentDidMount() {
        this.setupViewPort()
        this.onScroll = _.debounce(() => this.setupVisiblePages(this.props), 10).bind(this)
        this.viewPort && this.viewPort.addEventListener('scroll', this.onScroll)
        this.onScroll()
    }

    public componentWillUnmount() {
        removeEventListener('resize', this.onResize)
        this.viewPort.removeEventListener('scroll', this.onScroll)
        this.canUpdate = false
    }

    public componentWillReceiveProps(newProps: this['props']) {
        this.setupVisiblePages(newProps, newProps.activePage !== this.props.activePage ? newProps.activePage : undefined)
    }

    private setupVisiblePages(props: this['props'], pageNo?: number) {

        if (!props.pages.length || !this.canUpdate) {
            return
        }

        let defaultWidth!: number
        let defaultHeight!: number

        const pages = props.pages.map((p) => {

            if (p && !defaultWidth || !defaultHeight) {
                [defaultWidth, defaultHeight] = [p.Width, p.Height]
            }

            if (!p.Width || !p.Height) {
                [p.Width, p.Height] = [defaultWidth, defaultHeight]
            }

            const relativeSize = ImageUtil.getImageSize({
                width: this.state.viewportWidth,
                height: this.state.viewportHeight,
            }, {
                    width: p.Width,
                    height: p.Height,
                    rotation: p.Attributes && p.Attributes.degree || 0,
                }, props.zoomMode, props.zoomLevel)

            return {
                ...p,
                Width: relativeSize.width,
                Height: relativeSize.height,
            }
        })

        const scrollState = this.viewPort.scrollTop
        let marginTop: number = 0
        let pagesToSkip: number = 0

        while (pageNo !== undefined ? pagesToSkip < pageNo - 1 : pages[pagesToSkip] && marginTop + pages[pagesToSkip].Height + props.tolerance < scrollState) {
            marginTop += pages[pagesToSkip].Height + props.padding * 2
            pagesToSkip++
        }

        let pagesToTake: number = 1
        let pagesHeight: number = 0

        while (pages[pagesToSkip + pagesToTake] && pagesHeight < this.state.viewportHeight + props.tolerance) {
            pagesHeight += pages[pagesToSkip + pagesToTake].Height + props.padding * 2
            pagesToTake++
        }

        let marginBottom: number = 0
        for (let i = pagesToSkip + pagesToTake - 1; i < pages.length; i++) {
            marginBottom += pages[i].Height + props.padding * 2
        }

        if (pagesToSkip !== this.state.pagesToSkip || pagesToTake !== this.state.pagesToTake) {
            this.setState({
                ...this.state,
                marginTop,
                marginBottom,
                pagesToSkip,
                pagesToTake,
                scrollState,
                visiblePages: pages.slice(pagesToSkip, pagesToSkip + pagesToTake),
            })
            // this.forceUpdate()
        }
    }

    private setupViewPort() {
        if (!this.viewPort) {
            this.viewPort = document.querySelector(`#${this.props.id}`)
        }
        if (this.canUpdate && this.viewPort) {

            const newHeight = this.viewPort.clientHeight - 16
            const newWidth = this.viewPort.clientWidth - 16
            if (!this.state || newHeight !== this.state.viewportHeight || newWidth !== this.state.viewportWidth) {
                this.setState({
                    ...this.state,
                    visiblePages: this.state.visiblePages,
                    viewportHeight: newHeight,
                    viewportWidth: newWidth,
                })
                this.forceUpdate()
            }
        }
    }

    public render() {
        return (
            <Grid item style={{ ...this.props.style, flexGrow: 1, flexShrink: 1, overflow: 'auto', height: '100%' }} id={this.props.id}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: this.state.marginTop || 0,
                    paddingBottom: this.state.marginBottom || 0,
                }}>
                    {this.state.visiblePages.map((value) => (
                        <Page
                            showWidgets={this.props.showWidgets}
                            viewportWidth={this.state.viewportWidth}
                            viewportHeight={this.state.viewportHeight}
                            key={value.Index}
                            imageIndex={value.Index}
                            onClick={(ev) => this.props.onPageClick(ev, value.Index)}
                            zoomMode={this.props.zoomMode}
                            zoomLevel={this.props.zoomLevel}
                            elementNamePrefix={this.props.elementNamePrefix}
                            image={this.props.images}
                        />
                    ))}
                </div>
            </Grid>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PageList)
export { connectedComponent as PageList }
