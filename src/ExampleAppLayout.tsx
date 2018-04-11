import React = require('react')
import { connect } from 'react-redux'
import { RootReducerType } from './store'

import { v1 } from 'uuid'
import { PagerWidget, RotateDocumentWidget, SaveWidget, ToggleRedactionWidget, ToggleShapesWidget, ToggleWatermarkWidget, ZoomModeWidget } from './components/document-widgets'
import { DocumentViewer } from './components/DocumentViewer'
import { LayoutAppBar } from './components/LayoutAppBar'
import { DocumentViewerSettings } from './models/DocumentViewerSettings'
import { PreviewImageData } from './models/PreviewImageData'
import { Annotation, Highlight, Redaction, Shape } from './models/Shapes'
import { componentType } from './services'

import { Button, Paper, TextField, Typography } from 'material-ui'
import { FolderOpen } from 'material-ui-icons'

const addGuidToShape: <T extends Shape>(shape: T) => T = (shape) => {
    shape.guid = v1()
    return shape
}

const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
    }
}

export interface ExampleAppState {
    hostName: string
    documentIdOrPath: number | string
    isViewerOpened: boolean
    settings: DocumentViewerSettings
}

const mapDispatchToProps = {
}

export const defaultSettings: DocumentViewerSettings = {
    canEditDocument: async (documentData) => {
        const response = await fetch(`${encodeURI(documentData.hostName)}/odata.svc/${encodeURI(documentData.idOrPath.toString())}/HasPermission?permissions=Save`, { method: 'GET' })
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
    saveChanges: async (documentData, pages) => {
        const reqBody = {
            Shapes: JSON.stringify([
                { redactions: documentData.shapes.redactions },
                { highlights: documentData.shapes.highlights },
                { annotations: documentData.shapes.annotations },
            ]),
            PageAttributes: JSON.stringify(pages.map((p) => p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes } || undefined).filter((p) => p !== undefined)),
        }
        await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}`, {
            method: 'PATCH',
            body: JSON.stringify(reqBody),
        })
    },
    canHideWatermark: async (documentData) => {
        const response = await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}/HasPermission?permissions=PreviewWithoutWatermark`)
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
    canHideRedaction: async (documentData) => {
        const response = await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}/HasPermission?permissions=PreviewWithoutRedaction`)
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
    getExistingPreviewImages: async (documentData, version) => {
        const response = await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}/GetExistingPreviewImages?version=${version}`, { method: 'POST' })
        const availablePreviews = (await response.json() as Array<PreviewImageData & { PreviewAvailable?: string }>).map((a) => {
            if (a.PreviewAvailable) {
                a.PreviewImageUrl = `${documentData.hostName}${a.PreviewAvailable}`
                a.ThumbnailImageUrl = `${documentData.hostName}${a.PreviewAvailable.replace('preview', 'thumbnail')}`
            }
            return a
        })

        const allPreviews: PreviewImageData[] = []
        for (let i = 0; i < documentData.pageCount; i++) {
            allPreviews[i] = availablePreviews[i] || { Index: i + 1 }
            const pageAttributes = documentData.pageAttributes.find((p) => p.pageNum === allPreviews[i].Index)
            allPreviews[i].Attributes = pageAttributes && pageAttributes.options
        }
        return allPreviews
    },
    isPreviewAvailable: async (documentData, version, page: number, showWatermark) => {
        const response = await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}/PreviewAvailable?version=${version}`, {
            method: 'POST',
            body: JSON.stringify({ page }),
        })
        if (response.ok) {
            const responseBody = await response.json()
            if (responseBody.PreviewAvailable) {
                responseBody.PreviewImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable}`
                responseBody.ThumbnailImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable.replace('preview', 'thumbnail')}`
                return responseBody as PreviewImageData
            }
        }
        return
    },
    getDocumentData: async (documentData) => {
        const docData = await fetch(`${documentData.hostName}/odata.svc/` + documentData.idOrPath)
        const body = await docData.json()
        return {
            idOrPath: documentData.idOrPath,
            hostName: documentData.hostName,
            fileSizekB: body.d.Size as number,
            pageCount: body.d.PageCount,
            documentName: body.d.DisplayName,
            documentType: body.d.Type,
            shapes: body.d.Shapes && {
                redactions: (JSON.parse(body.d.Shapes)[0].redactions as Redaction[]).map((a) => addGuidToShape(a)) || [],
                annotations: (JSON.parse(body.d.Shapes)[2].annotations as Annotation[]).map((a) => addGuidToShape(a)) || [],
                highlights: (JSON.parse(body.d.Shapes)[1].highlights as Highlight[]).map((a) => addGuidToShape(a)) || [],
            },
            pageAttributes: body.d.PageAttributes && JSON.parse(body.d.PageAttributes) || [],
        }
    },
}

const localStorageKey = 'sn-docviewer-example'

class ExampleAppLayout extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, {}>, ExampleAppState> {
    public state: ExampleAppState =
        JSON.parse(localStorage.getItem(localStorageKey) as any) || {
            hostName: 'http://snbppc109.sn.hu',
            documentIdOrPath: `/Root/Sites/Default_Site/workspaces/Project/budapestprojectworkspace/Document_Library/('Pro ASP.NET MVC 4- 4th Edition.pdf')`,
            isViewerOpened: false,
            settings: defaultSettings,
        }

    public setState(newState: this['state']) {
        super.setState(newState)
        localStorage.setItem(localStorageKey, JSON.stringify(newState))
    }

    private openViewer() {
        this.setState({
            ...this.state,
            isViewerOpened: true,
        })
    }

    private closeViewer() {
        this.setState({
            ...this.state,
            isViewerOpened: false,
        })
    }

    public render() {
        return (<div style={{ height: '100%' }}>
            {
                this.state.isViewerOpened ?
                    <DocumentViewer
                        hostName={this.state.hostName}
                        documentIdOrPath={this.state.documentIdOrPath}
                        settings={this.state.settings}
                    >
                        <LayoutAppBar>
                            <div>
                                <RotateDocumentWidget />
                                <ZoomModeWidget />
                                <ToggleRedactionWidget />
                                <ToggleWatermarkWidget />
                                <ToggleShapesWidget />
                                <PagerWidget />
                                <SaveWidget />
                            </div>
                        </LayoutAppBar>
                    </DocumentViewer>
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Paper elevation={4} style={{
                            padding: '1.2rem',
                            flexGrow: 1,
                            maxWidth: '75%',
                        }}>
                            <Typography variant="title">Document Viewer Demo</Typography>
                            <Typography variant="subheading">Select a sensenet site and document to open</Typography>
                            <Typography variant="body1">asd</Typography>
                            <form
                                autoComplete="off"
                                autoCorrect="off"
                                onSubmit={(ev) => this.openViewer()}
                                style={{
                                    margin: '.5em',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}

                            >
                                <TextField
                                    value={this.state.hostName}
                                    onChange={(ev) => { this.setState({ ...this.state, hostName: ev.currentTarget.value }) }}
                                    required
                                    placeholder="The host URL, e.g. 'https://my-sensenet-site.org'"
                                    type="url"
                                    label="Host name"
                                    margin="normal"
                                />
                                <TextField
                                    value={this.state.documentIdOrPath}
                                    onChange={(ev) => { this.setState({ ...this.state, documentIdOrPath: ev.currentTarget.value }) }}
                                    required
                                    margin="normal"
                                    placeholder="The Id or full path of the document, e.g.: /Root/Sites/MySite/MyDocLib/('Example.docx')"
                                    label="Document id / full path"
                                />
                                <div>
                                    <Button type="submit" variant="raised" color="primary"> Open </Button>
                                </div>
                            </form>
                        </Paper>
                    </div>
            }

            {this.state.isViewerOpened ?
                <Button
                    style={{
                        position: 'fixed',
                        right: '2em',
                        bottom: '1em',
                        zIndex: 1,
                    }}
                    variant="fab"
                    color="secondary"
                    aria-label="select another document"
                    onClick={(ev) => this.closeViewer()}>
                    <FolderOpen />
                </Button>
                : null}

        </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ExampleAppLayout)
export { connectedComponent as ExampleAppLayout }
