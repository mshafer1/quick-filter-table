jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}))

jest.mock('vue3-easy-data-table', () => ({
  __esModule: true,
  default: {},
}))

jest.mock('vue', () => {
  const actual = jest.requireActual('vue')
  return {
    ...actual,
    createApp: jest.fn(() => ({
      component: jest.fn().mockReturnThis(),
      mount: jest.fn(),
    })),
  }
})

import axios from 'axios'
import { createApp } from 'vue'
import { QuickFilterTable, renderApp } from '../libray.js'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('libray.js core API', () => {
  let errorSpy
  let debugSpy

  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
    debugSpy.mockRestore()
  })

  test('exports QuickFilterTable and renderApp', () => {
    expect(QuickFilterTable).toBeTruthy()
    expect(typeof renderApp).toBe('function')
  })

  test('logs and returns when target element is missing', () => {
    renderApp('missing-target', { headers: [], items: [] })

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Target element with ID "missing-target" not found.'),
    )
    expect(createApp).not.toHaveBeenCalled()
  })

  test('logs and returns when both items and items_url are missing', () => {
    document.body.innerHTML = '<div id="app"></div>'

    renderApp('app', { headers: [] })

    expect(console.error).toHaveBeenCalledWith('QuickFilterTable: items_url or items is required.')
    expect(createApp).not.toHaveBeenCalled()
  })

  test('normalizes header defaults and mounts app', () => {
    document.body.innerHTML = '<div id="app"></div>'

    renderApp('app', {
      headers: [{ text: 'Name', value: 'name' }],
      items: [],
    })

    const rootWrapper = createApp.mock.calls[0][0]
    const state = rootWrapper.data()
    const appInstance = createApp.mock.results[0].value

    expect(state.headers[0]).toMatchObject({
      text: 'Name',
      value: 'name',
      sortable: true,
      html: false,
      filter: null,
    })
    expect(state.default_rows_per_page).toBe(25)
    expect(state.rows_per_page_options).toEqual([25, 50, 100])
    expect(appInstance.component).toHaveBeenCalledWith('EasyDataTable', expect.anything())
    expect(appInstance.mount).toHaveBeenCalledWith(document.getElementById('app'))
  })

  test('applies items_key and items_map for fetched data', async () => {
    document.body.innerHTML = '<div id="app"></div>'
    axios.get.mockResolvedValue({
      data: {
        rss: {
          channel: {
            item: [{ id: 1 }, { id: 2 }],
          },
        },
      },
    })

    renderApp('app', {
      headers: [],
      items_url: '/feed',
      items_key: 'rss.channel.item',
      items_map: (item) => ({ ...item, mapped: true }),
    })

    const rootWrapper = createApp.mock.calls[0][0]
    const state = rootWrapper.data()

    rootWrapper.mounted.call(state)
    await flushPromises()

    expect(axios.get).toHaveBeenCalledWith('/feed')
    expect(state.items).toEqual([
      { id: 1, mapped: true },
      { id: 2, mapped: true },
    ])
    expect(state.loaded).toBe(true)
  })

  test('applies items_map for local items when items_url is not provided', () => {
    document.body.innerHTML = '<div id="app"></div>'

    renderApp('app', {
      headers: [],
      items: [{ id: 10 }],
      items_map: (item) => ({ ...item, label: `id-${item.id}` }),
    })

    const rootWrapper = createApp.mock.calls[0][0]
    const state = rootWrapper.data()

    rootWrapper.mounted.call(state)

    expect(state.items).toEqual([{ id: 10, label: 'id-10' }])
    expect(state.loaded).toBe(true)
  })

  test('logs axios fetch errors without throwing', async () => {
    document.body.innerHTML = '<div id="app"></div>'
    axios.get.mockRejectedValue(new Error('Network failure'))

    renderApp('app', {
      headers: [],
      items_url: '/broken',
    })

    const rootWrapper = createApp.mock.calls[0][0]
    const state = rootWrapper.data()

    expect(() => rootWrapper.mounted.call(state)).not.toThrow()
    await flushPromises()

    expect(axios.get).toHaveBeenCalledWith('/broken')
    expect(console.error).toHaveBeenCalledWith('Error fetching items:', expect.any(Error))
    expect(state.loaded).toBe(false)
  })
})
