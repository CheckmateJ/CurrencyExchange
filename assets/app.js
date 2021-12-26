import './styles/main.scss';
import './bootstrap';
import axios from "axios";

let wallet = [], myWallet = [], currency = null, newAmount, unitPrice, addMoney;

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
        currency = e.target.dataset.currency;
        const value = prompt('How much do you want to sell ?')
        let amount = e.target.dataset.amount;

        if (parseInt(value) > parseInt(amount)) {
            alert('You don\'t have enough money');
        } else {
            if (myWallet.length > 0 && myWallet.filter(value => value.currency === currency).length > 0) {
                let currencyArr = myWallet.filter(value => value.currency === currency);
                amount = currencyArr[currencyArr.length - 1].amount;
            }

            newAmount = amount - value;
            addMoney = value * e.target.dataset.price;
            myWallet.push({'currency': currency, 'amount': newAmount})
            document.querySelector(`.my-wallet-amount-${currency}`).innerText = newAmount;
            document.querySelector(`.my-wallet-value-${currency}`).innerText = newAmount * e.target.dataset.price;
            let availableMoney = document.querySelector(`.available-money`);
            availableMoney.innerText =  parseInt(availableMoney.innerText) + addMoney;

            axios.post('/currency/wallet/update', {money: addMoney, newAmount: newAmount, currency: currency}).then(response => console.log(response))
        }
    })
});
