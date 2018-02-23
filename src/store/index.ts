import { Store } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { DocumentViewerSettings } from '../models'
import { rootReducer, RootReducerType } from './RootReducer'

export const configureStore: (settings: DocumentViewerSettings) => Store<RootReducerType> = (settings: DocumentViewerSettings) => {
    return createStore<RootReducerType>(rootReducer, {documentState: {isLoading: true}} as RootReducerType, applyMiddleware(thunk.withExtraArgument(settings), createLogger({})))
}
