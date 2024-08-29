import BaseFirestoreService from "./baseFirestoreService.js";
import TransactionService from "./transactionService.js";

class BankAccountService extends BaseFirestoreService {
    constructor() {
        super("bankaccounts");
        this.transactionService = new TransactionService()
    }

    async getBankAccountsByUser(userId, lastVisibleDoc = null, pageSize = null) {
        const filter = { field: "userId", operator: "==", value: userId };
        return this.getDocuments(filter, lastVisibleDoc, pageSize);
    }

    getBankAccountById = async (id) => this.getDocumentById(id);

    addBankAccount = async (data) => this.addDocument(data);

    updateBankAccount = async (updatedData) => this.updateDocument(updatedData);

    deleteBankAccount = async (accountId) => {
        
        await this.transactionService.deleteAllTransactionsForAccount(accountId);

        return this.deleteDocument(accountId);
    }
}

export default BankAccountService;