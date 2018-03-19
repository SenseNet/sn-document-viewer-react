import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { DocumentData, DocumentWidget } from '../models'
import { RootReducerType } from '../store/RootReducer'

import { componentType } from '../services/TypeHelpers'
import {  ViewerStateType } from '../store/Viewer'

export interface OwnProps {
    documentWidgets: DocumentWidget[]
}

export interface AppBarState {
    isLoading: boolean
    availableWidgets: DocumentWidget[]
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        store: state,
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        viewer: state.sensenetDocumentViewer.viewer as ViewerStateType,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
    },
})

class LayoutAppBar extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, AppBarState> {

    public state = {
        isLoading: true,
        availableWidgets: [] as DocumentWidget[],
    }

    private documentActionAvailabilityCache: Map<DocumentWidget, boolean> = new Map()

    public async componentWillReceiveProps(newProps: this['props']) {

        this.setState({ ...this.state, isLoading: true, availableWidgets: [] })
        const availableWidgets: DocumentWidget[] = []
        try {
            await Promise.all(this.props.documentWidgets.map(async (action) => {
                if (!action.shouldCheckAvailable(this.props.store, newProps.store) && this.documentActionAvailabilityCache.has(action)) {
                    availableWidgets.push(action)
                } else {
                    const isAvailable = await action.isAvailable(newProps.store)
                    if (isAvailable) {
                        availableWidgets.push(action)
                    }
                    this.documentActionAvailabilityCache.set(action, isAvailable)
                }
            }))
        } catch (error) {
            /** */
        }
        this.setState({ ...this.state, isLoading: false, availableWidgets })
    }

    public render() {

        const documentWidgets = this.state.availableWidgets.map((widget, i) =>
            React.createElement(widget.component, { data: {}, key: i }),
        )

        return (
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit">
                        {this.props.document.documentName}
                    </Typography>
                    <div>
                    {
                        documentWidgets
                    }
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
