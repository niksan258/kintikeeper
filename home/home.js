import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "../services/firebaseinit.js";
import BankAccountService from "../services/bankAccountService.js";

const bankAccountService = new BankAccountService();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await bankAccountService.getBankAccountsByUser(user.uid)
            .then((accounts) => accounts.documents.forEach(acc => {
                console.log(acc)
            }))}

    //     const bankAccount = {
    //         id: 'i1YQ35FNLAI3LVjvThlD',
    //         IBAN: 'DE89 3704 0044 0532 0130 00',
    //         Currency: 0, // Assuming '0' represents a specific currency code or type
    //         Balance: 1234,
    //         userId: 'zM7v3bTGZke5U2ahcA9qZYUZabf1'
    //     };

    //     await bankAccountService.addBankAccount(bankAccount)
    // }

});

window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.querySelector('.userEmail').textContent = user.email;
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