

export function fechaHora() {
  const now = new Date()

  // sumar 8 horas
  now.setHours(now.getHours() + 8)

  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()

  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')

  return {
    fecha: `${dd}-${mm}-${yyyy}`,
    hora: `${hh}:${min}hs`
  }
}