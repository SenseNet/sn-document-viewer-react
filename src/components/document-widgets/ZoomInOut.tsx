import { IconButton } from '@material-ui/core'
import { ZoomIn, ZoomOut } from '@material-ui/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setCustomZoomLevel, setZoomMode, ZoomMode } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        zoomMode: state.sensenetDocumentViewer.viewer.zoomMode,
        customZoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
        localization: {
            zoomMode: state.sensenetDocumentViewer.localization.zoomMode,
            zoomModeFit: state.sensenetDocumentViewer.localization.zoomModeFit,
            zoomModeFitHeight: state.sensenetDocumentViewer.localization.zoomModeFitHeight,
            zoomModeFitWidth: state.sensenetDocumentViewer.localization.zoomModeFitWidth,
            zoomModeOriginalSize: state.sensenetDocumentViewer.localization.zoomModeOriginalSize,
            zooomModeCustom: state.sensenetDocumentViewer.localization.zooomModeCustom,
        },
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
    setZoomMode,
    setZoomLevel: setCustomZoomLevel,
}

/**
 * Document widget component for modifying the zoom mode / level
 */
export class ZoomInOutWidgetComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, { zoomMenuAnchor?: HTMLElement }> {

    private zoomIn(ev: React.MouseEvent<HTMLElement>) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.setZoomLevel(this.props.customZoomLevel + 1 || 1)
    }

    private zoomOut(ev: React.MouseEvent<HTMLElement>) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.setZoomLevel(this.props.customZoomLevel - 1 || 0)
    }

    /**
     * renders the component
     */
    public render() {
        const localization = this.props.localization
        return (
            <div style={{ display: 'inline-block' }}>
                            <IconButton disabled={this.props.customZoomLevel === 5} onClickCapture={(ev) => this.zoomIn(ev)}>
                                <ZoomIn />
                            </IconButton>
                        }
                            <IconButton disabled={this.props.customZoomLevel === 0} onClickCapture={(ev) => this.zoomOut(ev)}>
                                <ZoomOut />
                            </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ZoomInOutWidgetComponent)
export { connectedComponent as ZoomInOutWidget }
