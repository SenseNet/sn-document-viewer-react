import { createMuiTheme, Grid, MuiThemeProvider, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType } from '../../store'

/**
 * Theme overrides for the SearchBar component
 */
export const searchBarTheme = createMuiTheme({
    overrides: {
        MuiInput: {
            root: {
                color: 'white',
            },
            underline: {
                borderBottomColor: 'white',
                color: 'white',
            },
        },
    },
})

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        placeholder: state.sensenetDocumentViewer.localization.search,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {

}

/**
 * Defines the own props for the PagerState component
 */
export interface SearchBarState {
    searchValue: string
}

/**
 * Document widget component for paging
 */
export class SearchBarComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, SearchBarState> {

    /** the component state */
    public state = { searchValue: '' }

    /**
     * sets the page to the specified value
     * @param page
     */
    public evaluateSearch() {
        // tslint:disable-next-line:no-console
        console.log('Search triggered', this.state.searchValue)
    }

    private updateValue(value: string) {
        this.setState({
            ...this.state,
            searchValue: value,
        })
    }

    private handleKeyPress(ev: React.KeyboardEvent<HTMLDivElement>) {
        if (ev.key === 'Enter') {
            this.evaluateSearch()
        }
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <MuiThemeProvider theme={searchBarTheme}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Search />
                    </Grid>
                    <Grid item>
                        <TextField type="text" placeholder={this.props.placeholder} onKeyPress={(ev) => this.handleKeyPress(ev)} onSubmit={() => this.evaluateSearch()} onChange={(ev) => this.updateValue(ev.target.value)} />
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SearchBarComponent)

export { connectedComponent as SearchBar }
