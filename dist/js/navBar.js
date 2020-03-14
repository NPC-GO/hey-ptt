function getNavBarProperties() {
  let navBar = document.getElementById("navBar");
  let navText = document.getElementById("nav-text");
  let navTextStyle = window.getComputedStyle(navText);
  let navTextWidth = (Number(navTextStyle.getPropertyValue('width').slice(0, -2)) * 1.26).toString() + "px";
  navBar.style.width = "max-content";
  let navBarWidth = window.getComputedStyle(navBar).getPropertyValue('width');
  navBar.style.width = navTextWidth;
  return [navBarWidth, navTextWidth]
}

function fixNavBarSize() {
  let navBar = document.getElementById("navBar");
  const props = getNavBarProperties();
  navBar.style.width = props[1];
}

function navBarEventListener() {
  fixNavBarSize();
  let navBar = document.getElementById("navBar");
  navBar.style.visibility = "hidden";
  navBar.addEventListener("mouseenter", function () {
    const props = getNavBarProperties();
    this.style.width = props[0];
  });
  navBar.addEventListener("mouseleave", function () {
    const props = getNavBarProperties();
    this.style.width = props[1];
  });
}

(function () {
  window.addEventListener("resize", function () {
    setTimeout(fixNavBarSize, 200);
  });
  navBarEventListener();
}());
