import api from './api';

function fade(element) {
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}


function beforeLoaded() {
    let homePageTitle = document.getElementById("home-page-button");
    homePageTitle.addEventListener("click", function () {
        api.request();
    });
}

(() => {
    beforeLoaded();
})();
