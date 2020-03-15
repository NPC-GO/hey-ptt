function request(url, method, ...header) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url);
    header.forEach(h => httpRequest.setRequestHeader(h.key, h.val));
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
  const article = await request("/api/article_list/", 'GET');
  const latestId = article["articles"].slice(-1)[0];
  if (latestId === undefined) {

  } else {
    const latestArticle = await request("/api/article/" + latestId + "/content", 'GET');
    const articleTitle = document.getElementById("article-title");
    const articleTime = document.getElementById("article-time");
    const articleAuthor = document.getElementById("article-author");
    const articleContent = document.getElementById("article-content");
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

function firstClick() {
  //get navigation drawer object.
  let navBar = document.getElementById("navBar");
  //get title div object.
  let titleContainer = document.getElementById("title-container");
  //set navigation drawer to be seen.
  navBar.style.visibility = "visible";
  //make title div to transparent.
  //Notice! we added a "transition" css property of this div, so it will disappear after 0.5s.
  titleContainer.style.opacity = "0";
  setTimeout(function () {
    //after "approximately" 500ms (0.5s), browser will execute this. Think: 0.5s, really? why not?
    //Really remove this title div element.
    let body = titleContainer.parentNode;
    body.removeChild(titleContainer);
    body.appendChild(mainContainer);
  }, 500);
}

let mainContainer = document.getElementById("main-container");
(function () {
  mainContainer.parentNode.removeChild(mainContainer);
  //green button
  let latestPostButton = document.getElementById("latest-post-button");
  //white button
  let selfPostIdButton = document.getElementById("self-post-id-button");
  //green button in nav bar
  let latestPostButtonNav = document.getElementById("latest-post-button-nav");
  //add a event listener to the button.
  latestPostButton.addEventListener("click", firstClick);
  latestPostButton.addEventListener("click", getLatestArticle);
  latestPostButtonNav.addEventListener("click", getLatestArticle);
  //add a event listener to the button.
  selfPostIdButton.addEventListener("click", firstClick);
}());
