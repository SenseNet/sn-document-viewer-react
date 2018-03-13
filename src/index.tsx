import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { rotateDocumentWidget} from './components/document-widgets/RotateDocument'
import { zoomModeWidget } from './components/document-widgets/ZoomMode'
import { rotatePageWidget } from './components/page-widgets/RotatePage'

import DocumentViewer from './components/DocumentViewer'
import { DocumentViewerSettings, PreviewImageData } from './models'
import { getStoreConfig } from './store'
import { pollDocumentData } from './store/Document'

import { createStore } from 'redux'
import './style'

const SITE_URL = 'https://dmsservice.demo.sensenet.com/'

const settings: DocumentViewerSettings = {
    pollInterval: 2000,
    getExistingPreviewImages: async (docData, version) => {
        const response = await fetch(`${SITE_URL}/odata.svc/${docData.idOrPath}/GetExistingPreviewImages?version=${version}`, { method: 'POST' })
        const availablePreviews = (await response.json() as Array<PreviewImageData & { PreviewAvailable?: string }>).map((a) => {
            if (a.PreviewAvailable) {
                a.PreviewImageUrl = `${SITE_URL}${a.PreviewAvailable}`
                a.ThumbnailImageUrl = `${SITE_URL}${a.PreviewAvailable.replace('preview', 'thumbnail')}`
            }
            return a
        })

        const allPreviews: PreviewImageData[] = []
        for (let i = 0; i < docData.pageCount; i++) {
            allPreviews[i] = availablePreviews[i] || { Index: i + 1 }
            const pageAttributes = docData.pageAttributes.find((p) => p.pageNum === allPreviews[i].Index)
            allPreviews[i].Attributes = pageAttributes && pageAttributes.options
        }
        return allPreviews
    },
    isPreviewAvailable: async (docData, version, page: number) => {
        const response = await fetch(`${SITE_URL}/odata.svc/${docData.idOrPath}/PreviewAvailable?version=${version}`, {
            method: 'POST',
            body: JSON.stringify({ page }),
        })
        if (response.ok) {
            const responseBody = await response.json()
            if (responseBody.PreviewAvailable) {
                responseBody.PreviewImageUrl = `${SITE_URL}${responseBody.PreviewAvailable}`
                responseBody.ThumbnailImageUrl = `${SITE_URL}${responseBody.PreviewAvailable.replace('preview', 'thumbnail')}`
                return responseBody as PreviewImageData
            }
        }
        return
    },
    getDocumentData: async (idOrPath: number | string) => {
        const docData = await fetch(`${SITE_URL}/odata.svc/` + idOrPath)
        const body = await docData.json()
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

const storeConfig = getStoreConfig(settings)
const store = createStore(storeConfig.rootReducer, storeConfig.preloadedState, storeConfig.enhancer)

store.dispatch<any>(pollDocumentData(`/Root/Sites/Default_Site/workspaces/Project/budapestprojectworkspace/Document_Library/('BusinessPlan.docx')`))

ReactDOM.render(
    <Provider store={store} >
        <DocumentViewer documentWidgets={[rotateDocumentWidget, zoomModeWidget]} settings={settings} pageWidgets={[rotatePageWidget]} />
    </Provider>,
    document.getElementById('example'),
)
