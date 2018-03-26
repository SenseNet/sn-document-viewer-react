import { Action, ActionCreator, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { PreviewState } from '../Enums'
import { DocumentData, DocumentViewerSettings, PreviewImageData, Shape, Shapes } from '../models'
import { getAvailableImages } from './PreviewImages'
import { RootReducerType } from './RootReducer'

export interface DocumentStateType {
    idOrPath?: number | string
    version?: string
    document: DocumentData
    error?: string
    isLoading: boolean
    canEdit: boolean
    canHideWatermark: boolean,
    canHideRedaction: boolean,
    hasChanges: boolean
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
        try {
            const [canEdit, canHideRedaction, canHideWatermark ] = await Promise.all([
                await api.canEditDocument(docData.idOrPath),
                await api.canHideRedaction(docData.idOrPath),
                await api.canHideWatermark(docData.idOrPath),
            ])
            dispatch(documentPermissionsReceived(canEdit, canHideRedaction, canHideWatermark))
        } catch (error) {
            dispatch(documentPermissionsReceived(false, false, false))
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

export const removeShape: <K extends keyof Shapes>(shapeType: K, shapeGuid: string) => Action = (shapeType, shapeGuid) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_REMOVE_SHAPE',
    shapeType,
    shapeGuid,
})

export const documentPermissionsReceived: (canEdit: boolean, canHideRedaction: boolean, canHideWatermark: boolean) => Action =
(canEdit, canHideRedaction, canHideWatermark) => ({
    type: 'SN_DOCVEWER_DOCUMENT_PERMISSIONS_RECEIVED',
    canEdit,
    canHideRedaction,
    canHideWatermark,
})

export const saveChangesRequest: () => Action = () => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_REQUEST',
})

export const saveChangesError: (error: any) => Action = (error) => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_ERROR',
    error,
})

export const saveChangesSuccess: () => Action = () => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS',
})

export const saveChanges: ActionCreator<ThunkAction<Promise<void>, RootReducerType, DocumentViewerSettings>> = () => {
    return async (dispatch, getState, api) => {
        dispatch(saveChangesRequest())
        try {
            await api.saveChanges(getState().sensenetDocumentViewer.documentState.document as DocumentData, getState().sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[])
            dispatch(saveChangesSuccess())
        } catch (error) {
            dispatch(saveChangesError(error))
        }
    }
}

export const documentStateReducer: Reducer<DocumentStateType>
    = (state = {
        document: { } as DocumentData,
        error: undefined,
        isLoading: true,
        idOrPath: undefined,
        version: undefined,
        canEdit: false,
        hasChanges: false,
        canHideRedaction: false,
        canHideWatermark: false,
    }, action) => {
        const actionCasted = action as Action & DocumentStateType
        switch (actionCasted.type) {
            case 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT':
                return { ...state, document: { } as DocumentData, error: undefined, isLoading: true, idOrPath: actionCasted.idOrPath, version: actionCasted.version }
            case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED':
                return { ...state, document: actionCasted.document, error: undefined, isLoading: false, hasChanges: false }
            case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR':
                return { ...state, document: actionCasted.document, error: actionCasted.error, isLoading: false }
            case 'SN_DOCVIEWER_DOCUMENT_UPDATE_SHAPE':
                return {
                    ...state,
                    hasChanges: true,
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
                                }).filter((shape) => shape !== undefined),
                        },
                    },
                }
            case 'SN_DOCVIEWER_DOCUMENT_REMOVE_SHAPE':
            return {
                ...state,
                hasChanges: true,
                document: state.document && {
                    ...state.document,
                    shapes: {
                        ...state.document && state.document.shapes,
                        [action.shapeType as keyof Shapes]:
                            state.document && state.document.shapes && (state.document.shapes[action.shapeType as keyof Shapes] as Shape[]).filter((shape) => shape.guid !== action.shapeGuid),
                    },
                },
            }
            case 'SN_DOCVEWER_DOCUMENT_PERMISSIONS_RECEIVED':
                return {
                    ...state,
                    canEdit: actionCasted.canEdit,
                    canHideRedaction: actionCasted.canHideRedaction,
                    canHideWatermark: actionCasted.canHideWatermark,
                }
            case 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS':
                return {
                    ...state,
                    hasChanges: false,
                }
            default:
                return state
        }
    }
