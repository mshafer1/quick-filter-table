/**
 * Client.vue integration-style tests
 *
 * These tests mount the real component and verify behavior through user
 * interaction instead of asserting local variables.
 */

import { defineComponent } from 'vue'
import { fireEvent, render, screen } from '@testing-library/vue'
import Client from '../Client.vue'

jest.mock('lodash/debounce', () => (fn) => fn)

const defaultHeaders = [
  { text: 'Name', value: 'name', filter: null },
  { text: 'Status', value: 'status', filter: 'distinct' },
]

const defaultItems = [
  { name: 'Alpha', status: 'active' },
  { name: 'Beta', status: 'inactive' },
  { name: 'Gamma', status: 'active' },
  { name: 'Delta', status: 'inactive' },
]

const longItems = Array.from({ length: 100 }, (_, i) => ({
  name: `Item ${i + 1}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
  number: i + 1,
}))

function renderClient(overrides = {}) {
  return render(Client, {
    props: {
      headers: defaultHeaders,
      items: defaultItems,
      loaded: true,
      default_rows_per_page: 25,
      rows_per_page_options: [25, 50, 100],
      ...overrides,
    },
    global: {
      stubs: {
        DistinctFilter: defineComponent({
          template: '<div data-testid="distinct-filter-stub"></div>',
        }),
        MultiDistinctFilter: defineComponent({
          template: '<div data-testid="multi-distinct-filter-stub"></div>',
        }),
        NumberRangeFilter: defineComponent({
          template: '<div data-testid="number-range-filter-stub"></div>',
        }),
        TextFilter: defineComponent({
          template: '<div data-testid="text-filter-stub"></div>',
        }),
      },
    },
  })
}

describe('Client.vue Component Interaction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders loading state when not loaded', () => {
    renderClient({ loaded: false })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: '' })).not.toBeInTheDocument()
  })

  test('initializes with search input and pagination props', () => {
    renderClient()

    const searchInput = screen.getByPlaceholderText('Search...')

    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  test('requires the fuse.js library for fuzzy search', () => {
    expect(() => require.resolve('fuse.js')).not.toThrow()
  })

  test('uses hidden footer config when rows_per_page_options is null', () => {
    renderClient({ rows_per_page_options: null })

    expect(screen.queryByText('rows per page:')).not.toBeInTheDocument()
  })

  test('toggles focused class on search input focus and blur', async () => {
    renderClient()

    const searchInput = screen.getByPlaceholderText('Search...')

    await fireEvent.focus(searchInput)
    expect(searchInput).toHaveClass('focused')

    await fireEvent.blur(searchInput)
    expect(searchInput).not.toHaveClass('focused')
  })

  test('filters visible items when user types in search input', async () => {
    renderClient()

    const searchInput = screen.getByPlaceholderText('Search...')
    await fireEvent.update(searchInput, 'Alpha')

    expect(screen.getAllByRole('row')).toHaveLength(2) // 1 header row + 1 data row
    expect(screen.getByText('Alpha')).toBeInTheDocument()

    await fireEvent.update(searchInput, 'ta')

    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
  })

  test('clear button resets search and restores full item list', async () => {
    renderClient()

    const searchInput = screen.getByPlaceholderText('Search...')
    await fireEvent.update(searchInput, 'Alpha')

    expect(screen.getAllByRole('row')).toHaveLength(2) // 1 header row + 1 data row
    expect(screen.getByText('Alpha')).toBeInTheDocument()

    const clearButton = screen.getByTitle('clear search')
    await fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
    expect(screen.getAllByRole('row')).toHaveLength(5) // 1 header row + 4 data rows
  })

  test('default rows per page', async () => {
    renderClient({ items: longItems, default_rows_per_page: 25 })
    expect(screen.getAllByRole('row')).toHaveLength(26) // 1 header row + 25 data rows
  })

  test('changing page updates visible items', async () => {
    const { container } = renderClient({
      items: longItems,
      default_rows_per_page: 25,
      headers: [{ text: 'Name', value: 'name', filter: null }], // just the name for smaller log
    })

    expect(screen.getAllByRole('row')).toHaveLength(26) // 1 header row + 25 data rows
    expect(screen.queryByText('Item 26')).not.toBeInTheDocument()

    const nextPageButton = container.querySelector('div.next-page__click-button')
    await fireEvent.click(nextPageButton)

    expect(screen.getByText('Item 26')).toBeInTheDocument()
  })

  test('setting search resets pagination', async () => {
    const { container } = renderClient({
      items: longItems,
      default_rows_per_page: 25,
      headers: [{ text: 'Name', value: 'name', filter: null }], // just the name for smaller log
    })

    const searchInput = screen.getByPlaceholderText('Search...')
    await fireEvent.update(searchInput, 'Item 1')

    expect(screen.getAllByRole('row')).toHaveLength(13) // 1 header row + 1 data row
    expect(screen.getByText('Item 1')).toBeInTheDocument()

    await fireEvent.update(searchInput, '') // clear search
    expect(screen.getAllByRole('row')).toHaveLength(26) // 1 header row + 25 data rows

    const nextPageButton = container.querySelector('div.next-page__click-button')
    await fireEvent.click(nextPageButton) // Move to page 2, validated in previous test

    await fireEvent.update(searchInput, 'Item 1') // set search again
    expect(screen.getAllByRole('row')).toHaveLength(13) // 1 header row + 1 data row
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  test('Searching mixed-type columns does not crash fuzzy sort', async () => {
    const complexItems = [
      { id: 1, name: 'Alice', score: 1, active: null },
      { id: 2, name: 'Bran', score: 2, active: { state: 'on Fridays' } },
      { id: 3, name: 'Cara', score: 'N/A', active: null },
      { id: 4, name: 'Drew', score: 4, active: { state: 'always' } },
      { id: 5, name: 'Evan', score: 5, active: null },
      { id: 4, name: 'Felix', score: null, active: { state: 'always' } },
    ]
    renderClient({
      items: complexItems,
      headers: [
        { text: 'ID', value: 'id', filter: 'distinct' },
        { text: 'Name', value: 'name', filter: 'text' },
        { text: 'Score', value: 'score', filter: 'numberRange' },
        { text: 'Active', value: 'active', filter: 'distinct' },
        { text: 'Tags', value: 'tags', filter: 'distinct' },
      ],
    })

    const searchInput = screen.getByPlaceholderText('Search...')
    await fireEvent.update(searchInput, 'a')

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Cara')).toBeInTheDocument()
  })

  test('text filter comparison succeeds even when value is truthy non-string and criteria is lowercase', () => {
    const textHeader = {
      text: 'Score',
      value: 'score',
      filter: 'text',
      filterValue: 'abc',
    }

    const filterOptions = Client.computed.filterOptions.call({
      filtered_headers: [textHeader],
    })

    expect(filterOptions).toHaveLength(1)
    filterOptions[0].comparison(123, 'abc')
  })
})
