function powModk(x, y, k){
    if(y == 0) return 1;
    return (x*powModk(x, y-1, k))%k;
}

class Node {
    constructor(key, value){
        this.key = key;
        this.value = [value];
        this.next = null;
    }
}

class LinkedList {
    constructor(){
        this.root = null;
    }

    add(key, value){
        if(this.root == null) this.root = new Node(key, value);
        else{
            var root = this.root;
            while(root.next != null){
                if(root.key == key){
                    root.value.push(value);
                    return;
                }
                root = root.next;
            }
            if(root.key == key){
                root.value.push(value);
                return;
            }
            root.next = new Node(key, value);
        }
    }
    get(key){
        var root = this.root;
        while(root != null){
            if(root.key == key){
                return root.value;
            }
            root = root.next;
        }
        return [];
    }
}

class HashMap
{
    constructor() {
        this.values = [];
    }
    // perform hash function on key
    getHash(key) {
        var hashCode = 0;
        for (var i = 0; i < key.length; i++) {
            hashCode += (key.charCodeAt(i)-65) * powModk(31, i, 275000);
            hashCode %= 275000;
        }
        return hashCode;
    }
    // add value to the hash map
    add(value) {
        var key = value.split("").sort().join("");
        var hashValue = this.getHash(key);
        if(!this.values[hashValue]) this.values[hashValue] = new LinkedList();
        this.values[hashValue].add(key, value);
    }
    // get value from the hash map
    get(key) {
        var hashValue = this.getHash(key);
        if(this.values[hashValue]) return this.values[hashValue].get(key);
        return [];
    }
    // search if a word exists in the map
    pattern(letters, results){
        // if no blanks, hash the key
        if(!letters.includes("?")){     
            var key = letters.split("").sort().join("");
            var anagrams = map.get(key);
            if(anagrams == null) return;
            for(var i = 0; i < anagrams.length; i++){
                if(anagrams[i] == letters) results.push([anagrams[i], ""]);
            }
        // if one or more blank, iterate through the hash map like an array
        }else{
            for(var i = 0; i < this.values.length; i++){
                if(this.values[i] == null) continue;
                var root = this.values[i].root;
                while(root != null){
                    for(var j = 0; j < root.value.length; j++){
                        var word = root.value[j];
                        var blanks = "";
                        if(word.length != letters.length) continue;
                        var valid = true;
                        for(var n = 0; n < word.length; n++){
                            if(letters[n] == word[n]) continue;
                            if(letters[n] == "?"){
                                blanks += word[n];
                                continue;
                            }
                            valid = false;
                            break;
                        }       
                        if(valid) results.push([word, blanks]);
                    }
                    root = root.next;
                }
            }
        }
    }
    // find anagrams of the letters
    anagrams(letters, results){
        // if no blanks, hash the key
        if(!letters.includes("?")){    
            var key = letters.split("").sort().join("");
            var anagrams = map.get(key);
            for(var i = 0; i < anagrams.length; i++){
                if(!results.includes(anagrams[i])) results.push([anagrams[i], ""]);
            }
        // if one or more blank, iterate through hash map like an array
        }else{
            for(var i = 0; i < this.values.length; i++){
                if(this.values[i] == null) continue;
                var root = this.values[i].root;
                while(root != null){
                    var key = root.key;
                    if(key.length != letters.length){
                        root = root.next;
                        continue;
                    }
                    var valid = true;
                    var checkletters = letters.split("");
                    var keyletters = key.split("");
                    var blanks = "";
                    for(var n = 0; n < keyletters.length; n++){
                        if(checkletters.includes(keyletters[n])) checkletters.splice(checkletters.indexOf(keyletters[n]), 1);
                        else if(checkletters.includes("?")) {
                            checkletters.splice(checkletters.indexOf("?"), 1);
                            blanks += keyletters[n];
                        }
                        else{
                            valid = false;
                            break;
                        }
                    }
                    if(valid){
                        for(var j = 0; j < root.value.length; j++){
                            results.push([root.value[j], blanks]);
                        }
                    }
                    root = root.next;
                }
            }
        }        
    }
    // find subanagrams of the letters
    subanagrams(letters, results){
        // cannot be done any more efficiently than iterating through every element in the map
        for(var i = 0; i < this.values.length; i++){
            if(this.values[i] == null) continue;
            var root = this.values[i].root;
            while(root != null){
                for(var j = 0; j < root.value.length; j++){
                    var word = root.value[j];
                    if(word.length > letters.length) break;
                    var valid = true;
                    var checkletters = letters.split("");
                    var wordletters = word.split("");
                    var blanks = "";
                    for(var n = 0; n < wordletters.length; n++){
                        if(checkletters.includes(wordletters[n])) checkletters.splice(checkletters.indexOf(wordletters[n]), 1);
                        else if(checkletters.includes("?")) {
                            checkletters.splice(checkletters.indexOf("?"), 1);
                            blanks += wordletters[n];
                        }
                        else{
                            valid = false;
                            break;
                        }
                    }    
                    if(valid) results.push([word, blanks]);
                }
                root = root.next;
            }
        }
    }
}