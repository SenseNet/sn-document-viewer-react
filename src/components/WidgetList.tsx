import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { v1 } from 'uuid'
import { Widget } from '../models'
import { componentType } from '../services'
import { RootReducerType } from '../store'

const mapStateToProps = (state: RootReducerType, ownProps: WidgetListOwnProps<Widget>) => {
    return {
        state,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
    },
})

export interface WidgetListOwnProps<T extends Widget> {
    widgets: T[]
    widgetProps: InstanceType<T['component']>['props']
}

class WidgetListComponent<T extends Widget> extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, WidgetListOwnProps<T>>, { availableWidgets: T[], widgets: any[] }> {
    public state = { availableWidgets: [] as T[], widgets: [] as Array<InstanceType<T['component']>> }
    private widgetAvailabilityCache: Map<T, boolean> = new Map()

    private canUpdate: boolean = false

    public componentDidMount() {
        this.canUpdate = true
    }

    public componentWillUnmount() {
        this.canUpdate = false
    }

    public async componentWillReceiveProps(nextProps: this['props']) {
        const availableWidgets: T[] = []
        for (const widget of this.props.widgets) {
            const cached = this.widgetAvailabilityCache.get(widget)
            if (!widget.shouldCheckAvailable(this.props.state, nextProps.state) && cached) {
                availableWidgets.push(widget)
            } else {
                const isAvailable = await widget.isAvailable(nextProps.state)
                if (isAvailable) {
                    availableWidgets.push(widget)
                }
                this.widgetAvailabilityCache.set(widget, isAvailable)
            }
        }

        const hasChanges = this.state.widgets.map((w) => (w as any).type.WrappedComponent.name).join('') !== availableWidgets.map((w) => (w.component as any).WrappedComponent.name).join('')

        if (this.canUpdate) {
            if (hasChanges) {
                this.setState({
                    ...this.state,
                    availableWidgets,
                    widgets: availableWidgets.map((widget, i) =>
                        React.createElement(widget.component, {
                            ...this.props.widgetProps as object, key: v1(),
                        }),
                    ),
                })
            } else if (this.props.widgetProps !== nextProps.widgetProps) {
                for (const widget of this.state.widgets) {
                    // tslint:disable-next-line:no-string-literal
                    widget['props'] = nextProps.widgetProps
                }
            }

        }
    }

    public render() {
        return (
            <div className="widget-list">
                {this.state.widgets}
            </div>)
    }

}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(WidgetListComponent)

export { connectedComponent as WidgetList }
