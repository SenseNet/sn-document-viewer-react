import { CircularProgress } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'

const mapStateToProps = (state: RootReducerType, ownProps: undefined) => {
    return {
        loadingDocument: state.sensenetDocumentViewer.localization.loadingDocument,
    }
}

const mapDispatchToProps = {
}

class DocumentViewerLoadingComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>> {
    public render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <CircularProgress size={64} />
                    <div style={{ marginLeft: '2rem' }}> { this.props.loadingDocument } </div>
                </div>
            </div>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLoadingComponent)

export {connectedComponent as DocumentViewerLoading}
