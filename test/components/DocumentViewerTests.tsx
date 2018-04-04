import { expect } from 'chai'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentViewer } from '../../src/components/DocumentViewer'
import { exampleDocumentData, useTestContext, useTestContextWithSettings } from '../viewercontext'

/**
 * Tests for the Document Viewer main component
 */
export const documentViewerTests = describe('Document Viewer component', () => {
    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            const c = renderer.create(
                <Provider store={ctx.store} >
                    <DocumentViewer settings={ctx.settings} documentIdOrPath="" />
                </Provider>)
            c.unmount()
        })
    })

    it('Should poll document data if there is an Id or Path provided and stop polling on unmount', (done: MochaDone) => {
        let c!: renderer.ReactTestRenderer

        after(() => {
            c.unmount()
        })

        const exampleIdOrPath = 'Example/Id/Or/Path'

        useTestContextWithSettings({
            getDocumentData: async (idOrPath) => {
                expect(idOrPath).to.be.eq(exampleIdOrPath)
                done()
                return exampleDocumentData
            },
        }, (ctx) => {
            c = renderer.create(
                <Provider store={ctx.store} >
                    <DocumentViewer settings={ctx.settings} documentIdOrPath={exampleIdOrPath} />
                </Provider>)
        })
    })
})
