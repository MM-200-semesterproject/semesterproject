exports.hashCode = function(string) {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
        let charOfString = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + charOfString; // <<5 shifts bits in binary 5 times left
        hash |= 0; // Convert to 32bit integer  //bitwise OR assignment 
    }
    return hash;
}

//test
//console.log(hashCode("password"));