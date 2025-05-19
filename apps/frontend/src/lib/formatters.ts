type Locale = 'pt-BR' | 'en-US'

// date
interface DateOpts {
  locale?: Locale
  options?: Intl.DateTimeFormatOptions
}

export function formatDate(date: Date | string, ops?: DateOpts) {
  const { locale = 'en-US', options = { dateStyle: 'short' } } = ops || {}
  if (typeof date === 'string') date = new Date(date)
  return date.toLocaleDateString(locale, options)
}

// price
type Currency = 'BRL' | 'USD'

interface PriceOpts {
  locale?: Locale
  currency?: Currency
}

const currencyMap: Record<Locale, Currency> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
}

export function formatPrice(price: number, ops?: PriceOpts) {
  const { locale = 'en-US', currency } = ops || {}
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency ?? currencyMap[locale],
  }).format(price)
}
