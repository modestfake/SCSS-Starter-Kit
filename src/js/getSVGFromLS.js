(function (window, document) {
  const file = 'build/svg/symbols.svg'
  const revision = 1

  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return

  const isLocalStorage = 'localStorage' in window && window['localStorage'] !== null
  let request
  let data
  const insertIT = () => {
    document.body.insertAdjacentHTML('afterbegin', data)
  }

  const insert = () => {
    if (document.body) insertIT()
    else document.addEventListener('DOMContentLoaded', insertIT)
  }

  const ls = window.localStorage

  if (isLocalStorage && ls.getItem('inlineSVGrev') === revision) {
    data = ls.getItem('inlineSVGdata')

    if (data) {
      insert()
      return
    }
  }

  try {
    request = new window.XMLHttpRequest()
    request.open('GET', file, true)
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText
        insert()

        if (isLocalStorage) {
          ls.setItem('inlineSVGdata', data)
          ls.setItem('inlineSVGrev', revision)
        }
      }
    }

    request.send()
  } catch (error) {
    console.error(error)
  }
})(window, document)
