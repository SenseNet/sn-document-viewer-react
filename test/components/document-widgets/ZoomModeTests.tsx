import * as React from 'react'
import { Provider } from 'react-redux'

import { expect } from 'chai'
import { IconButton, Menu, MenuItem } from 'material-ui'
import * as renderer from 'react-test-renderer'
import { ZoomModeWidget } from '../../../src/components/document-widgets/ZoomMode'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

export const zoomModeWidgetTests = describe('ZoomModeWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <ZoomModeWidget>
                    </ZoomModeWidget>
                </Provider>)
        })
    })

    it('ZoomMenu open / close', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <ZoomModeWidget>
                    </ZoomModeWidget>
                </Provider>)
            const zoomMenuButton = c.root.findByType(IconButton)
            zoomMenuButton.props.onClick({currentTarget: undefined})
            const zoomMenu = c.root.findByType(Menu)
            zoomMenu.props.onClose()
        })
    })

    it('set zoom mode to fit', () => {
        // useTestContext((ctx) => {
        //     ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

        //     c = renderer.create(
        //         <Provider store={ctx.store}>
        //             <ZoomModeWidget>
        //             </ZoomModeWidget>
        //         </Provider>)
        //     const zoomMenuButton = c.root.findByType(IconButton)
        //     zoomMenuButton.props.onClick({currentTarget: undefined})
        //     const button = c.root.findAllByType(MenuItem)[0];
        //     (button as any).props.onClick({})
        //     expect(ctx.store.getState().sensenetDocumentViewer.viewer.zoomMode).to.be.eq('fit')
        // })
    })
})
