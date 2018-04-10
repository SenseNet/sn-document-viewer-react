import { Divider, IconButton, Menu, MenuItem, MobileStepper } from 'material-ui'
import { AspectRatio, Code, Error, ZoomIn, ZoomOut, ZoomOutMap } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { DocumentData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, setCustomZoomLevel, setZoomMode, ViewerStateType, ZoomMode } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        viewer: state.sensenetDocumentViewer.viewer as ViewerStateType,
    }
}

export const mapDispatchToProps = {
    setZoomMode,
    setZoomLevel: setCustomZoomLevel as (level: number) => Action,
}

export class ZoomWidgetComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, { zoomMenuAnchor?: HTMLElement }> {

    public state = { zoomMenuAnchor: undefined }

    private openZoomMenu(event: React.MouseEvent<any>) {
        this.setState({ zoomMenuAnchor: event.currentTarget })
    }

    private closeZoomMenu(newZoomMode?: ZoomMode) {
        if (newZoomMode) {
            this.props.setZoomMode(newZoomMode)
        }
        this.setState({ zoomMenuAnchor: undefined })
    }

    private zoomIn(ev: React.MouseEvent<HTMLElement>) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.setZoomLevel(this.props.viewer.customZoomLevel + 1 || 1)
    }

    private zoomOut(ev: React.MouseEvent<HTMLElement>) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.setZoomLevel(this.props.viewer.customZoomLevel - 1 || 0)
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton onClick={(ev) => this.openZoomMenu(ev)} title="Zoom mode">
                    {(() => {
                        switch (this.props.viewer.zoomMode) {
                            case 'custom':
                                if (this.props.viewer.customZoomLevel > 0) {
                                    return <ZoomIn />
                                }
                                return <ZoomOut />
                            case 'fitHeight':
                                return <Code style={{ transform: 'rotate(90deg)' }} />
                            case 'fitWidth':
                                return <Code />
                            case 'originalSize':
                                return <AspectRatio />
                            case 'fit':
                                return (<ZoomOutMap />)
                            default:
                                return <Error />
                        }
                    })()}
                </IconButton>
                <Menu
                    id="zoom-menu"
                    anchorEl={this.state.zoomMenuAnchor}
                    open={Boolean(this.state.zoomMenuAnchor)}
                    onClose={() => this.closeZoomMenu()}
                >
                    <MenuItem onClick={() => this.closeZoomMenu('fit')}><ZoomOutMap /> &nbsp; Fit </MenuItem>
                    <MenuItem onClick={() => this.closeZoomMenu('originalSize')}><AspectRatio />&nbsp; Original size </MenuItem>
                    <MenuItem onClick={() => this.closeZoomMenu('fitHeight')}><Code style={{ transform: 'rotate(90deg)' }} /> &nbsp; Fit height </MenuItem>
                    <MenuItem onClick={() => this.closeZoomMenu('fitWidth')}><Code /> &nbsp; Fit width </MenuItem>
                    <Divider light />
                    &nbsp; Custom <br />
                    <MobileStepper
                        variant="progress"
                        steps={6}
                        position="static"
                        activeStep={this.props.viewer.customZoomLevel}
                        nextButton={
                            <IconButton disabled={this.props.viewer.customZoomLevel === 5} onClickCapture={(ev) => this.zoomIn(ev)}>
                                <ZoomIn />
                            </IconButton>
                        }
                        backButton={
                            <IconButton disabled={this.props.viewer.customZoomLevel === 0} onClickCapture={(ev) => this.zoomOut(ev)}>
                                <ZoomOut />
                            </IconButton>
                        }
                    />
                </Menu>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ZoomWidgetComponent)
export { connectedComponent as ZoomModeWidget }
