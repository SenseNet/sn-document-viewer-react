import React = require('react')

/**
 * Component to display preview generation errors
 */
export class DocumentViewerError extends React.Component<{error: string}> {
    public render() {
        return (
            <div>
                Error: {JSON.stringify(this.props)}
            </div>
        )
    }
}
