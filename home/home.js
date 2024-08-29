import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "../js/firebaseinit.js";
import BankAccountService from "../js/bankAccountService.js";
import TransactionService from "../js/transactionService.js";

const bankAccountService = new BankAccountService();
const transactionService = new TransactionService();

// bank accounts
const renderBankAccountTile = (account) => {
    return `
        <div class="account-tile">
            <div class="balance">
                <span class="label">Balance:</span>
                <span class="amount">€${account.Balance.toFixed(2)}</span>
            </div>
            <div class="currency">
                <span class="label">Currency:</span>
                <span class="value">${account.Currency === 0 ? 'EUR' : account.Currency}</span>
            </div>
            <div class="iban">
                <span class="label">IBAN:</span>
                <span class="value">${account.IBAN}</span>
            </div>
        </div>
    `;
};

const fetchAndRenderBankAccounts = async (userId) => {
    try {
        const bankAccounts = (await bankAccountService.getBankAccountsByUser(userId)).documents;

        const container = document.querySelector('.bank-accounts');
        container.innerHTML = ''; // Clear any existing content
        console.log(bankAccounts)

        bankAccounts.forEach(account => {
            container.innerHTML += renderBankAccountTile(account);
        });
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
    }
};

//transactions

const TransactionTypes = {
    0: 'Grocery',
    1: 'Transport',
    2: 'Utilities',
    3: 'Entertainment',
    4: 'Dining',
};

const CurrencyTypes= {
    0: 'EUR',
    1: 'USD',
    2: 'BGN',
}

const renderTransactionRow = (transaction, iban) => {
    return `
        <tr>
            <td>${transaction.title}</td>
            <td>${TransactionTypes[transaction.type]}</td>
            <td>${iban.slice(0, 2)}****${iban.slice(-3)}</td> 
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${CurrencyTypes[transaction.currency]}</td> 
            <td>${transaction.timestamp.toDate().toLocaleDateString('en-GB', {
                day: '2-digit', 
                month: 'short', 
                year: 'numeric'
            })}</td>
        </tr>
    `;
};


const fetchAndRenderTransactions = async (userId) => {
    try {
        // Fetch transactions by user
        const transactions = (await transactionService.getLatestTransactionsForUser(userId)).documents;

        const tbody = document.querySelector('.table-container tbody');
        tbody.innerHTML = ''; // Clear any existing content

        for (const transaction of transactions) {

            const iban = (await bankAccountService.getBankAccountById(transaction.bankAccountId)).IBAN;
            tbody.innerHTML += renderTransactionRow(transaction, iban);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.querySelector('.userEmail').textContent = user.email;
            fetchAndRenderBankAccounts(user.uid)
            fetchAndRenderTransactions(user.uid)

            const transaction = {
                amount: 75, // Example amount, you can change this to any number
                bankAccountId: "636RmOAtsYnNBkAGVviz", // Unchanged
                currency: 1, // Example currency code, adjust to your needs
                timestamp: new Date("August 12, 2024 19:29:42 GMT+0300"), // Example timestamp, adjust as needed
                title: "Got food", // Example title, adjust as needed
                type: 3, // Example type code, adjust to your needs
                userId: "zM7v3bTGZke5U2ahcA9qZYUZabf1" // Unchanged
            };

            // transactionService.addTransaction(transaction)
        } else {
            window.location.href = '../auth/auth.html';
        }
    });
};

window.logOut = () => {
    auth.signOut().then(() => {
        window.location.href = "../auth/auth.html"
    })
}