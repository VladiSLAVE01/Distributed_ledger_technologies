/**
 * Seminar 2.5 Simple Trie
 */


class TrieNode {
    constructor(key) {
        this.key = key;
        this.children = {};
        this.isWord = false;
    }
}


class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }

    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const symbol = word[i];
            if(!node.children[symbol]){
                node.children[symbol] = new TrieNode(symbol);
            }
            node = node.children[symbol];

            if (i== word.length - 1) {
                node.isWord = true;
            }
        }

    }

    hasNode(word){
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const symbol = word[i];
            if (!node.children[symbol]) {
                return false;
            }
            node = node.children[symbol];
        }
        return false;
    }

    getAllNodes() {
        const result = [];
        const traverse = (node) => {
            if (node === null) return;
            result.push(node);
            for (const symbol in node.children) {
                traverse(node.children[symbol]);
            }
        };
        traverse(this.root);
        return result;
    }
}

module.exports = { Trie };
