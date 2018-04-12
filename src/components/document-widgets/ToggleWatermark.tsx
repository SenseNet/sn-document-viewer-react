import { IconButton } from 'material-ui'
import { BrandingWatermark } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setWatermark } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        canHideWatermark: state.sensenetDocumentViewer.documentState.canHideWatermark,
        showWatermark: state.sensenetDocumentViewer.viewer.showWatermark,
        toggleWatermark: state.sensenetDocumentViewer.localization.toggleWatermark,
    }
}

export const mapDispatchToProps = {
    setWatermark,
}

export class ToggleWatermarkComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleWatermark() {
        this.props.setWatermark(!this.props.showWatermark)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton title={this.props.toggleWatermark} style={{ opacity: this.props.showWatermark ? 1 : 0.5 }}>
                    <BrandingWatermark onClick={() => this.toggleWatermark()} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleWatermarkComponent)

export {connectedComponent as ToggleWatermarkWidget}
