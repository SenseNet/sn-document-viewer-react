import { Action, Reducer } from 'redux'

export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

export interface ViewerStateType {
    activePages: number[]
    zoomMode: ZoomMode
    customZoomLevel: number
    showWatermark: boolean
    showRedaction: boolean
    showShapes: boolean
}

export const setActivePages: (activePages: number[]) => Action = (activePages) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE',
    activePages,
})

export const setZoomMode: (zoomMode: ZoomMode) => Action = (zoomMode) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE',
    zoomMode,
})

export const setCustomZoomLevel: (level: number) => Action = (customZoomLevel) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL',
    customZoomLevel,
})

export const setWatermark: (showWatermark: boolean) => Action = (showWatermark) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK',
    showWatermark,
})

export const setRedaction: (showRedaction: boolean) => Action = (showRedaction) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION',
    showRedaction,
})

export const setShapes: (showShapes: boolean) => Action = (showShapes) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES',
    showShapes,
})

export const viewerStateReducer: Reducer<ViewerStateType> = (state = { activePages: [1], zoomMode: 'fit', customZoomLevel: 3, showWatermark: false, showRedaction: true, showShapes: true }, action) => {
    const actionCasted = action as Action & ViewerStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
            return {...state, activePages: [...actionCasted.activePages] }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
            return {...state, zoomMode: actionCasted.zoomMode, customZoomLevel: 0 }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
            return {...state, zoomMode: 'custom', customZoomLevel: actionCasted.customZoomLevel }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK':
            return {...state, showWatermark: actionCasted.showWatermark }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION':
            return {...state, showRedaction: actionCasted.showRedaction }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES':
            return {...state, showShapes: actionCasted.showShapes }
        default:
            return state
    }
}
