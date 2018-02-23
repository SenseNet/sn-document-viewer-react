export enum Mode {
    View= 'View',
    EditAnnotations= 'EditAnnotations',
    EditHighlights= 'EditHighlights',
    EditRedaction= 'EditRedaction',
}

export enum PreviewState {
    Available= 1,
    Empty= 0,
    Loading= -1,
    ExtensionFailure= -2,
    UploadFailure= -3,
    UploadFailure2= -4,
    NoPreviewProviderEnabled= -5,
}
