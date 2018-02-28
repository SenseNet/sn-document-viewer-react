import React = require('react')

export class DocumentViewerError extends React.Component<{error: string}> {
    public render() {
        return (
            <div>
                Error: {JSON.stringify(this.props)}
            </div>
        )
    }
}
