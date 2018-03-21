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

class WidgetListComponent<T extends Widget> extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, WidgetListOwnProps<T>>, { availableWidgets: T[] }> {
    public state = { availableWidgets: [] as T[]}
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
        await Promise.all(this.props.widgets.map(async (action) => {
            if (!action.shouldCheckAvailable(this.props.state, nextProps.state) && this.widgetAvailabilityCache.has(action)) {
                availableWidgets.push(action)
            } else {
                const isAvailable = await action.isAvailable(nextProps.state)
                if (isAvailable) {
                    availableWidgets.push(action)
                }
                this.widgetAvailabilityCache.set(action, isAvailable)
            }
        }))
        if (this.canUpdate) {
            this.setState({ ...this.state, availableWidgets })
        }
    }

    public render() {
        const widgets = this.state.availableWidgets.map((widget, i) =>
            React.createElement(widget.component, {...this.props.widgetProps as object, key: v1()}),
        )
        return (
            <div className="widget-list">
                {widgets}
            </div>)
    }

}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(WidgetListComponent)

export { connectedComponent as WidgetList }
