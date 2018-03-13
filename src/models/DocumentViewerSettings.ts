import { DocumentData, PreviewImageData } from '.'

/**
 * Main settings for the Document Viewer component
 */
export class DocumentViewerSettings {

    /**
     * The interval between polling the server for pagecount / generated previews.
     */
    public pollInterval: number = 250

    public getDocumentData: (idOrPath: string | number) => Promise<DocumentData | undefined> = async (idOrPath) => (undefined)

    /**
     *
     */
    public getExistingPreviewImages: (document: DocumentData, version: string ) => Promise<PreviewImageData[]> = async (document, version = 'V1.0A') => []

    /**
     * Callback for checking if a preview is available for a specified page
     */
    public isPreviewAvailable: (document: DocumentData, version: string, page: number) => Promise<PreviewImageData | undefined> = async (document) => (undefined)

}
