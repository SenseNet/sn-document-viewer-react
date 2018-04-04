import { DocumentData, PreviewImageData } from '.'

/**
 * Main settings for the Document Viewer component
 */
export class DocumentViewerSettings {

    /**
     * Callback that will retrieve if the current user has permission for document editing
     */
    public canEditDocument: (idOrPath: string | number ) => Promise<boolean> = async (idOrPath) => (false)

    /**
     * Callback for saving changes to the document
     */
    public saveChanges: (document: DocumentData, pages: PreviewImageData[]) => Promise<void> = async () => (undefined)

    /**
     * Callback for checking if the current user can hide the watermark
     */
    public canHideWatermark: (idOrPath: string | number ) => Promise<boolean> = async () => (false)

    /**
     * Callback for checking if the current user can hide the redaction
     */
    public canHideRedaction: (idOrPath: string | number ) => Promise<boolean> = async () => (false)

    /**
     * Callback that will return with the retrieved DocumentData (if available)
     */

    public getDocumentData: (idOrPath: string | number) => Promise<DocumentData | undefined> = async (idOrPath) => (undefined)

    /**
     * Callback that will return with the retrieved PreviewImageData array
     */
    public getExistingPreviewImages: (document: DocumentData, version: string, showWatermark: boolean ) => Promise<PreviewImageData[]> = async (document, version = 'V1.0A', showWatermark) => []

    /**
     * Callback for checking if a preview is available for a specified page
     */
    public isPreviewAvailable: (document: DocumentData, version: string, page: number, showWatermark: boolean) => Promise<PreviewImageData | undefined> = async (document, verison, page, showWatermark) => (undefined)

}
