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
    getHash(key) {
        var hashCode = 0;
        for (var i = 0; i < key.length; i++) {
            hashCode += (key.charCodeAt(i)-65) * powModk(31, i, 275003);
            hashCode %= 275003;
        }
        return hashCode;
    }
    add(value) {
        var key = value.split("").sort().join("");
        var hashValue = this.getHash(key);
        if(!this.values[hashValue]) this.values[hashValue] = new LinkedList();
        this.values[hashValue].add(key, value);
    }
    get(key) {
        var hashValue = this.getHash(key);
        if(this.values[hashValue]) return this.values[hashValue].get(key);
        return [];
    }
    exists(key) {
        var hashValue = this.getHash(key);
        return this.values[hashValue] != null;
    }
}