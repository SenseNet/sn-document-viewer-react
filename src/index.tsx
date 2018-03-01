import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import DocumentViewer from './components/DocumentViewer'
import { DocumentViewerSettings, PreviewImageData } from './models'
import { configureStore } from './store'
import { pollDocumentData } from './store/Document'

import './style'

const settings: DocumentViewerSettings = {
    pollInterval: 250,
    getExistingPreviewImages: async (docData, version) => {
        const response = await fetch(`http://sensenet7-local/odata.svc/${docData.idOrPath}/GetExistingPreviewImages?version=${version}`, {method: 'POST'})
        const availablePreviews = (await response.json() as PreviewImageData[]).map((a) => {
            if (a.PreviewAvailable) {
                a.PreviewAvailable = `http://sensenet7-local/${a.PreviewAvailable}`
            }
            return a
        })

        const allPreviews: PreviewImageData[] = []
        for (let i = 0; i < docData.pageCount; i++) {
            allPreviews[i] = availablePreviews[i] || {Index: i + 1}
            const pageAttributes = docData.pageAttributes.find((p) => p.pageNum === allPreviews[i].Index)
            allPreviews[i].Attributes = pageAttributes && pageAttributes.options
        }
        return allPreviews
    },
    isPreviewAvailable: async (idOrPath) => undefined,
    getDocumentData:  async (idOrPath: number | string) => {
        const docData = await fetch('http://sensenet7-local/odata.svc/' + idOrPath)
        const body = await docData.json()
        await new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), 250)
        })
        return {
            idOrPath,
            fileSizekB: body.d.Size as number,
            pageCount: body.d.PageCount,
            documentName: body.d.DisplayName,
            documentType: body.d.Type,
            shapes: body.d.Shapes && JSON.parse(body.d.Shapes) || [],
            pageAttributes: body.d.PageAttributes && JSON.parse(body.d.PageAttributes) || [],
        }
    },
}

const store = configureStore(settings)

store.dispatch<any>(pollDocumentData(`/Root/Sites/Default_Site/workspaces/Project/budapestprojectworkspace/Document_Library/('1000-Lorem.docx')`))

ReactDOM.render(
    <Provider store={store}>
        <DocumentViewer settings={settings} />
    </Provider>,
    document.getElementById('example'),
)
