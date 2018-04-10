import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import { DocumentViewerSettings } from '../models'
import { componentType } from '../services'
import { DocumentStateType, pollDocumentData, RootReducerType } from '../store'
import { DocumentViewerError } from './DocumentViewerError'
import { DocumentViewerLayout } from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'

/**
 * Properties for main
 */
export interface OwnProps {
    settings: DocumentViewerSettings
    documentIdOrPath: string | number
}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        isLoading: state.sensenetDocumentViewer.documentState.isLoading,
        idOrPath: state.sensenetDocumentViewer.documentState.document && state.sensenetDocumentViewer.documentState.document.idOrPath,
        error: state.sensenetDocumentViewer.documentState.error,
    }
}

const mapDispatchToProps = {
    pollDocumentData: pollDocumentData as ActionCreator<(dispatch: Dispatch<DocumentStateType>, getState: () => DocumentStateType, extraArgument: DocumentViewerSettings) => Promise<void>>,
}

type docViewerComponentType = componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>

/**
 * Main document viewer component
 */
class DocumentViewer extends React.Component<docViewerComponentType> {

    constructor(props: docViewerComponentType) {
        super(props)
        if (this.props.documentIdOrPath) {
            this.props.pollDocumentData(this.props.documentIdOrPath)
        }

    }

    public componentWillReceiveProps(newProps: this['props']) {
        if (this.props.documentIdOrPath !== newProps.documentIdOrPath) {
            this.props.pollDocumentData(newProps.documentIdOrPath)
        }
    }

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
        return (<DocumentViewerLayout>
            {this.props.children}
        </DocumentViewerLayout>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)

export { connectedComponent as DocumentViewer }
