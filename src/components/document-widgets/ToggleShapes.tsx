import { IconButton } from 'material-ui'
import { Dashboard } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { DocumentWidget } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, setShapes } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        setShapes: (value: boolean) => void,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setShapes: (value: boolean) => dispatch(setShapes(value)),
    },
})

export class ToggleShapesComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleRedaction() {
        this.props.actions.setShapes(!this.props.showShapes)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton onClick={() => this.toggleRedaction()} title="Toggle redaction" style={{ opacity: this.props.showShapes ? 1 : 0.5 }}>
                    <Dashboard />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleShapesComponent)

export const toggleShapesWidget: DocumentWidget = {
    shouldCheckAvailable: (oldState, newState) => true,
    isAvailable: async (state) => true,
    component: connectedComponent,
}
