import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { Annotation, Highlight, PageWidget, PreviewImageData, Redaction, Shape, Shapes } from '../../models'
import { componentType, Dimensions } from '../../services'
import { RootReducerType, updateShapeData } from '../../store'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from './Shape'

export interface ShapesWidgetState {
    zoomRatio: number,
}

export interface OwnProps {
    Index: number,
    viewPort: Dimensions,
}

export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        page: state.sensenetDocumentViewer.previewImages.AvailableImages.find((p) => p.Index === ownProps.Index) as PreviewImageData || { Height: 1 },
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
        showRedactions: state.sensenetDocumentViewer.viewer.showRedaction,
        canHideRedactions: state.sensenetDocumentViewer.documentState.canHideRedaction,
        redactions: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions.filter((r) => r.imageIndex === ownProps.Index) || [] as Redaction[],
        highlights: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights.filter((r) => r.imageIndex === ownProps.Index) || [] as Highlight[],
        annotations: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations.filter((r) => r.imageIndex === ownProps.Index) || [] as Annotation[],
        canEdit: state.sensenetDocumentViewer.documentState.canEdit,
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

export class ShapesComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, ShapesWidgetState> {

    public state = {
        zoomRatio: this.props.viewPort.height / this.props.page.Height,
    }

    public componentWillReceiveProps(props: this['props']) {
        const zoomRatio = props.viewPort.height / props.page.Height
        if (zoomRatio !== this.state.zoomRatio) {
            this.setState({
                zoomRatio,
            })
        }
    }

    private onDrop(ev: React.DragEvent<HTMLElement>, page: PreviewImageData) {
        if (this.props.canEdit) {

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
    }

    public render() {

        return (
            <div
                onDrop={(ev) => this.onDrop(ev, this.props.page)}
                onDragOver={(ev) => ev.preventDefault()}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>

                {
                    this.props.canHideRedactions && this.props.showRedactions && this.props.redactions.map((redaction, index) => {
                        return (<ShapeRedaction shapeType="redactions" shape={redaction} canEdit={this.props.canEdit} zoomRatio={this.state.zoomRatio} key={index}/>)
                    })
                }

                {
                    this.props.showShapes && this.props.annotations.map((annotation, index) => {
                        return (<ShapeAnnotation shapeType="annotations" shape={annotation} canEdit={this.props.canEdit} zoomRatio={this.state.zoomRatio} key={index}/>)
                    })
                }

                {
                    this.props.showShapes && this.props.highlights.map((highlight, index) => {
                        return (<ShapeHighlight shapeType="highlights" shape={highlight} canEdit={this.props.canEdit} zoomRatio={this.state.zoomRatio} key={index}/>)
                    })
                }

            </div>)
    }
}

const shapesComponent = connect(mapStateToProps, mapDispatchToProps)(ShapesComponent)

export const shapesWidget: PageWidget = {
    shouldCheckAvailable: () => false,
    isAvailable: async () => true,
    component: shapesComponent,
}
