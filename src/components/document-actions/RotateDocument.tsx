import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { DocumentAction, PreviewImageData } from '../../models'
import { rotateImages } from '../../store/PreviewImages'
import { RootReducerType } from '../../store/RootReducer'

export interface RotateDocumentActionProps {
    pages: PreviewImageData[],
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        pages: state.previewImages.AvailableImages,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class RotateComponent extends React.Component<RotateDocumentActionProps> {

    private rotateLeft() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), -90)
    }

    private rotateRight() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), 90)
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>
                <IconButton onClick={() => this.rotateLeft()}>
                    <RotateLeft />
                </IconButton>

                <IconButton onClick={() => this.rotateRight()}>
                    <RotateRight />
                </IconButton>
            </div>)
    }
}

const rotateComponent = connect(mapStateToProps, mapDispatchToProps)(RotateComponent)

export const rotateDocumentAction: DocumentAction = {
    shouldCheckAvailable: () => false,
    isAvailable: async () => true,
    component: rotateComponent,
}
