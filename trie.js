class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
      this.words = set();
    }
}
  
class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      word = word.split("").sort().join("");
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          return false; // prefix not found
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    startsWith(prefix) {
      let node = this.root;
      for (let char of prefix) {
        if (!node.children[char]) {
          return false; // prefix not found
        }
        node = node.children[char];
      }
      return true; // prefix found
    }
  }