import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { Annotation, Shape, Shapes } from '../../models'
import { componentType, Dimensions } from '../../services'
import { removeShape, RootReducerType, updateShapeData } from '../../store'

export interface OwnProps<T extends Shape> {
    shape: T
    shapeType: keyof Shapes
    canEdit: boolean
    zoomRatio: number
}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps<Shape>) => {
    return {

    }
}

const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        updateShapeData: <K extends keyof Shapes>(shapeType: K, shapeGuid: string, shapeData: Shapes[K][0]) => Action,
        removeShape: <K extends keyof Shapes>(shapeType: K, shapeGuid: string) => Action,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        updateShapeData: <K extends keyof Shapes>(shapeType: K, shapeGuid: string, shapeData: Shapes[K][0]) => dispatch(updateShapeData<K>(shapeType, shapeGuid, shapeData)),
        removeShape: <K extends keyof Shapes>(shapeType: K, shapeGuid: string) => dispatch(removeShape<K>(shapeType, shapeGuid)),

    },
})

abstract class ShapeComponent<T extends Shape = Shape> extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps<T>>> {

    protected getShapeDimensions(shape: Shape, offsetX: number = 0, offsetY: number = 0): React.CSSProperties {
        return {
            top: shape.y * this.props.zoomRatio + offsetY * this.props.zoomRatio,
            left: shape.x * this.props.zoomRatio + offsetX * this.props.zoomRatio,
            width: shape.w * this.props.zoomRatio,
            height: shape.h * this.props.zoomRatio,
        }
    }

    protected onResized(ev: React.MouseEvent<HTMLElement>, type: keyof Shapes, shape: Shape) {
        const boundingBox = ev.currentTarget.getBoundingClientRect()
        const newSize = {
            w: boundingBox.width * (1 / this.props.zoomRatio),
            h: boundingBox.height * (1 / this.props.zoomRatio),
        }
        if (Math.abs(newSize.w - shape.w) > 1 || Math.abs(newSize.h - shape.h) > 1) {
            this.props.actions.updateShapeData(type, shape.guid, {
                ...shape,
                ...newSize,
            })
        }
    }

    protected onDragStart(ev: React.DragEvent<HTMLElement>, type: keyof Shapes, shape: Shape, additionalOffset: Dimensions = { width: 0, height: 0 }) {
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

    public abstract renderShape(): JSX.Element

    private handleKeyPress(ev: React.KeyboardEvent<HTMLDivElement>, shape: T) {
        switch (ev.key) {
            case 'Backspace':
            case 'Delete':
                this.props.canEdit && this.props.actions.updateShapeData(this.props.shapeType, this.props.shape.guid, undefined as any)
                break
        }
    }

    public render() {
        return (<div onKeyUp={(ev) => this.handleKeyPress(ev, this.props.shape)}>
            {this.renderShape()}
        </div>)
    }
}

class ShapeRedaction extends ShapeComponent {
    public renderShape() {
        {
            return (<div
                tabIndex={0}
                onClickCapture={(ev) => { ev.stopPropagation() }}
                draggable={this.props.canEdit}
                onDragStart={(ev) => this.onDragStart(ev, 'redactions', this.props.shape)}
                key={`r-${this.props.shape.h}-${this.props.shape.w}`}
                onMouseUp={(ev) => this.onResized(ev, 'redactions', this.props.shape)}
                style={{
                    ...this.getShapeDimensions(this.props.shape),
                    resize: this.props.canEdit && 'both',
                    position: 'absolute',
                    overflow: 'auto',
                    backgroundColor: 'black',
                }}>
            </div>)
        }
    }
}

const shapeRedaction = connect(mapStateToProps, mapDispatchToProps)(ShapeRedaction)

class ShapeAnnotation extends ShapeComponent<Annotation> {
    public renderShape() {
        {
            return (<div
                tabIndex={0}
                onClickCapture={(ev) => { ev.stopPropagation() }}
                draggable={this.props.canEdit}
                onDragStart={(ev) => this.onDragStart(ev, 'annotations', this.props.shape, { width: -120 * this.props.zoomRatio, height: 0 })}
                onMouseUp={(ev) => this.onResized(ev, 'annotations', this.props.shape)}
                style={{
                    ...this.getShapeDimensions(this.props.shape, -120, 0),
                    position: 'absolute',
                    resize: this.props.canEdit && 'both',
                    overflow: 'hidden',
                    backgroundColor: 'blanchedalmond',
                    lineHeight: `${this.props.shape.lineHeight * this.props.zoomRatio}pt`,
                    fontWeight: this.props.shape.fontBold as any,
                    color: this.props.shape.fontColor,
                    fontFamily: this.props.shape.fontFamily,
                    fontSize: parseFloat(this.props.shape.fontSize.replace('pt', '')) * this.props.zoomRatio,
                    fontStyle: this.props.shape.fontItalic as any,
                    boxShadow: `${5 * this.props.zoomRatio}px ${5 * this.props.zoomRatio}px ${15 * this.props.zoomRatio}px rgba(0,0,0,.3)`,
                }}>
                <div
                    style={{
                        margin: `${10 * this.props.zoomRatio}pt`,
                        userSelect: 'text',
                    }}
                    contentEditable={this.props.canEdit}
                    suppressContentEditableWarning={true}
                >
                    {this.props.shape.text}
                </div>
            </div>)
        }
    }
}

const shapeAnnotation = connect(mapStateToProps, mapDispatchToProps)(ShapeAnnotation)

class ShapeHighlight extends ShapeComponent {
    public renderShape() {
        {
            return (<div
                tabIndex={0}
                onClickCapture={(ev) => { ev.stopPropagation() }}
                draggable={this.props.canEdit}
                onDragStart={(ev) => this.onDragStart(ev, 'highlights', this.props.shape)}
                onMouseUp={(ev) => this.onResized(ev, 'highlights', this.props.shape)}
                style={{
                    ...this.getShapeDimensions(this.props.shape),
                    position: 'absolute',
                    resize: this.props.canEdit && 'both',
                    overflow: 'auto',
                    backgroundColor: 'yellow',
                    opacity: .5,
                    userFocus: 'all',
                }}>
            </div>)
        }
    }
}

const shapeHighlight = connect(mapStateToProps, mapDispatchToProps)(ShapeHighlight)

export {shapeAnnotation as ShapeAnnotation, shapeHighlight as ShapeHighlight, shapeRedaction as ShapeRedaction}
