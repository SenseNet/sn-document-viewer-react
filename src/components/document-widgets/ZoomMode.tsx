import { Divider, IconButton, Menu, MenuItem, MobileStepper } from 'material-ui'
import { AspectRatio, Code, Error, ZoomIn, ZoomOut, ZoomOutMap } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { DocumentData, DocumentWidget } from '../../models'
import { RootReducerType } from '../../store/RootReducer'
import { setCustomZoomLevel, setZoomMode, ViewerStateType, ZoomMode } from '../../store/Viewer'

export interface ZoomModeWidgetProps {
    document: DocumentData,
    viewer: ViewerStateType,
    actions: {
        setZoomMode: (zoomMode: ZoomMode) => Action,
        setZoomLevel: (zoomLevel: number) => Action,
    }
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        document: state.sensenetDocumentViewer.documentState.document as DocumentData,
        viewer: state.sensenetDocumentViewer.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setZoomMode: (zoomMode: ZoomMode) => dispatch(setZoomMode(zoomMode)),
        setZoomLevel: (zoomLevel: number) => dispatch(setCustomZoomLevel(zoomLevel)),
    },
})

export class ZoomWidgetComponent extends React.Component<ZoomModeWidgetProps, { zoomMenuAnchor?: HTMLElement }> {

    public state = { zoomMenuAnchor: undefined}

    private openZoomMenu(event: React.MouseEvent<any>) {
        this.setState({ zoomMenuAnchor: event.currentTarget })
    }

    private closeZoomMenu(newZoomMode?: ZoomMode) {
        if (newZoomMode) {
            this.props.actions.setZoomMode(newZoomMode)
        }
        this.setState({ zoomMenuAnchor: undefined })
    }

    private zoomIn() {
        this.props.actions.setZoomLevel(this.props.viewer.customZoomLevel + 1 || 1)
    }

    private zoomOut() {
        this.props.actions.setZoomLevel(this.props.viewer.customZoomLevel - 1 || 0)
    }

    public render() {
        return (
            <div style={{display: 'inline-block'}}>
                <IconButton onClick={(ev) => this.openZoomMenu(ev)} >
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
                            <IconButton disabled={this.props.viewer.customZoomLevel === 5} onClick={() => this.zoomIn()}>
                                <ZoomIn />
                            </IconButton>
                        }
                        backButton={
                            <IconButton disabled={this.props.viewer.customZoomLevel === 0} onClick={() => this.zoomOut()}>
                                <ZoomOut />
                            </IconButton>
                        }
                    />
                </Menu>
            </div>)
    }
}

const zoomComponent = connect(mapStateToProps, mapDispatchToProps)(ZoomWidgetComponent)

export const zoomModeWidget: DocumentWidget = {
    shouldCheckAvailable: () => false,
    isAvailable: async () => true,
    component: zoomComponent,
}
