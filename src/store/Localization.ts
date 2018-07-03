import { Reducer } from 'redux'
import { PreviewState } from '../Enums'

/**
 * Model definition for the localization store
 */
export interface LocalizationStateType {
    rotateDocumentLeft: string
    rotateDocumentRight: string
    rotatePageLeft: string
    rotatePageRight: string
    zoomMode: string
    zoomModeFit: string
    zoomModeOriginalSize: string
    zoomModeFitHeight: string
    zoomModeFitWidth: string
    zooomModeCustom: string
    toggleRedaction: string
    toggleWatermark: string
    toggleShapes: string
    toggleThumbnails: string
    firstPage: string
    previousPage: string
    gotoPage: string
    nextPage: string
    lastPage: string
    saveChanges: string
    loadingDocument: string
    errorLoadingDocument: Array<{state: PreviewState, value: string}>
    errorLoadingDetails: string
    reloadPage: string
    search: string
    share: string
}

/**
 * Default localization string value
 */
export const defaultLocalization: LocalizationStateType = {
    rotateDocumentLeft: 'Rotate document left',
    rotateDocumentRight: 'Rotate document right',
    rotatePageLeft: 'Rotate page left',
    rotatePageRight: 'Rotate page right',
    zoomMode: 'Zoom mode',
    zoomModeFit: 'Fit',
    zoomModeOriginalSize: 'Original size',
    zoomModeFitHeight: 'Fit height',
    zoomModeFitWidth: 'Fit width',
    zooomModeCustom: 'Custom',
    toggleRedaction: 'Toggle redaction',
    toggleWatermark: 'Toggle watermark',
    toggleShapes: 'Toggle shapes',
    toggleThumbnails: 'Toggle thumbnails',
    firstPage: 'First page',
    previousPage: 'Previous page',
    gotoPage: 'Goto page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    saveChanges: 'Save changes',
    loadingDocument: 'Preview image generation is in progress',
    errorLoadingDocument: [
        {state: PreviewState.Empty, value: ''},
        {state: PreviewState.UploadFailure, value: 'Failed to upload'},
        {state: PreviewState.UploadFailure2, value: 'Failed to upload'},
        {state: PreviewState.ExtensionFailure, value: 'Failed to generate preview images due to an extension error'},
        {state: PreviewState.Empty, value: 'The document doesn\'t have any preview images'},
        {state: PreviewState.NoPreviewProviderEnabled, value: 'There is no preview provider enabled'},
    ],
    errorLoadingDetails: 'The following error occured during opening a document: ',
    reloadPage: 'Reload page',
    search: 'Search',
    share: 'Share',
}

/**
 * Action that updates the store with new localized values
 * @param localization The new localization values
 */
export const setLocalization = (localization: Partial<LocalizationStateType>) => ({
    type: 'SN_DOCVIEWER_SET_LOCALIZATION',
    localization,
})

/**
 * Reducer for localization
 * @param state the current state
 * @param action the action to dispatch
 */
export const localizationReducer: Reducer<LocalizationStateType> = (state: LocalizationStateType = defaultLocalization, action) => {
    switch (action.type) {
        case 'SN_DOCVIEWER_SET_LOCALIZATION': {
            return {
                ...state,
                ...action.localization,
            }
        }
    }
    return state
}
