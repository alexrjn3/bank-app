//Persoane cu acces la aplicatie
const person1 = {
    user: 'Alex',
    pin: '2222',
    balance: 250000.22,
    transfer_premium: true,
    available_loan: true,
    premium_loan: true,
    transaction: [],
    in_transactions: 0,
    out_transactions: 0,
    counterTranzactie: 0,
    loans: []
};
const person2 = {
    user: 'Mario',
    pin: '3131',
    balance: 0,
    transfer_premium: false,
    available_loan: false,
    premium_loan: false,
    transaction: [],
    in_transactions: 0,
    out_transactions: 0,
    counterTranzactie: 0,
    loans: []
};
const person3 = {
    user: 'Gigel',
    pin: '4222',
    balance: 100,
    transfer_premium: false,
    available_loan: true,
    premium_loan: false,
    transaction: [],
    in_transactions: 0,
    out_transactions: 0,
    counterTranzactie: 0,
    loans: []
};
const persons = [
    person1,
    person2,
    person3
];
let transaction_session = [];
let currentPerson;
let min = 10;
let sec = 0;
let timerDisplay;
let timerLogout;
let interest_rate = 6;
let butonLoan_setat_payLoan = false;
//let counterTranzactie = 0;
const in_trans = document.querySelector('.in-span');
const out_trans = document.querySelector('.out-span');
const loan_trans = document.querySelector('.loan-span');
function formatNumber(amount) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0
    }).format(amount);
}
const updateFooter = function(transferDa, amount) {
    // afisarea partii de jos(footer)
    let formattedNumber;
    if (transferDa) {
        currentPerson.out_transactions -= amount;
        formattedNumber = formatNumber(currentPerson.out_transactions);
        out_trans.textContent = `${formattedNumber}\u20AC`;
    } else if (butonLoan_setat_payLoan == false) {
        //gpt check again:
        const total = currentPerson.loans.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue; // Adună valorile
        }, 0); // Valoarea inițială a accumulator-ului este 0
        formattedNumber = formatNumber(total);
        loan_trans.textContent = `${formattedNumber}\u20AC`;
    } else {
        //gpt check again:
        const total = currentPerson.loans.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue; // Adună valorile
        }, 0); // Valoarea inițială a accumulator-ului este 0
        formattedNumber = formatNumber(total);
        loan_trans.textContent = `${formattedNumber}\u20AC`;
    }
};
const updateSum_Time = function(person) {
    //date
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    document.querySelector('.date-balance').textContent = `As of ${formattedDate}`;
    //balance money
    let formattedNumber = formatNumber(person.balance);
    document.querySelector('.money-balance').textContent = `${formattedNumber}\u20AC`;
};
const trans_history = function() {
    const transaction = currentPerson.transaction; //prescurtare
    for(let i = 0; i < transaction.length; i++){
        //creare elements
        const scrollable_content = document.querySelector('.scrollable-content');
        let card_history = document.createElement('div');
        card_history.className = "card-history";
        let card_history_left = document.createElement('div');
        card_history_left.className = "card-history-left";
        let counter = document.createElement('p');
        let date = document.createElement('p');
        let sum = document.createElement('p');
        if (transaction[i].type === 'WITHDRAWAL') {
            counter.textContent = `${i} WITHDRAWAL`;
            counter.style.backgroundColor = 'red';
        } else if (transaction[i].type === 'LOAN') {
            counter.textContent = `${i} LOAN`;
            counter.style.backgroundColor = 'orange';
        } else if (transaction[i].type === 'LOANPAY') {
            counter.textContent = `${i} LOAN PAY`;
            counter.style.backgroundColor = 'blue';
        } else {
            counter.textContent = `${i} DEPOSIT`;
            counter.style.backgroundColor = 'green';
        }
        counter.className = "counter";
        date.className = "date";
        date.textContent = transaction[i].date;
        sum.className = "sum";
        sum.textContent = transaction[i].formattedAmount;
        card_history_left.appendChild(counter);
        card_history_left.appendChild(date);
        card_history.appendChild(card_history_left);
        card_history.appendChild(sum);
        scrollable_content.prepend(card_history);
    }
//console.log(" currentPerson.counterTranzactie in trans_history:"+ currentPerson.counterTranzactie)
};
const init_Elements = function(person) {
    //header si hidden-class init
    document.querySelector('.starter-menu').classList.add('hidden-class');
    document.querySelector('.main-app').classList.remove('hidden-class');
    document.querySelector('.welcome-mess').textContent = `Good Afternoon, ${person.user}`;
    const hand_animation = document.createElement('span');
    hand_animation.textContent = `\u{1F590}\u{FE0F}`;
    document.querySelector(`.welcome-mess`).appendChild(hand_animation);
    hand_animation.classList.add('hand-move');
    //stergem datele scrise pe login
    document.querySelector('.user-input').value = "";
    document.querySelector('.pin-input').value = "";
    //main
    updateSum_Time(person);
    //timer afisare
    timerDisplay = setInterval(afisare_timer, 1000);
    //timer logout
    timerLogout = setTimeout(min10_logout, 600000);
    //transaction history:
    if (!currentPerson.transaction.length == 0) trans_history();
    //footer in out
    let formattedNumber;
    formattedNumber = formatNumber(currentPerson.in_transactions);
    in_trans.textContent = `${formattedNumber}\u20AC`;
    formattedNumber = formatNumber(currentPerson.out_transactions);
    out_trans.textContent = `${formattedNumber}\u20AC`;
    //gpt check again:
    const total = currentPerson.loans.reduce((accumulator, currentValue)=>{
        return accumulator + currentValue; // Adună valorile
    }, 0); // Valoarea inițială a accumulator-ului este 0
    formattedNumber = formatNumber(total);
    loan_trans.textContent = `${formattedNumber}\u20AC`;
    document.querySelector('.interest-span').textContent = `${interest_rate}%`;
};
//Login event
const login = document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    const login_user = document.querySelector('.user-input').value;
    const login_pin = document.querySelector('.pin-input').value;
    for(let i = 0; i < persons.length; i++)if (login_user === persons[i].user && login_pin === persons[i].pin) {
        //console.log("Ai intrat");
        currentPerson = persons[i];
        init_Elements(persons[i]);
        const errorMessage = document.querySelector('.login-error');
        errorMessage.classList.add('hidden-class');
        errorMessage.textContent = "";
        break;
    } else {
        //console.log("User sau pin gresit");
        const errorMessage = document.querySelector('.login-error');
        errorMessage.classList.remove('hidden-class');
        errorMessage.innerHTML = "Wrong <strong>USER</strong> or <strong>PIN</strong>";
        //TODO afisarea corecta a mesajului in orice situatie
        login_user === "" || login_pin;
    }
});
const logoutf = function() {
    document.querySelector('.starter-menu').classList.remove('hidden-class');
    document.querySelector('.main-app').classList.add('hidden-class');
    clearTimeout(timerLogout);
    clearInterval(timerDisplay);
    min = 10;
    sec = 0;
    document.querySelector('.timer').textContent = "10:00";
    //counterTranzactie = 0; //ne mai trb acum ca fiecare are counterTranzactie al lor?
    currentPerson.transaction.push(...transaction_session);
    transaction_session = [];
    //TODO:la logoutof toate datele din tabla le stocam intr-un array, apoi le stergem. probabil ne trb si la intrare
    //in cont un if(exista date in array? atunci nu ai nici-o tranzactie : inseamna ca ai date si le afisam(continuam de udne am ramas))
    const scrollable_content = document.querySelector('.scrollable-content');
    while(scrollable_content.firstChild)scrollable_content.removeChild(scrollable_content.firstChild);
    //erori display hidden cand se iese din logout
    // PROBABIL O SA FAC O FUNCTIE DE EXIT-ELEMENTS, ca si la init_elemetns la login
    document.querySelector('.wrong-cred-loan').classList.add('hidden-class');
    document.querySelector('.wrong-cred-loan').textContent = "";
    const sortbuton = document.querySelector('.sort');
    sortbuton.classList.remove('font-size-sort1');
    scrollable_content.classList.remove('animation-sort1');
    scrollable_content.offsetWidth; // Trigger reflow
    sortbuton.classList.add('font-size-sort2');
    sortbuton.innerHTML = "&darr; SORT";
};
//Logout event
const logout = document.querySelector('.logout').addEventListener('click', logoutf);
const get_date = function() {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
};
const updateHistory = function(transferDa, amount) {
    const scrollable_content = document.querySelector('.scrollable-content');
    let card_history = document.createElement('div');
    card_history.className = "card-history";
    let card_history_left = document.createElement('div');
    card_history_left.className = "card-history-left";
    let counter = document.createElement('p');
    counter.className = "counter";
    counter.textContent = `${currentPerson.counterTranzactie} ${transferDa == true ? 'WITHDRAWAL' : 'LOAN'}`;
    counter.style.backgroundColor = `${transferDa ? "red" : butonLoan_setat_payLoan ? "blue" : "orange"}`;
    let date = document.createElement('p');
    date.className = "date";
    date.textContent = get_date();
    //console.log("currentPerson.counterTranzactie in updateHistory:"+currentPerson.counterTranzactie);
    let sum = document.createElement('p');
    sum.className = "sum";
    //pt withdraw
    let formattedNumber = formatNumber(amount);
    let minusformattedNumber = '-' + String(formattedNumber);
    //pt loan:
    let amount_loan = amount + amount * (interest_rate / 100) * 1; //1 reprz timp= lasam default 1 an
    let formattedNumberLoan = formatNumber(amount_loan);
    let minusformattedNumberLoan = '-' + String(formattedNumberLoan);
    sum.textContent = `${transferDa ? minusformattedNumber : butonLoan_setat_payLoan ? minusformattedNumberLoan : formattedNumber}\u20AC`;
    card_history_left.appendChild(counter);
    card_history_left.appendChild(date);
    card_history.appendChild(card_history_left);
    card_history.appendChild(sum);
    scrollable_content.prepend(card_history);
    let transaction = {
        type: transferDa ? 'WITHDRAWAL' : butonLoan_setat_payLoan ? 'LOANPAY' : 'LOAN',
        formattedAmount: `${transferDa ? minusformattedNumber : butonLoan_setat_payLoan ? minusformattedNumberLoan : formattedNumber}\u20AC`,
        date: get_date()
    };
    transaction_session.push(transaction); //asa?
    currentPerson.counterTranzactie++;
};
const transferReusit = function(transferToPerson, amount_transfer) {
    transferToPerson.balance += amount_transfer;
    transferToPerson.in_transactions += amount_transfer;
    //console.log("transferToPerson.in_trans in transferReusit:"+ transferToPerson.in_transactions);
    let transaction = {
        type: 'DEPOSIT',
        formattedAmount: `${formatNumber(amount_transfer)}\u20AC`,
        date: get_date()
    };
    //console.log("transferToPerson.user in transferReusit:"+transferToPerson.user);
    transferToPerson.counterTranzactie++;
    //console.log("currentPerson.counterTranzactie:"+currentPerson.counterTranzactie);
    //console.log("transferToPerson.counterTranzactie in transferReusit:"+transferToPerson.counterTranzactie);
    transferToPerson.transaction.push(transaction);
    currentPerson.balance -= amount_transfer;
    //TODO: o functie pt transfer si loan...se repeta multe lucruri DRY
    updateSum_Time(currentPerson);
    updateHistory(true, amount_transfer); //cand facem logout keep table data, ar trebui sa trimitem si persoana
    updateFooter(true, amount_transfer);
};
//Transfer money
const transfer_money = document.querySelector('.transfer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    //reset creds:
    document.querySelector('.wrong-cred').textContent = "";
    document.querySelector('.wrong-cred').classList.add('hidden-class');
    const transfer_person = document.querySelector('.transfer-input').value;
    const amount_transfer = parseFloat(document.querySelector('.amount-input').value);
    let wrongPerson1 = 1;
    if (transfer_person == currentPerson.user) {
        document.querySelector('.wrong-cred').textContent = "You cant transfer yourself money!";
        document.querySelector('.wrong-cred').classList.remove('hidden-class');
        return;
    }
    for(let i = 0; i < persons.length; i++)if (transfer_person === persons[i].user) {
        if (amount_transfer < 3000) {
            transferReusit(persons[i], amount_transfer);
            wrongPerson1 = 0;
            break;
        } else if (currentPerson.transfer_premium === false) {
            let formattedNumber = formatNumber(3000);
            document.querySelector('.wrong-cred').textContent = `You dont have premium transfer! Amount has to be lower then ${formattedNumber}\u20AC`;
            document.querySelector('.wrong-cred').classList.remove('hidden-class');
            wrongPerson1 = 0;
            break;
        } else {
            transferReusit(persons[i], amount_transfer);
            wrongPerson1 = 0;
            break;
        }
    }
    if (wrongPerson1 === 1) {
        document.querySelector('.wrong-cred').textContent = "Wrong account user! Try again.";
        document.querySelector('.wrong-cred').classList.remove('hidden-class');
    }
    document.querySelector('.transfer-input').value = "";
    document.querySelector('.amount-input').value = "";
});
const updateDropbox = function() {
    console.log("a intrat in updateDropbox");
    //update la dropbox:
    const loanForm = document.querySelector(".loan-form");
    const dropboxActual = document.querySelector(".options-loans");
    loanForm.removeChild(dropboxActual);
    const options = document.createElement("select");
    options.className = "options-loans";
    console.log("currentPerson.loans.length:" + currentPerson.loans.length);
    console.log("currentPerson.loans:" + currentPerson.loans);
    for(let i = 0; i < currentPerson.loans.length; i++){
        let value = document.createElement("option");
        value.value = currentPerson.loans[i];
        value.text = "" + currentPerson.loans[i];
        options.appendChild(value);
    }
    loanForm.prepend(options);
    console.log("currentPerson.loans.length dupa:" + currentPerson.loans.length);
    console.log("currentPerson.loans: dupa" + currentPerson.loans);
    if (currentPerson.loans.length === 0) {
        document.querySelector('.wrong-cred-loan').classList.remove("hidden-class");
        document.querySelector('.wrong-cred-loan').textContent = "All loans paid";
    }
};
//Loan money
const loan_money = document.querySelector('.loan-form').addEventListener('submit', function(e) {
    e.preventDefault();
    //reset the p error:
    document.querySelector('.wrong-cred-loan').textContent = "";
    document.querySelector('.wrong-cred-loan').classList.add('hidden-class');
    let loan_amount;
    if (butonLoan_setat_payLoan == false) loan_amount = parseFloat(document.querySelector('.amount-input-loan').value);
    else loan_amount = parseFloat(document.querySelector('.options-loans').value);
    if (!isNaN(loan_amount)) {
        if (currentPerson.available_loan) {
            if (currentPerson.premium_loan) {
                if (butonLoan_setat_payLoan == false) {
                    currentPerson.balance += loan_amount;
                    currentPerson.loans.push(loan_amount);
                } else {
                    currentPerson.balance -= loan_amount + loan_amount * (interest_rate / 100) * 1; //1 reprz timp= lasam default 1 an
                    const index = currentPerson.loans.indexOf(loan_amount);
                    currentPerson.loans.splice(index, 1);
                    console.log("loan_amount:" + loan_amount + "si interest_rate:" + interest_rate);
                    updateDropbox();
                }
                updateSum_Time(currentPerson);
                updateHistory(false, loan_amount);
                updateFooter(false, loan_amount);
            } else if (loan_amount > 1500) {
                let formattedNumber = formatNumber(loan_amount);
                document.querySelector('.wrong-cred-loan').textContent = `Loan not premium! Can't deposit more then ${formattedNumber}\u20AC`;
                document.querySelector('.wrong-cred-loan').classList.remove('hidden-class');
            } else {
                if (butonLoan_setat_payLoan == false) {
                    currentPerson.balance += loan_amount;
                    currentPerson.loans.push(loan_amount);
                } else {
                    currentPerson.balance -= loan_amount + loan_amount * (interest_rate / 100) * 1; //1 reprz timp= lasam default 1 an
                    const index = currentPerson.loans.indexOf(loan_amount);
                    currentPerson.loans.splice(index, 1);
                    updateDropbox();
                }
                updateSum_Time(currentPerson);
                updateHistory(false, loan_amount);
                updateFooter(false, loan_amount);
            }
        } else {
            document.querySelector('.wrong-cred-loan').textContent = "Loan not available for you!";
            document.querySelector('.wrong-cred-loan').classList.remove('hidden-class');
        }
        const amountInputLoan = document.querySelector('.amount-input-loan');
        if (amountInputLoan) amountInputLoan.value = ""; // Clear the value
    } else {
        document.querySelector('.wrong-cred-loan').classList.remove("hidden-class");
        document.querySelector('.wrong-cred-loan').textContent = "No Loan exists";
    }
});
let close_user, close_pin;
//Close money
const close_acc = document.querySelector('.close-form').addEventListener('submit', function(e) {
    e.preventDefault();
    close_user = document.querySelector('.close-confirm').value;
    close_pin = document.querySelector('.close-pin').value;
    let wrongPerson1 = 1;
    //delete
    for(let i = 0; i < persons.length; i++)if (close_user === persons[i].user && close_pin === persons[i].pin) {
        wrongPerson1 = 0;
        document.querySelector('.wrong-cred-close').textContent = "";
        document.querySelector('.wrong-cred-close').classList.add('hidden-class');
        confirm_button = document.querySelector('.confirm-close').classList.remove('hidden-class');
        break;
    }
    if (wrongPerson1 === 1) {
        document.querySelector('.wrong-cred-close').textContent = "Wrong user or pin!";
        document.querySelector('.wrong-cred-close').classList.remove('hidden-class');
    }
});
const confirm_close_acc = document.querySelector('.confirm-close').addEventListener('click', function(e) {
    for(let i = 0; i < persons.length; i++)if (close_user === persons[i].user && close_pin === persons[i].pin) {
        persons.splice(i, 1);
        wrongPerson = 0;
        logoutf();
        document.querySelector('.close-confirm').value = "";
        document.querySelector('.close-pin').value = "";
        document.querySelector('.confirm-close').classList.add('hidden-class');
        document.querySelector('.login-error').textContent = `Your ${currentPerson.user} account has been deleted!`;
        document.querySelector('.login-error').classList.remove('hidden-class');
    }
});
//Logout every 10min
function min10_logout() {
    logoutf();
    document.querySelector('.login-error').textContent = "10 minutes passed. You have been logged out!";
    document.querySelector('.login-error').classList.remove('hidden-class');
    clearTimeout(timerLogout);
}
function afisare_timer() {
    if (sec === 0) {
        if (min > 0) {
            min--;
            sec = 59;
        } else {
            clearInterval(timerDisplay);
            return;
        }
    } else sec--;
    let secFormatted = sec < 10 ? '0' + sec : sec;
    document.querySelector('.timer').textContent = `${min}:${secFormatted}`;
}
///sort button
const sortbtn = document.querySelector('.sort').addEventListener('click', function() {
    const scrollable_content = document.querySelector('.scrollable-content');
    const sortbuton = document.querySelector('.sort');
    let aux = [];
    for(let i = scrollable_content.children.length - 1; i >= 0; i--)aux.push(scrollable_content.children[i]);
    for(let i = 0; i < aux.length; i++)scrollable_content.appendChild(aux[i]);
    if (scrollable_content.classList.contains('animation-sort1')) {
        sortbuton.classList.remove('font-size-sort1');
        scrollable_content.classList.remove('animation-sort1');
        scrollable_content.offsetWidth; // Trigger reflow
        scrollable_content.classList.add('animation-sort2');
        sortbuton.classList.add('font-size-sort2');
        sortbuton.innerHTML = "&darr; SORT";
    } else {
        sortbuton.classList.remove('font-size-sort2');
        scrollable_content.classList.remove('animation-sort2');
        scrollable_content.offsetWidth; // Trigger reflow
        scrollable_content.classList.add('animation-sort1');
        sortbuton.classList.add('font-size-sort1');
        sortbuton.innerHTML = "&uarr; SORT";
    }
});
const payloan = document.querySelector('.pay-loan').addEventListener('click', function() {
    const loanForm = document.querySelector(".loan-form");
    const deleteInput = document.querySelector('.amount-input-loan');
    const options = document.createElement("select");
    if (document.querySelector('.pay-loan').textContent === "Pay Loan") {
        const paragraphLoan = document.querySelector('.loan-m');
        paragraphLoan.textContent = "Pay Loan";
        const loan = document.querySelector('.loan');
        document.querySelector('.pay-loan').textContent = "Request Loan";
        butonLoan_setat_payLoan = true;
        //modificam(stergem) input type text intr-un dropdown list cu loans ale currentPerson
        loanForm.removeChild(deleteInput);
        options.className = "options-loans";
        //aici va trb for
        for(let i = 0; i < currentPerson.loans.length; i++){
            let value = document.createElement("option");
            value.value = currentPerson.loans[i];
            value.text = "" + currentPerson.loans[i];
            options.appendChild(value);
        }
        loanForm.prepend(options);
    } else {
        butonLoan_setat_payLoan = false;
        document.querySelector('.wrong-cred-loan').classList.add("hidden-class");
        document.querySelector('.wrong-cred-loan').textContent = "";
        console.log("else");
        console.log("document.querySelector('.pay-loan').textContent " + document.querySelector('.pay-loan').textContent);
        const paragraphLoan = document.querySelector('.loan-m');
        console.log("document.querySelector('.pay-loan').textContent " + document.querySelector('.pay-loan').textContent);
        paragraphLoan.textContent = "Request Loan";
        const loan = document.querySelector('.loan');
        document.querySelector('.pay-loan').textContent = "Pay Loan";
        //adaugam inapoi input type text
        const loanForm2 = document.querySelector(".loan-form");
        const options_loans = document.querySelector(".options-loans");
        loanForm2.removeChild(options_loans);
        const inputLoan = document.createElement("input");
        inputLoan.className = "amount-input-loan";
        inputLoan.type = "text";
        inputLoan.placeholder = "Amount";
        loanForm2.prepend(inputLoan);
    }
});

//# sourceMappingURL=bank_last_vers.c36f364e.js.map
