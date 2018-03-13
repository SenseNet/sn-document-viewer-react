import { RootReducerType } from '../store/RootReducer'

export interface PageWidget {
    shouldCheckAvailable: (lastState: RootReducerType, nextState: RootReducerType) => boolean
    isAvailable: (state: RootReducerType) => Promise<boolean>
    component: { new(props: {Index: number}): React.Component<{Index: number}> }
}
