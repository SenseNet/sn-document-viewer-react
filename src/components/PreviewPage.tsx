import { Button, CircularProgress, Grid, Paper } from 'material-ui'
import React = require('react')
import { Element } from 'react-scroll'
import { PreviewImageData } from '../models'

export class PreviewPage extends React.Component<{ page: PreviewImageData, onClick: (ev: React.MouseEvent<HTMLElement>) => void }> {

    public render() {
        return (
            <Grid item key={this.props.page.Index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Element name={`Preview-${this.props.page.Index}`}>
                    <Paper>
                        <Button style={{ padding: 0 }} onClick={(ev) => this.props.onClick(ev)}>
                            {
                                this.props.page.PreviewAvailable ?
                                    <img src={this.props.page.PreviewAvailable.replace('preview', 'thumbnail')} style={{maxWidth: '100%'}}/> : <CircularProgress size={64} />
                            }
                        </Button>
                    </Paper>
                </Element>
            </Grid>
        )
    }
}
