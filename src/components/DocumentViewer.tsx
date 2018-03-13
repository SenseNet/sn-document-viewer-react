import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { DocumentViewerSettings, DocumentWidget, PageWidget } from '../models'
import { DocumentStateType, pollDocumentData } from '../store/Document'
import { RootReducerType } from '../store/RootReducer'
import { DocumentViewerError } from './DocumentViewerError'
import DocumentViewerLayout from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'

/**
 * Properties for main
 */
export interface DocumentViewerProps {
    idOrPath: number | string
    settings: DocumentViewerSettings
    documentWidgets: DocumentWidget[],
    pageWidgets: PageWidget[],

}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return state.sensenetDocumentViewer.documentState
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        pollDocumentData: (idOrPath: number | string) => dispatch<any>(pollDocumentData(idOrPath)),
    },
})

/**
 * Main document viewer component
 */
class DocumentViewer extends React.Component<DocumentViewerProps & DocumentStateType & { actions: any }, {}> {
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
        return <DocumentViewerLayout documentWidgets={this.props.documentWidgets} pageWidgets={this.props.pageWidgets} />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)
