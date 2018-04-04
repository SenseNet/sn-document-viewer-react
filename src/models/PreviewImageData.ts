import { PageAttribute } from '.'

export interface PreviewImageData {
    Index: number
    Height: number
    Width: number
    PreviewImageUrl?: string
    ThumbnailImageUrl?: string
    Attributes?: PageAttribute['options']
}
