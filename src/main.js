const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    };
};

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    };

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    };

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        };

        console.log('BLOCK MINED: ' + this.hash);
    };
};


class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    };

    createGenesisBlock() {
        return new Block(Date.parse('01/01/2019'), [], '0');
    };

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    };

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // };

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('BLOCK SUCCESSFULY MINED!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    };

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    };

    getBalanceofAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address)
                    balance -= trans.amount;

                if (trans.toAddress === address)
                    balance += trans.amount;
            };
        };

        return balance;
    };

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if (currentBlock.previousHash !== previousBlock.hash)
                return false;
        };

        return true;
    };
};

let coin = new BlockChain();

coin.createTransaction(new Transaction('address1', 'address2', 100));
coin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting transaction...');
coin.minePendingTransactions('luc-address');

console.log('\nBalance of luc is ', coin.getBalanceofAddress('luc-address'));

console.log('\nStarting transaction again...');
coin.minePendingTransactions('luc-address');

console.log('\nBalance of luc is ', coin.getBalanceofAddress('luc-address'));

console.log(JSON.stringify(coin, null, 4));