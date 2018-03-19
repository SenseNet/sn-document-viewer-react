import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { DocumentViewerSettings, DocumentWidget, PageWidget } from '../models'
import { componentType } from '../services/TypeHelpers'
import { DocumentStateType, pollDocumentData } from '../store/Document'
import { RootReducerType } from '../store/RootReducer'
import { DocumentViewerError } from './DocumentViewerError'
import DocumentViewerLayout from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'

/**
 * Properties for main
 */
export interface OwnProps {
    settings: DocumentViewerSettings
    documentWidgets: DocumentWidget[],
    pageWidgets: PageWidget[],

}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        state: state.sensenetDocumentViewer.documentState as DocumentStateType,
        idOrPath: state.sensenetDocumentViewer.documentState.document && state.sensenetDocumentViewer.documentState.document.idOrPath,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        pollDocumentData: (idOrPath: number | string) => dispatch<any>(pollDocumentData(idOrPath)),
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
        if (this.props.state.error) {
            return <DocumentViewerError error={this.props.state.error} />
        }
        if (this.props.state.isLoading) {
            return <DocumentViewerLoading />

        }
        return <DocumentViewerLayout documentWidgets={this.props.documentWidgets} pageWidgets={this.props.pageWidgets} />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)
