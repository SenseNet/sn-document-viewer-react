import * as React from 'react'
import { Provider } from 'react-redux'

import { Save } from 'material-ui-icons'
import * as renderer from 'react-test-renderer'
import { SaveWidget } from '../../../src/components/document-widgets/SaveWidget'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext, useTestContextWithSettings } from '../../viewercontext'

export const saveWidgetTests = describe('SaveWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <SaveWidget>
                    </SaveWidget>
                </Provider>)
        })
    })

    it('Click on save should trigger a save request', (done: MochaDone) => {
        useTestContextWithSettings({
            saveChanges: async () => {
                done()
            },
        }, (ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <SaveWidget>
                    </SaveWidget>
                </Provider>)
            const button = c.root.findByType(Save)
            button.props.onClick()
        })
    })
})
