import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { RotateDocumentWidget } from '../../../src/components/document-widgets/RotateDocument'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

export const rotateDocumentWidgetTests = describe('RotateDocumentWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <RotateDocumentWidget>
                    </RotateDocumentWidget>
                </Provider>)
        })
    })
})
