import { Reducer } from 'redux'

export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

export interface ViewerStateType {
    activePages: number[]
    zoomMode: ZoomMode
    customZoomLevel: number
    showWatermark: boolean
    showRedaction: boolean
    showShapes: boolean
}

export const setActivePages = (activePages: number[]) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE',
    activePages,
})

export const setZoomMode = (zoomMode: ZoomMode) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE',
    zoomMode,
})

export const setCustomZoomLevel = (customZoomLevel: number) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL',
    customZoomLevel,
})

export const setWatermark = (showWatermark: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK',
    showWatermark,
})

export const setRedaction = (showRedaction: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION',
    showRedaction,
})

export const setShapes = (showShapes: boolean) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES',
    showShapes,
})

export const viewerStateReducer: Reducer<ViewerStateType> = (state = { activePages: [1], zoomMode: 'fit', customZoomLevel: 3, showWatermark: false, showRedaction: true, showShapes: true }, action) => {
    switch (action.type) {
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
            return {...state, activePages: [...action.activePages] }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
            return {...state, zoomMode: action.zoomMode, customZoomLevel: 0 }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
            return {...state, zoomMode: 'custom', customZoomLevel: action.customZoomLevel }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_WATERMARK':
            return {...state, showWatermark: action.showWatermark }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_REDACTION':
            return {...state, showRedaction: action.showRedaction }
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_SHAPES':
            return {...state, showShapes: action.showShapes }
        default:
            return state
    }
}
