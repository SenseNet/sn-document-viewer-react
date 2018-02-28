import { Button, Grid, Paper } from 'material-ui'
import React = require('react')
import { Element } from 'react-scroll'
import { PreviewImageData } from '../models'
import { ViewerStateType } from '../store/Viewer'

export interface DocumentPageProps extends ViewerStateType {
    page: PreviewImageData,
    viewportHeight: number,

    viewportWidth: number,
    elementNamePrefix: string,
    onClick: (ev: React.MouseEvent<HTMLElement>) => any
}

export interface DocumentPageState {
    isRotated: boolean,
    imageRotation: number,
    isLoading: boolean
}

export class DocumentPage extends React.Component<DocumentPageProps, DocumentPageState> {
    public canvas: HTMLCanvasElement | null = null
    private rotatedImgBase64: string = ''

    private rotateImage(imgElement: HTMLImageElement, canvas: HTMLCanvasElement, degrees: number): string {
        if (this.rotatedImgBase64) {
            return this.rotatedImgBase64
        }
        const [oldMaxWidth, oldMaxHeight] = [imgElement.style.maxWidth, imgElement.style.maxHeight]
        imgElement.style.maxWidth = 'unset'
        imgElement.style.maxHeight = 'unset'
        let base64: string = ''
        const ctx = canvas.getContext('2d')
        canvas.width = imgElement.height
        canvas.height = imgElement.width
        if (ctx) {
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate(degrees * Math.PI / 180)
            ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2)
            ctx.rotate(-degrees * Math.PI / 180)
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

        return base64
    }
    private getStateFromProps(props: this['props'], isLoaded: boolean = false): this['state'] {
        const isRotated = props.page.Attributes && (props.page.Attributes.degree === 90 || props.page.Attributes.degree === -90) || false
        if (isLoaded && props.page.Attributes && props.page.Attributes.degree && this.imageRef && this.canvas && props.page.Attributes) {
            this.rotatedImgBase64 = this.rotateImage(this.imageRef, this.canvas, props.page.Attributes.degree)
        }
        return {
            isRotated,
            imageRotation: this.props.page.Attributes && this.props.page.Attributes.degree || 0,
            isLoading: isRotated || !this.props.page.PreviewAvailable,
        }
    }

    constructor(props: DocumentPageProps) {
        super(props)
        this.state = this.getStateFromProps(props)
    }

    private imageRef!: HTMLImageElement | null

    public componentWillReceiveProps(nextProps: DocumentPageProps, isLoaded: boolean = false) {
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
                {this.state.isRotated ? <canvas ref={((c) => this.canvas = c)} style={{ display: 'none' }} /> : null}
                <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`}>
                    <Paper>
                        <Button style={{ padding: 0, overflow: 'hidden' }} onClick={(ev) => this.props.onClick(ev)}>
                            {
                                <img src={this.rotatedImgBase64 || this.props.page.PreviewAvailable}
                                    crossOrigin={'anonymous'}
                                    ref={(img) => this.imageRef = img}
                                    style={this.getImgageStyle()}
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
