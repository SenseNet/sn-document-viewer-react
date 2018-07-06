import { IconButton } from '@material-ui/core'
import { ZoomIn, ZoomOut } from '@material-ui/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setCustomZoomLevel } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        customZoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
    setZoomLevel: setCustomZoomLevel,
}

/**
 * Document widget component for modifying the zoom mode / level
 */
export class ZoomInOutWidgetComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, { zoomMenuAnchor?: HTMLElement }> {

    private zoomIn(ev: React.MouseEvent<HTMLElement>) {
        this.props.setZoomLevel(this.props.customZoomLevel + 1)
    }

    private zoomOut(ev: React.MouseEvent<HTMLElement>) {
        this.props.setZoomLevel(this.props.customZoomLevel - 1)
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton color="inherit" onClick={(ev) => this.zoomIn(ev)}>
                    <ZoomIn />
                </IconButton>
                <IconButton color="inherit" onClick={(ev) => this.zoomOut(ev)}>
                    <ZoomOut />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ZoomInOutWidgetComponent)
export { connectedComponent as ZoomInOutWidget }
