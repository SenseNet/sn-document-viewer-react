import { RootReducerType } from '../store/RootReducer'

export interface DocumentWidget {
    shouldCheckAvailable: (lastState: RootReducerType, nextState: RootReducerType) => boolean
    isAvailable: (state: RootReducerType) => Promise<boolean>
    component: { new(props: any): React.Component<any> }
}