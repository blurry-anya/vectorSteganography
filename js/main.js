let curve, deltaStep, precision, accuracy, maxBitQuantity, minDistance, curveOrder,
    patternLength, startStep, patternSteganoKeys = [];

curve = '';
let testMessage = '01010101';

let testMessagePattern = '01010111'

// let experimentalMessage = 'Steganography is the technique of hiding secret data within an ordinary, non-secret, file or message in order to avoid detection';
let experimentalMessage = 'Steganography is the technique of hiding secret data within an ordinary, non-secret, file or message in order to avoid detection. Steganography is the technique of hiding secret data within an ordinary, non-secret, file or message in order to avoid detection. Steganography is the hiding technique...';
// let experimentalMessage = 'Concealing in the vector image';
// let experimentalMessage = 'The vector image steganography';

maxBitQuantity = 40;
precision = 5; //>=4
// precision = 6; //>=4
accuracy = 0.00002; // <= 5 * 10^(1-precision)
// accuracy = 0.0004; // <= 5 * 10^(1-precision)
let patternAccuracy = 0.00004;




// deltaStep = 0.003;
// deltaStep = 0.001;
deltaStep = 0.0005;

minDistance = 1;
curveOrder = 4;
patternLength = 4;
startStep = 0.0005;

// let patternAccuracy = 0.00004;

let normalizedCurves = [];
let copyOfOriginalSVG;
let readyTexts = [
    "With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.", "We diminution preference thoroughly if. Joy deal pain view much her time. Led young gay would now state. Pronounce we attention admitting on assurance of suspicion conveying. That his west quit had met till. Of advantage he attending household at do perceived. Middleton in objection discovery as agreeable. Edward thrown dining so he my around to.", "Or neglected agreeable of discovery concluded oh it sportsman. Week to time in john. Son elegance use weddings separate. Ask too matter formed county wicket oppose talent. He immediate sometimes or to dependent in. Everything few frequently discretion surrounded did simplicity decisively. Less he year do with no sure loud.", "Am finished rejoiced drawings so he elegance. Set lose dear upon had two its what seen. Held she sir how know what such whom. Esteem put uneasy set piqued son depend her others. Two dear held mrs feet view her old fine. Bore can led than how has rank. Discovery any extensive has commanded direction. Short at front which blind as. Ye as procuring unwilling principle by.", "To sorry world an at do spoil along. Incommode he depending do frankness remainder to. Edward day almost active him friend thirty piqued. People as period twenty my extent as. Set was better abroad ham plenty secure had horses. Admiration has sir decisively excellence say everything inhabiting acceptance. Sooner settle add put you sudden him.", "Entire any had depend and figure winter. Change stairs and men likely wisdom new happen piqued six. Now taken him timed sex world get. Enjoyed married an feeling delight pursuit as offered. As admire roused length likely played pretty to no. Means had joy miles her merry solid order.", "Is branched in my up strictly remember. Songs but chief has ham widow downs. Genius or so up vanity cannot. Large do tried going about water defer by. Silent son man she wished mother. Distrusts allowance do knowledge eagerness assurance additions to.", "Sense child do state to defer mr of forty. Become latter but nor abroad wisdom waited. Was delivered gentleman acuteness but daughters. In as of whole as match asked. Pleasure exertion put add entrance distance drawings. In equally matters showing greatly it as. Want name any wise are able park when. Saw vicinity judgment remember finished men throwing.", "Talent she for lively eat led sister. Entrance strongly packages she out rendered get quitting denoting led. Dwelling confined improved it he no doubtful raptures. Several carried through an of up attempt gravity. Situation to be at offending elsewhere distrusts if. Particular use for considered projection cultivated. Worth of do doubt shall it their. Extensive existence up me contained he pronounce do. Excellence inquietude assistance precaution any impression man sufficient.", "Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me unpleasing impossible in attachment announcing so astonished. What ask leaf may nor upon door. Tended remain my do stairs. Oh smiling amiable am so visited cordial in offices hearted."
];
/*
    let testSegment1 = [new Point(5.480655, 31.938989),
        new Point(5.2916666, 26.269345),
        new Point(6.047619, 17.197916),
        new Point(10.961309, 13.418155)]
    let testSegment2 = [new Point(28.537201, 9.0714284),
        new Point(37.041666, 9.827381),
        new Point(38.889765, 15.360591),
        new Point(41.605871, 20.221726)]
    let testSegment3 = [new Point(8.693452699999998, 43.845239),
        new Point(8.693452, 43.845239),
        new Point(5.669643, 37.608631),
        new Point(5.480655, 31.938989)]
    let testSegments = [testSegment1, testSegment2, testSegment3]
    for (let i = 0; i < testSegments.length; i++) {
        console.log(testSegments[i])
        for (let j = 1; j < testSegments[i].length; j++) {
            console.group('Distance')
            console.log(i, j)
            console.log('Point1:', testSegments[i][j-1])
            console.log('Point2:', testSegments[i][j])
            console.log('distance:', getDistanceBetween2points(testSegments[i][j-1], testSegments[i][j]))
            console.groupEnd()
        }
    }
*/


document.getElementById('loadSVGBtn').addEventListener('click', function (e) {
    normalizedCurves = [];
    let selectFile = document.getElementById('fileSelect');
    selectFile.click();
    let path = '';
    let container = document.getElementById('objectContainer'),
        fileName = document.getElementById('file-name'),
        fileCurves = document.getElementById('file-curves'),
        bezierCurves = document.getElementById('file-bezier-curves'),
        availableCurves = document.getElementById('file-available-curves'),
        extractedCurves = document.getElementById('file-extracted-curves'),
        recInputSize = document.getElementById('file-inputSize');
    let attributeCurves = [];

    selectFile.addEventListener('change', function () {
        path = selectFile.value;
        let index = path.indexOf('fakepath') + 9;
        container.data = '../images/'.concat(path.slice(index, path.length));
        container.onload = function () {
            fileName.innerHTML = path.slice(index, path.length);
            let svgPath = container.contentDocument.getElementsByTagName('path');

            let bezierCount = 0;
            for (let i = 0; i < svgPath.length; i++) {
                attributeCurves.push(svgPath[i].getAttribute('d'));
                if (isAvailable(attributeCurves[i])) bezierCount++;
            }
            bezierCurves.innerHTML = String(bezierCount);
            copyOfOriginalSVG = container.contentDocument.cloneNode(true);
            if (attributeCurves.length !== 0) {
                let selectedCurves = []; // объявление внутри блока обеспечивает очистку массива при новой загрузке свг
                console.log('attribute curves: ', attributeCurves)
                for (let i = 0; i < attributeCurves.length; i++) {
                    selectedCurves.push(selectCurves(attributeCurves[i]));
                }
                console.log('Array of selected in an image curves: ', selectedCurves)

                let count = 0;
                for (let i = 0; i < selectedCurves.length; i++) {
                    count += selectedCurves[i].length
                }
                fileCurves.innerHTML = String(count);


                for (let i = 0; i < selectedCurves.length; i++) {
                    for (let j = 0; j < selectedCurves[i].length; j++) {
                        // console.log(selectedCurves[i][j].startPoint)
                        for (let k = 0; k < selectedCurves[i][j].segments.length; k++) {
                            // console.log(selectedCurves[i][j].segments)
                            for (let l = 0; l < selectedCurves[i][j].segments[k].points.length; l++) {
                                selectedCurves[i][j].segments[k].points[l] = stringPointToPoint(selectedCurves[i][j].segments[k].points[l])
                            }
                            // console.log(i,j,k,selectedCurves[i][j].segments[k].points)
                        }
                        selectedCurves[i][j].startPoint = stringPointToPoint(selectedCurves[i][j].startPoint);
                    }
                }
                console.log(selectedCurves)


                for (let i = 0; i < selectedCurves.length; i++) {
                    normalizedCurves.push(extractCurves(selectedCurves[i], curveOrder));
                }
                console.log(normalizedCurves)

                for (let i = 0; i < normalizedCurves.length; i++) {
                    getCanonicalForm(normalizedCurves[i]);
                }
                console.log(normalizedCurves)

                for (let i = 0; i < normalizedCurves.length; i++) {
                    checkIfCurveIsPolybezierAndTransform(normalizedCurves[i]);
                }
                console.log(normalizedCurves)

                let availableCount = 0;
                for (let i = 0; i < normalizedCurves.length; i++) {
                    for (let j = 0; j < normalizedCurves[i].length; j++) {
                        // console.log(selectedCurves[i][j].startPoint)
                        for (let k = 0; k < normalizedCurves[i][j].segments.length; k++) {
                            /* console.group('Segment: ', normalizedCurves[i][j].segments[k])
                             for (let l = 1; l < normalizedCurves[i][j].segments[k].points.length; l++) {
                                 // console.log(i,j,k,l,getDistanceBetween2points(normalizedCurves[i][j].segments[k].points[l-1], normalizedCurves[i][j].segments[k].points[l]))
                                 console.group("Distance")
                                 console.log("iteration", i,j,k,l)
                                 console.log("Point1: ", normalizedCurves[i][j].segments[k].points[l-1])
                                 console.log("Point2: ", normalizedCurves[i][j].segments[k].points[l])
                                 console.log("Distance:", getDistanceBetween2points(normalizedCurves[i][j].segments[k].points[l-1], normalizedCurves[i][j].segments[k].points[l]))
                                 console.groupEnd();

                             }
                             console.groupEnd()*/
                            normalizedCurves[i][j].segments[k].valid = isValid(normalizedCurves[i][j].segments[k].points, minDistance)
                            if (normalizedCurves[i][j].segments[k].valid === 'yes') availableCount++
                        }
                    }
                }
                availableCurves.innerHTML = String(availableCount)




                /*let path = []
                for (let i = 0; i < temporaryToString.length; i++) {
                    path.push(initialCurveToString(temporaryToString[i]))
                }
                console.log(path)*/

                console.log(getSegmentsAmount(normalizedCurves))
                extractedCurves.innerHTML = String(getSegmentsAmount(normalizedCurves));
                recInputSize.innerHTML = String(availableCount * maxBitQuantity)

                return normalizedCurves;
            } else {
                alert('There are no available curves to be used for encoding/decoding!');
            }
        }
    });
});


document.getElementById('encodeBtn').addEventListener('click', function () {
    if (document.getElementById('objectContainer').data.match(/images/)) {
        if (normalizedCurves.length !== 0) {
            let progress = document.getElementById('progress');
            progress.max = parseInt(document.getElementById('file-extracted-curves').innerHTML);
            let percent = 0;
            console.log('Obtained points from curves in an image: ', normalizedCurves);
            // let input = convertTextToBinary(document.getElementById('message').innerHTML);
            let input = convertTextToBinary(experimentalMessage);
            if (input) {
                console.log('Длина бинарного сообщения:', input.length);
                console.log('Количество сегментов для встаивания:', normalizedCurves.flat(2).length)
                if (document.getElementById('bitMethod').classList.contains('selected')) {
                    input = chunkString(input, maxBitQuantity)
                } else if (document.getElementById('patternMethod').classList.contains('selected')) {
                    input = chunkString(input, maxBitQuantity)
                }
                console.log('Разбитый инпут', input)


                console.time('encode')
                let finalParameters = [];
                let encodedCurves = [];
                let patternTable = initTableOfPatterns(patternLength, maxBitQuantity)
                // let patternTable = [];
                for (let i = 0, index = 0; i < normalizedCurves.length; i++) {
                    let newSegments = [];
                    for (let j = 0; j < normalizedCurves[i].length; j++) {
                        let tmpSegments = [];
                        for (let k = 0; k < normalizedCurves[i][j].segments.length; k++) {
                            if (document.getElementById('bitMethod').classList.contains('selected')) {
                                tmpSegments.push(encodeBit(normalizedCurves[i][j].segments[k], input[index], deltaStep, precision));
                            } else {
                                tmpSegments.push(encodePattern(normalizedCurves[i][j].segments[k], input[index], precision, startStep, patternLength, maxBitQuantity, patternTable));
                            }
                            if (tmpSegments[k].finalParameter !== null) {
                                index++;
                            }
                            updateProgress(++percent, progress)
                        }
                        newSegments.push(tmpSegments)
                    }
                    encodedCurves.push(newSegments)
                }
                console.timeEnd('encode')


                console.log('encodedCurves:', encodedCurves);
                let encodedCurvesExtractedData = [];
                for (let i = 0; i < encodedCurves.length; i++) {
                    let curve = [];
                    for (let j = 0; j < encodedCurves[i].length; j++) {
                        let segments = [], param = [];
                        for (let k = 0; k < encodedCurves[i][j].length; k++) {
                            segments.push(encodedCurves[i][j][k].encoded);
                            // console.log(segments)
                            param.push(encodedCurves[i][j][k].finalParameter)
                        }
                        curve.push(segments);
                        finalParameters.push(param);
                    }
                    console.log(curve)
                    encodedCurvesExtractedData.push(curve);
                }
                console.log(encodedCurvesExtractedData)
                console.log('finalParameters:', finalParameters);

                patternSteganoKeys = {
                    patternTable: patternTable,
                    finalParameters: finalParameters
                };
                console.log('object to save:', patternSteganoKeys)
                let encodedCurvesToString = [];
                for (let i = 0; i < encodedCurvesExtractedData.length; i++) {
                    let tmpSegments = [];
                    for (let j = 0; j < encodedCurvesExtractedData[i].length; j++) {
                        if (j === 0) {
                            tmpSegments.push(new Curve(normalizedCurves[i][j].literal, normalizedCurves[i][j].startPoint, encodedCurvesExtractedData[i][j]));
                        } else {
                            tmpSegments.push(new Curve('m', new Point(0, 0), encodedCurvesExtractedData[i][j]));
                        }
                    }
                    encodedCurvesToString.push(tmpSegments)
                }
                console.log(encodedCurvesToString)

                let path = []
                for (let i = 0; i < encodedCurvesToString.length; i++) {
                    path.push(arrayOfCurvesToString(encodedCurvesToString[i]))
                }
                let copyPath = copyOfOriginalSVG.getElementsByTagName('path');
                for (let i = 0; i < copyPath.length; i++) {
                    copyPath[i].setAttribute('d', path[i]);
                }
                showEncryptionEnd();
                if (document.getElementById('patternMethod').classList.contains('selected')) {
                    let tempDOMObject = document.createElement('p');
                    tempDOMObject.classList.add('noDisplay');
                    tempDOMObject.innerHTML = JSON.stringify(patternSteganoKeys);
                    let svgName = document.getElementById('file-name').innerHTML;
                    let name = svgName.slice(0, svgName.length - 4).concat('.txt');
                    saveSteganoKeys(tempDOMObject,
                        ('patternKeysFor_'.concat(name)));
                } else if (document.getElementById('bitMethod').classList.contains('selected')) {
                    let tempDOMObject = document.createElement('p');
                    tempDOMObject.classList.add('noDisplay');
                    tempDOMObject.innerHTML = JSON.stringify(patternSteganoKeys);
                    let svgName = document.getElementById('file-name').innerHTML;
                    let name = svgName.slice(0, svgName.length - 4).concat('.txt');
                    saveSteganoKeys(tempDOMObject,
                        ('bitKeysFor_'.concat(name)));
                }
            } else {
                alert('A message is not entered!')
            }

        } else {
            alert('There is no curves for encoding')
        }
    } else {
        alert('Load SVG image first!')
    }
});

document.getElementById('decodeBtn').addEventListener('click', function () {
    if (normalizedCurves.length !== 0) {
        let decodedMessage = [];
        let progress = document.getElementById('progress');
        progress.max = parseInt(document.getElementById('file-extracted-curves').innerHTML);
        let percent = 0;
        if (document.getElementById('patternMethod').classList.contains('selected')) {
            let patternSteganoKeyForDecoding = '';
            let selectedFile = document.getElementById('fileSelectKeys');
            selectedFile.click();
            let path = '';
            selectedFile.addEventListener('change', function () {
                path = selectedFile.value;
                let index = path.indexOf('fakepath') + 9;
                let request = new XMLHttpRequest();
                request.open('GET', '../steganoKeys/'.concat(path.slice(index, path.length)), true);
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        let keysHolder = document.createElement('p');
                        keysHolder.classList.add('noDisplay');
                        keysHolder.innerHTML = request.responseText;
                        Array.from(keysHolder.querySelectorAll("p")).forEach(function (p) {
                            patternSteganoKeyForDecoding = JSON.parse(p.innerHTML)
                        });
                        console.log(patternSteganoKeyForDecoding);

                        console.time('decodePattern')
                        for (let i = 0; i < normalizedCurves.length; i++) {
                            console.log('DECODE:', i, normalizedCurves[i]);
                            for (let j = 0; j < normalizedCurves[i].length; j++) {
                                console.log('ELEMENT:', i, j, normalizedCurves[i][j].segments);
                                if (!(normalizedCurves[i][j].segments[0].literal.match(/[Ll]/))) {
                                    decodedMessage.push(decodePattern(maxBitQuantity, patternAccuracy, normalizedCurves[i][j].segments, startStep, precision, patternSteganoKeyForDecoding.finalParameters[i][j], patternSteganoKeyForDecoding.patternTable));
                                }
                                updateProgress(++percent, progress)
                            }
                        }
                        console.timeEnd('decodePattern')

                        console.log('DECODED MESSAGE:', decodedMessage.join(' '))
                        console.log(convertBinaryToText(decodedMessage.join('')))
                        document.getElementById('decodedMessage').innerHTML = convertBinaryToText(decodedMessage.join(''));
                    }
                }
                request.send();
            });
        } else {
            if (document.getElementById('bitMethod').classList.contains('selected')) {
                let bitSteganoKeyForDecoding = '';
                let selectedFile = document.getElementById('fileSelectKeys');
                selectedFile.click();
                let path = '';
                selectedFile.addEventListener('change', function () {
                    path = selectedFile.value;
                    let index = path.indexOf('fakepath') + 9;
                    let request = new XMLHttpRequest();
                    request.open('GET', '../steganoKeys/'.concat(path.slice(index, path.length)), true);
                    request.onreadystatechange = function () {
                        if (request.readyState === 4 && request.status === 200) {
                            let keysHolder = document.createElement('p');
                            keysHolder.classList.add('noDisplay');
                            keysHolder.innerHTML = request.responseText;
                            Array.from(keysHolder.querySelectorAll("p")).forEach(function (p) {
                                bitSteganoKeyForDecoding = JSON.parse(p.innerHTML)
                            });
                            console.log(bitSteganoKeyForDecoding);

                            console.time('decodeBit')
                            for (let i = 0; i < normalizedCurves.length; i++) {
                                console.log('DECODE:', i, normalizedCurves[i]);
                                console.log("finalParameter:", bitSteganoKeyForDecoding.finalParameters[i])
                                for (let j = 0; j < normalizedCurves[i].length; j++) {
                                    console.log('ELEMENT:', i, j, normalizedCurves[i][j].segments);
                                    console.log("finalParameter:", bitSteganoKeyForDecoding.finalParameters[i][j])

                                    if (!(normalizedCurves[i][j].segments[0].literal.match(/[Ll]/))) {
                                        decodedMessage.push(decodeBit(maxBitQuantity, accuracy, normalizedCurves[i][j].segments, deltaStep, precision, bitSteganoKeyForDecoding.finalParameters[i][j]));
                                    }
                                    updateProgress(++percent, progress)
                                }
                            }
                            console.timeEnd('decodeBit')

                            console.log('DECODED MESSAGE:\n', decodedMessage.join(' '))
                            console.log(convertBinaryToText(decodedMessage.join('')))
                            document.getElementById('decodedMessage').innerHTML = convertBinaryToText(decodedMessage.join(''));
                        }
                    }
                    request.send();
                });


                /*for (let i = 0; i < normalizedCurves.length; i++) {
                    for (let j = 0; j < normalizedCurves[i].length; j++) {
                        console.log('DECODE:', i, normalizedCurves[i]);
                        console.log('ELEMENT:', i, j, normalizedCurves[i][j].segments);
                        decodedMessage.push(decodeBit(maxBitQuantity, accuracy, normalizedCurves[i][j].segments, deltaStep, precision));
                        updateProgress(++percent,progress)
                    }
                }
                console.log('DECODED MESSAGE:', decodedMessage.join(' '))
                console.log(convertBinaryToText(decodedMessage.join('')))
                document.getElementById('decodedMessage').innerHTML = convertBinaryToText(decodedMessage.join(''));*/
            }

        }
    }
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    let svgName = document.getElementById('file-name').innerHTML;
    let name = svgName.slice(0, svgName.length - 4).concat('.svg');
    saveStegoContainer(copyOfOriginalSVG, 'stego'.concat(name));
});

document.getElementById('loadInputBtn').addEventListener('click', function () {
    document.getElementById('loadMessageWindow').classList.remove('noDisplay');
    document.getElementById('loadMessageWindowCloseBtn').addEventListener('click', function () {
        document.getElementById('loadMessageWindow').classList.add('noDisplay');
    });
    document.getElementById('loadMessageWindowLoadBtn').addEventListener('click', function () {
        let selectedFile = document.getElementById('textFileSelect');
        selectedFile.click();
        let path = '';
        selectedFile.addEventListener('change', function () {
            path = selectedFile.value;
            let index = path.indexOf('fakepath') + 9;
            let request = new XMLHttpRequest();
            request.open('GET', '../texts/'.concat(path.slice(index, path.length)));
            request.onreadystatechange = function () {
                document.getElementById('message').innerText = request.responseText;
            }
            request.send();
        });
    });
    let texts = document.getElementsByClassName('loadTextBtn');
    for (let i = 0; i < texts.length; i++) {
        texts[i].addEventListener('click', function () {
            document.getElementById('message').innerText = readyTexts[i];
        })
    }
})

/*document.getElementById('loadKeysBtn').addEventListener('click', function () {
    let selectedFile = document.getElementById('fileSelectKeys');
    selectedFile.click();
    let path = '';
    selectedFile.addEventListener('change', function () {
        path = selectedFile.value;
        let index = path.indexOf('fakepath') + 9;
        let request = new XMLHttpRequest();
        request.open('GET', '../steganoKeys/'.concat(path.slice(index, path.length)));
        request.onreadystatechange = function () {
            let keysHolder = document.createElement('p');
            keysHolder.classList.add('noDisplay');
            keysHolder.innerHTML = request.responseText;
        }
        request.send();
    });
})*/

function updateProgress(value, progressBar) {
    console.log(value)
    progressBar.value = value;
    document.getElementById('progress-label').innerText = String((100 / progressBar.max) * value).concat('%');
}

function showEncryptionEnd() {
    document.getElementById('encryptionCompleteWindow').classList.remove('noDisplay');
    setInterval(function () {
        document.getElementById('encryptionCompleteWindow').classList.add('noDisplay');
    }, 1000)
}

