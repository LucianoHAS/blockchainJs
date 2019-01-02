const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    };

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    };
};


class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    };

    createGenesisBlock() {
        return new Block(0, '01/01/2019', 'Genesis block', '0');
    };

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    };

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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

// Teste
let coin = new BlockChain();

// Inclusão de novos blocos
coin.addBlock(new Block(1, '02/01/2019', { saldo: 10 }));
coin.addBlock(new Block(1, '03/01/2019', { saldo: 40 }));
console.log('Is block chain valid? ' + coin.isChainValid());

// Alteração do valor de um bloco depois de incluído
coin.chain[1].data = { saldo: 200 };
console.log('Is block chain valid? ' + coin.isChainValid());

// Recalculo do hash depois de alterado o valor do bloco
coin.chain[1].hash = coin.chain[1].calculateHash();
console.log('Is block chain valid? ' + coin.isChainValid());

// Alteração do bloco para o valor original
coin.chain[1].data = { saldo: 10 };
console.log('Is block chain valid? ' + coin.isChainValid());

// Recalculo do hash depois de voltar o bloco para o valor original
coin.chain[1].hash = coin.chain[1].calculateHash();
console.log('Is block chain valid? ' + coin.isChainValid());

// Lista todos os blocos
console.log(JSON.stringify(coin, null, 4));