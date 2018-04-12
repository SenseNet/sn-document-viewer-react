import * as React from 'react'
import { connect } from 'react-redux'
import { Annotation, Highlight, PreviewImageData, Redaction, Shape, Shapes } from '../../models'
import { componentType, Dimensions } from '../../services'
import { RootReducerType, updateShapeData } from '../../store'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from './Shape'

export interface OwnProps {
    viewPort: Dimensions,
    page: PreviewImageData,
    zoomRatio: number
}

export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
        showRedactions: state.sensenetDocumentViewer.viewer.showRedaction,
        canHideRedactions: state.sensenetDocumentViewer.documentState.canHideRedaction,
        redactions: state.sensenetDocumentViewer.documentState.document.shapes.redactions.filter((r) => r.imageIndex === ownProps.page.Index) as Redaction[],
        highlights: state.sensenetDocumentViewer.documentState.document.shapes.highlights.filter((r) => r.imageIndex === ownProps.page.Index) as Highlight[],
        annotations: state.sensenetDocumentViewer.documentState.document.shapes.annotations.filter((r) => r.imageIndex === ownProps.page.Index) as Annotation[],
        canEdit: state.sensenetDocumentViewer.documentState.canEdit,
    }
}

export const mapDispatchToProps = ({
    updateShapeData,
})

export class ShapesComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

    private onDrop(ev: React.DragEvent<HTMLElement>, page: PreviewImageData) {
        if (this.props.canEdit) {

            ev.preventDefault()
            const shapeData = JSON.parse(ev.dataTransfer.getData('shape')) as { type: keyof Shapes, shape: Shape, offset: Dimensions }
            const boundingBox = ev.currentTarget.getBoundingClientRect()
            this.props.updateShapeData(shapeData.type, shapeData.shape.guid, {
                ...shapeData.shape,
                imageIndex: page.Index,
                x: ((ev.clientX - boundingBox.left - shapeData.offset.width) * (1 / this.props.zoomRatio)),
                y: ((ev.clientY - boundingBox.top - shapeData.offset.height) * (1 / this.props.zoomRatio)),
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
                        return (<ShapeRedaction shapeType="redactions" shape={redaction} canEdit={this.props.canEdit} zoomRatio={this.props.zoomRatio} key={index} />)
                    })
                }

                {
                    this.props.showShapes && this.props.annotations.map((annotation, index) => {
                        return (<ShapeAnnotation shapeType="annotations" shape={annotation} canEdit={this.props.canEdit} zoomRatio={this.props.zoomRatio} key={index} />)
                    })
                }

                {
                    this.props.showShapes && this.props.highlights.map((highlight, index) => {
                        return (<ShapeHighlight shapeType="highlights" shape={highlight} canEdit={this.props.canEdit} zoomRatio={this.props.zoomRatio} key={index} />)
                    })
                }

            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ShapesComponent)
export { connectedComponent as ShapesWidget }
