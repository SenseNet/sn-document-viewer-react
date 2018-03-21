import { Dimensions } from '../services'
import { Widget } from './Widget'

export interface PageWidget extends Widget {
    component: { new(props: {Index: number, viewPort: Dimensions}): React.Component<{Index: number, viewPort: Dimensions}> }
}
