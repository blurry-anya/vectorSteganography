function round(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

function saveStegoContainer(svgObject, name) {
    let serialized = new XMLSerializer().serializeToString(svgObject)
    let svgBlob = new Blob([serialized], {type: "image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function saveSteganoKeys(keysObject, name) {
    let serialized = new XMLSerializer().serializeToString(keysObject)
    console.log(serialized)
    let blob = new Blob([serialized], {type: 'text'});
    console.log("blob", blob)
    let url = URL.createObjectURL(blob);
    console.log('url', url)
    let link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function convertTextToBinary(input) {
    console.log("ПРОЦЕСС КОНВЕРТИРОВАНИЯ ТЕКСТА В ДВОИЧНЫЙ..");
    let output = [];
    for (let i = 0; i < input.length; i++) {
        output.push(make8bit(input[i].charCodeAt(0).toString(2)));
    }
    return output.join('');
}

function convertBinaryToText(str) {
    console.log("\tПРОЦЕСС КОНВЕРТИРОВАНИЯ ДВОИЧНОГО КОДА В ТЕКСТ");
    str = str.match(/.{1,8}/g).toString().replace(/,/g, ' ');
    str = str.split(' ');
    let binCode = [];
    for (let i = 0; i < str.length; i++) {
        binCode.push(String.fromCharCode(parseInt(str[i], 2)));
    }
    return binCode.join(''); // return string
}

function make8bit(str) {
    let result = [];
    for (let i = 0; i < 8 - str.length; i++) {
        result.push('0');
    }
    result.push(str);
    return result.join('');
}

function makeNbit(str, N) {
    let result = [];
    for (let i = 0; i < N - str.length; i++) {
        result.push('0');
    }
    result.push(str);
    return result.join('');
}
function makeNbitAtEnd(str, N) {
    let result = [];

    for (let i = 0; i < N - str.length; i++) {
        result.push('0');
    }
    str.push(result);
    str = str.join('').replace(/,/g, '').split('');
    return str;
}

function chunkString(string, chunkSize) {
    let res = [];
    for (let i = 0; i < string.length; i += chunkSize) {
        res.push(string.slice(i, i + chunkSize))
    }
    return res;
}

function isAvailable(stringCurve) {
    if (stringCurve.match(/[Cc]/)) return true;
}

function arrayOfCurvesToString(array) {//for array of curves

    let stringCurve = [];
    for (let i = 0; i < array.length; i++) {
        // console.log(i, 'array[i]:', array[i])

        for (let j = 0; j < array[i].segments.length; j++) {
            // console.log(i, j, 'array[i].segments[j]:', array[i].segments[j])
            // console.log(array[i].segments[j].length)

            let stringSegment = '';
            if (j !== 0) {
                stringSegment += 'm 0,0 ';
            }
            let stringPoints = '';
            for (let k = 0; k < array[i].segments[j].length; k++) {
                // console.log(i,j,k,'array[i].segments[j][k]:', array[i].segments[j][k].points[l])
                // console.log(array[i].segments[j][k].points)
                // console.log(array[i].segments[j][k].toString())
                if (i === 0 && j === 0 && k === 0) {
                    stringSegment += array[i].literal + ' ' + array[i].startPoint.toString() + ' ' + array[i].segments[j][k].toString();
                } else {
                    stringSegment += array[i].segments[j][k].toString();
                    // stringSegment += 'm 0,0 ' + array[i].segments[j].literal + ' ' + stringPoints;
                }
            }
            stringCurve.push(stringSegment);
        }
        // console.log(stringSegment)
    }
    // console.log(stringCurve.join(''))
    return stringCurve.join('')
}


function initialCurveToString(array) {//for array of curves TEMPORARY
    let stringCurve = [];
    for (let i = 0; i < array.length; i++) {
        // console.log(i,'array[i]:', array[i])
        let stringSegment = '';
        for (let j = 0; j < array[i].segments.length; j++) {
            let stringPoints = '';
            if (array[i].segments[j].points.length === 4){
                array[i].segments[j].points.shift();
            }
            stringPoints += array[i].segments[j].toString();
            // console.log(stringPoints)

            if (j === 0) {
                stringSegment += array[i].literal + ' ' + array[i].startPoint.toString() + stringPoints;
            } else {
                stringSegment +=  stringPoints;
            }
        }
        stringCurve.push(stringSegment);
        // console.log(stringSegment)
    }
    // console.log(stringCurve.join(''))
    return stringCurve.join('')
}




/*function initTableOfPatterns(patternLength, maxBitQuantity) { //forPatternMethod table of pattern corresponding to its step change
    let maxStep = patternLength / maxBitQuantity;
    console.log(maxStep)
    let uniqueValues = new Set;
    while (uniqueValues.size !== Math.pow(2, patternLength)){
        uniqueValues.add(parseFloat(randomNumber(0.001, maxStep / 100).toFixed(4)))
    }
   let steps = [...uniqueValues].sort((a, b) => b-a)
    let table = [];
    for (let i = 0; i < Math.pow(2, patternLength); i++) {
        table.push({
            index: i,
            pattern: makeNbit(i.toString(2), patternLength),
            step: steps[i]
        })
    }
    console.table(table)
    return table;

}*/

function randomNumber(min, max) {
    return min + Math.random() * (max - min + 0.01);
}


function initTableOfPatterns(patternLength, maxBitQuantity) {
    let maxStep = patternLength / maxBitQuantity;
    console.log(maxStep)

    let uniqueValues = [0.0095, 0.009, 0.0085, 0.008, 0.0075, 0.007, 0.0065, 0.006, 0.0055, 0.005, 0.0045, 0.004, 0.0035, 0.003, 0.0025, 0.002];
    let table = [];
    for (let i = 1; i <= Math.pow(2, patternLength); i++) {
        table.push({
            index: i,
            pattern: makeNbit((i - 1).toString(2), patternLength),
            step: uniqueValues[i - 1]
        })
    }
    console.log('test table of patterns:', table);
    return table;
}


document.querySelectorAll("div.methods").forEach((element, n, all) => {
    element.addEventListener("click", function () {
        all.forEach(function (item) {
            if (item.classList.contains('selected')) {
                item.classList.replace('selected', 'notSelected');
            }
        });
        if (element.classList.contains('selected') === false) {
            element.classList.replace("notSelected", 'selected');
        }
    });
});

document.getElementById('bitMethod').addEventListener('click', function (){
    document.getElementsByClassName('bitParameters')[0].classList.remove('noDisplay')
    document.getElementsByClassName('patternParameters')[0].classList.add('noDisplay')
    document.getElementById('bitPrecision').innerHTML = String(precision)
    document.getElementById('bitAccuracy').innerHTML = String(accuracy)
    document.getElementById('bitMaxBitQuantity').innerHTML = String(maxBitQuantity)
    document.getElementById('bitDeltaStep').innerHTML = String(deltaStep)
})
document.getElementById('patternMethod').addEventListener('click', function (){
    document.getElementsByClassName('patternParameters')[0].classList.remove('noDisplay')
    document.getElementsByClassName('bitParameters')[0].classList.add('noDisplay')
    document.getElementById('patternPrecision').innerHTML = String(precision)
    document.getElementById('patternAccuracy').innerHTML = String(patternAccuracy)
    document.getElementById('patternMaxBitQuantity').innerHTML = String(maxBitQuantity)
    document.getElementById('patternLength').innerHTML = String(patternLength)
    document.getElementById('patternStartStep').innerHTML = String(startStep)
})


