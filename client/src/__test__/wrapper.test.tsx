
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
let fake = vi.fn()
vi.doMock('../api/get', () => ({
    'getAllNavApi': fake
}))
import Wrapper from '../Wrapper'
import { render, prettyDOM, screen, waitFor, cleanup } from '@testing-library/react'
import { createStoreContainer } from './util/createStoreContainer';

describe('test wrapper', () => {
    afterEach(() => {
        cleanup()
    })
    it('test error render', async () => {
        fake.mockReturnValueOnce([undefined, 'eeeee'])
        const el = createStoreContainer(<Wrapper><div></div></Wrapper>)
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('wrapper-error')).toBeTruthy()
            expect(queryByTestId('wrapper-nodata')).toBeNull()
            expect(queryByTestId('wrapper-success')).toBeNull()
        })
    })
    it('test no data render', async () => {
        fake.mockReturnValueOnce([{ data: { result: [] } }])
        const el = createStoreContainer(<Wrapper><div></div></Wrapper>)
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('wrapper-error')).toBeNull()
            expect(queryByTestId('wrapper-nodata')).toBeTruthy()
            expect(queryByTestId('wrapper-success')).toBeNull()
        })
    })
    it('test data render', async () => {
        fake.mockReturnValueOnce([{ data: { result: [111] } }])
        const el = createStoreContainer(<Wrapper><div></div></Wrapper>)
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('wrapper-error')).toBeNull()
            expect(queryByTestId('wrapper-nodata')).toBeNull()
            expect(queryByTestId('wrapper-success')).toBeTruthy()
        })
    })


})