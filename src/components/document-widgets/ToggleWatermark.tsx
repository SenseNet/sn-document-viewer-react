import { IconButton } from 'material-ui'
import { BrandingWatermark } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { DocumentWidget } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, setWatermark } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        canHideWatermark: state.sensenetDocumentViewer.documentState.canHideWatermark,
        showWatermark: state.sensenetDocumentViewer.viewer.showWatermark,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        setWatermark: (value: boolean) => void,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setWatermark: (value: boolean) => dispatch(setWatermark(value)),
    },
})

export class ToggleWatermarkComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleWatermark() {
        this.props.actions.setWatermark(!this.props.showWatermark)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton onClick={() => this.toggleWatermark()} title="Toggle watermark" style={{ opacity: this.props.showWatermark ? 1 : 0.5 }}>
                    <BrandingWatermark />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleWatermarkComponent)

export const toggleWatermarkWidget: DocumentWidget = {
    shouldCheckAvailable: (oldState, newState) => true,
    isAvailable: async (state) => {
        return state.sensenetDocumentViewer.documentState.canHideWatermark
    },
    component: connectedComponent,
}
