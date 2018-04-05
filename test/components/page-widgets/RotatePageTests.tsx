import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { RotatePageWidget } from '../../../src/components/page-widgets/RotatePage'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

export const rotatePageWidgetTests = describe('RotatePageWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <RotatePageWidget page={page} viewPort={{width: 1024, height: 768}} zoomRatio={1}>
                    </RotatePageWidget>
                </Provider>)
        })
    })
})
