import { Button, Paper } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Element } from 'react-scroll'
import { PreviewImageData } from '../models'
import { ImageUtil } from '../services/ImageUtils'
import { RootReducerType } from '../store/RootReducer'
import { ZoomMode } from '../store/Viewer'

const mapStateToProps = (state: RootReducerType, ownProps: { imageIndex: number }) => {
    return {
        page: state.previewImages.AvailableImages[ownProps.imageIndex - 1] || {},
        activePages: state.viewer.activePages,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {},
})

export interface PageProps {
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
    actions: {}
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
        style.width = relativeSize.width
        style.height = relativeSize.height
        return style
    }

    public render() {
        return (
            <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`} style={{ margin: '8px' }}>
                <Paper elevation={this.state.isActive ? 8 : 2}>
                    <Button style={{ ...this.state.pageStyle, padding: 0, overflow: 'hidden' }} onClick={(ev) => this.props.onClick(ev)}>
                        <img src={this.state.imgSrc}
                            style={{width: this.state.imageWidth, height: this.state.imageHeight, transform: this.state.imageTransform}}
                        />
                    </Button>
                </Paper>
            </Element>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
