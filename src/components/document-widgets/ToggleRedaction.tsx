import { IconButton } from 'material-ui'
import { PictureInPicture } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setRedaction } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        canHideRedaction: state.sensenetDocumentViewer.documentState.canHideRedaction,
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
        showRedaction: state.sensenetDocumentViewer.viewer.showRedaction,
        toggleRedaction: state.sensenetDocumentViewer.localization.toggleRedaction,
    }
}

export const mapDispatchToProps = {
    setRedaction,
}

export class ToggleRedactionComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleRedaction() {
        this.props.setRedaction(!this.props.showRedaction)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton title={this.props.toggleRedaction} style={{ opacity: this.props.showRedaction ? 1 : 0.5 }}>
                    <PictureInPicture onClick={() => this.toggleRedaction()} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleRedactionComponent)

// todo: disabled to state.sensenetDocumentViewer.documentState.canHideRedaction
export {connectedComponent as ToggleRedactionWidget}
