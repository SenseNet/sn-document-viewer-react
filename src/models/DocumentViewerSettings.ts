import { DocumentData, PreviewImageData } from '.'

/**
 * Main settings for the Document Viewer component
 */
export class DocumentViewerSettings {

    /**
     * The interval between polling the server for pagecount / generated previews.
     */
    public pollInterval: number = 250

    /**
     * Callback that will retrieve if the current user has permission for document editing
     */
    public canEditDocument: (idOrPath: string | number ) => Promise<boolean> = async (idOrPath) => (false)

    /**
     * Callback for saving changes to the document
     */
    public saveChanges: (document: DocumentData, pages: PreviewImageData[]) => Promise<void> = async () => (undefined)

    /**
     * Callback that will return with the retrieved DocumentData (if available)
     */

    public getDocumentData: (idOrPath: string | number) => Promise<DocumentData | undefined> = async (idOrPath) => (undefined)

    /**
     * Callback that will return with the retrieved PreviewImageData array
     */
    public getExistingPreviewImages: (document: DocumentData, version: string ) => Promise<PreviewImageData[]> = async (document, version = 'V1.0A') => []

    /**
     * Callback for checking if a preview is available for a specified page
     */
    public isPreviewAvailable: (document: DocumentData, version: string, page: number) => Promise<PreviewImageData | undefined> = async (document) => (undefined)

}
