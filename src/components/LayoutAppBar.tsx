import { AppBar, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from 'material-ui'
import { AspectRatio, Code, Error, ZoomIn, ZoomOut, ZoomOutMap } from 'material-ui-icons'
import React = require('react')
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { DocumentData } from '../models'
import { RootReducerType } from '../store/RootReducer'
import { setPage, setZoomMode, ViewerStateType, ZoomMode } from '../store/Viewer'

export interface AppBarProps {
    document: DocumentData,
    viewer: ViewerStateType,
    actions: {
        setPage: (page: number) => Action,
        setZoomMode: (zoomMode: ZoomMode) => Action,
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
        setPage: (page: number) => dispatch(setPage(page)),
        setZoomMode: (zoomMode: ZoomMode) => dispatch(setZoomMode(zoomMode)),
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

    public render() {
        return (
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit">
                        {this.props.document.documentName}
                    </Typography>

                    <IconButton onClick={(ev) => this.openZoomMenu(ev)} style={{ color: 'white' }}>
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
                        <MenuItem onClick={() => this.closeZoomMenu('custom')}> &nbsp; Custom </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
