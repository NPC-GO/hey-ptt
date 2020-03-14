function firstClick() {
  let navBar = document.getElementById("navBar");
  let titleContainer = document.getElementById("title-container");
  navBar.style.visibility = "visible";
  titleContainer.style.opacity = "0";
  setTimeout(function () {
    titleContainer.parentNode.removeChild(titleContainer);
  }, 500);
}

(function () {
  let latestPostButton = document.getElementById("latest-post-button");
  let selfPostIdButton = document.getElementById("self-post-id-button");
  latestPostButton.addEventListener("click", firstClick);
  selfPostIdButton.addEventListener("click", firstClick);
}());
