'use strict'

let currentBoard = getCookie('board') || 'Gossiping'
let prevPage, boards
const loadMoreButton = document.getElementById('load-more-button')
const loadingIcon = document.getElementById('loading-icon')
const loadingIconChildren = loadingIcon.children

function getRandomIntInclusive(min, max) {
  const randomBuffer = new Uint32Array(1)
  window.crypto.getRandomValues(randomBuffer)
  const randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1)
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(randomNumber * (max - min + 1)) + min
}

(async function () {
  loadMoreButton.addEventListener('click', async () => {
    await showList(prevPage)
  })

  const articleContainer = document.getElementById('article-container')

  function close() {
    articleContainer.style.display = 'none'
  }

  const closeArticle = document.getElementById('close-article')
  closeArticle.addEventListener('click', close)
  onclick = (e) => {
    if (e.target === articleContainer)
      close()
  }

  const boardsSelectBox = document.getElementById('boards')
  boardsSelectBox.addEventListener('change', changeBoard)

  const colorBars = document.querySelectorAll('.colorful-line')
  const randomColor = () => Math.floor(getRandomIntInclusive(0, 9999) * 1677.7215).toString(16)
  colorBars.forEach((coloBar) => {
    coloBar.style.background = 'linear-gradient(to top right,' + `#${randomColor()},` + `#${randomColor()})`
  })
  await showBoardsSelectorOptions()
  await showList()
}())

function request(url, method, parameters, ...header) {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest()
    if (method === 'GET') {
      if (parameters)
        url += (`?${parameters}` || '')

      parameters = null
    }
    httpRequest.open(method, url)
    header.forEach(h => httpRequest.setRequestHeader(Object.keys(h)[0], Object.values(h)[0].toString()))
    httpRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200)
          resolve(JSON.parse(this.responseText))
        else
          reject(`${this.status} ${this.statusText}`)
      }
    }
    httpRequest.send(JSON.stringify(parameters))
  })
}

function getCookie(name) {
  const cookieArr = document.cookie.split(';')
  for (const i of cookieArr) {
    const cookiePair = i.split('=')
    if (name === cookiePair[0].trim())
      return decodeURIComponent(cookiePair[1])
  }
  return null
}

function errorHandler(e) {
  loadingIconChildren[0].style.display = 'inline'
  loadingIconChildren[0].textContent = `${e.slice(0, 3)} ERROR`
  loadingIconChildren[1].style.display = 'none'
  document.getElementById('progress-bar').style.display = 'none'
}

function leaveError() {
  loadingIconChildren[0].style.display = 'none'
  loadingIconChildren[1].style.display = 'inline'
}

async function getArticleWithContent(articleId, board) {
  return await request(`/api/articles/${articleId}`, 'GET', `board=${board || currentBoard}`)
    .catch(e => errorHandler(e)) || ''
}

async function getArticleTitle(articleId, board) {
  return await request(`/api/articles/${articleId}/info`, 'GET', `board=${board || currentBoard}`)
    .catch(e => errorHandler(e)) || ''
}

async function getList(page, board) {
  const list = await request('/api/articles', 'GET', `page=${page || ''}&board=${board || currentBoard}`)
    .catch(e => errorHandler(e))
  return [list.articles || [], list.prev || []]
}

async function getBoards() {
  const boards = await request('/api/boards', 'GET')
    .catch(e => errorHandler(e))
  return boards.boards || { boards: 'Gossiping' }
}

async function showBoardsSelectorOptions() {
  leaveError()
  loadingIcon.style.display = 'flex'
  boards = await getBoards()
  const boardsSelectBox = document.getElementById('boards')
  boards.forEach((board) => {
    const option = document.createElement('option')
    option.text = board
    boardsSelectBox.add(option)
  })
  const inferredBoardIndex = getCookie('board-index') || 0
  if (boardsSelectBox[inferredBoardIndex] !== currentBoard)
    boardsSelectBox.selectedIndex = boards.findIndex(board => board === currentBoard)
  else
    boardsSelectBox.selectedIndex = inferredBoardIndex

  loadingIcon.style.display = 'none'
}

async function changeBoard() {
  const listContainer = document.getElementById('list')
  listContainer.innerHTML = ''
  currentBoard = boards[this.selectedIndex]
  await showList('', currentBoard)
  document.cookie = `board=${currentBoard}`
  document.cookie = `board-index=${this.selectedIndex}`
}

async function showList(page, board) {
  leaveError()
  loadingIcon.style.display = 'flex'
  loadMoreButton.classList.add('disabled')
  loadMoreButton.disabled = true
  loadMoreButton.textContent = '載入中...'
  let list;
  [list, prevPage] = await getList(page, board)
  const listContainer = document.getElementById('list')
  const progressBar = document.getElementsByClassName('progress-bar')[0]
  const partOfProgress = 100 / list.length
  let progressBarStatus = 0
  progressBar.parentNode.style.display = 'flex'
  progressBar.style.width = '0';
  (await Promise.all(list.map(async (articleId) => {
    const cardData = await getArticleTitle(articleId, board).catch(e => ({
      title: '無法載入文章',
      time: e,
      author: '',
      disabled: true,
    }))
    progressBarStatus += partOfProgress
    progressBar.style.width = `${progressBarStatus}%`
    await new Promise(resolve => setTimeout(() => resolve(), 800))
    return {
      title: cardData.title,
      time: cardData.time,
      author: cardData.author,
      id: articleId,
      disabled: cardData.error,
    }
  }))).forEach(({ time, author, title, id, disabled }) => {
    if (!disabled) {
      const card = document.createElement('div')
      const cardInfo = document.createElement('div')
      const cardTitle = document.createElement('p')
      const cardAuthor = document.createElement('p')
      const cardTime = document.createElement('p')
      const hr = document.createElement('hr')
      card.className += 'article-card'
      cardInfo.className += 'article-card-info'
      cardTitle.className += 'article-card-title'
      cardAuthor.className += 'article-card-author'
      cardTime.className += 'article-card-time'
      cardTime.appendChild(document.createTextNode(time))
      cardAuthor.appendChild(document.createTextNode(author))
      cardTitle.appendChild(document.createTextNode(title))
      cardInfo.appendChild(cardAuthor)
      cardInfo.appendChild(cardTime)
      card.appendChild(cardTitle)
      card.appendChild(hr)
      card.appendChild(cardInfo)
      card.addEventListener('click', () => showArticle(id))
      card.style.display = 'none'
      listContainer.appendChild(card)
      card.style.removeProperty('display')
    }
  })
  progressBar.style.width = '100%'
  progressBar.parentNode.style.display = 'none'
  progressBar.style.width = '0'
  loadMoreButton.style.display = 'inline'
  loadMoreButton.classList.remove('disabled')
  loadMoreButton.disabled = false
  loadMoreButton.textContent = '載入更多'
  loadingIcon.style.display = 'none'
}

async function showArticle(articleId, board) {
  leaveError()
  loadingIcon.style.display = 'flex'
  const article = await getArticleWithContent(articleId, board)
  if (article === undefined) {
    errorHandler('404')
    return
  }
  const titleText = document.getElementsByClassName('title-text')[0]
  const articleText = document.getElementsByClassName('article')[0]
  const colorfulLine = document.getElementById('article-color-line')
  colorfulLine.style.display = 'none'
  titleText.innerText = ''
  articleText.innerText = ''
  setTimeout(() => {
    titleText.innerText = article.title
    articleText.innerHTML = article.content
    colorfulLine.style.display = 'inherit'
  }, 600)
  const articleContainer = document.getElementById('article-container')
  articleContainer.style.display = 'block'
  loadingIcon.style.display = 'none'
  await loadImages()
}

async function loadImages() {
  await new Promise(resolve => setTimeout(() => resolve(), 800))
  const content = document.getElementById('main-content')
  const richContents = content.getElementsByTagName('blockquote')
  for (const richContent of richContents) {
    const id = richContent.getAttribute('data-id')
    const clientId = '9328a3cd4a074e4'
    const imgUrl = `https://api.imgur.com/3/image/${id}`
    const response = await request(imgUrl, 'GET', null, {
      Authorization: `Client-ID ${clientId}`,
    }).catch(e => errorHandler(e)) || ''
    if (response.data.link && response.data.type) {
      let media
      if (response.data.type.slice(0, 5) === 'image')
        media = document.createElement('img')

      else if (response.data.type.slice(0, 5) === 'video')
        media = document.createElement('video')

      media.classList.add('media')
      media.setAttribute('src', response.data.link)
      media.setAttribute('loading', 'lazy')
      media.setAttribute('alt', 'failed to load this image.')
      richContent.parentNode.insertBefore(media, richContents.nextSibling)
    }
  }
}
