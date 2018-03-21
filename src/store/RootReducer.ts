import { combineReducers } from 'redux'
import { Reducer } from 'redux'
import { documentStateReducer, DocumentStateType } from './Document'
import { previewImagesReducer, PreviewImagesStateType } from './PreviewImages'
import { viewerStateReducer, ViewerStateType } from './Viewer'

export interface RootReducerType {
    sensenetDocumentViewer: {
        documentState: DocumentStateType,
        previewImages: PreviewImagesStateType,
        viewer: ViewerStateType,
    }
}

export const rootReducer: Reducer<RootReducerType> = combineReducers<RootReducerType>({
    sensenetDocumentViewer:
        combineReducers({
            documentState: documentStateReducer,
            previewImages: previewImagesReducer,
            viewer: viewerStateReducer,
        }),
})

export const sensenetDocumentViewerReducer = combineReducers({
    documentState: documentStateReducer,
    previewImages: previewImagesReducer,
    viewer: viewerStateReducer,
})
