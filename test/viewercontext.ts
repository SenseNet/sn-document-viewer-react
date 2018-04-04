import { Store } from 'react-redux'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../src/models'
import { configureStore, RootReducerType } from '../src/store'

export const exampleDocumentData: DocumentData = {
    documentName: 'example doc',
    documentType: 'word',
    idOrPath: 'example/id/or/path',
    shapes: {
        annotations: [],
        highlights: [],
        redactions: [],
    },
    fileSizekB: 128,
    pageAttributes: [],
    pageCount: 1,
}

export const examplePreviewImageData: PreviewImageData = {
    Attributes: {
        degree: 0,
    },
    Height: 1024,
    Width: 768,
    Index: 1,
    PreviewImageUrl: '/',
    ThumbnailImageUrl: '/',
}

export const defaultSettings: DocumentViewerSettings = {
    canEditDocument: async () => false,
    canHideRedaction: async () => false,
    canHideWatermark: async () => false,
    getDocumentData: async (idOrPath) => exampleDocumentData,
    getExistingPreviewImages: async () => [examplePreviewImageData],
    isPreviewAvailable: async () => examplePreviewImageData,
    saveChanges: async () => undefined,
}

export interface DocViewerTestContext {
    store: Store<RootReducerType>,
    settings: DocumentViewerSettings,
}

export const useTestContextWithSettings = (additionalSettings: Partial<DocumentViewerSettings>, callback: (context: DocViewerTestContext) => void) => {
    const settings = {
        ...defaultSettings,
        ...additionalSettings,
    }
    const store = configureStore(settings)
    callback({ store, settings })
}

export const useTestContext: (callback: (context: DocViewerTestContext) => void) => void
    = (callback) => useTestContextWithSettings({}, callback)
