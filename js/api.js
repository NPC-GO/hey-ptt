function request(url, method, ...header) {
    return new Promise(function (resolve, reject) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open(method, url);
        header.forEach(h => httpRequest.setRequestHeader(h.key, h.val));
        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    resolve(this.responseText);
                } else {
                    reject();
                }
            }
        };
        httpRequest.send();
    });
}

(function () {

})()