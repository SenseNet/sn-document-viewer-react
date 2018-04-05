import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { LayoutAppBar } from '../../src/components/LayoutAppBar'
import { useTestContext } from '../viewercontext'

export const layoutAppBarTests = describe('Layout AppBar component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            c = renderer.create(
                <Provider store={ctx.store}>
                    <LayoutAppBar>
                        <span>test</span>
                    </LayoutAppBar>
                </Provider>)
        })
    })
})
