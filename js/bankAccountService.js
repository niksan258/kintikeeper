import BaseFirestoreService from "./baseFirestoreService.js";

class BankAccountService extends BaseFirestoreService {
    constructor() {
        super("bankaccounts");
    }

    async getBankAccountsByUser(userId, lastVisibleDoc = null, pageSize = 10) {
        const filter = { field: "userId", operator: "==", value: userId };
        return this.getDocuments(filter, lastVisibleDoc, pageSize);
    }

    getBankAccountById = async (id) => this.getDocumentById(id);

    addBankAccount = async (data) => this.addDocument(data);

    updateBankAccount = async (updatedData) => this.updateDocument(updatedData);

    deleteBankAccount = async (accountId) => this.deleteDocument(accountId);
}

export default BankAccountService;