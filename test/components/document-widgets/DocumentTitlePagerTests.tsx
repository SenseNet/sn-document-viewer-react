import { expect } from 'chai'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentTitlePager, DocumentTitlePagerComponent } from '../../../src/components/document-widgets/DocumentTitlePager'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContextAsync } from '../../viewercontext'

/**
 * Pager widget tests
 */
export const documentTitlePagerWidgetTests: Mocha.Suite = describe('DocumentTitlePagerWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', async () => {
        await useTestContextAsync(async (ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentTitlePager />
                </Provider>)
            const t: DocumentTitlePagerComponent = c.root.findAllByType(DocumentTitlePagerComponent)[0].instance
            expect(t).to.be.instanceof(DocumentTitlePagerComponent)
        })
        c.unmount()
    })

    it('Should change focused attribute with focus and blur handlers', async () => {
        await useTestContextAsync(async (ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentTitlePager />
                </Provider>)
            const t: DocumentTitlePagerComponent = c.root.findAllByType(DocumentTitlePagerComponent)[0].instance
            expect(t.state.focused).to.be.eq(false)

            // tslint:disable-next-line:no-string-literal
            t['handleFocused']()
            expect(t.state.focused).to.be.eq(true)

            // tslint:disable-next-line:no-string-literal
            t['handleBlur']()
            expect(t.state.focused).to.be.eq(false)

        })

        c.unmount()
    })

})
