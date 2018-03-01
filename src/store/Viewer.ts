import { Action, Reducer } from 'redux'

export type ZoomMode = 'originalSize' | 'fit' | 'fitHeight' | 'fitWidth' | 'custom'

export interface ViewerStateType {
    activePages: number[]
    zoomMode: ZoomMode
    customZoomLevel: number
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

export const viewerStateReducer: Reducer<ViewerStateType> = (state = { activePages: [1], zoomMode: 'fit', customZoomLevel: 3 }, action) => {
    const actionCasted = action as Action & ViewerStateType
    switch (actionCasted.type) {
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_PAGE':
            return Object.assign({}, state, { activePages: [...actionCasted.activePages] })
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_ZOOM_MODE':
            return Object.assign({}, state, { zoomMode: actionCasted.zoomMode, customZoomLevel: 0 })
        case 'SN_DOCVIEWER_DOCUMENT_VIEWER_SET_CUSTOM_ZOOM_LEVEL':
            return Object.assign({}, state, { zoomMode: 'custom', customZoomLevel: actionCasted.customZoomLevel })
        default:
            return state
    }
}
