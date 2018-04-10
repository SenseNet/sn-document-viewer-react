import { combineReducers } from 'redux'
import { Reducer } from 'redux'
import { documentStateReducer, DocumentStateType } from './Document'
import { localizationReducer, LocalizationStateType} from './Localization'

import { previewImagesReducer, PreviewImagesStateType } from './PreviewImages'
import { viewerStateReducer, ViewerStateType } from './Viewer'

export interface RootReducerType {
    sensenetDocumentViewer: {
        documentState: DocumentStateType,
        previewImages: PreviewImagesStateType,
        viewer: ViewerStateType,
        localization: LocalizationStateType,
    }
}

export const rootReducer: Reducer<RootReducerType> = combineReducers<RootReducerType>({
    sensenetDocumentViewer:
        combineReducers({
            documentState: documentStateReducer,
            previewImages: previewImagesReducer,
            viewer: viewerStateReducer,
            localization: localizationReducer,
        }),
})

export const sensenetDocumentViewerReducer = combineReducers({
    documentState: documentStateReducer,
    previewImages: previewImagesReducer,
    viewer: viewerStateReducer,
    localization: localizationReducer,
})
