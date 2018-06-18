import { Typography } from '@material-ui/core'
import _ = require('lodash')
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setActivePages } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        documentName: state.sensenetDocumentViewer.documentState.document.documentName,
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
        gotoPage: state.sensenetDocumentViewer.localization.gotoPage,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
    setActivePages,
}

/**
 * Defines the own props for the PagerState component
 */
export interface PagerState {
    currentPage: number
    lastPage: number
}

/**
 * Document widget component for paging
 */
export class DocumentTitlePagerComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, PagerState> {

    /** the component state */
    public state = { currentPage: this.props.activePages[0], lastPage: this.props.pageCount }

    private setPage = _.debounce(() => {
        this.props.setActivePages([this.state.currentPage])
    }, 200).bind(this)

    /** triggered when the component will receive props */
    public componentWillReceiveProps(nextProps: this['props']) {
        this.setState({ currentPage: nextProps.activePages[0], lastPage: nextProps.pageCount })
    }

    /**
     * sets the page to the specified value
     * @param page
     */
    public gotoPage(page: string | number) {
        let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
        if (!isNaN(pageInt)) {
            pageInt = Math.max(pageInt, 1)
            pageInt = Math.min(pageInt, this.props.pageCount)
            this.setState({
                currentPage: pageInt,
            })
            this.setPage()
        }
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <Typography variant="title" color="inherit" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {this.props.documentName}
                &nbsp;
                {this.props.activePages[0]} / {this.props.pageCount}
            </Typography>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentTitlePagerComponent)

export { connectedComponent as DocumentTitlePager }
