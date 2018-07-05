import { Typography } from '@material-ui/core'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'
import { LayoutAppBar } from './LayoutAppBar'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: undefined) => {
    return {
        loadingDocument: state.sensenetDocumentViewer.localization.loadingDocument,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
}

class DocumentViewerLoadingComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>> {
    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <LayoutAppBar style={{ position: 'fixed', top: 0 }} >
                    <span></span>
                </LayoutAppBar>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    maxWidth: 500,
                    margin: '.5em 0 .6em 0',
                }}>
                    <svg width="442px" height="333px" viewBox="0 0 442 333" version="1.1" >
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="New-Image-Generation" transform="translate(-9.000000, 5.000000)">
                                <g id="Document" transform="translate(9.000000, 0.000000)">
                                    <ellipse id="Oval-2" fill="#DFDFDF" cx="221" cy="230" rx="221" ry="27"></ellipse>
                                    <path d="M129.868875,229.165007 L129.868875,6.81087018 C129.868875,3.49716168 132.555166,0.810870179 135.868875,0.810870179 L262.245476,0.810870179 C263.836775,0.810870179 265.362898,1.44301122 266.488117,2.56822949 L311.211391,47.2915035 C312.336609,48.4167218 312.96875,49.9428453 312.96875,51.5341442 L312.96875,229.724935 C312.96875,233.038644 310.282458,235.724935 306.96875,235.724935 C306.962205,235.724935 306.95566,235.724924 306.949115,235.724903 L135.84924,235.164975 C132.543214,235.154156 129.868875,232.47105 129.868875,229.165007 Z" id="Path" stroke="#A4A8AD" strokeWidth="11" fill="#EEEEEE"></path>
                                    <path d="M262.50809,3.20349862 L262.50809,46.2114256 C262.50809,47.3159951 263.40352,48.2114256 264.50809,48.2114256 L308.124241,48.2114256" id="Path-2" stroke="#A4A8AD" strokeWidth="11"></path>
                                    <rect id="Rectangle" fill="#A4A8AD" x="156" y="90" width="129" height="13"></rect>
                                    <rect id="Rectangle-Copy" fill="#A4A8AD" x="156" y="133" width="129" height="13"></rect>
                                    <rect id="Rectangle-Copy-2" fill="#A4A8AD" x="156" y="176" width="95" height="13"></rect>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <Typography variant="headline" color="textSecondary" align="center" style={{ fontWeight: 'bolder' }}>
                        {this.props.loadingDocument}
                    </Typography>
                </div>
            </div >
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLoadingComponent)

export { connectedComponent as DocumentViewerLoading }
