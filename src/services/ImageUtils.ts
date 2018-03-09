import { ZoomMode } from '../store/Viewer'

export interface Dimensions { width: number, height: number }

export class ImageUtil {

    public static normalizeDegrees(degrees: number): number {
        let normalizedDegrees = (degrees || 0) % 360
        if (normalizedDegrees < 0) {
            normalizedDegrees += 360
        }
        return normalizedDegrees
    }

    public getImageSize(viewPort: Dimensions, image: Dimensions & { rotation: number }, zoomMode: ZoomMode): Dimensions {

        const boundingBox = this.getRotatedBoundingBoxSize(image, image.rotation)
        const [width, height] = [boundingBox.width, boundingBox.height]

        const zoomWidth = viewPort.width / width
        const zoomHeight = viewPort.height / height

        switch (zoomMode) {
            case 'fitWidth':
                return {
                    width: width * zoomWidth,
                    height: height * zoomWidth,
                }
            case 'fitHeight':
                return {
                    width: width * zoomHeight,
                    height: height * zoomHeight,
                }
            case 'fit':
                const zoom = Math.min(zoomWidth, zoomHeight)
                return {
                    width: width * zoom,
                    height: height * zoom,
                }
            default:
                return { width, height }
        }
    }

    public getRotatedBoundingBoxSize(image: Dimensions, degrees: number): Dimensions & { zoomRatio: number } {

        if (ImageUtil.normalizeDegrees(degrees) === 0) {
            return {
                ...image,
                zoomRatio: 1,
            }
        }
        if (degrees <= 90 || (degrees >= 180 && degrees <= 270)) {
            const angle1 = (degrees % 180) * Math.PI / 180
            const dimensions = {
                width: Math.cos(angle1) * image.width + Math.sin(angle1) * image.height,
                height: Math.sin(angle1) * image.width + Math.cos(angle1) * image.height,
            }
            return {
                ...dimensions,
                zoomRatio: dimensions.height / image.height,
            }
        } else {
            const h = image.width
            const w = image.height
            const angle2 = ((degrees % 180) - 90) * Math.PI / 180
            const dimensions = {
                width: Math.cos(angle2) * w + Math.sin(angle2) * h,
                height: Math.sin(angle2) * w + Math.cos(angle2) * h,
            }
            return {
                ...dimensions,
                zoomRatio: dimensions.height / image.height,
            }
        }
    }

    // private rotationCache: Map<string, Map<number, string>> = new Map()

    // public rotateImage(imgElement: HTMLImageElement, canvas: HTMLCanvasElement, degrees: number): string {
    //     if (!degrees || !imgElement) {
    //         return ''
    //     }
    //     if (this.rotationCache.has(imgElement.src) && (this.rotationCache.get(imgElement.src) as Map<number, string>).has(degrees)) {
    //         return (this.rotationCache.get(imgElement.src) as Map<number, string>).get(degrees) as string
    //     }

    //     const [oldMaxWidth, oldMaxHeight] = [imgElement.style.maxWidth, imgElement.style.maxHeight]
    //     imgElement.style.maxWidth = 'unset'
    //     imgElement.style.maxHeight = 'unset'
    //     let base64: string = ''
    //     const ctx = canvas.getContext('2d')

    //      if (ctx) {
    //         ctx.fillStyle = 'red'
    //         ctx.fillRect(0, 0, canvas.width, canvas.height)
    //         ctx.translate(canvas.width / 2, canvas.height / 2)
    //         ctx.rotate(rads)
    //         ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2)
    //         ctx.rotate(-rads)
    //         ctx.translate(-canvas.width / 2, -canvas.height / 2)
    //         const dataUrl = canvas.toDataURL()
    //         if (dataUrl !== 'data:,') {
    //             base64 = dataUrl
    //         }
    //     }
    //     canvas.width = 0
    //     canvas.height = 0
    //     imgElement.style.maxWidth = oldMaxWidth
    //     imgElement.style.maxHeight = oldMaxHeight
    //     if (base64) {
    //         if (!this.rotationCache.has(imgElement.src)) {
    //             this.rotationCache.set(imgElement.src, new Map())
    //         }
    //         (this.rotationCache.get(imgElement.src) as Map<number, string>).set(degrees, base64)
    //     }
    //     return base64
    // }

}
