/**
 * SearchFilters Component Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilters from '../SearchFilters'
import { SearchFilters as SearchFiltersType } from '@/types'
import { CountryCode } from '@/lib/countries'

describe('SearchFilters', () => {
  const mockFilters: SearchFiltersType = {
    country: 'SG',
    page: 1,
    limit: 20,
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search filters correctly', () => {
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText(/search/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search for cars/i)).toBeInTheDocument()
  })

  it('calls onFiltersChange when search input changes', async () => {
    const user = userEvent.setup()
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search for cars/i)
    await user.type(searchInput, 'Toyota')

    // Wait for debounce (if implemented)
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('calls onFiltersChange when make filter changes', async () => {
    const user = userEvent.setup()
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const makeSelect = screen.getByLabelText(/make/i) || screen.getByRole('combobox', { name: /make/i })
    if (makeSelect) {
      await user.selectOptions(makeSelect, 'Toyota')
      
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            make: 'Toyota',
          })
        )
      })
    }
  })

  it('calls onFiltersChange when category filter changes', async () => {
    const user = userEvent.setup()
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const categorySelect = screen.getByLabelText(/category/i) || screen.getByRole('combobox', { name: /category/i })
    if (categorySelect) {
      await user.selectOptions(categorySelect, 'cars')
      
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            category: 'cars',
          })
        )
      })
    }
  })

  it('displays country-specific makes', () => {
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Singapore should show Toyota, Honda, Mercedes-Benz, etc.
    const makeOptions = screen.getAllByRole('option')
    const makeTexts = makeOptions.map(option => option.textContent)
    
    expect(makeTexts.some(text => text?.includes('Toyota'))).toBeTruthy()
  })

  it('displays country-specific categories', () => {
    render(
      <SearchFilters
        country="MY"
        filters={{ ...mockFilters, country: 'MY' }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Malaysia should show MPV category
    const categoryOptions = screen.getAllByRole('option')
    const categoryTexts = categoryOptions.map(option => option.textContent)
    
    // Malaysia includes MPV category
    expect(categoryTexts.some(text => text?.includes('MPV') || text?.includes('mpv'))).toBeTruthy()
  })

  it('updates filters when price range changes', async () => {
    const user = userEvent.setup()
    render(
      <SearchFilters
        country="SG"
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const minPriceInput = screen.getByLabelText(/min price/i) || screen.getByPlaceholderText(/min/i)
    if (minPriceInput) {
      await user.type(minPriceInput, '10000')
      
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            minPrice: 10000,
          })
        )
      })
    }
  })

  it('resets filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <SearchFilters
        country="SG"
        filters={{ ...mockFilters, make: 'Toyota', category: 'cars' }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const clearButton = screen.getByRole('button', { name: /clear/i }) || screen.getByText(/clear/i)
    if (clearButton) {
      await user.click(clearButton)
      
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            make: undefined,
            category: undefined,
          })
        )
      })
    }
  })

  it('renders different popular brands for different countries', () => {
    const { rerender } = render(
      <SearchFilters
        country="CA"
        filters={{ ...mockFilters, country: 'CA' }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Canada brands
    const caMakes = screen.getAllByRole('option')
    const caMakeTexts = caMakes.map(option => option.textContent)

    rerender(
      <SearchFilters
        country="MY"
        filters={{ ...mockFilters, country: 'MY' }}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    // Malaysia brands should include Proton/Perodua
    const myMakes = screen.getAllByRole('option')
    const myMakeTexts = myMakes.map(option => option.textContent)
    
    // Different countries should have different brand options
    expect(caMakeTexts).not.toEqual(myMakeTexts)
  })
})

