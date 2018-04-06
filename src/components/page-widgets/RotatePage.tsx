import { IconButton } from 'material-ui'
import { RotateLeft, RotateRight } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { PreviewImageData } from '../../models'
import { componentType, Dimensions } from '../../services'
import { RootReducerType, rotateImages, rotateShapesForPages } from '../../store'

const ROTATION_AMOUNT = 90

export interface OwnProps {
    page: PreviewImageData,
    viewPort: Dimensions,
    zoomRatio: number,
}

export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => Action,
        rotateShapes: (pages: Array<{index: number, size: Dimensions}>, amount: number) => Action,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        rotateImages: (imageIndexes: number[], amount: number) => dispatch(rotateImages(imageIndexes, amount)),
        rotateShapes: (pages: Array<{index: number, size: Dimensions}>, amount: number) => dispatch(rotateShapesForPages(pages, amount)),
    },
})

export class RotatePageComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

    private rotatePageLeft() {
        this.props.actions.rotateImages([this.props.page.Index], -ROTATION_AMOUNT)
        this.props.actions.rotateShapes([{index: this.props.page.Index, size: { width: this.props.page.Width, height: this.props.page.Height}}], -ROTATION_AMOUNT)
    }

    private rotatePageRight() {
        this.props.actions.rotateImages([this.props.page.Index], ROTATION_AMOUNT)
        this.props.actions.rotateShapes([{index: this.props.page.Index, size: { width: this.props.page.Width, height: this.props.page.Height}}], ROTATION_AMOUNT)
    }

    public render() {
        return (
            <div style={{ position: 'absolute', zIndex: 1, top: 0, right: 0, filter: 'drop-shadow(0 0 3px white) drop-shadow(0 0 5px white) drop-shadow(0 0 9px white)' }}>

                <IconButton>
                    <RotateLeft onClick={() => this.rotatePageLeft()} />
                </IconButton>

                <IconButton>
                    <RotateRight onClick={() => this.rotatePageRight()}/>
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RotatePageComponent)

export {connectedComponent as RotatePageWidget}
