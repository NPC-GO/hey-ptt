async function homePageFadeIn() {
    let blackTitle = document.getElementById("home-page-title");
    let buttonContainer = document.getElementById("home-page-buttons");
    let components = [blackTitle, buttonContainer];
    components.forEach(el => el.style.opacity = 0);
    [...buttonContainer.children].forEach(el => el.classList.add("disabled"));
    for (let el = 0; el < 2; el++) {
        for (let i = 0; i <= 200; i++) {
            await new Promise(resolve => setTimeout(resolve, 1));
            components[el].style.opacity = i * 0.005;
        }
    }
    [...buttonContainer.children].forEach(el => el.classList.remove("disabled"));
}
(function () {
    homePageFadeIn();
}());