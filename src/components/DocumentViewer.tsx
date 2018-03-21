import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { DocumentViewerSettings, DocumentWidget, PageWidget } from '../models'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store/RootReducer'
import { DocumentViewerError } from './DocumentViewerError'
import DocumentViewerLayout from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'

/**
 * Properties for main
 */
export interface OwnProps {
    settings: DocumentViewerSettings
    documentWidgets: DocumentWidget[]
    sidebarWidgets: DocumentWidget[]
    pageWidgets: PageWidget[]
}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        isLoading: state.sensenetDocumentViewer.documentState.isLoading,
        idOrPath: state.sensenetDocumentViewer.documentState.document && state.sensenetDocumentViewer.documentState.document.idOrPath,
        error: state.sensenetDocumentViewer.documentState.document && state.sensenetDocumentViewer.documentState.error,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
    },
})

/**
 * Main document viewer component
 */
class DocumentViewer extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {
    /**
     * renders the component
     */
    public render() {
        if (this.props.error) {
            return <DocumentViewerError error={this.props.error} />
        }
        if (this.props.isLoading) {
            return <DocumentViewerLoading />

        }
        return <DocumentViewerLayout documentWidgets={this.props.documentWidgets} pageWidgets={this.props.pageWidgets} sidebarWidgets={this.props.sidebarWidgets} />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)
