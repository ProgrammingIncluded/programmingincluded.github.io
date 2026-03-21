// Connect strings into blocks of 16 bytes.
function blocks(strarr) {
    // Pad the strings
    var blocks = []; 
    for(var i = 0; i < strarr.length / 16; ++i) {
        blocks.push(strarr.slice((i) * 16, (i + 1) * 16));
    }
    return blocks;
}

function hexblock(str) {
    var blocksarr = blocks(str.split(""));
    var res = [];
    for(var i = 0; i < blocksarr.length; ++i) {
        var bl = blocksarr[i];
        var value = [];
        for(var n=0; n < bl.length; ++n) {
            var h = Number(bl[n].charCodeAt(0));
            value.push(h);
        }
        res.push(value);
    }
    return res;
}

function dehexblock(value) {
    var str = "";
    for(var i = 0; i < value.length; ++i) {
        for(var n =0; n < value[i].length; ++n) {
            str += String.fromCharCode(value[i][n]);
        }
    }
    return str;
}

function decode(pass, data) {
        var ob = sjcl.hash.sha256;
        var codec = sjcl.codec.bytes;
        var bitarray = ob.hash(pass);
        var key = codec.fromBits(bitarray);

        // convert to what we can read
        data = JSON.parse(data);

        AES_Init();
        // Recreate key
        key = codec.fromBits(bitarray);
        AES_ExpandKey(key);
        for(var i = 0; i < data.length; ++i) {
            AES_Decrypt(data[i], key);
        }
        var html = dehexblock(data);
        AES_Done();
        return html;
}