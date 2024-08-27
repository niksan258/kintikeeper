import BaseFirestoreService from "./baseFirestoreService.js";

class BankAccountService extends BaseFirestoreService {
    constructor() {
        super("bankaccounts");
    }

    async getBankAccountsByUser(userId, lastVisibleDoc = null, pageSize = 10) {
        const filter = { field: "userId", operator: "==", value: userId };
        return this.getDocuments(filter, lastVisibleDoc, pageSize);
    }

    async addBankAccount(data) {
        return this.addDocument(data);
    }

    async updateBankAccount(accountId, updatedData) {
        return this.updateDocument(accountId, updatedData);
    }

    async deleteBankAccount(accountId) {
        return this.deleteDocument(accountId);
    }
}

export default BankAccountService;