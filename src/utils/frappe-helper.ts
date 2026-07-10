export const createElement = (option: {
  element: string
  key: string
  class?: string
  event_name?: string
}): string => {
  return `<div class="${option.class || ''}"  key="${option.key}" event_name="${option.event_name || ''}">${option.element}</div>`
}
