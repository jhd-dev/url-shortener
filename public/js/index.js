var mainUrl = 'https://porygonj-url-shortener.herokuapp.com/';

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("url-submit").onclick = function(){
        window.location = mainUrl + encodeURIComponent(document.getElementById("url-input").value);
    };
});
