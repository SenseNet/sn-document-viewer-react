import { PageAttribute } from '.'

export interface PreviewImageData {
    Index: number
    Height: number
    Width: number
    PreviewAvailable?: string
    Attributes?: PageAttribute['options']
}
