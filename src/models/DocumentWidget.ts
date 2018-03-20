import { Widget } from './Widget'

export interface DocumentWidget extends Widget {
    /** */
    component: { new(props: any): React.Component<any> }

}
