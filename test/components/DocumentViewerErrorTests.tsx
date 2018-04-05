import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { DocumentViewerError } from '../../src/components/DocumentViewerError'
import { useTestContext } from '../viewercontext'

export const documentViewerErrorTests = describe('Document Viewer Error component', () => {
    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            const c = renderer.create(
            <DocumentViewerError error=":(" />)
            c.unmount()
        })
    })
})
