import { Button, Grid, Paper } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Element } from 'react-scroll'
import { PreviewImageData } from '../models'
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
    actions: {}
    image: 'preview' | 'thumbnail'
}

export interface PageState {
    isRotated: boolean,
    imageRotation: number,
    isLoading: boolean,
    imgSrc: string
    imgStyle: React.CSSProperties
    isActive: boolean
}

class Page extends React.Component<PageProps, PageState> {
    private rotationCache: Map<number, string> = new Map()
    private rotateImage(imgElement: HTMLImageElement, canvas: HTMLCanvasElement, degrees: number): string {

        if (!degrees) {
            return ''
        }

        if (this.rotationCache.has(degrees)) {
            return this.rotationCache.get(degrees) as string
        }

        const [oldMaxWidth, oldMaxHeight] = [imgElement.style.maxWidth, imgElement.style.maxHeight]
        imgElement.style.maxWidth = 'unset'
        imgElement.style.maxHeight = 'unset'
        let base64: string = ''
        const ctx = canvas.getContext('2d')

        const rads = degrees * Math.PI / 180

        if (degrees <= 90 || (degrees >= 180 && degrees <= 270)) {
            const rads2 = (degrees % 180) * Math.PI / 180
            canvas.width =  Math.cos(rads2) * imgElement.width + Math.sin(rads2) * imgElement.height
            canvas.height =  Math.sin(rads2) * imgElement.width + Math.cos(rads2) * imgElement.height
        } else {
            const h = imgElement.width
            const w = imgElement.height
            const angle = ((degrees % 180) - 90) * Math.PI / 180
            canvas.width =  Math.cos(angle) * w + Math.sin(angle) * h
            canvas.height =  Math.sin(angle) * w + Math.cos(angle) * h
        }

        if (ctx) {
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate(rads)
            ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2)
            ctx.rotate(-rads)
            ctx.translate(-canvas.width / 2, -canvas.height / 2)
            const dataUrl = canvas.toDataURL()
            if (dataUrl !== 'data:,') {
                base64 = dataUrl
            }
        }

        canvas.width = 0
        canvas.height = 0

        imgElement.style.maxWidth = oldMaxWidth
        imgElement.style.maxHeight = oldMaxHeight
        if (base64) {
            this.rotationCache.set(degrees, base64)
        }
        return base64
    }

    private originalImgNode?: Node

    private getStateFromProps(props: this['props'], isLoaded: boolean = false): this['state'] {
        const isRotated = props.page.Attributes && props.page.Attributes.degree % 180 !== 0 || false

        let imageRotation  = ( props.page.Attributes && props.page.Attributes.degree || 0) % 360
        if (imageRotation < 0) {
            imageRotation += 360
        }

        let imgSrc = (this.props.image === 'preview' ? props.page.PreviewImageUrl : props.page.ThumbnailImageUrl) || ''

        if (isLoaded && imageRotation && this.imageRef && props.canvas) {
            if (!this.originalImgNode) {
                this.originalImgNode = this.imageRef.cloneNode(true)
            }
            imgSrc = this.rotateImage(this.originalImgNode as HTMLImageElement, this.props.canvas, imageRotation)
        }
        return {
            isActive: props.activePages.indexOf(this.props.page.Index) >= 0,
            isRotated,
            imgSrc,
            imgStyle: this.getImgageStyle(),
            imageRotation,
            isLoading: isRotated || !props.page.PreviewImageUrl,
        }
    }

    constructor(props: PageProps) {
        super(props)
        this.state = this.getStateFromProps(props)
    }

    private imageRef!: HTMLImageElement | null

    public componentWillReceiveProps(nextProps: PageProps, isLoaded: boolean = false) {
        this.setState(this.getStateFromProps(nextProps, isLoaded))
    }

    public getImgageStyle() {
        const style: React.CSSProperties = {}
        switch (this.props.zoomMode) {
            case 'fitWidth':
                style.width = this.props.viewportWidth
                break
            case 'fitHeight':
                style.height = this.props.viewportHeight
                break
            case 'fit':
                style.maxWidth = this.props.viewportWidth
                style.maxHeight = this.props.viewportHeight
                break
        }
        return style
    }

    public render() {
        return (
            <Grid item key={this.props.page.Index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`}>
                    <Paper elevation={this.state.isActive ? 8 : 2}>
                        <Button style={{ padding: 0, overflow: 'hidden' }} onClick={(ev) => this.props.onClick(ev)}>
                            {
                                <img src={this.state.imgSrc || this.props.page.PreviewImageUrl}
                                    // crossOrigin={'use-credentials'}
                                    ref={(img) => this.imageRef = img}
                                    style={this.state.imgStyle}
                                    onLoad={(ev) => { this.componentWillReceiveProps(this.props, true) }}
                                />
                            }
                        </Button>
                    </Paper>
                </Element>
            </Grid>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
