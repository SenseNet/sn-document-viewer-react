import { PreviewImageData } from '.'
import { Dimensions } from '../services'
import { Widget } from './Widget'

export interface PageWidgetProps {
    page: PreviewImageData,
    viewPort: Dimensions,
    zoomRatio: number
}

export interface PageWidget extends Widget {
    component: { new(props: PageWidgetProps): React.Component<PageWidgetProps> }
}
