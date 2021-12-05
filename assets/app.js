import './styles/main.scss';
import './bootstrap';

let wallet = [];

fetch('/currency').then(resp => resp.json()).then(data => {
    wallet = data
})
setInterval(function () {
    setTimeout(function () {
        document.querySelector(`.rates-${wallet[0].code}`).innerText = wallet[0].bid;
    }, 2000);
}, 30000)


