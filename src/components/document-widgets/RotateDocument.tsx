import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { PreviewImageData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, rotateImages } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
        activePages: state.sensenetDocumentViewer.viewer.activePages,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) =>  {
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

export class RotateDocumentComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private rotateDocumentLeft() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), -90)
    }

    private rotateDocumentRight() {
        this.props.actions.rotateImages(this.props.pages.map((p) => p.Index), 90)
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>
                <IconButton title="Rotate document left">
                    <RotateLeft onClick={() => this.rotateDocumentLeft()} style={{border: '2px solid', borderRadius: '5px'}} />
                </IconButton>
                <IconButton title="Rotate document right">
                    <RotateRight onClick={() => this.rotateDocumentRight()} style={{border: '2px solid', borderRadius: '5px'}}/>
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RotateDocumentComponent)

export {connectedComponent as RotateDocumentWidget}
