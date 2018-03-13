import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { Annotation, Highlight, PageWidget, PreviewImageData, Redaction, Shape } from '../../models'
import { Dimensions } from '../../services/ImageUtils'
import { rotateImages } from '../../store/PreviewImages'
import { RootReducerType } from '../../store/RootReducer'

export interface DrawingsWidgetProps {
    page: PreviewImageData,
    redactions: Redaction[],
    highlights: Highlight[],
    annotations: Annotation[],
    viewPort: Dimensions,
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

export interface DrawingsWidgetState {
    zoomRatio: number,
}

const mapStateToProps = (state: RootReducerType, ownProps: {Index: number, viewPort: Dimensions}) => {
    return {
        page: state.sensenetDocumentViewer.previewImages.AvailableImages.find((p) => p.Index === ownProps.Index),
        redactions: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions &&
            state.sensenetDocumentViewer.documentState.document.shapes.redactions.filter((r) => r.imageIndex === ownProps.Index) || [],
        highlights: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights &&
            state.sensenetDocumentViewer.documentState.document.shapes.highlights.filter((r) => r.imageIndex === ownProps.Index) || [],
        annotations: state.sensenetDocumentViewer.documentState.document &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations &&
            state.sensenetDocumentViewer.documentState.document.shapes.annotations.filter((r) => r.imageIndex === ownProps.Index) || [],
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class DrawingsComponent extends React.Component<DrawingsWidgetProps, DrawingsWidgetState> {

    public state = {zoomRatio: 1}

    public componentWillReceiveProps(props: DrawingsWidgetProps) {
        const zoomRatio = this.props.viewPort.height /  this.props.page.Height
        this.setState({
            zoomRatio,
        })
    }

    private getShapeDimensions(shape: Shape): React.CSSProperties {
        return {
            top: shape.y * this.state.zoomRatio,
            left: shape.x * this.state.zoomRatio,
            width: shape.w * this.state.zoomRatio,
            height: shape.h * this.state.zoomRatio,
        }
    }

    public render() {
        return (
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1}}>
                {this.props.redactions.map((redaction) => {
                    return (<div key={`r-${redaction.h}-${redaction.w}`} style={{...this.getShapeDimensions(redaction), position: 'absolute', backgroundColor: 'black'}}>
                    </div>)
                })}

                {this.props.highlights.map((highlight) => {
                    return (<div key={`h-${highlight.h}-${highlight.w}`} style={{...this.getShapeDimensions(highlight), position: 'absolute', backgroundColor: 'yellow', opacity: .5}}>
                    </div>)
                })}

                {this.props.annotations.map((annotation) => {
                    return (
                    <div key={`a-${annotation.h}-${annotation.w}`}
                         style={{
                             ...this.getShapeDimensions(annotation),
                             position: 'absolute',
                             backgroundColor: 'orange',
                             lineHeight: `${annotation.lineHeight * this.state.zoomRatio}pt`,
                             fontWeight: annotation.fontBold as any,
                             color: annotation.fontColor,
                             fontFamily: annotation.fontFamily,
                             fontSize: parseFloat(annotation.fontSize.replace('pt', '')) * this.state.zoomRatio,
                             fontStyle: annotation.fontItalic as any,
                             }}>
                            {annotation.text}
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
