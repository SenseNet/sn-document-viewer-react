import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { DocumentData, DocumentWidget } from '../models'
import { RootReducerType } from '../store/RootReducer'
import WidgetList from './WidgetList'

import { componentType } from '../services/TypeHelpers'
import { ViewerStateType } from '../store/Viewer'

export interface OwnProps {
    documentWidgets: DocumentWidget[]
}

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

class LayoutAppBar extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

    public state = {
        isLoading: true,
        availableWidgets: [] as DocumentWidget[],
    }

    public render() {

        const documentWidgets = this.state.availableWidgets.map((widget, i) =>
            React.createElement(widget.component, { data: {}, key: i }),
        )

        return (
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {this.props.document.documentName}
                    </Typography>
                    <WidgetList widgets={this.props.documentWidgets} widgetProps={{}} />
                    {
                        documentWidgets
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
