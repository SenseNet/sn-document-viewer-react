import { PreviewImageData } from '../models'
import { ZoomMode } from '../store/Viewer'

export class ImageUtil {

    // private rotationCache: Map<string, Map<number, string>> = new Map()

    public getImageSize(viewPort: { width: number, height: number }, zoomMode: ZoomMode, image: PreviewImageData): PreviewImageData {

        const zoomWidth = viewPort.width / image.Width
        const zoomHeight = viewPort.height / image.Height

        switch (zoomMode) {
            case 'fitWidth':
                return {
                    ...image,
                    Width: image.Width * zoomWidth,
                    Height: image.Height * zoomWidth,
                }
            case 'fitHeight':
                return {
                    ...image,
                    Width: image.Width * zoomHeight,
                    Height: image.Height * zoomHeight,
                }
            case 'fit':
                const zoom = Math.min(zoomWidth, zoomHeight)
                return {
                    ...image,
                    Width: image.Width * zoom,
                    Height: image.Height * zoom,
                }
            default:
                return image
        }
    }

    // public rotate(img: HTMLImageElement, degrees: number): string {

        // const cacheItem: Map<number, string> = this.rotationCache.has(img.src) ? this.sizeCache.get(img.src) : new Map()
        // if (cacheItem.has(degrees)) {
        //     return cacheItem.get(degrees)
        // }
        // const value: string = ''
        // this.rotationCache.set(img.src, cacheItem)

        // return value
    // }

}
