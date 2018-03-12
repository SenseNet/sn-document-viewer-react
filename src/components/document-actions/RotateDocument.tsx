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
    activePages: number[],
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        pages: state.previewImages.AvailableImages,
        activePages: state.viewer.activePages,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class RotateComponent extends React.Component<RotateDocumentActionProps> {

    private rotateDocumentLeft() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), -90)
    }

    private rotateDocumentRight() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), 90)
    }

    private rotatePageLeft() {
        this.props.actions.rotateImages(this.props.activePages, -90)
    }

    private rotatePageRight() {
        this.props.actions.rotateImages(this.props.activePages, 90)
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>

                <IconButton onClick={() => this.rotatePageLeft()}>
                    <RotateLeft />
                </IconButton>

                <IconButton onClick={() => this.rotatePageRight()}>
                    <RotateRight />
                </IconButton>

                <IconButton onClick={() => this.rotateDocumentLeft()}>
                    <RotateLeft style={{border: '2px solid', borderRadius: '5px'}} />
                </IconButton>

                <IconButton onClick={() => this.rotateDocumentRight()}>
                    <RotateRight style={{border: '2px solid', borderRadius: '5px'}}/>
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
