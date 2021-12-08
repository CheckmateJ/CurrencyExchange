import './styles/main.scss';
import './bootstrap';

let wallet = [];
let currency = null;

fetch('/currency/wallet').then(resp => resp.json()).then(data => {
    wallet = data
})

fetch('https://api.nbp.pl/api/exchangerates/tables/C/').then(resp => resp.json()).then(data => {
    currency = data[0]['rates'];
})

setInterval(function () {
    setTimeout(function () {
        document.querySelector(`.rates-${wallet[0].code}`).innerText = wallet[0].bid;
    }, 2000);
}, 30000)


setTimeout(function () {
    for (const currenciesKey in currency) {

        let tr = document.createElement('tr');
        let currencyTd = document.createElement('td')
        let uniTd = document.createElement('td')
        let valueTd = document.createElement('td')
        let actionTd = document.createElement('td')
        let currencies = document.querySelector('.currencies')
        console.log(currency[currenciesKey])
        currencyTd.innerText = currency[currenciesKey].currency
        uniTd.innerText = 1;
        valueTd.innerText = currency[currenciesKey].ask;
        actionTd.innerHTML = '<button>Buy</button>'

        currencies.appendChild(tr)
        currencies.appendChild(currencyTd)
        currencies.appendChild(uniTd)
        currencies.appendChild(valueTd)
        currencies.appendChild(actionTd)
    }

}, 2000)