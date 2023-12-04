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
      this.anagramsRecursive(sortedLetters, results, this.root, "", numBlanks, "?");
    }

    anagramsRecursive(letters, results, node, blanks, numBlanks, prev){
      if(letters.length == 0 && numBlanks == 0) {
        for(var i = 0; i < node.words.length; i++){
          results.push([node.words[i], blanks]);
        }
        return;
      }
      for(var i = 0; i < 26; i++){
        var char = String.fromCharCode(65 + i);
        if(node.children[char]){
          if(letters.length > 0 && letters[0] == (char)){
            var newLetters = letters.substring(1);
            this.anagramsRecursive(newLetters, results, node.children[char], blanks, numBlanks, char);
          }
          else if(char >= prev && (letters.length == 0 || char < letters[0]) && numBlanks > 0){
            this.anagramsRecursive(letters, results, node.children[char], blanks + char, numBlanks - 1, char);
          }
        }
      }
    }

    subanagrams(letters, results){
      var sortedLetters = letters.split("").sort().join("");
      var numBlanks = 0;
      while(sortedLetters[0] == "?") {
        numBlanks++;
        sortedLetters = sortedLetters.substring(1);
      }
      this.subanagramsRecursive(sortedLetters, results, this.root, "", numBlanks, "?");
    }

    subanagramsRecursive(letters, results, node, blanks, numBlanks, prev){
      for(var i = 0; i < node.words.length; i++){
        results.push([node.words[i], blanks]);
      }
      if(letters.length == 0 && numBlanks == 0) return;
      for(var i = 0; i < 26; i++){
        var char = String.fromCharCode(65 + i);
        if(node.children[char]){
          if(letters.includes(char)){
            var newLetters = letters.substring(letters.indexOf(char) + 1);
            this.subanagramsRecursive(newLetters, results, node.children[char], blanks, numBlanks, char);
          }
          else if(char >= prev && numBlanks > 0){
            while(letters.length > 0 && letters[0] < char){
              letters = letters.substring(1);
            }
            this.subanagramsRecursive(letters, results, node.children[char], blanks + char, numBlanks - 1, char);
          }
        }
      }
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