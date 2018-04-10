import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { PreviewImageData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, rotateImages } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        rotateDocumentLeft: state.sensenetDocumentViewer.localization.rotateDocumentLeft,
        rotateDocumentRight: state.sensenetDocumentViewer.localization.rotateDocumentRight,
    }
}

export const mapDispatchToProps = {
    rotateImages: rotateImages as (imageIndexes: number[], amount: number) => Action,
}

export class RotateDocumentComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private rotateDocumentLeft() {
        this.props.rotateImages(this.props.pages.map((p) => p.Index), -90)
    }

    private rotateDocumentRight() {
        this.props.rotateImages(this.props.pages.map((p) => p.Index), 90)
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>
                <IconButton title={this.props.rotateDocumentLeft}>
                    <RotateLeft onClick={() => this.rotateDocumentLeft()} style={{border: '2px solid', borderRadius: '5px'}} />
                </IconButton>
                <IconButton title={this.props.rotateDocumentRight}>
                    <RotateRight onClick={() => this.rotateDocumentRight()} style={{border: '2px solid', borderRadius: '5px'}}/>
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RotateDocumentComponent)

export {connectedComponent as RotateDocumentWidget}
