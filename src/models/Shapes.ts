export interface Shape {
    h: number
    w: number
    x: number
    y: number
    imageIndex: number
    guid: string
}

export type Redaction = Shape

export type Highlight = Shape

export interface Annotation extends Shape {
    index: number
    lineHeight: number,
    text: string,
    fontBold: string,
    fontColor: string,
    fontFamily: string,
    fontItalic: string,
    fontSize: string
}

export interface Shapes {
    redactions: Redaction[]
    highlights: Highlight[]
    annotations: Annotation[]
}
