import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux'
import { RootReducerType } from '../store/RootReducer'

export type componentType<
    TStateToProps extends MapStateToProps<TState, TOwnProps, State>,
    TDispatchToProps extends MapDispatchToPropsFunction<TDispatchReturns, TOwnProps>,
    TOwnProps = undefined,
    TState = ReturnType<TStateToProps>,
    TDispatchReturns = ReturnType<TDispatchToProps>,
    State = RootReducerType,
    > = (
        ReturnType<TStateToProps> &
        ReturnType<TDispatchToProps> &
        TOwnProps
    )
