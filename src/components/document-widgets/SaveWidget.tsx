import { IconButton } from 'material-ui'
import { Save } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { DocumentData, DocumentWidget, PreviewImageData } from '../../models'
import { componentType } from '../../services/TypeHelpers'
import { saveChanges } from '../../store/Document'
import { RootReducerType } from '../../store/RootReducer'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        hasChanges: state.sensenetDocumentViewer.documentState.hasChanges || state.sensenetDocumentViewer.previewImages.hasChanges,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) =>  {
    actions: {
        save: (document: DocumentData, pages: PreviewImageData[]) => void,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        save: (document: DocumentData, pages: PreviewImageData[]) => dispatch(saveChanges(document, pages)),
    },
})

export class SaveDocumentComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private save() {
        this.props.actions.save(this.props.document, this.props.pages)
        /** */
        // bang
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>
                <IconButton disabled={!this.props.hasChanges} onClick={() => this.save()}>
                    <Save />
                </IconButton>

            </div>)
    }
}

const saveComponent = connect(mapStateToProps, mapDispatchToProps)(SaveDocumentComponent)

export const saveDocumentWidget: DocumentWidget = {
    shouldCheckAvailable: () => true,
    isAvailable: async (state) => state.sensenetDocumentViewer.documentState.canEdit,
    component: saveComponent,
}