import { Action, Reducer } from 'redux'

export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

export interface ViewerStateType {
    activePage: number
    zoomMode: ZoomMode
    customZoomLevel: number
}

export const setPage: (pageNumber: number) => Action = (pageNumber) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE',
    pageNumber,
})

export const setZoomMode: (zoomMode: ZoomMode) => Action = (zoomMode) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE',
    zoomMode,
})

export const setZoomLevel: (level: number) => Action = (zoomLevel) => ({
    type: 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL',
    zoomLevel,
})

export const viewerStateReducer: Reducer<ViewerStateType> = (state = { activePage: 0, zoomMode: 'fit', customZoomLevel: 0 }, action) => {
    const actionCasted = action as Action & ViewerStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
            return Object.assign({}, state, { activePage: actionCasted.activePage })
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
            return Object.assign({}, state, { zoomMode: actionCasted.zoomMode, customZoomLevel: 0 })
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
            return Object.assign({}, state, { zoomMode: 'custom', customZoomLevel: actionCasted.customZoomLevel })
        default:
            return state
    }
}
