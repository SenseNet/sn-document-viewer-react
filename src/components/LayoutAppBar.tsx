import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { DocumentData } from '../models'
import { RootReducerType, ViewerStateType } from '../store'

import { componentType } from '../services'

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        store: state,
        isLoading: state.sensenetDocumentViewer.documentState.isLoading,
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        viewer: state.sensenetDocumentViewer.viewer as ViewerStateType,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
    },
})

class LayoutAppBar extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, {}>> {

    public render() {
        return (
            <AppBar position="sticky" style={{ position: 'relative', zIndex: 1 }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {this.props.document.documentName}
                    </Typography>
                    {this.props.children}
                </Toolbar>
            </AppBar>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
export { connectedComponent as LayoutAppBar }
