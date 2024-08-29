import BankAccountService from "./bankAccountService.js";
import BaseFirestoreService from "./baseFirestoreService.js";

class TransactionService extends BaseFirestoreService {
    constructor() {
        super("transactions");
        this.bankAccountService = new BankAccountService();
    }

    async getTransactionsForAccount(accountId, lastVisibleDoc = null, pageSize = 10) {
        const filter = { field: "bankAccountId", operator: "==", value: accountId };
        return this.getDocuments(filter, lastVisibleDoc, pageSize);
    }

    async getLatestTransactionsForUser(userId, pageSize = 10) {

        const filter = { field: "userId", operator: "==", value: userId };
        return  this.getDocuments(filter, null, pageSize);
    }

    // TODO
    async addTransaction(data) {
        return this.addDocument(data);
    }
}

export default TransactionService;