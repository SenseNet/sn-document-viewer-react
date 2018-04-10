import { Button, Paper, Typography } from 'material-ui'
import { Refresh } from 'material-ui-icons'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'

export interface OwnProps {
    error: any
}

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        errorLoadingDocument: state.sensenetDocumentViewer.localization.errorLoadingDocument,
        errorLoadingDetails: state.sensenetDocumentViewer.localization.errorLoadingDetails,
        reloadPage: state.sensenetDocumentViewer.localization.reloadPage,
    }
}

const mapDispatchToProps = {
}

class DocumentViewerErrorComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {
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
                    <Paper elevation={4} style={{padding: '1.2rem'}}>
                        <Typography variant="headline" component="h3">
                            {this.props.errorLoadingDocument}
                        </Typography>
                        <Typography component="p">
                            {this.props.errorLoadingDetails}
                        </Typography>
                        <Typography component="p" align="center">
                            <strong>
                                {this.props.error.message}
                            </strong>
                        </Typography>
                        <div style={{textAlign: 'center', marginTop: '1em'}}>
                            <Button title={this.props.reloadPage} size="small"  onClick={() => window.location.reload()}>
                                <Refresh/>
                                {this.props.reloadPage}
                            </Button >
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerErrorComponent)

export { connectedComponent as DocumentViewerError }
