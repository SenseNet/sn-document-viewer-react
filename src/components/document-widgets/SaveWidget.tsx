import { IconButton } from 'material-ui'
import { Save } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { DocumentData, PreviewImageData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, saveChanges } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        saveChanges: state.sensenetDocumentViewer.localization.saveChanges,
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        hasChanges: state.sensenetDocumentViewer.documentState.hasChanges || state.sensenetDocumentViewer.previewImages.hasChanges,
    }
}

export const mapDispatchToProps = {
    save: saveChanges as (document: DocumentData, pages: PreviewImageData[]) => void,
}

export class SaveDocumentComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private save() {
        this.props.save(this.props.document, this.props.pages)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton disabled={!this.props.hasChanges} title={this.props.saveChanges}>
                    <Save onClick={() => this.save()} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SaveDocumentComponent)

export { connectedComponent as SaveWidget }
