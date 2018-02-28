import { Action, ActionCreator, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { DocumentData, DocumentViewerSettings } from '../models'
import { getAvailableImages } from './PreviewImages'

export interface DocumentStateType {
    idOrPath: number | string | undefined
    document: DocumentData | undefined
    error: string | undefined
    isLoading: boolean
}

export const pollDocumentData: ActionCreator<ThunkAction<Promise<void>, DocumentStateType, DocumentViewerSettings>> = (idOrPath: string) => {
    return async (dispatch, getState, api) => {
        dispatch(setDocumentAction(idOrPath))
        let docData: DocumentData | undefined
        while (!docData) {
            try {
                docData = await api.getDocumentData(idOrPath)
            } catch (error) {
                dispatch(documentReceiveErrorAction(error || Error('Error loading document')))
                return
            }
        }
        dispatch(documentReceivedAction(docData))
        dispatch<any>(getAvailableImages(docData))
    }
}

export const setDocumentAction: (idOrPath: number | string) => Action = (idOrPath) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT',
    idOrPath,
})

export const documentReceivedAction: (document: DocumentData) => Action = (document: DocumentData) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED',
    document,
})

export const documentReceiveErrorAction: (error: string) => Action = (error: string) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR',
    error,
})

export const documentStateReducer: Reducer<DocumentStateType> = (state = { document: undefined, error: undefined, isLoading: true, idOrPath: undefined }, action) => {
    const actionCasted = action as Action & DocumentStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT':
            return Object.assign({}, state, { document: undefined, error: undefined, isLoading: true, idOrPath: actionCasted.idOrPath })
        case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED':
            return Object.assign({}, state, { document: actionCasted.document, error: undefined, isLoading: false })
        case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR':
            return Object.assign({}, state, { document: actionCasted.document, error: actionCasted.error, isLoading: false })
        default:
            return state
    }
}
