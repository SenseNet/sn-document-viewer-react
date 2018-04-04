import { ZoomMode } from '../store'

export interface Dimensions { width: number, height: number }

export class ImageUtil {

    public static normalizeDegrees(degrees: number): number {
        let normalizedDegrees = (degrees || 0) % 360
        if (normalizedDegrees < 0) {
            normalizedDegrees += 360
        }
        return normalizedDegrees
    }

    public static getImageSize(viewPort: Dimensions, image: Dimensions & { rotation: number }, zoomMode: ZoomMode, relativeZoomLevel: number = 1): Dimensions {

        if (zoomMode === 'custom') {
            relativeZoomLevel = (relativeZoomLevel + 1) / 4
        } else {
            relativeZoomLevel = 1
        }

        const boundingBox = this.getRotatedBoundingBoxSize(image, image.rotation)
        const [width, height] = [boundingBox.width, boundingBox.height]

        const zoomWidth = viewPort.width / width
        const zoomHeight = viewPort.height / height

        switch (zoomMode) {
            case 'fitWidth':
                return {
                    width: width * zoomWidth * relativeZoomLevel,
                    height: height * zoomWidth * relativeZoomLevel,
                }
            case 'fitHeight':
                return {
                    width: width * zoomHeight * relativeZoomLevel,
                    height: height * zoomHeight * relativeZoomLevel,
                }
            case 'fit':
                const zoom = Math.min(zoomWidth, zoomHeight)
                return {
                    width: width * zoom * relativeZoomLevel,
                    height: height * zoom * relativeZoomLevel,
                }
            default:
                return { width: width * relativeZoomLevel, height: height * relativeZoomLevel }
        }
    }

    public static getRotatedBoundingBoxSize(image: Dimensions, degrees: number): Dimensions & { zoomRatio: number } {

        if (ImageUtil.normalizeDegrees(degrees) === 0) {
            return {
                ...image,
                zoomRatio: 1,
            }
        }

        degrees = this.normalizeDegrees(degrees)

        if (degrees <= 90 || (degrees >= 180 && degrees <= 270)) {
            const angle1 = (degrees % 180) * Math.PI / 180
            const dimensions = {
                width: (Math.cos(angle1) * image.width) + (Math.sin(angle1) * image.height),
                height: (Math.sin(angle1) * image.width) + (Math.cos(angle1) * image.height),
            }
            return {
                ...dimensions,
                zoomRatio: image.width / dimensions.width,
            }
        } else {
            const h = image.width
            const w = image.height
            const angle2 = ((degrees % 180) - 90) * Math.PI / 180
            const dimensions = {
                width: (Math.cos(angle2) * w) + (Math.sin(angle2) * h),
                height: (Math.sin(angle2) * w) + (Math.cos(angle2) * h),
            }
            return {
                ...dimensions,
                zoomRatio: image.height / dimensions.width,
            }
        }
    }
}
