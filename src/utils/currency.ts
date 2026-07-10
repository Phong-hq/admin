const formatCurrency = (
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

export const currency = (price: any): string => {
  let result = price
  if (typeof price == 'string') result = price.replace(/\D/g, '')
  if (!result || !Number(result)) return formatCurrency(0, 'vi-VN', 'VND')
  return formatCurrency(Number(result), 'vi-VN', 'VND')
}

export const currencyInput = (price: any): string => {
  return Number(price.toString().replace(/\D/g, ''))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const currencyNumber = (price: any): number => {
  price = price.toString()
  return Number((price || '0').replace(/\D/g, ''))
}
