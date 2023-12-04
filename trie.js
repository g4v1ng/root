class TrieNode {
    constructor() {
      this.children = {};
      this.words = [];
    }
}
  
class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      var sortedWord = word.split("").sort().join("");
      let node = this.root;
      for (let char of sortedWord) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.words.push(word);
    }
  
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          return false; // prefix not found
        }
        node = node.children[char];
      }
      return node.words;
    }

    anagrams(letters, results) {
      var sortedLetters = letters.split("").sort().join("");
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