import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { DocumentAction, DocumentData } from '../models'
import { RootReducerType } from '../store/RootReducer'

import {  ViewerStateType } from '../store/Viewer'

export interface AppBarProps {
    document: DocumentData,
    store: RootReducerType,
    viewer: ViewerStateType,
    documentActions: DocumentAction[]
    actions: {
    //     setActivePages: (page: number) => Action,
    //     setZoomMode: (zoomMode: ZoomMode) => Action,
    //     setZoomLevel: (zoomLevel: number) => Action,
    //     rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

export interface AppBarState {
    isLoading: boolean
    availableActions: DocumentAction[]
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        store: state,
        document: state.documentState.document,
        viewer: state.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        // setActivePages: (page: number) => dispatch(setActivePages([page])),
        // setZoomMode: (zoomMode: ZoomMode) => dispatch(setZoomMode(zoomMode)),
        // setZoomLevel: (zoomLevel: number) => dispatch(setCustomZoomLevel(zoomLevel)),
        // rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

class LayoutAppBar extends React.Component<AppBarProps, AppBarState> {

    public state = {
        isLoading: true,
        availableActions: [] as DocumentAction[],
    }

    private documentActionAvailabilityCache: Map<DocumentAction, boolean> = new Map()

    public async componentWillReceiveProps(newProps: this['props']) {

        this.setState({ ...this.state, isLoading: true, availableActions: [] })
        const availableActions: DocumentAction[] = []
        try {
            await Promise.all(this.props.documentActions.map(async (action) => {
                if (!action.shouldCheckAvailable(this.props.store, newProps.store) && this.documentActionAvailabilityCache.has(action)) {
                    availableActions.push(action)
                } else {
                    const isAvailable = await action.isAvailable(newProps.store)
                    if (isAvailable) {
                        availableActions.push(action)
                    }
                    this.documentActionAvailabilityCache.set(action, isAvailable)
                }
            }))
        } catch (error) {
            /** */
            // tslint:disable-next-line:no-console
            console.warn(error)
        }
        this.setState({ ...this.state, isLoading: false, availableActions })
    }

    // private rotateClockWise() {
    //     this.props.actions.rotateImages(this.props.viewer.activePages, 90)
    // }

    // private rotateCounterClockwise() {
    //     this.props.actions.rotateImages(this.props.viewer.activePages, -90)
    // }

    public render() {

        const documentActions = this.state.availableActions.map((action, i) =>
            React.createElement(action.component, { data: {}, key: i }),
        )

        return (
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit">
                        {this.props.document.documentName}
                    </Typography>
                    <div>
                    {
                        documentActions
                    }
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
