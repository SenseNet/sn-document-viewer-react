import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { DocumentData, DocumentWidget } from '../models'
import { RootReducerType } from '../store/RootReducer'

import {  ViewerStateType } from '../store/Viewer'

export interface AppBarProps {
    document: DocumentData,
    store: RootReducerType,
    viewer: ViewerStateType,
    documentWidgets: DocumentWidget[]
    actions: {
    }
}

export interface AppBarState {
    isLoading: boolean
    availableWidgets: DocumentWidget[]
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        store: state,
        document: state.sensenetDocumentViewer.documentState.document,
        viewer: state.sensenetDocumentViewer.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
    },
})

class LayoutAppBar extends React.Component<AppBarProps, AppBarState> {

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
            // tslint:disable-next-line:no-console
            console.warn(error)
        }
        this.setState({ ...this.state, isLoading: false, availableWidgets })
    }

    // private rotateClockWise() {
    //     this.props.actions.rotateImages(this.props.viewer.activePages, 90)
    // }

    // private rotateCounterClockwise() {
    //     this.props.actions.rotateImages(this.props.viewer.activePages, -90)
    // }

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
