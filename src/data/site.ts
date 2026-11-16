/** Datos de contacto. El número se configura en .env (VITE_WHATSAPP_NUMBER, solo dígitos con código de país). */
const raw = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''
const number = raw.replace(/\D/g, '')

export const WHATSAPP_ENABLED = number.length > 0

export function whatsappUrl(message = 'Hola, quiero información sobre sus servicios digitales.') {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
