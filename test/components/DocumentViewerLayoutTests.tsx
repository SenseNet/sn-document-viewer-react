import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { Page } from '../../src/components'
import { DocumentViewerLayout } from '../../src/components/DocumentViewerLayout'
import { documentReceivedAction } from '../../src/store/Document'
import { availabelImagesReceivedAction } from '../../src/store/PreviewImages'
import { exampleDocumentData, useTestContext } from '../viewercontext'

/**
 * DocumentViewerLayout Component tests
 */
export const documentViewerLayoutTests: Mocha.Suite = describe('Document Viewer Layout component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentViewerLayout>
                        <span>test</span>
                    </DocumentViewerLayout>
                </Provider>)
        })
    })

    it('Should render and scroll on small screens', () => {
        (global as any).innerWidth = 600

        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentViewerLayout>
                        <span>test</span>
                    </DocumentViewerLayout>
                </Provider>)
            const page = c.root.findAllByType(Page)[0]
            page.props.onClick()
            page.props.onClick()
        });
        (global as any).innerWidth = 1024
    })

    it('Click on a page should scroll to the selected page', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentViewerLayout>
                    </DocumentViewerLayout>
                </Provider>)

            const page = c.root.findAllByType(Page)[0]
            page.props.onClick()
        })
    })
})
