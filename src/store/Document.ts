import { Action, ActionCreator, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { PreviewState } from '../Enums'
import { DocumentData, DocumentViewerSettings, PreviewImageData, Shape, Shapes } from '../models'
import { Dimensions, ImageUtil } from '../services'
import { getAvailableImages } from './PreviewImages'
import { RootReducerType } from './RootReducer'

export interface DocumentStateType {
    pollInterval: number
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
                    await new Promise<void>((resolve, reject) => setTimeout(() => { resolve() }, getState().pollInterval))
                }
            } catch (error) {
                dispatch(documentReceiveErrorAction(error || Error('Error loading document')))
                return
            }
        }
        try {
            const [canEdit, canHideRedaction, canHideWatermark] = await Promise.all([
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

export const setPollInterval: (pollInterval: number) => Action = (pollInterval) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_SET_POLL_INTERVAL',
    pollInterval,
})

export const documentPermissionsReceived: (canEdit: boolean, canHideRedaction: boolean, canHideWatermark: boolean) => Action =
    (canEdit, canHideRedaction, canHideWatermark) => ({
        type: 'SN_DOCVEWER_DOCUMENT_PERMISSIONS_RECEIVED',
        canEdit,
        canHideRedaction,
        canHideWatermark,
    })

export const saveChangesRequest = () => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_REQUEST',
})

export const saveChangesError = (error: any) => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_ERROR',
    error,
} as Action)

export const saveChangesSuccess = () => ({
    type: 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS',
} as Action)

export const rotateShapesForPages = (pages: Array<{ index: number, size: Dimensions }>, degree: number) => ({
    type: 'SN_DOCVEWER_DOCUMENT_ROTATE_SHAPES_FOR_PAGES',
    pages,
    degree,
} as Action)

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

export const applyShapeRotations = <T extends Shape>(shapes: T[], degree: number, pages: Array<{ index: number, size: Dimensions }>) => ([
    ...shapes.map((s) => {
        const page = pages.find((p) => p.index === s.imageIndex)
        if (page) {
            const angle = (Math.PI / 180) * ImageUtil.normalizeDegrees(degree)
            const [sin, cos] = [Math.sin(angle), Math.cos(angle)]
            const oldX = s.x - page.size.height / 2
            const oldY = s.y - page.size.width / 2
            const newX = oldX * cos - oldY * sin
            const newY = oldY * cos + oldX * sin
            return {
                ...s as {},
                x: newX + page.size.height / 2,
                y: newY + page.size.width / 2,
            } as T
        }
        return s
    }),
])

export const documentStateReducer: Reducer<DocumentStateType>
    = (state = {
        document: {
            shapes: {
                annotations: [],
                highlights: [],
                redactions: [],
            },
            documentName: '',
            documentType: '',
            fileSizekB: 0,
            idOrPath: 0,
            pageAttributes: [],
            pageCount: 0,
        } as DocumentData,
        error: undefined,
        isLoading: true,
        idOrPath: undefined,
        version: undefined,
        canEdit: false,
        hasChanges: false,
        canHideRedaction: false,
        canHideWatermark: false,
        pollInterval: 2000,
    }, action) => {
        const actionCasted = action as Action & DocumentStateType
        switch (actionCasted.type) {
            case 'SN_DOCVIEWER_DOCUMENT_SET_DOCUMENT':
                return { ...state, error: undefined, isLoading: true, idOrPath: actionCasted.idOrPath, version: actionCasted.version }
            case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVED':
                return { ...state, document: actionCasted.document, error: undefined, isLoading: false, hasChanges: false }
            case 'SN_DOCVIEWER_DOCUMENT_DATA_RECEIVE_ERROR':
                return { ...state, error: actionCasted.error, isLoading: false }
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
                                state.document && state.document.shapes && (state.document.shapes[action.shapeType as keyof Shapes] as Shape[])
                                    .filter((shape) => shape && shape.guid !== action.shapeGuid),
                        },
                    },
                }
            case 'SN_DOCVEWER_DOCUMENT_ROTATE_SHAPES_FOR_PAGES':
                return {
                    ...state,
                    hasChanges: true,
                    document: state.document && {
                        ...state.document,
                        shapes: {
                            annotations: applyShapeRotations(state.document.shapes.annotations, action.degree, action.pages),
                            highlights: applyShapeRotations(state.document.shapes.highlights, action.degree, action.pages),
                            redactions: applyShapeRotations(state.document.shapes.redactions, action.degree, action.pages),
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
            case 'SN_DOCVIEWER_DOCUMENT_SET_POLL_INTERVAL':
                return {
                    ...state,
                    pollInterval: action.pollInterval,
                }
            default:
                return state
        }
    }
