import { CircularProgress } from 'material-ui'
import React = require('react')

export class DocumentViewerLoading extends React.Component {
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
                    <div style={{ marginLeft: '2rem' }}>Loading document...</div>
                </div>
            </div>
        )
    }
}
