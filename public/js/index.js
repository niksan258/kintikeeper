import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "./firebaseinit.js";
import BankAccountService from "./bankAccountService.js";
import TransactionService from "./transactionService.js";

const bankAccountService = new BankAccountService();
const transactionService = new TransactionService();

// Handle user authentication state
window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("userEmail").textContent = user.email;
            localStorage.uid = user.uid;
            fetchAndRenderBankAccounts(user.uid);
            fetchAndRenderTransactions(user.uid);
        } else {
            localStorage.uid = null;
            window.location.href = './auth.html';
        }
    });
};

// Log out function
window.logOut = () => {
    auth.signOut().then(() => {
        window.location.href = "./auth.html";
    });
};

// Fetch and render bank accounts
const fetchAndRenderBankAccounts = async (userId) => {
    try {
        const bankAccounts = (await bankAccountService.getBankAccountsByUser(userId)).documents;
        const container = document.getElementById('accountList');
        container.innerHTML = ''; // Clear any existing content

        bankAccounts.forEach(account => {
            const accountTileHTML = renderBankAccountTile(account);

            // Create a temporary container to parse the newly added tile
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = accountTileHTML;
            const accountTile = tempContainer.firstElementChild;

            // Add the event listener to the account tile
            accountTile.addEventListener('click', () => {
                openAccountDetailsModal(account);
            });

            container.appendChild(accountTile);
        });
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
    }
};

// Render a single bank account tile
const renderBankAccountTile = (account) => {
    return `
        <div class="account-tile" data-account-id="${account.id}">
            <div class="balance">
                <span class="label">Balance:</span>
                <span class="amount">${CurrencyTypes[account.currency].sign + ' ' + account.balance.toFixed(2)}</span>
            </div>
            <div class="currency">
                <span class="label">Currency:</span>
                <span class="value">${CurrencyTypes[account.currency].text}</span>
            </div>
            <div class="iban">
                <span class="label">IBAN:</span>
                <span class="value">${account.iban}</span>
            </div>
        </div>
    `;
};

// Fetch and render transactions for a specific account
const fetchAndRenderAccountTransactions = async (accountId) => {
    try {
        const transactions = (await transactionService.getTransactionsForAccount(accountId, null, 5)).documents;
        const tbody = document.getElementById("transactionTableBody");
        tbody.innerHTML = ''; // Clear any existing content

        transactions.forEach(transaction => {
            tbody.innerHTML += renderTransactionRow(transaction, null);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Fetch and render transactions for the user
const fetchAndRenderTransactions = async (userId) => {
    try {
        const transactions = (await transactionService.getLatestTransactionsForUser(userId, 5)).documents;
        console.log("found" + transactions)
        const tbody = document.querySelector('.table-container tbody');
        tbody.innerHTML = ''; // Clear any existing content

        for (const transaction of transactions) {
            const account = await bankAccountService.getBankAccountById(transaction.bankAccountId);
            tbody.innerHTML += renderTransactionRow(transaction, account.iban);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Render a single transaction row
const renderTransactionRow = (transaction, iban) => {
    return `
        <tr>
            <td>${transaction.title}</td>
            <td>${TransactionTypes[transaction.type]}</td>
            ${iban == null || iban == "" ? "" : "<td>" + iban.slice(0, 2) + "****" + iban.slice(-3) + "</td>"}
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${CurrencyTypes[transaction.currency].text}</td>
            <td>${transaction.createdAt.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })}</td>
        </tr>
    `;
};

// Define transaction types and currencies
const TransactionTypes = {
    0: 'Grocery',
    1: 'Transport',
    2: 'Utilities',
    3: 'Entertainment',
    4: 'Dining',
};

const CurrencyTypes = {
    0: {
        text: 'EUR',
        sign: '€',
    },
    1: {
        text: 'USD',
        sign: '$',
    },
    2: {
        text: 'BGN',
        sign: 'лв',
    },
};


// Modals logic  -------------------------
const accountDetailsModal = document.getElementById("accountDetailsModal");
const closeAccountDetailsModalBtn = accountDetailsModal.querySelector(".close");

const addAccountModal = document.getElementById("addAccountModal");
const closeAddAccountModalBtn = addAccountModal.querySelector(".close");

const addAccountTile = document.querySelector(".add-account-tile");

// Hanle add bank account
document.getElementById("addAccountForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const balance = parseFloat(document.getElementById("balance").value);
    const currency = parseInt(document.getElementById("currency").value);

    try {
        await bankAccountService.addBankAccount({
            balance: balance,
            currency: currency,
            iban: generateRandomIBAN(),
            userId: auth.currentUser.uid
        });

        fetchAndRenderBankAccounts(auth.currentUser.uid);
        addAccountModal.style.display = "none";
    } catch (error) {
        console.error('Error adding new account:', error);
    }
});

const generateRandomIBAN = () => {
    return 'BG' + Math.random().toString().slice(2, 36);
}

// set when opening modal
let currentAccountId = null;

// Hanle deleting account
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    try {
        await bankAccountService.deleteBankAccount(currentAccountId);
        fetchAndRenderBankAccounts(auth.currentUser.uid);
        accountDetailsModal.style.display = "none";
        confirmModal.style.display = "none";
    } catch (error) {
        console.error('Error deleting account:', error);
    }
});

// Modals visibility ------------------------------
function openAccountDetailsModal(account) {
    document.getElementById('modalBalance').textContent = `€${account.balance.toFixed(2)}`;
    document.getElementById('modalCurrency').textContent = account.currency === 0 ? 'EUR' : account.currency;
    document.getElementById('modalIBAN').textContent = account.iban;

    currentAccountId = account.id;
    console.log(account.id)

    fetchAndRenderAccountTransactions(account.id);
    accountDetailsModal.style.display = "block";
}

// Close account details modal
closeAccountDetailsModalBtn.addEventListener("click", () => {
    accountDetailsModal.style.display = "none";
    currentAccountId = null;
});

// Open modal when 'Create Account' tile is clicked
addAccountTile.addEventListener("click", () => {
    addAccountModal.style.display = "block";
});

// Close modal when 'X' is clicked
closeAddAccountModalBtn.addEventListener("click", () => {
    addAccountModal.style.display = "none";
});

const confirmModal = document.getElementById('confirmationModal');
const closeConfirmModalIcon = document.getElementById('closeConfirmationModal');
const closeConfirmModalButton = document.getElementById('cancelDeleteButton');
const deleteAccountButton = document.getElementById('deleteAccountButton');
deleteAccountButton.addEventListener('click', () => {
    confirmModal.style.display = 'block'
    accountDetailsModal.style.display = 'none'});

closeConfirmModalIcon.addEventListener('click', () => confirmModal.style.display = 'none');
closeConfirmModalButton.addEventListener('click', () => {
    confirmModal.style.display = 'none'
    accountDetailsModal.style.display = 'block'});

window.addEventListener("click", (event) => {
    if (event.target === accountDetailsModal
        || event.target === addAccountModal
        || event.target === confirmationModal
        || event.target === createTransactionModal) {

        accountDetailsModal.style.display = "none";
        addAccountModal.style.display = "none";
        confirmModal.style.display = "none";
        createTransactionModal.style.display = "none";
    }});

// Add references to the new modal and form elements
const createTransactionModal = document.getElementById("createTransactionModal");
const closeCreateTransactionModalBtn = createTransactionModal.querySelector(".close");
const createTransactionButton = document.getElementById("createTransactionButton");
const createTransactionForm = document.getElementById("createTransactionForm");

// Handle opening and closing the Create Transaction modal
const openCreateTransactionModal = () => {
    accountDetailsModal.style.display = "none"
    createTransactionModal.style.display = "block";
};

// Close the Create Transaction modal
closeCreateTransactionModalBtn.addEventListener("click", () => {
    accountDetailsModal.style.display = "block"
    createTransactionModal.style.display = "none";
});

// Handle the creation of a new transaction
createTransactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("transactionTitle").value;
    const type = parseInt(document.getElementById("transactionType").value);
    const amount = parseFloat(document.getElementById("transactionAmount").value);
    const currency = parseInt(document.getElementById("transactionCurrency").value);

    try {
        const transaction = {
            title,
            type,
            amount,
            currency,
            bankAccountId: currentAccountId, // Add reference to the account
            userId: localStorage.uid
        };

        await transactionService.addTransaction(transaction);

        fetchAndRenderAccountTransactions(currentAccountId); // Refresh transactions
        createTransactionModal.style.display = "none";
        accountDetailsModal.style.display = "block"

    } catch (error) {
        console.error('Error creating transaction:', error);
    }
});

// Show Create Transaction modal
document.getElementById('createTransactionButton').addEventListener('click', openCreateTransactionModal);
