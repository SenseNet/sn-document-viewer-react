import { combineReducers } from 'redux'
import { Reducer } from 'redux'
import { documentStateReducer, DocumentStateType } from './Document'

export interface RootReducerType {
    documentState: DocumentStateType
}

export const rootReducer: Reducer<RootReducerType> = combineReducers<RootReducerType>({
    documentState: documentStateReducer,
})
