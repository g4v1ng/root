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
      var numBlanks = 0;
      while(sortedLetters[0] == "?") {
        numBlanks++;
        sortedLetters = sortedLetters.substring(1);
      }
      var node = this.root;
      for(var i = 0; i < letters.length; i++){
        this.anagrams(letters, results);
      }
    }

    subanagrams(letters, results)
  
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