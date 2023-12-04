var definition = {};
var array = [];
var map;
var trie;
var results = [];
var time = {};



function readWords(){
    var req = new XMLHttpRequest();
    req.onload = function(){
        storeWords(req.responseText.split("\n"));
    }
    req.open("GET", "NWL2020.txt");
    req.send();
}

function storeWords(dict){
    fillDefinitions(dict);
    fillArray(dict);
    fillHashMap(dict);
    fillTrie(dict);
}

function fillDefinitions(dict){
    for(var i = 0; i < dict.length; i++){
        var entry = dict[i].split(" ");
        var word = entry[0];
        var def = "";
        for(var j = 1; j < entry.length - 1; j++){
            def += entry[j] + " ";
        }
        def += entry[entry.length - 1];
        definition[word] = def;
    }
}

function fillArray(dict){
    for(var i = 0; i < dict.length; i++){
        array.push(dict[i].split(" ")[0]);
    }
}

function fillHashMap(dict){
    map = new HashMap();
    for(var i = 0; i < dict.length; i++){
        map.add(dict[i].split(" ")[0]);
    }
}

function fillTrie(dict){
    trie = new Trie();
    for(var i = 0; i < dict.length; i++){
        trie.insert(dict[i].split(" ")[0]);
    }
}

function search(){
    results = [];
    document.getElementById("results").innerHTML = "";
    document.getElementById("times").innerHTML = "";
    var letters = document.getElementById("letters").value.toUpperCase();
    var query = document.getElementById("query").value;
    var t1 = Date.now();
    if(query == "anagram") anagramSearch(letters);
    else if(query == "pattern") patternSearch(letters);
    else if(query == "subanagram") subanagramSearch(letters);
    results.sort(function(x, y){
        if(x[0].length < y[0].length) return 1;
        if(x[0].length > y[0].length) return -1;
        if(x[0] < y[0]) return -1;
        if(x[0] > y[0]) return 1;
        return 0;
    });
    var text = "<br>" + results.length;
    if(results.length != 1) text += " results found. ";
    else text += " result found. ";
    if(document.getElementById("array").checked) text += "<span style = \"color: red\">" + time["array"] + " ms</span> using array. ";
    if(document.getElementById("trie").checked) text += "<span style = \"color: red\">" + time["trie"] + " ms</span> using trie. ";
    if(document.getElementById("hash").checked) text += "<span style = \"color: red\">" + time["hash"] + " ms</span> using hash map. ";
    document.getElementById("times").innerHTML += text + "<br>";
    displayResults(0);
}

function anagramSearch(letters){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    var start;
    if(useArray){
        results = [];
        start = Date.now();
        for(var i = 0; i < array.length; i++){
            if(results.includes(array[i])) continue;
            if(array[i].length < letters.length) continue;
            if(array[i].length > letters.length) break;
            var valid = true;
            var checkletters = letters.split("");
            var wordletters = array[i].split("");
            var blanks = "";
            for(var n = 0; n < wordletters.length; n++){
                if(checkletters.includes(wordletters[n])) checkletters.splice(checkletters.indexOf(wordletters[n]), 1);
                else if(checkletters.includes("?")){
                    checkletters.splice(checkletters.indexOf("?"), 1);
                    blanks += wordletters[n];
                }
                else{
                    valid = false;
                    break;
                } 
            }
            if(valid) results.push([array[i], blanks]);
        }
        time["array"] = Date.now() - start;
        console.log(Date.now() - start);
    }
    if(useTrie){
        results = [];
        start = Date.now();
        trie.anagrams(letters, results);
        time["trie"] = Date.now() - start;
    }
    if(useHash){
        results = [];
        start = Date.now();
        map.anagrams(letters, results);
        time["hash"] = Date.now() - start;
    }
}

function patternSearch(letters){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    if(useArray){
        results = [];
        start = Date.now(); 
        for(var i = 0; i < array.length; i++){
            var word = array[i];
            if(word.length < letters.length) continue;
            if(word.length > letters.length) break;
            var valid = true;
            var blanks = "";
            for(var n = 0; n < word.length; n++){
                if(letters[n] == word[n]) continue;
                if(letters[n] == "?"){
                    blanks += word[n];
                    continue;
                }
                valid = false;
                break;
            }
            if(valid) results.push([array[i], blanks]);
        }
        time["array"] = Date.now() - start;
    }
    if(useTrie){
        results = [];
        start = Date.now();
        trie.pattern(letters, results);
        time["trie"] = Date.now() - start;
    }
    if(useHash){
        results = [];
        start = Date.now();
        map.pattern(letters, results);
        time["hash"] = Date.now() - start;
    }
}

function subanagramSearch(letters){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    if(useArray){
        results = [];
        start = Date.now();
        for(var i = 0; i < array.length; i++){
            if(array[i].length > letters.length) break;
            var valid = true;
            var checkletters = letters.split("");
            var wordletters = array[i].split("");
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
            if(valid) results.push([array[i], blanks]);
        }
        time["array"] = Date.now() - start;
    }
    if(useTrie){
        results = [];
        start = Date.now();
        trie.subanagrams(letters, results);
        time["trie"] = Date.now() - start;
    }
    if(useHash){
        results = [];
        start = Date.now();
        map.subanagrams(letters, results);
        time["hash"] = Date.now() - start;
    }
}

function getDefinition(word, pos){
    var def = definition[word];
    if(def.includes("/")){
        var defs = def.split(" / ");
        if(pos == "x"){
            def = cleanDefinition(defs[0]);
            for(var i = 1; i < defs.length; i++){
                def += " / " + cleanDefinition(defs[i]);
            }
            return def;
        }else{
            for(var i = 0; i < defs.length; i++){
                if(defs[i].split("[")[1].substring(0, pos.length) == pos){
                    return cleanDefinition(defs[i]);
                }
            }
        }
    }
    return cleanDefinition(def);
}

function cleanDefinition(def){
    if(def.includes("<")){
        var splitdef = def.split("<");
        var endsplit = splitdef[1].split(">");
        var word = endsplit[0].split("=")[0].toUpperCase();
        var pos = endsplit[0].split("=")[1][0];
        var worddef = getDefinition(word, pos).split("[")[0].trim();
        def = word + ", " + worddef + endsplit[1];
    }
    else if(def.includes("{")){
        var splitdef = def.split("{");
        var endsplit = splitdef[1].split("}");
        var word = endsplit[0].split("=")[0].toUpperCase();
        var pos = endsplit[0].split("=")[1][0];
        var worddef = getDefinition(word, pos).split("[")[0].trim();
        if (worddef != "") def = splitdef[0] + word.toLowerCase() + " (" + worddef + ") " + endsplit[1];
        else def = splitdef[0] + word.toLowerCase() + endsplit[1];
    }
    return def;
}

function highlightBlanks(word, blanks){
    for(var i = 0; i < blanks.length; i++){
        var n = word.lastIndexOf(blanks[i]);
        while(n > 1 && word[n-2] == "\""){
            n = word.lastIndexOf(blanks[i], n-1);
        }
        word = (word.substring(0, n) 
        + "<span style=\"color: red;\">" + blanks[i] + "</span>"
        + word.substring(n+1));
    }
    return word;
}

function displayResults(start){
    var final = start + 200;
    var text = document.getElementById("results").innerHTML;
    if(text.lastIndexOf("<span") >= 0) text = text.substring(0, text.lastIndexOf("<span"));
    for(var i = start; i < Math.min(results.length, start + 200); i++){
        var word = highlightBlanks(results[i][0], results[i][1]);
        text += word + ": " + getDefinition(results[i][0], "x") + "<br>";
    }
    if(results.length > final){
        text += "<span id = \"showmore\" onClick=\"displayResults(" + final + ")\">Showing results 1-" + final + ": Click to show more</span><br>";
    }
    document.getElementById("results").innerHTML = text;
}

readWords();

window.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (document.activeElement == document.getElementById("letters") && event.key == "Enter"){
        search();
    }
});