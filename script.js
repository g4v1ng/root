var definition = {};
var array = [];
var map;

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

function search(){
    document.getElementById("results").innerText = "";
    var results = [];
    var letters = document.getElementById("letters").value.toUpperCase();
    var query = document.getElementById("query").value;
    var t1 = Date.now();
    if(query == "anagram") anagramSearch(letters, results);
    else if(query == "pattern") patternSearch(letters, results);
    else if(query == "subanagram") subanagramSearch(letters, results);
    time = Date.now() - t1;
    if(document.getElementById("trie").checked){
        results.sort(function(x, y){
            if(x.length < y.length) return 1;
            if(x.length > y.length) return -1;
            if(x < y) return -1;
            if(x > y) return 1;
            return 0;
        });
    }
    document.getElementById("results").innerText += "\n" + results.length + " results found in " + time + " ms";
    display(results);
}

function anagramSearch(letters, results){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    if(useArray){
        for(var i = 0; i < array.length; i++){
            if(results.includes(array[i])) continue;
            if(array[i].length < letters.length) continue;
            if(array[i].length > letters.length) break;
            var valid = true;
            var checkletters = letters.split("");
            var wordletters = array[i].split("");
            for(var n = 0; n < wordletters.length; n++){
                if(checkletters.includes(wordletters[n])) checkletters.splice(checkletters.indexOf(wordletters[n]), 1);
                else if(checkletters.includes("?")) checkletters.splice(checkletters.indexOf("?"), 1);
                else{
                    valid = false;
                    break;
                } 
            }
            if(valid) results.push(array[i]);
        }
    }
    if(useHash){
        if(letters.split("?").length < 4){    
            if(letters.includes("?")){
                for(var i = 0; i < 26; i++){
                    anagramSearch(letters.replace("?", String.fromCharCode(65+i)), results);
                }  
            }  
            var key = letters.split("").sort().join("");
            var anagrams = map.get(key);
            for(var i = 0; i < anagrams.length; i++){
                results.push(anagrams[i]);
            }
        }else{
            for(var i = 0; i < map.values.length; i++){
                if(map.values[i] == null) continue;
                var root = map.values[i].root;
                while(root != null){
                    var key = root.key;
                    if(key.length != letters.length){
                        root = root.next;
                        continue;
                    }
                    var valid = true;
                    var checkletters = letters.split("");
                    var keyletters = key.split("");
                    for(var n = 0; n < keyletters.length; n++){
                        if(checkletters.includes(keyletters[n])) checkletters.splice(checkletters.indexOf(keyletters[n]), 1);
                        else if(checkletters.includes("?")) checkletters.splice(checkletters.indexOf("?"), 1);
                        else{
                            valid = false;
                            break;
                        }
                    }
                    if(valid){
                        for(var j = 0; j < root.value.length; j++){
                            results.push(root.value[j]);
                        }
                    }
                    root = root.next;
                }
            }
        }
    }
}

function patternSearch(letters, results){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    if(useArray){    
        for(var i = 0; i < array.length; i++){
            var word = array[i];
            if(word.length < letters.length) continue;
            if(word.length > letters.length) break;
            var valid = true;
            for(var n = 0; n < word.length; n++){
                if(letters[n] == "?" || letters[n] == word[n]) continue;
                else{
                    valid = false;
                    break;
                } 
            }
            if(valid) results.push(array[i]);
        }
    }
    if(useHash){
        if(letters.split("?").length < 4){     
            if(letters.includes("?")){
                for(var i = 0; i < 26; i++){
                    patternSearch(letters.replace("?", String.fromCharCode(65+i)), results);
                }  
            }  
            var key = letters.split("").sort().join("");
            var anagrams = map.get(key);
            if(anagrams == null) return;
            for(var i = 0; i < anagrams.length; i++){
                if(anagrams[i] == letters) results.push(anagrams[i]);
            }
        }else{
            for(var i = 0; i < map.values.length; i++){
                if(map.values[i] == null) continue;
                var root = map.values[i].root;
                while(root != null){
                    for(var j = 0; j < root.value.length; j++){
                        var word = root.value[j];
                        if(word.length != letters.length) continue;
                        var valid = true;
                        for(var n = 0; n < word.length; n++){
                            if(letters[n] == "?" || letters[n] == word[n]) continue;
                            else{
                                valid = false;
                                break;
                            } 
                        }       
                        if(valid) results.push(word);
                    }
                    root = root.next;
                }
            }
        }
    }
}

function subanagramSearch(letters, results){
    var useHash = document.getElementById("hash").checked;
    var useTrie = document.getElementById("trie").checked;
    var useArray = document.getElementById("array").checked;
    if(useArray){
        for(var i = 0; i < array.length; i++){
            if(array[i].length > letters.length) break;
            var valid = true;
            var checkletters = letters.split("");
            var wordletters = array[i].split("");
            for(var n = 0; n < wordletters.length; n++){
                if(checkletters.includes(wordletters[n])) checkletters.splice(checkletters.indexOf(wordletters[n]), 1);
                else if(checkletters.includes("?")) checkletters.splice(checkletters.indexOf("?"), 1);
                else{
                    valid = false;
                    break;
                } 
            }
            if(valid) results.push(array[i]);
        }
    }
    if(useHash){
        for(var i = 0; i < map.values.length; i++){
            if(map.values[i] == null) continue;
            var root = map.values[i].root;
            while(root != null){
                for(var j = 0; j < root.value.length; j++){
                    var word = root.value[j];
                    if(word.length > letters.length) break;
                    var valid = true;
                    var checkletters = letters.split("");
                    var wordletters = word.split("");
                    for(var n = 0; n < wordletters.length; n++){
                        if(checkletters.includes(wordletters[n])) checkletters.splice(checkletters.indexOf(wordletters[n]), 1);
                        else if(checkletters.includes("?")) checkletters.splice(checkletters.indexOf("?"), 1);
                        else{
                            valid = false;
                            break;
                        }
                    }    
                    if(valid) results.push(word);
                }
                root = root.next;
            }
        }
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

function display(results){
    var text = "";
    for(var i = 0; i < results.length; i++){
        text +="\n" + results[i] + ": " + getDefinition(results[i], "x");
    }
    document.getElementById("results").innerText += text;
}

readWords();