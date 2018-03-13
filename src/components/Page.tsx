import { Button, Paper } from 'material-ui'
import { CircularProgress } from 'material-ui/Progress'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Element } from 'react-scroll'
import { Action } from 'redux'
import { DocumentData, PreviewImageData } from '../models'
import { ImageUtil } from '../services/ImageUtils'
import { previewAvailable } from '../store/PreviewImages'
import { RootReducerType } from '../store/RootReducer'
import { ZoomMode } from '../store/Viewer'

const mapStateToProps = (state: RootReducerType, ownProps: { imageIndex: number }) => {
    return {
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
    documentData: DocumentData,
    version: string,
    pollInterval: number
    page: PreviewImageData,
    imageIndex: number,
    viewportHeight: number,

    viewportWidth: number,
    elementNamePrefix: string,
    zoomMode: ZoomMode,
    canvas: HTMLCanvasElement,
    activePages: number[]
    onClick: (ev: React.MouseEvent<HTMLElement>) => any,
    imageUtil: ImageUtil,
    actions: {
        previewAvailable: (docData: DocumentData, version: string, page: number) => Action,
    }
    image: 'preview' | 'thumbnail'
}

export interface PageState {
    imgSrc: string
    pageStyle: React.CSSProperties
    isActive: boolean
    imageWidth: string
    imageHeight: string
    imageTransform: string
}

class Page extends React.Component<PageProps, PageState> {

    private pollPreview?: number

    private stopPolling() {
        if (this.pollPreview) {
            clearInterval(this.pollPreview)
            this.pollPreview = undefined
        }
    }

    public componentWillUnmount() {
        this.stopPolling()
    }

    private getStateFromProps(props: this['props']): this['state'] {
        const imageRotation = ImageUtil.normalizeDegrees(props.page.Attributes && props.page.Attributes.degree || 0)
        const imageRotationRads = (imageRotation % 180) * Math.PI / 180

        const imgSrc = (this.props.image === 'preview' ? props.page.PreviewImageUrl : props.page.ThumbnailImageUrl) || ''
        const pageStyle = this.getPageStyle(props)
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
            isActive: props.activePages.indexOf(this.props.page.Index) >= 0,
            imgSrc,
            pageStyle,
            imageWidth: `${100 * boundingBox.zoomRatio}%`,
            imageHeight:  `${100 * boundingBox.zoomRatio}%`,
            imageTransform: `translateY(${-diffWidth}px) rotate(${imageRotation}deg)`,
        }
    }

    constructor(props: PageProps) {
        super(props)
        this.state = this.getStateFromProps(props)
    }

    public componentWillReceiveProps(nextProps: PageProps) {
        const newState = this.getStateFromProps(nextProps)
        this.setState(newState)
    }

    public getPageStyle(props: PageProps) {
        const style: React.CSSProperties = {}
        const relativeSize = this.props.imageUtil.getImageSize({
            width: props.viewportWidth,
            height: props.viewportHeight,
        }, {
                width: props.page.Width,
                height: props.page.Height,
                rotation: props.page.Attributes && props.page.Attributes.degree || 0,
            }, props.zoomMode)
        style.width = relativeSize.width || '100%'
        style.height = relativeSize.height || '100%'
        return style
    }

    public render() {
        return (
            <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`} style={{ margin: '8px' }}>
                <Paper elevation={this.state.isActive ? 8 : 2}>
                    <Button style={{ ...this.state.pageStyle, padding: 0, overflow: 'hidden' }} onClick={(ev) => this.props.onClick(ev)}>
                        {this.state.imgSrc ?
                        <img src={this.state.imgSrc}
                            style={{transition: 'transform .1s ease-in-out', width: this.state.imageWidth, height: this.state.imageHeight, transform: this.state.imageTransform}}
                        /> :
                            <CircularProgress />
                        }
                    </Button>
                </Paper>
            </Element>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
