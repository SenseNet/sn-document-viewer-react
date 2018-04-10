import { MapStateToProps } from 'react-redux'
import { RootReducerType } from '../store'

export type componentType<
    TStateToProps extends MapStateToProps<TState, TOwnProps, State>,
    TDispatchToProps,
    TOwnProps = undefined,
    TState = ReturnType<TStateToProps>,
    State = RootReducerType,
    > = (
        ReturnType<TStateToProps> &
        TDispatchToProps &
        TOwnProps
    )
