let prevPage, lastPage, latestPage;
(async function () {
  let prevButton = document.getElementById("prev-button");
  prevButton.addEventListener("click", async () => {
    await showList(prevPage || "");
  });
  let nextButton = document.getElementById("next-button");
  nextButton.addEventListener("click", async () => {
    await showList(lastPage || "");
  });
  let latestButton = document.getElementById("latest-button");
  latestButton.addEventListener("click", async () => {
    await showList("");
  });
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
  return await request("/api/article/" + articleId, "GET").catch(console.log());
}

async function getList(page) {
  let list = await request("/api/article_list/" + page || "", "GET");
  return [list["articles"], list["prev"]];
}

async function showList(page) {
  let prevButton = document.getElementById("prev-button");
  let nextButton = document.getElementById("next-button");
  let latestButton = document.getElementById("latest-button");
  [prevButton, nextButton, latestButton].forEach((button) => {
    button.disabled = true;
    button.classList.add("disabled");
  });
  let list;
  [list, prevPage] = await getList(page);
  if (!latestPage) {
    latestPage = String(Number(prevPage) + 1);
  }
  let listContainer = document.getElementById("list");
  listContainer.innerHTML = "";
  (await Promise.all(list.map(async (articleId) => {
    let cardData = await getArticleTitle(articleId).catch(e => ({
      title: "本文已被刪除",
      time: e,
      author: ""
    }));
    return {
      title: cardData["title"],
      time: cardData["time"],
      author: cardData["author"]
    }
  }))).forEach((cardData) => {
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
    cardTime.appendChild(document.createTextNode(cardData.time));
    cardAuthor.appendChild(document.createTextNode(cardData.author));
    cardTitle.appendChild(document.createTextNode(cardData.title));
    cardInfo.appendChild(cardAuthor);
    cardInfo.appendChild(cardTime);
    card.appendChild(cardTitle);
    card.appendChild(hr);
    card.appendChild(cardInfo);
    listContainer.appendChild(card);
  });
  latestButton.disabled = false;
  latestButton.classList.remove("disabled");
  lastPage = String(Number(prevPage) + 2);
  if (prevPage) {
    prevButton.disabled = false;
    prevButton.classList.remove("disabled");
  }
  if (lastPage && Number(lastPage) <= Number(latestPage)) {
    nextButton.disabled = false;
    nextButton.classList.remove("disabled");
  }
}

async function showArticle(articleId) {
  let article = await getArticleWithContent(articleId);
  //show
}
