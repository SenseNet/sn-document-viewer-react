import { Paper } from 'material-ui'
import { CircularProgress } from 'material-ui/Progress'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Element } from 'react-scroll'
import { Action } from 'redux'
import { DocumentData, PageWidget, PreviewImageData } from '../models'
import { Dimensions, ImageUtil } from '../services/ImageUtils'
import { previewAvailable } from '../store/PreviewImages'
import { RootReducerType } from '../store/RootReducer'
import { ZoomMode } from '../store/Viewer'

const mapStateToProps = (state: RootReducerType, ownProps: { imageIndex: number }) => {
    return {
        store: state,
        documentData: state.sensenetDocumentViewer.documentState.document,
        version: state.sensenetDocumentViewer.documentState.version,
        page: state.sensenetDocumentViewer.previewImages.AvailableImages[ownProps.imageIndex - 1] || {},
        activePages: state.sensenetDocumentViewer.viewer.activePages,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        previewAvailable: (docData: DocumentData, version: string, page: number) => dispatch<any>(previewAvailable(docData, version, page)),
    },
})

export interface PageProps {
    store: RootReducerType,
    pageWidgets: PageWidget[],
    documentData: DocumentData,
    version: string,
    pollInterval: number
    page: PreviewImageData,
    imageIndex: number,
    viewportHeight: number,

    viewportWidth: number,
    elementNamePrefix: string,
    zoomMode: ZoomMode,
    activePages: number[]
    onClick: (ev: React.MouseEvent<HTMLElement>) => any,
    imageUtil: ImageUtil,
    actions: {
        previewAvailable: (docData: DocumentData, version: string, page: number) => Action,
    }
    image: 'preview' | 'thumbnail'
}

export interface PageState {
    zoomRatio: number
    availableWidgets: PageWidget[]
    imgSrc: string
    pageStyle: React.CSSProperties
    pageWidth: number
    pageHeight: number
    isActive: boolean
    imageWidth: string
    imageHeight: string
    imageTransform: string
}

class Page extends React.Component<PageProps, PageState> {

    private pollPreview?: number

    public state = this.getStateFromProps(this.props)

    private stopPolling() {
        if (this.pollPreview) {
            clearInterval(this.pollPreview)
            this.pollPreview = undefined
        }
    }

    public componentDidMount() {
        this.componentWillReceiveProps(this.props)
    }

    public componentWillUnmount() {
        this.stopPolling()
    }

    private getStateFromProps(props: PageProps): PageState {
        const imageRotation = ImageUtil.normalizeDegrees(props.page.Attributes && props.page.Attributes.degree || 0)
        const imageRotationRads = (imageRotation % 180) * Math.PI / 180

        const imgSrc = (this.props.image === 'preview' ? props.page.PreviewImageUrl : props.page.ThumbnailImageUrl) || ''
        const relativePageSize = this.props.imageUtil.getImageSize({
            width: props.viewportWidth,
            height: props.viewportHeight,
        }, {
                width: props.page.Width,
                height: props.page.Height,
                rotation: props.page.Attributes && props.page.Attributes.degree || 0,
            }, props.zoomMode)
        const pageStyle = this.getPageStyle(props, relativePageSize)
        const boundingBox = this.props.imageUtil.getRotatedBoundingBoxSize({
            width: props.page.Width,
            height: props.page.Height,
        }, imageRotation)

        const diffWidth = Math.sin(imageRotationRads) * ((pageStyle.width - pageStyle.height) / 2)

        if (!imgSrc) {
            this.stopPolling()
            this.pollPreview = setInterval(() => {
                this.props.actions.previewAvailable(this.props.documentData, this.props.version, this.props.imageIndex)
            }, this.props.pollInterval) as any as number
        } else {
            this.stopPolling()
        }

        return {
            zoomRatio: boundingBox.zoomRatio,
            isActive: props.activePages.indexOf(this.props.page.Index) >= 0,
            availableWidgets: [],
            imgSrc,
            pageWidth: relativePageSize.width,
            pageHeight: relativePageSize.height,
            pageStyle,
            imageWidth: `${100 * boundingBox.zoomRatio}%`,
            imageHeight: `${100 * boundingBox.zoomRatio}%`,
            imageTransform: `translateY(${-diffWidth}px) rotate(${imageRotation}deg)`,
        }
    }

    private pageWidgetAvailabilityCache: Map<PageWidget, boolean> = new Map()

    public async componentWillReceiveProps(nextProps: PageProps) {
        const availableWidgets: PageWidget[] = []
        await Promise.all(this.props.pageWidgets.map(async (action) => {
            if (!action.shouldCheckAvailable(this.props.store, nextProps.store) && this.pageWidgetAvailabilityCache.has(action)) {
                availableWidgets.push(action)
            } else {
                const isAvailable = await action.isAvailable(nextProps.store)
                if (isAvailable) {
                    availableWidgets.push(action)
                }
                this.pageWidgetAvailabilityCache.set(action, isAvailable)
            }
        }))

        const newState = this.getStateFromProps(nextProps)
        this.setState({ ...newState, availableWidgets })
    }

    public getPageStyle(props: PageProps, relativeSize: Dimensions) {
        const style: React.CSSProperties = {}
        style.width = relativeSize.width || '100%'
        style.height = relativeSize.height || '100%'
        return style
    }

    public render() {

        const pageWidgets = this.state.availableWidgets.map((widget, i) =>
            React.createElement(widget.component, {
                Index: this.props.page.Index,
                key: i,
                viewPort: { width: this.state.pageWidth, height: this.state.pageHeight },
            }),
        )

        return (
            <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`} style={{ margin: '8px' }}>
                <Paper elevation={this.state.isActive ? 8 : 2}>
                    <div style={{ ...this.state.pageStyle, padding: 0, overflow: 'hidden', position: 'relative' }} onClick={(ev) => this.props.onClick(ev)}>
                        {pageWidgets}
                        <span style={{ display: 'flex', justifyContent: 'center' }}>
                            {this.state.imgSrc ?
                                <img src={this.state.imgSrc}
                                    style={{ transition: 'transform .1s ease-in-out', width: this.state.imageWidth, height: this.state.imageHeight, transform: this.state.imageTransform }}
                                /> :
                                <CircularProgress />
                            }
                        </span>
                    </div>
                </Paper>
            </Element>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
