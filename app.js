
let totalBalance = 0;
let incomeBalance = 0;
let expenseBalance = 0;
let transactions = [];


const balanceElement = document.querySelector('.balance');
const incomeElement = document.querySelector('.income');
const expenseElement = document.querySelector('.expense');
const transactionForm = document.querySelector('form');
const transactionNameInput = document.querySelector('input[name="name"]');
const transactionAmountInput = document.querySelector('input[name="amount"]');
const transactionDateInput = document.querySelector('input[name="date"]');
const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');

// load in local storage:
function loadTransactions() {
    const transactionsData = JSON.parse(localStorage.getItem('transactions'));
    if (transactionsData) {
        transactions = transactionsData;
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                incomeBalance += transaction.amount;
            } else {
                expenseBalance += transaction.amount;
            }
        });
        totalBalance = incomeBalance - expenseBalance;
    }
}

// Save in local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// update the screen
function updateBalanceDisplay() {
    balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
    incomeElement.textContent = `$${incomeBalance.toFixed(2)}`;
    expenseElement.textContent = `$${expenseBalance.toFixed(2)}`;
}

// add transaction
function addTransaction(event) {
    event.preventDefault(); 
    const name = transactionNameInput.value;
    const amount = parseFloat(transactionAmountInput.value);
    const date = transactionDateInput.value;
    const type = document.getElementById('type').checked ? 'income' : 'expense';

    // all inpute are valid
    if (name.trim() === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Add transaction
    const transaction = {
        id: Date.now(),
        name,
        amount,
        date,
        type
    };

    transactions.push(transaction);

    if (type === 'income') {
        incomeBalance += amount;
    } else {
        expenseBalance += amount;
    }
    totalBalance = incomeBalance - expenseBalance;

    // Save transactions, update display
    saveTransactions();
    updateBalanceDisplay();
    renderTransactions();
}


function renderTransactions() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.name}: $${transaction.amount.toFixed(2)} (${transaction.date})`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));
        listItem.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editTransaction(transaction));
        listItem.appendChild(editButton);

        if (transaction.type === 'income') {
            incomeList.appendChild(listItem);
        } else {
            expenseList.appendChild(listItem);
        }
    });
}

// delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    loadTransactions();
    renderTransactions();
}

// edit transaction
function editTransaction(transaction) {
    const newName = prompt('Enter new name:', transaction.name);
    const newAmount = parseFloat(prompt('Enter new amount:', transaction.amount));
    const newDate = prompt('Enter new date:', transaction.date);

    if (newName !== null && newAmount !== null && newDate !== null) {
        const index = transactions.findIndex(t => t.id === transaction.id);
        transactions[index].name = newName.trim() !== '' ? newName : transaction.name;
        transactions[index].amount = !isNaN(newAmount) && newAmount > 0 ? newAmount : transaction.amount;
        transactions[index].date = newDate.trim() !== '' ? newDate : transaction.date;

        
        if (transaction.type === 'income') {
            incomeBalance -= transaction.amount;
            incomeBalance += transactions[index].amount;
        } else {
            expenseBalance -= transaction.amount;
            expenseBalance += transactions[index].amount;
        }
        totalBalance = incomeBalance - expenseBalance;

        saveTransactions();
        updateBalanceDisplay();
        renderTransactions();
    }
}


loadTransactions();
renderTransactions();
updateBalanceDisplay();


transactionForm.addEventListener('submit', addTransaction);
