import { get } from 'lodash-es'

export function getImgixUrlForElement(imgixUrl, el){
  const w = el.offsetWidth
  const h = el.offsetHeight
  let urlObj

  try {
    urlObj = new URL(imgixUrl)
  } catch(e) {
    // Defense #1 - `imgixUrl` is not a valid URL
    console.error('Expected valid URL')
    return ''
  }

  if (!w || !h) {
    // Defense #2 - element width or height is not available for some reason
    console.error('Expected dimensions')
    return imgixUrl
  }

  const multiplier = get(window, 'devicePixelRatio', 1)
  urlObj.searchParams.set('w', `${w * multiplier}`)
  urlObj.searchParams.set('h', `${h * multiplier}`)

  return urlObj
}

export function deviceIsMobileSize() {
  return window.screen.width < 600
}