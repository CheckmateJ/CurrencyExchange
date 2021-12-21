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

let unitPrice;

setTimeout(function () {
    for (const currenciesKey in currency) {

        let tr = document.createElement('tr');
        let currencyTd = document.createElement('td')
        let uniTd = document.createElement('td')
        let valueTd = document.createElement('td')
        let actionTd = document.createElement('td')
        let currencies = document.querySelector('.currencies')
        currencyTd.innerText = currency[currenciesKey].currency
        uniTd.innerText = 1;
        unitPrice = currency[currenciesKey].ask;
        valueTd.innerText = unitPrice;
        actionTd.innerHTML = '<button>Buy</button>'

        currencies.appendChild(tr)
        currencies.appendChild(currencyTd)
        currencies.appendChild(uniTd)
        currencies.appendChild(valueTd)
        currencies.appendChild(actionTd)
    }

}, 2000)

document.querySelectorAll('.btn-sell').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const value = prompt('How much do you want to sell ?')
        let amount = e.target.dataset.amount;
        let currency = e.target.dataset.currency;
        console.log(currency)
        if (parseInt(value) > parseInt(amount)) {
            alert('You don\'t have enough money');
        } else {
            let newAmount = amount - value;
            let wallet = e.target.dataset.price * value;
            document.querySelector(`.my-wallet-amount-${currency}`).innerText = newAmount;
            document.querySelector(`.my-wallet-value-${currency}`).innerText = newAmount * unitPrice ;
        }
    })
});
