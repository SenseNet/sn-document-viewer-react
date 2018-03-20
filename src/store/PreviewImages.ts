import { Action, ActionCreator } from 'redux'
import { Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../models'
import { ImageUtil } from '../services/ImageUtils'

export interface PreviewImagesStateType {
    AvailableImages: PreviewImageData[]
    hasChanges: boolean
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

export const rotateImages: (imageIndexes: number[], amount: number) => Action = (imageIndexes, amount) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_IMAGES_ROTATE',
    imageIndexes,
    amount,
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
export const previewAvailableAction: (documentData: DocumentData, version: string, page: number) => Action = (documentData, version, page) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE',
    documentData,
})

export const previewAvailableReceivedAction: (documentData: DocumentData, version: string, page: number, imageData: PreviewImageData) => Action = (documentData, version, page, imageData) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_RECEIVED',
    documentData,
    version,
    page,
    imageData,
})

export const previewNotAvailableReceivedAction: () => Action = () => ({
    type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_NOT_AVAILABLE_RECEIVED',
})

export const previewAvailableErrorAction: (error: string) => Action = (error) => ({
    type: 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_ERROR',
    error,
})

export const previewAvailable: ActionCreator<ThunkAction<Promise<void>, PreviewImagesStateType, DocumentViewerSettings>> = (documentData: DocumentData, version: string = 'V1.0A', page: number = 1) => {
    return async (dispatch, getState, api) => {
        dispatch(previewAvailableAction(documentData, version, page))
        let docData: PreviewImageData | undefined
        try {
            docData = await api.isPreviewAvailable(documentData, version, page)
        } catch (error) {
            dispatch(availabelImagesReceiveErrorAction(error.message || Error(`Error getting preview image for page ${page}`)))
            return
        }
        if (docData) {
            dispatch(previewAvailableReceivedAction(documentData, version, page, docData))
        } else {
            dispatch(previewNotAvailableReceivedAction)
        }
    }
}

export const previewImagesReducer: Reducer<PreviewImagesStateType> = (state = { AvailableImages: [], Error: null, hasChanges: false }, action) => {
    const actionCasted = action as Action & PreviewImagesStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_PREVIEWS_GET_IMAGES':
            return { ...state, AvailableImages: [], Error: null }
        case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVED':
            return { ...state, hasChanges: false, AvailableImages: action.imageData }
        case 'SN_DOCVIEWER_PREVIEWS_IMAGES_RECEIVE_ERROR':
            return { ...state, AvailableImages: [], error: action.Error }
        case 'SN_DOCVIEWER_PREVIEWS_IMAGES_ROTATE':
            return {
                ...state,
                hasChanges: true,
                AvailableImages:
                    state.AvailableImages.map((img) => {
                        const newImg = { ...img }
                        if (action.imageIndexes.indexOf(newImg.Index) >= 0) {
                            const newAngle = ImageUtil.normalizeDegrees((newImg.Attributes && newImg.Attributes.degree || 0) + (action.amount % 360)) % 360
                            newImg.Attributes = {
                                ...newImg.Attributes,
                                degree: newAngle,
                            }
                        }
                        return newImg
                    }),
            }
        case 'SN_DOCVIEWER_PREVIEWS_PREVIEW_AVAILABLE_RECEIVED':
            return {
                ...state,
                AvailableImages:
                    state.AvailableImages.map((img) => {
                        if (img.Index === action.page) {
                            return {
                                Index: img.Index,
                                ...action.imageData,
                            }
                        }
                        return img
                    }),
            }
        default:
            return state
    }
}
