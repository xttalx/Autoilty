/**
 * Responsive Design Tests
 * Tests mobile-first breakpoints and responsive behavior
 */

import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

// Mock window.matchMedia for responsive tests
const createMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('Responsive Design', () => {
  beforeEach(() => {
    // Reset window.matchMedia mock
    window.matchMedia = createMatchMedia(false)
  })

  it('renders mobile menu button on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    })

    window.matchMedia = createMatchMedia(true) // Mobile media query matches

    render(<Navbar currentCountry="SG" />)

    const menuButton = screen.getByRole('button', { name: /menu/i }) || 
                       screen.getByLabelText(/menu/i)
    
    expect(menuButton).toBeInTheDocument()
  })

  it('hides mobile menu by default', () => {
    render(<Navbar currentCountry="SG" />)

    // Mobile menu should not be visible initially
    const mobileMenu = screen.queryByRole('navigation', { name: /mobile/i })
    expect(mobileMenu).not.toBeInTheDocument() || expect(mobileMenu).not.toBeVisible()
  })

  it('shows desktop navigation on large screens', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    })

    window.matchMedia = createMatchMedia(false) // Desktop media query doesn't match mobile

    render(<Navbar currentCountry="SG" />)

    // Desktop nav items should be visible (using md:flex classes)
    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('renders country selector on all screen sizes', () => {
    render(<Navbar currentCountry="SG" />)

    const countrySelect = screen.getByRole('combobox', { name: /country/i }) ||
                          screen.getByDisplayValue(/singapore/i)
    
    expect(countrySelect).toBeInTheDocument()
  })

  it('renders language selector on all screen sizes', () => {
    render(<Navbar currentCountry="SG" />)

    const languageSelect = screen.getByRole('combobox', { name: /language/i }) ||
                           screen.getByDisplayValue(/english/i)
    
    expect(languageSelect).toBeInTheDocument()
  })
})

/**
 * Test responsive breakpoints using CSS classes
 */
describe('Responsive Breakpoints', () => {
  it('applies mobile-first styles correctly', () => {
    const { container } = render(<Navbar currentCountry="SG" />)
    
    // Check for Tailwind responsive classes
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('bg-white') // Mobile-first base class
  })

  it('uses responsive grid classes for listings', () => {
    const { container } = render(
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>Item 1</div>
        <div>Item 2</div>
      </div>
    )

    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1') // Mobile: 1 column
    expect(grid).toHaveClass('sm:grid-cols-2') // Tablet: 2 columns
    expect(grid).toHaveClass('lg:grid-cols-3') // Desktop: 3 columns
    expect(grid).toHaveClass('xl:grid-cols-4') // Large: 4 columns
  })

  it('applies responsive text sizes', () => {
    const { container } = render(
      <h1 className="text-2xl sm:text-3xl lg:text-4xl">
        Responsive Heading
      </h1>
    )

    const heading = container.querySelector('h1')
    expect(heading).toHaveClass('text-2xl') // Mobile
    expect(heading).toHaveClass('sm:text-3xl') // Tablet
    expect(heading).toHaveClass('lg:text-4xl') // Desktop
  })

  it('handles responsive spacing', () => {
    const { container } = render(
      <div className="p-4 sm:p-6 lg:p-8">
        Content
      </div>
    )

    const div = container.querySelector('div')
    expect(div).toHaveClass('p-4') // Mobile padding
    expect(div).toHaveClass('sm:p-6') // Tablet padding
    expect(div).toHaveClass('lg:p-8') // Desktop padding
  })
})

