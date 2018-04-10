import { IconButton } from 'material-ui'
import { Delete } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { Annotation, Shape, Shapes } from '../../models'
import { componentType, Dimensions } from '../../services'
import { removeShape, RootReducerType, updateShapeData } from '../../store'

// tslint:disable:max-classes-per-file

export interface OwnProps<T extends Shape> {
    shape: T
    shapeType: keyof Shapes
    canEdit: boolean
    zoomRatio: number
    additionalOffset?: Dimensions
}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps<Shape>) => {
    return {
        zoomMode: state.sensenetDocumentViewer.viewer.zoomMode,
        zoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
    }
}

const mapDispatchToProps = {
    updateShapeData: updateShapeData as <K extends keyof Shapes>(shapeType: K, shapeGuid: string, shapeData: Shapes[K][0]) => Action,
    removeShape,
}

abstract class ShapeComponent<T extends Shape = Shape> extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps<T>>> {

    public state = {
        focused: false,
        onResized: this.onResized.bind(this),
        onBlur: this.onBlur.bind(this),
        onDragStart: this.onDragStart.bind(this),
        handleKeyPress: this.handleKeyPress.bind(this),
        onFocus: this.onFocus.bind(this),
    }
    public abstract shapeType: keyof Shapes
    protected getShapeDimensions(shape: Shape, offsetX: number = 0, offsetY: number = 0): React.CSSProperties {
        return {
            top: shape.y * this.props.zoomRatio + offsetY * this.props.zoomRatio,
            left: shape.x * this.props.zoomRatio + offsetX * this.props.zoomRatio,
            width: shape.w * this.props.zoomRatio,
            height: shape.h * this.props.zoomRatio,
        }
    }

    protected onResized(ev: React.MouseEvent<HTMLElement>) {
        const boundingBox = ev.currentTarget.getBoundingClientRect()
        const [shape, shapeType, zoomRatio] = [this.props.shape, this.props.shapeType, this.props.zoomRatio]
        const newSize = {
            w: boundingBox.width * (1 / zoomRatio),
            h: boundingBox.height * (1 / zoomRatio),
        }
        if (Math.abs(newSize.w - shape.w) > 1 || Math.abs(newSize.h - shape.h) > 1) {
            this.props.updateShapeData(shapeType, shape.guid, {
                ...shape as any,
                ...newSize,
            })
        }
    }

    protected onDragStart(ev: React.DragEvent<HTMLElement>) {
        const additionalOffset = this.props.additionalOffset || { width: 0, height: 0 }
        ev.dataTransfer.setData('shape', JSON.stringify({
            type: this.shapeType,
            shape: this.props.shape,
            additionalOffset,
            offset: {
                width: ev.clientX - ev.currentTarget.getBoundingClientRect().left + additionalOffset.width,
                height: ev.clientY - ev.currentTarget.getBoundingClientRect().top + additionalOffset.height,
            },
        }))
    }

    public abstract renderShape(): JSX.Element

    protected handleKeyPress(ev: React.KeyboardEvent<HTMLDivElement>) {
        switch (ev.key) {
            case 'Backspace':
            case 'Delete':
                this.props.canEdit && this.props.removeShape(this.props.shapeType, this.props.shape.guid)
                break
        }
    }

    public onFocus(ev: React.FocusEvent<HTMLDivElement>) {
        if (!this.state.focused) {
            this.setState({ ...this.state, focused: true })
        }
    }

    public onBlur(ev: React.FocusEvent<HTMLDivElement>) {
        if (!ev.currentTarget.contains(ev.nativeEvent.relatedTarget as any)) {
            this.setState({ ...this.state, focused: false })
        }
    }

    public render() {
        return (
        <div
            onClickCapture={(ev) => ev.stopPropagation()}
            style={{ filter: this.state.focused ? 'contrast(.9) brightness(1.1)' : '' }}
            onKeyUp={this.state.handleKeyPress}
            onFocus={this.state.onFocus}
            onBlur={this.state.onBlur}>
            {this.renderShape()}
        </div>)
    }
}

class ShapeRedaction extends ShapeComponent {

    public readonly shapeType = 'redactions'

    public renderShape() {
        {
            return (<div
                tabIndex={0}
                draggable={this.props.canEdit}
                onDragStart={this.state.onDragStart}
                key={`r-${this.props.shape.h}-${this.props.shape.w}`}
                onMouseUp={this.state.onResized}
                style={{
                    ...this.getShapeDimensions(this.props.shape),
                    resize: this.props.canEdit ? 'both' : 'none',
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

    public readonly shapeType = 'annotations'

    protected handleKeyPress(ev: React.KeyboardEvent<HTMLDivElement>) {
        /** */
    }

    public onBlur(ev: React.FocusEvent<HTMLDivElement>) {
        super.onBlur(ev)
        this.props.updateShapeData(this.shapeType, this.props.shape.guid, {
            ...this.props.shape,
            text: ev.currentTarget.innerText.trim(),
        })
    }

    public renderShape() {
        {
            return (
                <div>
                    <div
                        onKeyUp={(ev) => this.handleKeyPress(ev)}
                        tabIndex={0}
                        draggable={this.props.canEdit}
                        onDragStart={this.state.onDragStart}
                        onMouseUp={this.state.onResized}
                        style={{
                            ...this.getShapeDimensions(this.props.shape, -120, 0),
                            position: 'absolute',
                            resize: this.props.canEdit ? 'both' : 'none',
                            overflow: 'hidden',
                            backgroundColor: 'blanchedalmond',
                            lineHeight: `${this.props.shape.lineHeight * this.props.zoomRatio}pt`,
                            fontWeight: this.props.shape.fontBold as any,
                            color: this.props.shape.fontColor,
                            fontFamily: this.props.shape.fontFamily,
                            fontSize: parseFloat(this.props.shape.fontSize.replace('pt', '')) * this.props.zoomRatio,
                            fontStyle: this.props.shape.fontItalic as any,
                            boxShadow: `${5 * this.props.zoomRatio}px ${5 * this.props.zoomRatio}px ${15 * this.props.zoomRatio}px rgba(0,0,0,.3)`,
                            padding: `${10 * this.props.zoomRatio}pt`,
                            boxSizing: 'border-box',
                        }}>
                        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}
                            contentEditable={this.props.canEdit ? 'plaintext-only' as any : false}
                            suppressContentEditableWarning={true}
                            >{this.props.shape.text}</div>
                        {this.state.focused ?
                            <div style={{position: 'relative', top: `-${64 * this.props.zoomRatio}px`}}>
                                <IconButton >
                                    <Delete style={{color: 'black'}} scale={this.props.zoomRatio} onMouseUp={(ev) => this.props.removeShape(this.shapeType, this.props.shape.guid)} />
                                </IconButton>
                            </div>
                            : null}
                    </div>
                </div>)
        }
    }
}

const shapeAnnotation = connect(mapStateToProps, mapDispatchToProps)(ShapeAnnotation)

class ShapeHighlight extends ShapeComponent {

    public readonly shapeType = 'highlights'

    public renderShape() {
        {
            return (<div
                tabIndex={0}
                draggable={this.props.canEdit}
                onDragStart={this.state.onDragStart}
                onMouseUp={this.state.onResized}
                style={{
                    ...this.getShapeDimensions(this.props.shape),
                    position: 'absolute',
                    resize: this.props.canEdit ? 'both' : 'none',
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

export { shapeAnnotation as ShapeAnnotation, shapeHighlight as ShapeHighlight, shapeRedaction as ShapeRedaction }
