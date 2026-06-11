export const formatPrice = (n?: number | null): string =>
  typeof n === 'number'
    ? new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }).format(n)
    : ''

export const formatDate = (d?: string | null): string =>
  d
    ? new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(d))
    : ''
