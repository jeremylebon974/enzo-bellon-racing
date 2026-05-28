const getVisitorId = (): string => {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('eb_visitor_id')
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('eb_visitor_id', id)
  }
  return id
}

const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem('eb_session_id')
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('eb_session_id', id)
  }
  return id
}

export const track = async (type: string, data: Record<string, any> = {}) => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        ...data,
      }),
    })
  } catch (e) {}
}

export const trackPageView = () => track('page_view')

export const trackProductView = (product_id: string, product_name: string) =>
  track('product_view', { product_id, metadata: { product_name } })

export const trackAddToCart = (product_id: string, product_name: string, size: string) =>
  track('add_to_cart', { product_id, metadata: { product_name, size } })

export const trackCheckoutStart = () => track('checkout_start')

export const trackScroll = (depth: number) =>
  track('scroll', { metadata: { depth } })