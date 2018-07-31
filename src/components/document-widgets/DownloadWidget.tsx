import { IconButton } from '@material-ui/core'
import { FileDownload } from '@material-ui/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { DocumentData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        title: state.sensenetDocumentViewer.localization.download,
        document: state.sensenetDocumentViewer.documentState.document,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {

}

/**
 * Own properties for the Share component
 */
export interface OwnProps {
    download: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export class DownloadComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton color="inherit" title={this.props.title}>
                    <FileDownload onClick={() => this.props.download(this.props.document)} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DownloadComponent)

export { connectedComponent as Download }
