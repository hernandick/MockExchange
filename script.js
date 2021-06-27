


const tbody = document.getElementById('tbody');
const listItems = [];
let portfolioItems = [];
let info = {};
const listSection = document.getElementById("list");
const exchangeSection = document.getElementById("exchange");
const portfolioSection = document.getElementById("portfolio");
const btnList = document.getElementById("btnList");
const btnExchange = document.getElementById("btnExchange");
const btnPortfolio = document.getElementById("btnPortfolio");
const dropdown = document.getElementById('dropdown-menu');
const dropdownList = [];
const filter = document.getElementById('search');
const symbolInput = document.getElementById('symbol-input-bar');
const tBalance = document.getElementById('tBalance');
const tPortfolio = document.getElementById('tPortfolio');
const input = document.getElementById('input-buy-sell');
let USD = 1000000;
let pValue = 0;
let stocks;
let ledger = [];
const buyBtn = document.getElementById('buy-btn');
const sellBtn = document.getElementById('sell-btn');
const tPValue = document.getElementById('tPValue');
const btnListDropdown = document.getElementById("btnListDropdown");
const btnExchangeDropdown = document.getElementById("btnExchangeDropdown");
const btnPortfolioDropdown = document.getElementById("btnPortfolioDropdown");


// currency format

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
 });

// nav bar start

exchangeSection.style.display = 'none'
portfolioSection.style.display = 'none'

btnList.addEventListener('click', ()=>{
    listSection.style.display = 'block'
    exchangeSection.style.display = 'none'
    portfolioSection.style.display = 'none'
    
    btnList.classList.add('active')
    btnExchange.classList.remove('active')
    btnPortfolio.classList.remove('active')
    
})

btnExchange.addEventListener('click', ()=>{
    listSection.style.display = 'none';
    portfolioSection.style.display = 'none';
    exchangeSection.style.display = 'block';
    
    btnList.classList.remove('active')
    btnExchange.classList.add('active')
    btnPortfolio.classList.remove('active')
    
})

btnPortfolio.addEventListener('click', ()=>{
    listSection.style.display = 'none';
    exchangeSection.style.display = 'none';
    portfolioSection.style.display = 'block';
    
    btnList.classList.remove('active')
    btnExchange.classList.remove('active')
    btnPortfolio.classList.add('active')
    
})
btnListDropdown.addEventListener('click', ()=>{
    listSection.style.display = 'block'
    exchangeSection.style.display = 'none'
    portfolioSection.style.display = 'none'
    
    btnList.classList.add('active')
    btnExchange.classList.remove('active')
    btnPortfolio.classList.remove('active')
    
})

btnExchangeDropdown.addEventListener('click', ()=>{
    listSection.style.display = 'none';
    portfolioSection.style.display = 'none';
    exchangeSection.style.display = 'block';
    
    btnList.classList.remove('active')
    btnExchange.classList.add('active')
    btnPortfolio.classList.remove('active')
    
})

btnPortfolioDropdown.addEventListener('click', ()=>{
    listSection.style.display = 'none';
    exchangeSection.style.display = 'none';
    portfolioSection.style.display = 'block';
    
    btnList.classList.remove('active')
    btnExchange.classList.remove('active')
    btnPortfolio.classList.add('active')
    
})
// nav bar end 

// get data start

filter.addEventListener('input', (e)=> filterData(e.currentTarget.value))

async function getData() {

const response = await fetch("https://spreadsheets.google.com/feeds/list/12zeYYIs_1lcsDA8M4TAcgtyTZviII2s3q3jXO8efl6M/od6/public/basic?alt=json")

.then(response => response.json())

    for(let i = 0; i<=99 ;i++){

        const tr = document.createElement('tr')
        
        listItems.push(tr)

        let str1 =  response.feed.entry[i].content.$t

        tr.innerHTML = `
            <th scope="row">${i+1}</th>
            <td>${response.feed.entry[i].title.$t}</td>
            <td>${str1.substring(str1.indexOf(": ")+2,str1.indexOf(", "))}</td>
            <td>${str1.substring(str1.indexOf("price: ")+7,str1.indexOf(", c"))}</td>
            <td>${str1.substring(str1.indexOf("change24hs: ")+12,100)}</td>
        `
        tbody.appendChild(tr)

    }
    info = response

    populateDropdown()
    createLedger()
    updateLedger()
    populatePortfolio()
    getPValue()
    getBalance()
    
}

getData()

// get data end

function populateDropdown(){
    for(let i = 0; i<=99 ;i++){
    let str2 =  info.feed.entry[i].content.$t
    const li = document.createElement('li')
    dropdownList.push(li)
    li.innerHTML =`
    <li><a id="dropdown-item" class="dropdown-item" href="#">${str2.substring(str2.indexOf(": ")+2,str2.indexOf(", "))}</a></li>
    `
    dropdown.appendChild(li)

 }
}

// filter search

function filterData(searchTerm){
    dropdownList.forEach(item => {
        if(item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
            item.classList.remove('hide')
        }else{
            item.classList.add('hide')
        }
    })
}
// symbol input bar

dropdown.addEventListener('click', function(e){
    if(e.target.id == 'dropdown-item'){
        symbolInput.innerHTML = e.target.innerHTML
        symbolInput.classList.remove("hide")
    }
})
// -------- TRADING FUNCTIONS --------
function getBalance() {
   
    let tr = document.createElement('tr')
            
    tr.innerHTML = `
    <td id="td">${formatter.format(USD)}</td>
    `
    tBalance.appendChild(tr)

}

function createLedger() {

    for(let i = 0; i<=99 ;i++){
        let str2 =  info.feed.entry[i].content.$t
        
        stocks = { 
            "symbol": str2.substring(str2.indexOf(": ")+2,str2.indexOf(", ")),
            "price": str2.substring(str2.indexOf("price: ")+7,str2.indexOf(", c")),
            "amount": 0}
        
            ledger.push(stocks)
        } 

}

function updateLedgerPrice(){
    for(let i = 0; i<=99 ;i++){
    let str2 =  info.feed.entry[i].content.$t
        
    ledger[i].price = str2.substring(str2.indexOf("price: ")+7,str2.indexOf(", c"))
                
}
}

function populatePortfolio(){
    
    for(let i = 0; i<=99 ; i++){

        if(ledger[i].amount * ledger[i].price > 0.1){
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${ledger[i].symbol}</td>
                <td>${Math.round(ledger[i].amount * 10000) /10000}</td>
                <td>${formatter.format(ledger[i].amount * ledger[i].price)}</td>
            `
            tPortfolio.appendChild(tr)
        }
    }
}

function resetBalance() {
    let td = document.getElementById('td')
    td.parentNode.removeChild(td)
}

function resetPortfolio(){
    tPortfolio.innerHTML = ""
}

// STORE AND UPDATE LEDGER FUNCTIONS

function storeLedger() {
    localStorage.setItem('ledger',JSON.stringify(ledger))
    localStorage.setItem('balance',USD)
}

function updateLedger(){
    if(localStorage.getItem('ledger')){
        ledger = JSON.parse(localStorage.getItem('ledger'))
    }
    if(localStorage.getItem('balance',USD)) {
        USD = localStorage.getItem('balance')
    }
    updateLedgerPrice()
}


// Buy

function buy(){
    symbol = symbolInput.innerHTML
    let amount = Number(input.value)
    if(symbol == ""){
        alert("chose symbol to buy")
    }else if(amount > USD){
        alert("not enough balance for transaction")
        input.value = ""
    }else if(isNaN(amount) != false){
        console.log(typeof(isNaN(amount)))
        alert("please insert a valid amount") 
    }else{
    USD = USD - amount
    for(let i = 0; i<=99 ; i++){
        if(ledger[i].symbol == symbol){
            ledger[i].amount = ledger[i].amount + amount/ledger[i].price
        }
    }
    resetBalance()
    getBalance()  
    resetPortfolio() 
    populatePortfolio()
    alert(`succesfully bought ${amount} of ${symbol} stock`)
    getPValue()
    storeLedger()
    input.value = ""
    }
}

buyBtn.addEventListener('click',() => buy())

// Sell

function sell(){
    symbol = symbolInput.innerHTML
    let amount = Number(input.value)
    if(symbol == ""){
        alert("chose symbol to buy")
    }else if(isNaN(amount) != false){
        console.log(typeof(isNaN(amount)))
        alert("please insert a valid amount") 
    }else{
    
    for(let i = 0; i<=99 ; i++){
        if(ledger[i].symbol == symbol){
            if(ledger[i].amount * ledger[i].price < amount ){
                alert("not enough balance for transaction")
                input.value = ""
            
            }else if(ledger[i].amount * ledger[i].price >= amount){
                ledger[i].amount = ledger[i].amount - amount/ledger[i].price
                USD = USD + amount
                alert(`succesfully sold ${amount} of ${symbol} stock`)
            }    
        }
    }
    
    resetBalance()
    getBalance()  
    resetPortfolio() 
    populatePortfolio()
    getPValue()
    storeLedger()
    input.value = ""
    
    }
}

sellBtn.addEventListener('click',() => sell())

// Update the value of the portfolio

function getPValue() {
    
    tPValue.innerHTML = ""
    
    pValue = 0
    
    for(let i = 0; i<=99 ; i++){
    pValue = pValue + ledger[i].amount * ledger[i].price
    }

    let tr = document.createElement('tr')
            
    tr.innerHTML = `
    <td align="right" id="td">${formatter.format(pValue)}</td>
    `
    tPValue.appendChild(tr)

}



