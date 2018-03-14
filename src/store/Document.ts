import { Action, ActionCreator, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { PreviewState } from '../Enums'
import { DocumentData, DocumentViewerSettings, Shape, Shapes } from '../models'
import { getAvailableImages } from './PreviewImages'

export interface DocumentStateType {
    idOrPath?: number | string
    version?: string
    document?: DocumentData
    error?: string
    isLoading: boolean
}

export const pollDocumentData: ActionCreator<ThunkAction<Promise<void>, DocumentStateType, DocumentViewerSettings>> = (idOrPath: string, version: string) => {
    return async (dispatch, getState, api) => {
        dispatch(setDocumentAction(idOrPath, version))
        let docData: DocumentData | undefined
        while (!docData || docData.pageCount === PreviewState.Loading) {
            try {
                docData = await api.getDocumentData(idOrPath)
                if (!docData || docData.pageCount === PreviewState.Loading) {
                    await new Promise<void>((resolve, reject) => setTimeout(() => { resolve() }, api.pollInterval))
                }
            } catch (error) {
                dispatch(documentReceiveErrorAction(error || Error('Error loading document')))
                return
            }
        }
        dispatch(documentReceivedAction(docData))
        dispatch<any>(getAvailableImages(docData))
    }
}

export const setDocumentAction: (idOrPath: number | string, version: string) => Action = (idOrPath, version) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT',
    idOrPath,
    version,
})

export const documentReceivedAction: (document: DocumentData) => Action = (document: DocumentData) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED',
    document,
})

export const documentReceiveErrorAction: (error: string) => Action = (error: string) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR',
    error,
})

export const updateShapeData: <K extends keyof Shapes>(shapeType: K, shapeGuid: string, shapeData: Shapes[K][0]) => Action = (shapeType, shapeGuid, shapeData) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_UPDATE_SHAPE',
    shapeType,
    shapeGuid,
    shapeData,
})

export const documentStateReducer: Reducer<DocumentStateType> = (state = { document: undefined, error: undefined, isLoading: true, idOrPath: undefined, version: undefined }, action) => {
    const actionCasted = action as Action & DocumentStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT':
            return { ...state, document: undefined, error: undefined, isLoading: true, idOrPath: actionCasted.idOrPath, version: actionCasted.version }
        case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED':
            return { ...state, document: actionCasted.document, error: undefined, isLoading: false }
        case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR':
            return { ...state, document: actionCasted.document, error: actionCasted.error, isLoading: false }
        case 'SN_DOCVIEWER_DOCUMENT_UPDATE_SHAPE':
            return {
                ...state,
                document: state.document && {
                    ...state.document,
                    shapes: {
                        ...state.document && state.document.shapes,
                        [action.shapeType as keyof Shapes]:
                            state.document && state.document.shapes && (state.document.shapes[action.shapeType as keyof Shapes] as Shape[]).map((shape) => {
                                if (shape.guid === action.shapeGuid) {
                                    return action.shapeData
                                }
                                return shape
                            }),
                    },
                },
            }
        default:
            return state
        }
}
