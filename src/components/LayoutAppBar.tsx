import { AppBar, Divider, IconButton, Menu, MenuItem, MobileStepper, Toolbar, Typography } from 'material-ui'
import { AspectRatio, Code, Error, RotateLeft, RotateRight, ZoomIn, ZoomOut, ZoomOutMap } from 'material-ui-icons'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { DocumentData } from '../models'
import { rotateImages } from '../store/PreviewImages'
import { RootReducerType } from '../store/RootReducer'

import { setActivePages, setCustomZoomLevel, setZoomMode, ViewerStateType, ZoomMode } from '../store/Viewer'

export interface AppBarProps {
    document: DocumentData,
    viewer: ViewerStateType,
    actions: {
        setActivePages: (page: number) => Action,
        setZoomMode: (zoomMode: ZoomMode) => Action,
        setZoomLevel: (zoomLevel: number) => Action,
        rotateImages: (imageIndexes: number[], amount: number) => Action,
    }
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        document: state.documentState.document as DocumentData,
        viewer: state.viewer,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setActivePages: (page: number) => dispatch(setActivePages([page])),
        setZoomMode: (zoomMode: ZoomMode) => dispatch(setZoomMode(zoomMode)),
        setZoomLevel: (zoomLevel: number) => dispatch(setCustomZoomLevel(zoomLevel)),
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
    },
})

class LayoutAppBar extends React.Component<AppBarProps, { zoomMenuAnchor?: HTMLElement }> {

    /**
     *
     */
    constructor(props: AppBarProps) {
        super(props)
        this.state = {}
    }

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

    private rotateClockWise() {
        this.props.actions.rotateImages(this.props.viewer.activePages, 90)
    }

    private rotateCounterClockwise() {
        this.props.actions.rotateImages(this.props.viewer.activePages, -90)
    }

    public render() {
        return (
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit">
                        {this.props.document.documentName}
                    </Typography>
                    <div className="rightActionBar" style={{ color: 'white' }}>
                        <IconButton onClick={() => this.rotateCounterClockwise()}>
                            <RotateLeft />
                        </IconButton>

                        <IconButton onClick={() => this.rotateClockWise()}>
                            <RotateRight />
                        </IconButton>

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
                    </div>

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
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
