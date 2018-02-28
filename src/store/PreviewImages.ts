import { Action, ActionCreator } from 'redux'
import { Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../models'

export interface PreviewImagesStateType {
    AvailableImages: PreviewImageData[]
    Error: string | null
}

export const getAvailabelImagesAction: (documentData: DocumentData) => Action = (documentData) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_GET_IMAGES',
    documentData,
})

export const availabelImagesReceivedAction: (imageData: PreviewImageData[]) => Action = (imageData) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVED',
    imageData,
})

export const availabelImagesReceiveErrorAction: (error: string) => Action = (error) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVE_ERROR',
    error,
})

export const getAvailableImages: ActionCreator<ThunkAction<Promise<void>, PreviewImagesStateType, DocumentViewerSettings>> = (documentData: DocumentData, version: string = 'V1.0A') => {
    return async (dispatch, getState, api) => {
        dispatch(getAvailabelImagesAction(documentData))
        let docData: PreviewImageData[] | undefined
        try {
            docData = await api.getExistingPreviewImages(documentData, version)
        } catch (error) {
            dispatch(availabelImagesReceiveErrorAction(error.message || Error('Error getting preview images')))
            return
        }
        dispatch(availabelImagesReceivedAction(docData))
    }
}

export const previewImagesReducer: Reducer<PreviewImagesStateType> = (state = { AvailableImages: [], Error: null }, action) => {
    const actionCasted = action as Action & PreviewImagesStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_PREVIEWS_GET_IMAGES':
            return Object.assign({}, state, { AvailableImages: [], Error: null })
        case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVED':
            return Object.assign({}, state, { AvailableImages: action.imageData })
        case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVE_ERROR':
            return Object.assign({}, state, { AvailableImages: [], error: action.Error })
        default:
            return state
    }
}
