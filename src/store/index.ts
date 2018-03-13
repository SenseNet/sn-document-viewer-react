import { Store } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { Reducer } from 'redux'
import { StoreEnhancer } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { DocumentViewerSettings } from '../models'
import { rootReducer, RootReducerType } from './RootReducer'

export const getStoreConfig: (settings: DocumentViewerSettings) => {rootReducer: Reducer<RootReducerType>, preloadedState: RootReducerType, enhancer: StoreEnhancer<any>}
     = (settings: DocumentViewerSettings) => {
    return {
        rootReducer,
        preloadedState: {sensenetDocumentViewer: {documentState: {isLoading: true}}} as RootReducerType,
        enhancer: applyMiddleware(thunk.withExtraArgument(settings), createLogger()),
    }
}

export const configureStore: (settings: DocumentViewerSettings) => Store<RootReducerType> = (settings: DocumentViewerSettings) => {
    const config = getStoreConfig(settings)
    return createStore<RootReducerType>(config.rootReducer, config.preloadedState, config.enhancer)
}
