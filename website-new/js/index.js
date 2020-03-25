let prevPage;
let loadMoreButton = document.getElementById("load-more-button");

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

  let colorBar = document.querySelector("#main-container .colorful-line");
  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
  colorBar.style.background = "linear-gradient(to top right," + "#" + randomColor() + "," + "#" + randomColor() + ")";
  await showList("");
}());

function request(url, method, ...header) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method || "GET", url);
    header.forEach(h => httpRequest.setRequestHeader(h.key, h.value));
    httpRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.status + " " + this.statusText);
        }
      }
    };
    httpRequest.send();
  });
}

async function getArticleWithContent(articleId) {
  return await request("/api/article/" + articleId + "/content", "GET");
}

async function getArticleTitle(articleId) {
  return await request("/api/article/" + articleId, "GET");
}

async function getList(page) {
  let list = await request("/api/article_list/" + page || "", "GET");
  return [list["articles"], list["prev"]];
}

async function showList(page) {
  loadMoreButton.classList.add("disabled");
  loadMoreButton.disabled = true;
  let list;
  [list, prevPage] = await getList(page);
  let listContainer = document.getElementById("list");
  (await Promise.all(list.map(async (articleId) => {
    let cardData = await getArticleTitle(articleId).catch(e => ({
      title: "本文已被刪除",
      time: e,
      author: ""
    }));
    return {
      title: cardData["title"],
      time: cardData["time"],
      author: cardData["author"],
      id: articleId,
      disabled: cardData["error"]
    }
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
      listContainer.appendChild(card);
    }
  });
  loadMoreButton.style.display = "inline";
  loadMoreButton.classList.remove("disabled");
  loadMoreButton.disabled = false;
}

async function showArticle(articleId) {
  let article = await getArticleWithContent(articleId);
  let titleText = document.getElementsByClassName("title-text")[0];
  let articleText = document.getElementsByClassName("article")[0];
  titleText.innerText = "";
  articleText.innerText = "";
  setTimeout(function () {
    titleText.innerText = article["title"];
    articleText.innerText = article["content"]
  }, 600);
  let articleContainer = document.getElementById("article-container");
  articleContainer.style.display = "block";
}
