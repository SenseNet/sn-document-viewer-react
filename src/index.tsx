import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { v1 } from 'uuid'

import { DocumentViewer } from './components/DocumentViewer'
import { Annotation, DocumentViewerSettings, Highlight, PreviewImageData, Redaction, Shape } from './models'
import { getStoreConfig, sensenetDocumentViewerReducer } from './store'

import { PagerWidget, RotateDocumentWidget, SaveWidget, ToggleRedactionWidget, ToggleShapesWidget, ToggleWatermarkWidget, ZoomModeWidget } from './components/document-widgets'

import { createStore } from 'redux'
import { combineReducers } from 'redux'
import { LayoutAppBar } from './components'
import './style'

const SITE_URL = 'http://snbppc109.sn.hu/'

const addGuidToShape: <T extends Shape>(shape: T) => T = (shape) => {
    shape.guid = v1()
    return shape
}

const settings: DocumentViewerSettings = {
    canEditDocument: async (idOrPath) => {
        const response = await fetch(`${SITE_URL}/odata.svc/${idOrPath}/HasPermission?permissions=Save`, { method: 'GET' })
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
    saveChanges: async (document, pages) => {
        const reqBody = {
            Shapes: JSON.stringify([
                { redactions: document.shapes.redactions },
                { highlights: document.shapes.highlights },
                { annotations: document.shapes.annotations },
            ]),
            PageAttributes: JSON.stringify(pages.map((p) => p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes } || undefined).filter((p) => p !== undefined)),
        }
        await fetch(`${SITE_URL}/odata.svc/${document.idOrPath}`, {
            method: 'PATCH',
            body: JSON.stringify(reqBody),
        })
    },
    canHideWatermark: async (idOrPath) => {
        const response = await fetch(`${SITE_URL}/odata.svc/${idOrPath}/HasPermission?permissions=PreviewWithoutWatermark`)
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
    canHideRedaction: async (idOrPath) => {
        const response = await fetch(`${SITE_URL}/odata.svc/${idOrPath}/HasPermission?permissions=PreviewWithoutRedaction`)
        if (response.ok) {
            return await response.text() === 'true'
        }
        return false
    },
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
    isPreviewAvailable: async (docData, version, page: number, showWatermark) => {
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
            shapes: body.d.Shapes && {
                redactions: (JSON.parse(body.d.Shapes)[0].redactions as Redaction[]).map((a) => addGuidToShape(a)) || [],
                annotations: (JSON.parse(body.d.Shapes)[2].annotations as Annotation[]).map((a) => addGuidToShape(a)) || [],
                highlights: (JSON.parse(body.d.Shapes)[1].highlights as Highlight[]).map((a) => addGuidToShape(a)) || [],
            },
            pageAttributes: body.d.PageAttributes && JSON.parse(body.d.PageAttributes) || [],
        }
    },
}

const storeConfig = getStoreConfig(settings)

const myReducer = combineReducers({
    sensenetDocumentViewer: sensenetDocumentViewerReducer,
    myStuff: (state = {}, action) => {
        if (action.type === 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS') {
            // tslint:disable-next-line:no-console
            // console.log('Changes saved')
        }
        return state
    },
})

const store = createStore(myReducer, storeConfig.preloadedState, storeConfig.enhancer)

ReactDOM.render(
    <Provider store={store} >
        <DocumentViewer
            documentIdOrPath={`/Root/Sites/Default_Site/workspaces/Project/budapestprojectworkspace/Document_Library/('Pro ASP.NET MVC 4- 4th Edition.pdf')`}
            settings={settings}
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
    </Provider>,
    document.getElementById('example'),
)
