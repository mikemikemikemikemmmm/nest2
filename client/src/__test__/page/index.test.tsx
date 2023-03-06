import { cleanup, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { createRouterContainer } from '../util/createContainer'
import { IndexPage } from '../../page';
describe('test index page', () => {
    it('render without error', async () => {
        const el = createRouterContainer({
            el: <IndexPage />,
            loaderData: { data: null },
        })
        render(el)
        await waitFor(() => {
            expect(screen).toBeTruthy()
        })
    })
})
