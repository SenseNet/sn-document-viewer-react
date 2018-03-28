import _ = require('lodash')
import { IconButton, TextField } from 'material-ui'
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from 'material-ui-icons'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { DocumentWidget } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, setActivePages } from '../../store'

export const mapStateToProps = (state: RootReducerType) => {
    return {
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        lastPage: state.sensenetDocumentViewer.documentState.document.pageCount,
    }
}

export const mapDispatchToProps: (dispatch: Dispatch<RootReducerType>) => {
    actions: {
        setActivePages: (value: number[]) => void,
    },
} = (dispatch: Dispatch<RootReducerType>) => ({
    actions: {
        setActivePages: (value: number[]) => dispatch(setActivePages(value)),
    },
})

export interface PagerState {
    currentPage: number
    lastPage: number
}

export class PagerComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, PagerState> {

    public state = { currentPage: this.props.activePages[0], lastPage: this.props.lastPage }

    public setPage = _.debounce(() => {
        this.props.actions.setActivePages([this.state.currentPage])
    }, 200).bind(this)

    private gotoPage(page: string | number = 1) {
        let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
        if (!isNaN(pageInt)) {
            pageInt = Math.max(pageInt, 1)
            pageInt = Math.min(pageInt, this.props.lastPage)
            this.setState({
                currentPage: pageInt,
            })
            this.setPage()
        }
    }

    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton disabled={this.state.currentPage <= 1}>
                    <FirstPage onClick={(ev) => this.gotoPage(1)} />
                </IconButton>

                <IconButton disabled={this.state.currentPage <= 1}>
                    <NavigateBefore onClick={(ev) => this.gotoPage(this.props.activePages[0] - 1)} />
                </IconButton>

                <TextField
                    value={this.state.currentPage}
                    onChange={(ev) => this.gotoPage(ev.currentTarget.value)}
                    type="number"
                    required={true}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{ min: 1, max: this.props.lastPage }}
                    margin="dense"
                />

                <IconButton disabled={this.state.currentPage >= this.state.lastPage}>
                    <NavigateNext onClick={(ev) => this.gotoPage(this.props.activePages[0] + 1)} />
                </IconButton>

                <IconButton disabled={this.state.currentPage >= this.state.lastPage}>
                    <LastPage onClick={(ev) => this.gotoPage(this.props.lastPage)} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PagerComponent)

export const pagerWidget: DocumentWidget = {
    shouldCheckAvailable: (oldState, newState) => false,
    isAvailable: async (state) => true,
    component: connectedComponent,
}
