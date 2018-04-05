import { Store } from 'react-redux'
import { v1 } from 'uuid'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../src/models'
import { configureStore, RootReducerType } from '../src/store'

export const exampleDocumentData: DocumentData = {
    documentName: 'example doc',
    documentType: 'word',
    idOrPath: 'example/id/or/path',
    shapes: {
        annotations: [
            {
                index: 1,
                h: 100,
                w: 100,
                x: 10,
                y: 10,
                text: 'Example Text',
                guid: v1(),
                lineHeight: 15,
                fontBold: '34',
                imageIndex: 1,
                fontColor: 'red',
                fontFamily: 'arial',
                fontItalic: 'false',
                fontSize: '12pt',
            },
        ],
        highlights: [
            {
                guid: v1(),
                imageIndex: 1,
                h: 100,
                w: 100,
                x: 100,
                y: 100,
            },
        ],
        redactions: [
            {
                guid: v1(),
                imageIndex: 1,
                h: 100,
                w: 100,
                x: 200,
                y: 200,
            },
        ],
    },
    fileSizekB: 128,
    pageAttributes: [
        {
            options: {
                degree: 3,
            },
            pageNum: 1,
        },
    ],
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

export const useTestContextWithSettingsAsync = async (additionalSettings: Partial<DocumentViewerSettings>, callback: (context: DocViewerTestContext) => Promise<void>) => {
    const settings = {
        ...defaultSettings,
        ...additionalSettings,
    }
    const store = configureStore(settings)
    await callback({ store, settings })
}

export const useTestContextAsync: (callback: (context: DocViewerTestContext) => Promise<void>) => Promise<void>
    = (callback) => useTestContextWithSettingsAsync({}, callback)
