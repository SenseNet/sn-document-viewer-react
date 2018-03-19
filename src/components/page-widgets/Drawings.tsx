import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { Annotation, Highlight, PageWidget, PreviewImageData, Redaction, Shape, Shapes } from '../../models'
import { Dimensions } from '../../services/ImageUtils'
import { componentType } from '../../services/TypeHelpers'
import { updateShapeData } from '../../store/Document'
import { RootReducerType } from '../../store/RootReducer'

export interface DrawingsWidgetState {
    zoomRatio: number,
    canEditShapes: boolean,
}

export interface OwnProps {
    Index: number,
    viewPort: Dimensions,
}

export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        page: state.sensenetDocumentViewer.previewImages.AvailableImages.find((p) => p.Index === ownProps.Index) as PreviewImageData,
        redactions: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions.filter((r) => r.imageIndex === ownProps.Index) || [] as Redaction[],
        highlights: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights.filter((r) => r.imageIndex === ownProps.Index) || [] as Highlight[],
        annotations: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations.filter((r) => r.imageIndex === ownProps.Index) || [] as Annotation[],
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        updateShapeData: <K extends keyof Shapes>(shapeType: K, guid: string, shapeData: Shapes[K][0]) => Action,
    },
}
 = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        updateShapeData: <K extends keyof Shapes>(shapeType: K, guid: string, shapeData: Shapes[K][0]) => dispatch(updateShapeData(shapeType, guid, shapeData)),
    },
})

export class DrawingsComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, DrawingsWidgetState> {

    public state = {
        zoomRatio: this.props.viewPort.height / this.props.page.Height,
        canEditShapes: true,    // todo: check permission
    }

    public componentWillReceiveProps(props: this['props']) {
        const zoomRatio = props.viewPort.height / props.page.Height
        if (zoomRatio !== this.state.zoomRatio) {
            this.setState({
                zoomRatio,
            })
        }
    }

    private getShapeDimensions(shape: Shape, offsetX: number = 0, offsetY: number = 0): React.CSSProperties {
        return {
            top: shape.y * this.state.zoomRatio + offsetY * this.state.zoomRatio,
            left: shape.x * this.state.zoomRatio + offsetX * this.state.zoomRatio,
            width: shape.w * this.state.zoomRatio,
            height: shape.h * this.state.zoomRatio,
        }
    }

    private onDragStart(ev: React.DragEvent<HTMLElement>, type: keyof Shapes, shape: Shape, additionalOffset: Dimensions = { width: 0, height: 0 }) {
        ev.dataTransfer.setData('shape', JSON.stringify({
            type,
            shape,
            additionalOffset,
            offset: {
                width: ev.clientX - ev.currentTarget.getBoundingClientRect().left + additionalOffset.width,
                height: ev.clientY - ev.currentTarget.getBoundingClientRect().top + additionalOffset.height,
            },
        }))
    }

    private onDrop(ev: React.DragEvent<HTMLElement>, page: PreviewImageData) {
        ev.preventDefault()
        const shapeData = JSON.parse(ev.dataTransfer.getData('shape')) as { type: keyof Shapes, shape: Shape, offset: Dimensions }
        const boundingBox = ev.currentTarget.getBoundingClientRect()
        this.props.actions.updateShapeData(shapeData.type, shapeData.shape.guid, {
            ...shapeData.shape,
            imageIndex: page.Index,
            x: ((ev.clientX - boundingBox.left - shapeData.offset.width) * (1 / this.state.zoomRatio)),
            y: ((ev.clientY - boundingBox.top - shapeData.offset.height) * (1 / this.state.zoomRatio)),
        })
    }

    private onResized(ev: React.MouseEvent<HTMLElement>, type: keyof Shapes, shape: Shape) {
        const boundingBox = ev.currentTarget.getBoundingClientRect()
        const newSize = {
            w: boundingBox.width * (1 / this.state.zoomRatio),
            h: boundingBox.height * (1 / this.state.zoomRatio),
        }
        if (Math.abs(newSize.w - shape.w) > 1 || Math.abs(newSize.h - shape.h) > 1) {
            this.props.actions.updateShapeData(type, shape.guid, {
                ...shape,
                ...newSize,
            })
        }
    }

    public render() {
        return (
            <div
                onDrop={(ev) => this.onDrop(ev, this.props.page)}
                onDragOver={(ev) => ev.preventDefault()}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {this.props.redactions.map((redaction) => {
                    return (<div
                        draggable={this.state.canEditShapes}
                        onDragStart={(ev) => this.onDragStart(ev, 'redactions', redaction)}
                        key={`r-${redaction.h}-${redaction.w}`}
                        onMouseUp={(ev) => this.onResized(ev, 'redactions', redaction)}
                        style={{
                            ...this.getShapeDimensions(redaction),
                            resize: 'both',
                            position: 'absolute',
                            overflow: 'auto',
                            backgroundColor: 'black',
                        }}>
                    </div>)
                })}

                {this.props.highlights.map((highlight) => {
                    return (<div
                        draggable={this.state.canEditShapes}
                        onDragStart={(ev) => this.onDragStart(ev, 'highlights', highlight)}
                        onMouseUp={(ev) => this.onResized(ev, 'highlights', highlight)}
                        key={`h-${highlight.h}-${highlight.w}`}
                        style={{
                            ...this.getShapeDimensions(highlight),
                            position: 'absolute',
                            resize: 'both',
                            overflow: 'auto',
                            backgroundColor: 'yellow',
                            opacity: .5,
                        }}>
                    </div>)
                })}

                {this.props.annotations.map((annotation) => {
                    return (<div
                        key={`a-${annotation.h}-${annotation.w}`}
                        draggable={this.state.canEditShapes}
                        onDragStart={(ev) => this.onDragStart(ev, 'annotations', annotation, { width: -120 * this.state.zoomRatio, height: 0 })}
                        onMouseUp={(ev) => this.onResized(ev, 'annotations', annotation)}
                        style={{
                            ...this.getShapeDimensions(annotation, -120, 0),
                            position: 'absolute',
                            resize: 'both',
                            overflow: 'auto',
                            backgroundColor: 'blanchedalmond',
                            lineHeight: `${annotation.lineHeight * this.state.zoomRatio}pt`,
                            fontWeight: annotation.fontBold as any,
                            color: annotation.fontColor,
                            fontFamily: annotation.fontFamily,
                            fontSize: parseFloat(annotation.fontSize.replace('pt', '')) * this.state.zoomRatio,
                            fontStyle: annotation.fontItalic as any,
                        }}>
                        <div
                            style={{
                                width: '94%',
                                height: '92%',
                                margin: '3%',
                                userSelect: 'text',
                            }}
                            contentEditable={this.state.canEditShapes}
                            suppressContentEditableWarning={true}
                        >
                            {annotation.text}
                        </div>
                    </div>)
                })}

            </div>)
    }
}

const drawingsComponent = connect(mapStateToProps, mapDispatchToProps)(DrawingsComponent)

export const drawingsWidget: PageWidget = {
    shouldCheckAvailable: () => false,
    isAvailable: async () => true,
    component: drawingsComponent,
}
