import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { DocumentViewerLayout } from '../../src/components/DocumentViewerLayout'
import { useTestContext } from '../viewercontext'

export const documentViewerLayoutTests = describe('Document Viewer Layout component', () => {

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
})
