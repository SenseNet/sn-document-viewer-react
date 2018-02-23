import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import DocumentViewer from './components/DocumentViewer'
import { DocumentViewerSettings } from './models'
import { configureStore } from './store'
import { pollDocumentData } from './store/Document'

import './style'

const settings: DocumentViewerSettings = {
    pollInterval: 250,
    getExistingPreviewImages: async () => [],
    isPreviewAvailable: async (idOrPath) => undefined,
    getDocumentData:  async (idOrPath: number | string) => {

        await new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), 2000)
        })
        return {
            idOrPath,
            fileSizekB: 0,
            pageCount: 0,
            documentName: 'Document Name',
            documentType: 'Word',
            shapes: {
                annotations: [],
                highlights: [],
                redactions: [],
            },
            pageAttributes: [],
        }
    },
}

const store = configureStore(settings)

store.dispatch<any>(pollDocumentData(1))

ReactDOM.render(
    <Provider store={store}>
        <DocumentViewer settings={settings} />
    </Provider>,
    document.getElementById('example'),
)
