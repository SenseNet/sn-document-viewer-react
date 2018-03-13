import { Dimensions } from '../services/ImageUtils'
import { RootReducerType } from '../store/RootReducer'

export interface PageWidget {
    shouldCheckAvailable: (lastState: RootReducerType, nextState: RootReducerType) => boolean
    isAvailable: (state: RootReducerType) => Promise<boolean>
    component: { new(props: {Index: number, viewPort: Dimensions}): React.Component<{Index: number, viewPort: Dimensions}> }
}
