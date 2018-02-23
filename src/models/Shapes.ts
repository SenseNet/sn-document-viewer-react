export interface Redaction {
    h: number
    w: number
    x: number,
    y: number
    imageIndex: number
}

export interface Highlight {
    h: number
    w: number
    x: number,
    y: number
    imageIndex: number
}

export interface Annotation {
    h: number
    w: number
    x: number,
    y: number
    imageIndex: number
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
