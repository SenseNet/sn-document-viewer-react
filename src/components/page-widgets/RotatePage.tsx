import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { PageWidget, PreviewImageData } from '../../models'
import { Dimensions } from '../../services/ImageUtils'
import { rotateImages } from '../../store/PreviewImages'
import { RootReducerType } from '../../store/RootReducer'

export interface RotatePageWidgetProps {
    page: PreviewImageData,
    viewPort: Dimensions,
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

const mapStateToProps = (state: RootReducerType, ownProps: {Index: number}) => {
    return {
        page: state.sensenetDocumentViewer.previewImages.AvailableImages.find((p) => p.Index === ownProps.Index),
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class RotatePageComponent extends React.Component<RotatePageWidgetProps> {

    private rotatePageLeft() {
        this.props.actions.rotateImages([this.props.page.Index], -90)
    }

    private rotatePageRight() {
        this.props.actions.rotateImages([this.props.page.Index], 90)
    }

    public render() {
        return (
            <div style={{ position: 'absolute', zIndex: 1, top: 0, right: 0 }}>

                <IconButton onClick={() => this.rotatePageLeft()}>
                    <RotateLeft />
                </IconButton>

                <IconButton onClick={() => this.rotatePageRight()}>
                    <RotateRight />
                </IconButton>
            </div>)
    }
}

const rotateComponent = connect(mapStateToProps, mapDispatchToProps)(RotatePageComponent)

export const rotatePageWidget: PageWidget = {
    shouldCheckAvailable: () => false,
    isAvailable: async () => true,
    component: rotateComponent,
}
