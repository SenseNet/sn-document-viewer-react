import { IconButton } from 'material-ui'
import { Dashboard } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { componentType } from '../../services'
import { RootReducerType, setShapes } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
    }
}

export const mapDispatchToProps = {
    setShapes: setShapes as (showShapes: boolean) => Action,
}

export class ToggleShapesComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleRedaction() {
        this.props.setShapes(!this.props.showShapes)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton title="Toggle redaction" style={{ opacity: this.props.showShapes ? 1 : 0.5 }}>
                    <Dashboard onClick={() => this.toggleRedaction()}  />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleShapesComponent)

export {connectedComponent as ToggleShapesWidget}
