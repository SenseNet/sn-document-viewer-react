import { DocumentData, PreviewImageData } from '.'

/**
 * Main settings for the Document Viewer component
 */
export interface DocumentViewerSettings {

    /**
     * Callback that will retrieve if the current user has permission for document editing
     */
    canEditDocument: (idOrPath: string | number ) => Promise<boolean>

    /**
     * Callback for saving changes to the document
     */
    saveChanges: (document: DocumentData, pages: PreviewImageData[]) => Promise<void>

    /**
     * Callback for checking if the current user can hide the watermark
     */
    canHideWatermark: (idOrPath: string | number ) => Promise<boolean>

    /**
     * Callback for checking if the current user can hide the redaction
     */
    canHideRedaction: (idOrPath: string | number ) => Promise<boolean>

    /**
     * Callback that will return with the retrieved DocumentData (if available)
     */

    getDocumentData: (idOrPath: string | number) => Promise<DocumentData | undefined>

    /**
     * Callback that will return with the retrieved PreviewImageData array
     */
    getExistingPreviewImages: (document: DocumentData, version: string, showWatermark: boolean ) => Promise<PreviewImageData[]>

    /**
     * Callback for checking if a preview is available for a specified page
     */
    isPreviewAvailable: (document: DocumentData, version: string, page: number, showWatermark: boolean) => Promise<PreviewImageData | undefined>

}
