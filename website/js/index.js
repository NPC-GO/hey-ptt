let mainContainer = document.getElementById("main-container");
let articleContainer = document.getElementById("article-container");
(function () {
  articleContainer.parentNode.removeChild(articleContainer);
  mainContainer.parentNode.removeChild(mainContainer);
  //green button
  let latestPostButton = document.getElementById("latest-post-button");
  //white button
  let selfPostIdButton = document.getElementById("self-post-id-button");
  //green button in nav bar
  let latestPostButtonNav = document.getElementById("latest-post-button-nav");
  //add a event listener to the button.
  latestPostButton.addEventListener("click", async function () {
    await showMainLayout();
    await getLatestArticle();
  });
  latestPostButtonNav.addEventListener("click", getLatestArticle);
  //add a event listener to the button.
  selfPostIdButton.addEventListener("click", showMainLayout);
}());

function request(url, method, ...header) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url);
    header.forEach(h => httpRequest.setRequestHeader(h.key, h.value));
    httpRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(Error);
        }
      }
    };
    httpRequest.send();
  });
}

async function getLatestArticle() {
  mainContainer.innerHTML = '';
  let article = await request("/api/article_list/", 'GET');
  if (article["articles"] === undefined) {
    let articleTitle = document.getElementById("article-title");
    let articleContent = document.getElementById("article-content");
    articleTitle.innerText = "Something went wrong, we can't get anything...";
    articleContent.innerText = "Nothing here ~ ";
  } else {
    let latestId = article["articles"][0];
    mainContainer.appendChild(articleContainer);
    let latestArticle = await request("/api/article/" + latestId + "/content", 'GET');
    let articleTitle = document.getElementById("article-title");
    let articleContent = document.getElementById("article-content");
    let articleTime = document.getElementById("article-time");
    let articleAuthor = document.getElementById("article-author");
    articleTitle.innerText = latestArticle["title"];
    articleTime.innerText = latestArticle["time"];
    articleAuthor.innerText = latestArticle["author"];
    articleContent.innerText = latestArticle["content"];
    articleTime.innerHTML += "<span class=\"badge badge-success mx-2\">Latest</span>";
  }
}

/*when user finish loading the webPage at the start page, user will see a single big title
  with only two buttons. This function will be executed after user choose to see the latest
  article or old-versions, try to transfer layout to another status. */

//HIDE the big title and two buttons.
//SHOW the navigation drawer.

async function showMainLayout() {
  //get navigation drawer object.
  let navBar = document.getElementById("navBar");
  //get title div object.
  let titleContainer = document.getElementById("title-container");
  //set navigation drawer to be seen.
  navBar.style.visibility = "visible";
  //make title div to transparent.
  titleContainer.style.opacity = "0";
  //Really remove this title div element.
  let body = titleContainer.parentNode;
  body.removeChild(titleContainer);
  body.appendChild(mainContainer);
}
