let prevPage;
let loadMoreButton = document.getElementById("load-more-button");
let loadingIcon = document.getElementById("loading-icon");
let loadingIconChildren = loadingIcon.children;

(async function () {
  loadMoreButton.addEventListener("click", async () => {
    await showList(prevPage);
  });

  let articleContainer = document.getElementById("article-container");

  function close() {
    articleContainer.style.display = "none";
  }

  let closeArticle = document.getElementById("close-article");
  closeArticle.addEventListener("click", close);
  onclick = (e) => {
    if (e.target === articleContainer) {
      close();
    }
  };

  let colorBars = document.querySelectorAll(".colorful-line");
  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
  colorBars.forEach((coloBar) => {
    coloBar.style.background = "linear-gradient(to top right," + "#" + randomColor() + "," + "#" + randomColor() + ")";
  });
  await showList();
}());

function request(url, method, parameters, ...header) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    header.forEach(h => httpRequest.setRequestHeader(h.key, h.value));
    if (method === "GET") {
      url += ("?" + parameters);
      parameters = null;
    }
    httpRequest.open(method, url);
    httpRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.status + " " + this.statusText);
        }
      }
    };
    httpRequest.send(JSON.stringify(parameters));
  });
}

function errorHandler(e) {
  loadingIconChildren[0].style.display = "inline";
  loadingIconChildren[0].textContent = e.slice(0, 3) + " ERROR";
  loadingIconChildren[1].style.display = "none";
  document.getElementById("progress-bar").style.display = "none";
}

function leaveError() {
  loadingIconChildren[0].style.display = "none";
  loadingIconChildren[1].style.display = "inline";
}

async function getArticleWithContent(articleId) {
  return await request("/api/articles/" + articleId, "GET")
    .catch((e) => errorHandler(e));
}

async function getArticleTitle(articleId) {
  return await request("/api/articles/" + articleId + "/info", "GET")
    .catch((e) => errorHandler(e));
}

async function getList(page) {
  let list = await request("/api/articles", "GET", `page=${page || ""}`)
    .catch((e) => errorHandler(e));
  return [list["articles"], list["prev"]];
}

async function showList(page) {
  leaveError();
  loadingIcon.style.display = "flex";
  loadMoreButton.classList.add("disabled");
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "載入中...";
  let list;
  [list, prevPage] = await getList(page);
  let listContainer = document.getElementById("list");
  let progressBar = document.getElementsByClassName("progress-bar")[0];
  let partOfProgress = 100 / list.length;
  progressBar.parentNode.style.display = "flex";
  progressBar.style.width = "0";
  (await Promise.all(list.map(async (articleId, index) => {
    let cardData = await getArticleTitle(articleId).catch(e => ({
      title: "無法載入文章",
      time: e,
      author: "",
      disabled: true
    }));
    progressBar.style.width = (index + 2) * partOfProgress + "%";
    await new Promise(resolve => setTimeout(() => resolve(), 800));
    return {
      title: cardData["title"],
      time: cardData["time"],
      author: cardData["author"],
      id: articleId,
      disabled: cardData["error"]
    };
  }))).forEach(({time, author, title, id, disabled}) => {
    if (!disabled) {
      let card = document.createElement("div");
      let cardInfo = document.createElement("div");
      let cardTitle = document.createElement("p");
      let cardAuthor = document.createElement("p");
      let cardTime = document.createElement("p");
      let hr = document.createElement("hr");
      card.className += "article-card";
      cardInfo.className += "article-card-info";
      cardTitle.className += "article-card-title";
      cardAuthor.className += "article-card-author";
      cardTime.className += "article-card-time";
      cardTime.appendChild(document.createTextNode(time));
      cardAuthor.appendChild(document.createTextNode(author));
      cardTitle.appendChild(document.createTextNode(title));
      cardInfo.appendChild(cardAuthor);
      cardInfo.appendChild(cardTime);
      card.appendChild(cardTitle);
      card.appendChild(hr);
      card.appendChild(cardInfo);
      card.addEventListener("click", () => showArticle(id));
      card.style.display = "none";
      listContainer.appendChild(card);
      card.style.removeProperty("display");
    }
  });
  progressBar.style.width = "100%";
  progressBar.parentNode.style.display = "none";
  progressBar.style.width = "0";
  loadMoreButton.style.display = "inline";
  loadMoreButton.classList.remove("disabled");
  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "載入更多";
  loadingIcon.style.display = "none";
}

async function showArticle(articleId) {
  leaveError();
  loadingIcon.style.display = "flex";
  let article = await getArticleWithContent(articleId);
  if (article === undefined) {
    errorHandler("404");
    return;
  }
  let titleText = document.getElementsByClassName("title-text")[0];
  let articleText = document.getElementsByClassName("article")[0];
  let colorfulLine = document.getElementById("article-color-line");
  colorfulLine.style.display = "none";
  titleText.innerText = "";
  articleText.innerText = "";
  setTimeout(function () {
    titleText.innerText = article["title"];
    articleText.innerText = article["content"];
    colorfulLine.style.display = "inherit"
  }, 600);
  let articleContainer = document.getElementById("article-container");
  articleContainer.style.display = "block";
  loadingIcon.style.display = "none";
}
