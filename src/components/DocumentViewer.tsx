import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { DocumentViewerSettings, DocumentWidget, PageWidget } from '../models'
import { componentType } from '../services'
import { pollDocumentData, RootReducerType } from '../store'
import { DocumentViewerError, DocumentViewerLayout, DocumentViewerLoading } from './'

/**
 * Properties for main
 */
export interface OwnProps {
    settings: DocumentViewerSettings
    documentIdOrPath: string | number
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
        pollDocumentData: (idOrPath: number | string) => dispatch<any>(pollDocumentData(idOrPath)) as void,
    },
})

type docViewerComponentType = componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>

/**
 * Main document viewer component
 */
class DocumentViewer extends React.Component<docViewerComponentType> {

    constructor(props: docViewerComponentType) {
        super(props)
        if (this.props.documentIdOrPath) {
            this.props.actions.pollDocumentData(this.props.documentIdOrPath)
        }

    }

    public componentWillReceiveProps(newProps: this['props']) {
        if (this.props.documentIdOrPath !== newProps.documentIdOrPath) {
            this.props.actions.pollDocumentData(newProps.documentIdOrPath)
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
        return <DocumentViewerLayout documentWidgets={this.props.documentWidgets} pageWidgets={this.props.pageWidgets} sidebarWidgets={this.props.sidebarWidgets} />
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)

export {connectedComponent as DocumentViewer}
