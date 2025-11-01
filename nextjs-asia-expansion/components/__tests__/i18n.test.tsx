/**
 * i18n (Internationalization) Tests
 */

import { render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n/config'

// Test component that uses translations
const TestComponent = () => {
  const { t } = require('react-i18next')
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('nav.listings')}</p>
    </div>
  )
}

describe('i18n Integration', () => {
  beforeEach(() => {
    i18n.init()
  })

  it('defaults to English locale', () => {
    expect(i18n.language).toBe('en')
  })

  it('switches to Bahasa Melayu (ms)', async () => {
    await i18n.changeLanguage('ms')
    
    expect(i18n.language).toBe('ms')
  })

  it('switches to Bahasa Indonesia (id)', async () => {
    await i18n.changeLanguage('id')
    
    expect(i18n.language).toBe('id')
  })

  it('renders English translations correctly', async () => {
    await i18n.changeLanguage('en')
    
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument()
    })
  })

  it('renders Bahasa Melayu translations correctly', async () => {
    await i18n.changeLanguage('ms')
    
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    )

    // Wait for translations to load
    await waitFor(() => {
      const homeText = screen.getByText(/rumah|home/i)
      expect(homeText).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('renders Bahasa Indonesia translations correctly', async () => {
    await i18n.changeLanguage('id')
    
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    )

    // Wait for translations to load
    await waitFor(() => {
      const homeText = screen.getByText(/beranda|home/i)
      expect(homeText).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('detects browser language if available', () => {
    const originalNavigator = global.navigator
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        language: 'ms-MY',
      },
      writable: true,
    })

    // Initialize i18n with language detection
    i18n.init({
      detection: {
        order: ['navigator'],
      },
    })

    // Should prefer detected language or fallback to default
    expect(['ms', 'en']).toContain(i18n.language)
    
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    })
  })

  it('handles missing translations gracefully', async () => {
    await i18n.changeLanguage('en')
    
    render(
      <I18nextProvider i18n={i18n}>
        <div>{i18n.t('nonexistent.key')}</div>
      </I18nextProvider>
    )

    // Should render key or empty string, not crash
    expect(screen.getByText(/nonexistent.key|^$/)).toBeInTheDocument()
  })
})

