import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { PageList } from '../../src/components/PageList'
import { documentReceivedAction } from '../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../viewercontext'

export const pageListTests = describe('PageList component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <PageList
                        id={'1'}
                        onPageClick={(ev) => undefined}
                        elementNamePrefix={'EL'}
                        zoomMode={'fit'}
                        zoomLevel={0}
                        showWidgets={true}
                        tolerance={100}
                        padding={10}
                        images={'preview'}
                    >
                    </PageList>
                </Provider>)
        })
    })
})
