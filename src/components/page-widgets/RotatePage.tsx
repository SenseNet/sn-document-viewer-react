import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { PageWidget, PreviewImageData } from '../../models'
import { componentType, Dimensions } from '../../services'
import { RootReducerType, rotateImages } from '../../store'

export interface OwnProps {
    Index: number,
    viewPort: Dimensions,

}

export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        page: state.sensenetDocumentViewer.previewImages.AvailableImages.find((p) => p.Index === ownProps.Index) as PreviewImageData,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class RotatePageComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

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
    shouldCheckAvailable: () => true,
    isAvailable: async (state) => state.sensenetDocumentViewer.documentState.canEdit,
    component: rotateComponent,
}
