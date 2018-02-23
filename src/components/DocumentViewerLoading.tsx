import React = require('react')
import Loader from './Loader'

const documentViewerLoading = (props: any) => (
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
            <Loader size={64} background="white" hint="Loading images"/>
            <div style={{marginLeft: '2rem'}}>Loading document...</div>
        </div>
    </div>
)

export default documentViewerLoading
