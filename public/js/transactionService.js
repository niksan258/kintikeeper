import BankAccountService from "./bankAccountService.js";
import BaseFirestoreService from "./baseFirestoreService.js";

class TransactionService extends BaseFirestoreService {
    constructor() {
        super("transactions");
    }

    async getTransactionsForAccount(accountId, lastVisibleDoc = null, pageSize = null) {
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

    async deleteTransaction(transactionId)
    {
        return this.deleteDocument(transactionId)
    }

    async deleteAllTransactionsForAccount(accountId)
    {
        const transactions = await this.getTransactionsForAccount(accountId)

        if(!transactions.empty)
        {
            transactions.documents.forEach(async transaction => {
                console.log(transaction.id)
                 await this.deleteTransaction(transaction.id)
            });
        }
    }
}

export default TransactionService;