let containers = ['../images/curve1_example.svg', '../images/рисунок.svg',
    '../images/exp_apple.svg', '../images/moon.svg', '../images/exp_ambrella.svg', '../images/exp_knife.svg', '../images/exp_lamp.svg', '../images/exp_spoon.svg',
    '../images/exp_mcdonalds.svg'
]

let transformations = ['translation', 'rotation', 'shearX', 'shearY', 'proportionalScaleForCompression', 'proportionalScaleForExtension', 'almostAffineTransformation']

let containerData = [];

let experiments = [
    {
        maxBitQuantity: 40,
        precision: 5,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 40,
        precision: 5,
        accuracy: 0.00004
    }, {
        maxBitQuantity: 40,
        precision: 6,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 40,
        precision: 6,
        accuracy: 0.00004
    }, {
        maxBitQuantity: 60,
        precision: 5,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 60,
        precision: 5,
        accuracy: 0.00004
    }, {
        maxBitQuantity: 60,
        precision: 6,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 60,
        precision: 6,
        accuracy: 0.00004
    }, {
        maxBitQuantity: 80,
        precision: 5,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 80,
        precision: 5,
        accuracy: 0.00004
    }, {
        maxBitQuantity: 80,
        precision: 6,
        accuracy: 0.00002
    }, {
        maxBitQuantity: 80,
        precision: 6,
        accuracy: 0.00004
    }
]


document.getElementById('experiment-btn').addEventListener('click', function () {
    let windowDiv = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(windowDiv)
    windowDiv.id = 'global-div'
    windowDiv.classList.add('displayFlex')
    let closeBtn = document.createElement('div')
    closeBtn.classList.add('experimentalWindow-close')
    windowDiv.appendChild(closeBtn)
    closeBtn.addEventListener('click', function () {
        windowDiv.classList.remove('displayFlex');
        windowDiv.classList.add('noDisplay');
    })

    // experiment('bit', 'translation', windowDiv)
    // experiment('bit', 'rotation', windowDiv)
    // experiment('bit', 'shearX', windowDiv)
    // experiment('bit', 'shearY', windowDiv)
    // experiment('bit', 'proportionalScaleForCompression', windowDiv)
    // experiment('bit', 'proportionalScaleForExtension', windowDiv)
    // experiment('bit', 'almostAffineTransformation', windowDiv)

    // experiment('pattern', 'translation', windowDiv)
    experiment('pattern', 'rotation', windowDiv)
    // experiment('pattern', 'shearX', windowDiv)
    // experiment('pattern', 'shearY', windowDiv)
    // experiment('pattern', 'proportionalScaleForCompression', windowDiv)
    // experiment('pattern', 'proportionalScaleForExtension', windowDiv)
    // experiment('pattern', 'almostAffineTransformation', windowDiv)
})


function experiment(method, type, parentObject) {
    console.log('Max bit quantity:', maxBitQuantity);
    console.log('Precision:', precision);
    console.log('Accuracy', accuracy);
    let incorrectnessResults = []
    containerData = [];
    let arg = 1;
    let a1 = Math.cos(1), a2 = -Math.sin(1), a3 = Math.sin(1)

    switch (method) {
        case 'bit':

            initContainer(containers[3], parentObject, function () {
                console.log(containerData);
                let input = convertTextToBinary(experimentalMessage);
                input = chunkString(input, maxBitQuantity)
                console.log(input)
                let encodeResult = initBitEncoding(containerData, input);
                let containers = [];

                switch (type) {
                    case 'translation':
                        console.error('translation')
                        let resultsTrans = [];

                        for (let i = -500, index = 0; i <= 500; i += 50) {
                            let decodeResult;
                            if (i === -500) {
                                console.error('FIRST CONTAINER')
                                containers[index] = encodeResult.path.slice();
                                decodeResult = initBitDecoding('y', encodeResult.path, encodeResult.steganoKey, 'translation', 1, 0, 0, 1, i, i, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'translation', 1, 0, 0, 1, i, i, 0, 0, 0, 0, 0, 0)
                            }
                            console.log('i:', i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log('incorrectness:', incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsTrans.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsTrans)


                        // console.log("incorrectness: ", resultsTrans)
                        break;
                    case 'rotation':
                        console.error('rotation')
                        let resultsRot = [];


                        for (let i = 1, index = 0; i <= 10; i++) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                // console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', encodeResult.path, encodeResult.steganoKey, 'rotation', a1, a2, a3, a1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                // console.log('index:', index)
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'rotation', a1, a2, a3, a1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log('i:', i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log('incorrectness:', incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsRot.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsRot)


                        break;

                    case 'shearX':
                        console.error('shearX')
                        let resultsShearX = [];

                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                // console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', containers[index], encodeResult.steganoKey, 'shearX', 1, 0.01, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                // console.log('index:', index)
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'shearX', 1, 0.01, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsShearX.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsShearX)


                        break;
                    case 'shearY':
                        console.error('shearY')
                        let resultsShearY = []

                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                // console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', containers[index], encodeResult.steganoKey, 'shearY', 1, 0, 0.01, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                // console.log('index:', index)
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'shearY', 1, 0, 0.01, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsShearY.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsShearY)


                        incorrectnessResults.push({
                            transformations: 'shearY',
                            result: resultsShearY
                        })

                        break;
                    case 'proportionalScaleForCompression':
                        console.error('proportionalScaleForCompression')
                        let resultsScaleForComp = []
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', containers[index], encodeResult.steganoKey, 'proportionalScaleForCompression', 0.99, 0, 0, 0.99, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'proportionalScaleForCompression', 0.99, 0, 0, 0.99, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsScaleForComp.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            // console.log('decodeResult.container: ', decodeResult.container)
                            incorrectnessResults.push(incorrectness)

                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsScaleForComp)
                        console.log("incorrectness: ", incorrectnessResults)


                        break;
                    case 'proportionalScaleForExtension':
                        console.error('proportionalScaleForExtension')
                        let resultsScaleForExt = []
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', containers[index], encodeResult.steganoKey, 'proportionalScaleForExtension', 1.1, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'proportionalScaleForExtension', 1.1, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsScaleForExt.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            incorrectnessResults.push(incorrectness)

                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsScaleForExt)
                        console.log("incorrectness: ", incorrectnessResults)

                        console.log(containers)


                        break;
                    case 'almostAffineTransformation':
                        console.error('almostAffineTransformation')
                        let resultsAlmostAffine = []


                        for (let i = 1, index = 0; i <= 10; i++) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                // console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('y', encodeResult.path, encodeResult.steganoKey, 'almostAffineTransformation', a1, a2, a3, -a1, 0, 0, -0.0001, 0.0001, 0.0001, -0.0001, 0.0001, -0.0001)
                            } else {
                                console.error('NEXT CONTAINER')
                                // console.log('index:', index)
                                // console.log('containers[index]:', containers[index])
                                decodeResult = initBitDecoding('n', containers[index], encodeResult.steganoKey, 'almostAffineTransformation', a1, a2, a3, -a1, 0, 0, -0.0001, 0.0001, 0.0001, -0.0001, 0.0001, -0.0001)
                            }

                            console.log('i:', i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log('incorrectness:', incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            resultsAlmostAffine.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity) * 100)).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", resultsAlmostAffine)
                        console.log("incorrectness: ", incorrectnessResults);
                        break;
                }
                console.log("Total incorrectness", incorrectnessResults);
            });
            break;

        case 'pattern':
            initContainer(containers[3], parentObject, function () {
                console.log(containerData);
                let input = convertTextToBinary(experimentalMessage);
                input = chunkString(input, maxBitQuantity)
                console.log(input)
                let encodeResult = initPatternEncoding(containerData, input);
                let incorrectnessResults = []
                let containers = [];

                switch (type) {
                    case 'translation':

                        console.error('translation')
                        let resultsTrans = [];

                        for (let i = -500, index = 0; i <= 500; i += 100) {
                            let decodeResult;
                            if (i === -500) {
                                console.error('FIRST CONTAINER')
                                containers[index] = encodeResult.path.slice();
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'translation', 1, 0, 0, 1, i, i, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'translation', 1, 0, 0, 1, i, i, 0, 0, 0, 0, 0, 0)
                            }
                            console.log('i:', i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log('incorrectness:', incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            // resultsTrans.push(parseFloat(((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100).toFixed(3)));
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;
                            resultsTrans.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(3)));
                            incorrectnessResults.push(incorrectness)

                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                            // console.log(convertBinaryToText(decodeResult.decodedMessage.join('')));
                        }
                        console.log("incorrectness: ", resultsTrans)


                        // console.log("incorrectness: ", resultsTrans)
                        break;
                    case 'rotation':
                        console.error('rotation')

                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'rotation', Math.cos(1), -Math.sin(1), Math.sin(1), Math.cos(1), 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'rotation', Math.cos(1), -Math.sin(1), Math.sin(1), Math.cos(1), 0, 0, 0, 0, 0, 0, 0, 0)
                                // decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'rotation', Math.cos(1), -Math.sin(1), Math.sin(1), Math.cos(1), 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;
                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(3)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = decodeResult.container;
                            // containers[index] = deepClone(decodeResult.container);
                            // console.log(convertBinaryToText(decodeResult.decodedMessage.join('')));

                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)
                        break;

                    case 'shearX':
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'shearX', 1, 0.01, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'shearX', 1, 0.01, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;

                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(3)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)

                        break;
                    case 'shearY':
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'shearY', 1, 0, 0.01, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'shearY', 1, 0, 0.01, 1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;

                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(3)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)

                        break;
                    case 'proportionalScaleForCompression':
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'proportionalScaleForCompression', 0.99, 0, 0, 0.99, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'proportionalScaleForCompression', 0.99, 0, 0, 0.99, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;
                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(3)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)
                        break;
                    case 'proportionalScaleForExtension':
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'proportionalScaleForExtension', 1.1, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0, 0)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'proportionalScaleForExtension', 1.1, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0, 0)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;

                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(2)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)
                        break;
                    case 'almostAffineTransformation':
                        for (let i = 1, index = 0; i <= 10; i += 1) {
                            let decodeResult;
                            if (i === 1) {
                                console.error('FIRST CONTAINER')
                                console.log('index:', index)
                                containers[index] = encodeResult.path.slice();
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('y', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'almostAffineTransformation', Math.cos(arg), -Math.sin(arg), Math.sin(arg), -Math.cos(arg), 0, 0, -0.0001, 0.0001, 0.0001, -0.0001, 0.0001, -0.0001)
                            } else {
                                console.error('NEXT CONTAINER')
                                console.log('index:', index)
                                console.log('containers[index]:', containers[index])
                                decodeResult = initPatternDecoding('n', containers[index], encodeResult.steganoKey, encodeResult.patternTable, 'almostAffineTransformation', Math.cos(arg), -Math.sin(arg), Math.sin(arg), -Math.cos(arg), 0, 0, -0.0001, 0.0001, 0.0001, -0.0001, 0.0001, -0.0001)
                            }

                            console.log(i)
                            let incorrectness = compareBits(decodeResult.decodedMessage, input);
                            let lostBlocks = input.length - decodeResult.decodedMessage.length;

                            console.log(incorrectness)
                            console.log((incorrectness / (decodeResult.decodedMessage.length * maxBitQuantity)) * 100);
                            incorrectnessResults.push(parseFloat((((incorrectness + (lostBlocks * maxBitQuantity)) / (input.length * maxBitQuantity)) * 100).toFixed(2)));
                            console.log('decodeResult.container: ', decodeResult.container)
                            index++;
                            containers[index] = deepClone(decodeResult.container);
                        }
                        console.log("incorrectness: ", incorrectnessResults)
                        console.log(containers)
                        break;
                }
            });
            break;
    }
}


function affineTransformation(container, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6) {
    let transformationMatrix = [
        [a1 + e1, a2 + e2, b1],
        [a3 + e3, a4 + e4, b2],
        [0, 0, 1]
    ];
    let breakPoint = new Point(0, 0)
    console.log('Will be transformed: \n', container)
    let transformedContainer = deepClone(container);
    console.log(transformedContainer)
    for (let i = 0; i < transformedContainer.length; i++) {
        for (let j = 0; j < transformedContainer[i].length; j++) {
            for (let k = 0; k < transformedContainer[i][j].segments.length; k++) {
                /*   console.log(transformedContainer[i][j])
                   console.log(isPointsTheSame(transformedContainer[i][j].startPoint, breakPoint))*/
                for (let l = 0; l < transformedContainer[i][j].segments[k].points.length; l++) {
                    transformedContainer[i][j].segments[k].points[l] = multiplyAffineMatrix(transformationMatrix, transformedContainer[i][j].segments[k].points[l], e5, e6)
                }

            }
            if (isPointsTheSame(transformedContainer[i][j].startPoint, breakPoint)) {
                transformedContainer[i][j].startPoint = new Point(0, 0);
                // transformedContainer[i][j].segments[k].points[0] = transformedContainer[i][j-1].segments[transformedContainer[i][j-1].segments.length - 1].points[3];
                // console.log('condition is met:', transformedContainer[i][j])
            } else {
                transformedContainer[i][j].startPoint = multiplyAffineMatrix(transformationMatrix, transformedContainer[i][j].startPoint, e5, e6);
            }
        }
    }
    console.log('transformed: ', transformedContainer)
    let copy = deepClone(transformedContainer)
    let tmpString = [];
    for (let i = 0; i < copy.length; i++) {
        tmpString.push(initialCurveToString(copy[i]))
    }
    console.log(tmpString)
    return transformedContainer;
}

function initBitEncoding(containerData, input) {

    let finalParameters = [], encodedCurves = [];
    for (let i = 0, index = 0; i < containerData.length; i++) {
        let newSegments = [];
        for (let j = 0; j < containerData[i].length; j++) {
            let tmpSegments = [];
            for (let k = 0; k < containerData[i][j].segments.length; k++) {
                tmpSegments.push(encodeBit(containerData[i][j].segments[k], input[index], deltaStep, precision));
                if (tmpSegments[k].finalParameter !== null) {
                    index++;
                }
            }
            newSegments.push(tmpSegments)
        }
        encodedCurves.push(newSegments)
    }
    console.log(encodedCurves)
    let encodedCurvesExtractedData = [];
    for (let i = 0; i < encodedCurves.length; i++) {
        let curve = [];
        for (let j = 0; j < encodedCurves[i].length; j++) {
            let segments = [], param = [];
            for (let k = 0; k < encodedCurves[i][j].length; k++) {
                segments.push(encodedCurves[i][j][k].encoded);
                param.push(encodedCurves[i][j][k].finalParameter)
            }
            curve.push(segments);
            finalParameters.push(param);
        }
        encodedCurvesExtractedData.push(curve);
    }
    console.log(encodedCurvesExtractedData)
    console.log('finalParameters:', finalParameters);

    let encodedCurvesToString = [];
    for (let i = 0; i < encodedCurvesExtractedData.length; i++) {
        let tmpSegments = [];
        for (let j = 0; j < encodedCurvesExtractedData[i].length; j++) {
            if (j === 0) {
                tmpSegments.push(new Curve(containerData[i][j].literal, containerData[i][j].startPoint, encodedCurvesExtractedData[i][j]));
            } else {
                if (!encodedCurvesExtractedData[i][j].segments[0].literal.match(/[Mm]/)) {
                    tmpSegments.push(new Curve('m', new Point(0, 0), encodedCurvesExtractedData[i][j]));
                } else {
                    tmpSegments.push(encodedCurvesExtractedData[i][j])
                }
            }
        }
        encodedCurvesToString.push(tmpSegments)
    }
    console.log(encodedCurvesToString)

    let path = []
    for (let i = 0; i < encodedCurvesToString.length; i++) {
        path.push(arrayOfCurvesToString(encodedCurvesToString[i]))
    }
    return {
        path: path,
        steganoKey: finalParameters
    }
}

function initBitDecoding(complexity, path, finalParameters, transformationName, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6) {
    console.log("DECODING..")
    let containerData = [];
    if (complexity === 'y') {
        let selectedCurves = []; // объявление внутри блока обеспечивает очистку массива при новой загрузке свг
        // console.log('attribute curves: ', path)
        for (let i = 0; i < path.length; i++) {
            selectedCurves.push(selectCurves(path[i]));
        }
        // console.log('Array of selected in an image curves: ', selectedCurves)

        // console.log(selectedCurves)
        for (let i = 0; i < selectedCurves.length; i++) {
            // console.log(i, selectedCurves[i])
            for (let j = 0; j < selectedCurves[i].length; j++) {
                // console.log(i, j, selectedCurves[i][j])
                for (let k = 0; k < selectedCurves[i][j].segments.length; k++) {
                    for (let l = 0; l < selectedCurves[i][j].segments[k].points.length; l++) {
                        selectedCurves[i][j].segments[k].points[l] = stringPointToPoint(selectedCurves[i][j].segments[k].points[l])
                    }
                }
                selectedCurves[i][j].startPoint = stringPointToPoint(selectedCurves[i][j].startPoint);
            }
        }
        // console.log(selectedCurves)

        for (let i = 0; i < path.length; i++) {
            containerData.push(extractCurves(selectedCurves[i], curveOrder));
        }
        // console.log(containerData)

        for (let i = 0; i < containerData.length; i++) {
            getCanonicalForm(containerData[i]);
        }
        // console.log(containerData)

        for (let i = 0; i < containerData.length; i++) {
            checkIfCurveIsPolybezierAndTransform(containerData[i]);
        }
        // console.log(containerData)
    } else {
        containerData = path;
    }
    switch (transformationName) {
        case 'translation':
            console.log(b1, b2)
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            console.log('containerData after transformation: \n', containerData)
            break;
        case 'rotation':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'shearX'://абцис
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'shearY'://ординат
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'proportionalScaleForCompression':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'proportionalScaleForExtension':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'almostAffineTransformation':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
    }

    let decodedMessage = [];
    for (let i = 0; i < containerData.length; i++) {
        // console.log('DECODE:', i, containerData[i]);
        for (let j = 0; j < containerData[i].length; j++) {
            // console.log('ELEMENT:', i, j, containerData[i][j].segments);
            if (!(containerData[i][j].segments[0].literal.match(/[Ll]/))) {
                decodedMessage.push(decodeBit(maxBitQuantity, accuracy, containerData[i][j].segments, deltaStep, precision, finalParameters[i][j]));
            }
            // console.error(decodedMessage[j])
        }
    }
    decodedMessage = decodedMessage.filter(el => typeof el !== 'undefined')
    console.log('DECODED MESSAGE:\n', decodedMessage)
    console.log(containerData)

    return {
        decodedMessage: decodedMessage,
        container: containerData
    }
}


function initPatternEncoding(containerData, input) {
    let patternTable = initTableOfPatterns(patternLength, maxBitQuantity)
    console.log(patternTable)
    let finalParameters = [], encodedCurves = [];
    for (let i = 0, index = 0; i < containerData.length; i++) {
        let newSegments = [];
        for (let j = 0; j < containerData[i].length; j++) {
            let tmpSegments = [];
            for (let k = 0; k < containerData[i][j].segments.length; k++) {
                tmpSegments.push(encodePattern(containerData[i][j].segments[k], input[index], precision, startStep, patternLength, maxBitQuantity, patternTable));
                if (tmpSegments[k].finalParameter !== null) {
                    index++;
                }
            }
            newSegments.push(tmpSegments)
        }
        encodedCurves.push(newSegments)
    }
    // console.log(encodedCurves)
    let encodedCurvesExtractedData = [];
    for (let i = 0; i < encodedCurves.length; i++) {
        let curve = [];
        for (let j = 0; j < encodedCurves[i].length; j++) {
            let segments = [], param = [];
            for (let k = 0; k < encodedCurves[i][j].length; k++) {
                segments.push(encodedCurves[i][j][k].encoded);
                param.push(encodedCurves[i][j][k].finalParameter)
            }
            curve.push(segments);
            finalParameters.push(param);
        }
        encodedCurvesExtractedData.push(curve);
    }
    console.log(encodedCurvesExtractedData)
    console.log('finalParameters:', finalParameters);

    let encodedCurvesToString = [];
    for (let i = 0; i < encodedCurvesExtractedData.length; i++) {
        let tmpSegments = [];
        for (let j = 0; j < encodedCurvesExtractedData[i].length; j++) {
            if (j === 0) {
                tmpSegments.push(new Curve(containerData[i][j].literal, containerData[i][j].startPoint, encodedCurvesExtractedData[i][j]));
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
    return {
        path: path,
        steganoKey: finalParameters,
        patternTable: patternTable
    }
}

function initPatternDecoding(complexity, path, finalParameters, patternTable, transformationName, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6) {
    let containerData = [];
    if (complexity === 'y') {
        let selectedCurves = [];
        console.log('attribute curves: ', path)
        for (let i = 0; i < path.length; i++) {
            selectedCurves.push(selectCurves(path[i]));
        }
        console.log('Array of selected in an image curves: ', selectedCurves)

        // console.log(selectedCurves)
        for (let i = 0; i < selectedCurves.length; i++) {
            // console.log(i, selectedCurves[i])
            for (let j = 0; j < selectedCurves[i].length; j++) {
                // console.log(i, j, selectedCurves[i][j])
                for (let k = 0; k < selectedCurves[i][j].segments.length; k++) {
                    for (let l = 0; l < selectedCurves[i][j].segments[k].points.length; l++) {
                        selectedCurves[i][j].segments[k].points[l] = stringPointToPoint(selectedCurves[i][j].segments[k].points[l])
                    }
                }
                selectedCurves[i][j].startPoint = stringPointToPoint(selectedCurves[i][j].startPoint);
            }
        }
        console.log('selectedCurves:', selectedCurves)

        for (let i = 0; i < path.length; i++) {
            containerData.push(extractCurves(selectedCurves[i], curveOrder));
        }
        console.log('containerData:', containerData)

        for (let i = 0; i < containerData.length; i++) {
            getCanonicalForm(containerData[i]);
        }
        console.log('containerData getCanonForm:', containerData)

        for (let i = 0; i < containerData.length; i++) {
            checkIfCurveIsPolybezierAndTransform(containerData[i]);
        }
        console.log('containerData checkIfPolybezier:', containerData)
    } else {
        containerData = path;
    }
    switch (transformationName) {
        case 'translation':
            console.log(b1, b2)
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            console.log('containerData after transformation: \n', containerData)
            break;
        case 'rotation':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'shearX'://абцис
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'shearY'://ординат
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'proportionalScaleForCompression':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'proportionalScaleForExtension':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
        case 'almostAffineTransformation':
            containerData = affineTransformation(containerData, a1, a2, a3, a4, b1, b2, e1, e2, e3, e4, e5, e6)
            break;
    }

    let decodedMessage = [];
    for (let i = 0; i < containerData.length; i++) {
        // console.log('DECODE:', i, containerData[i]);
        for (let j = 0; j < containerData[i].length; j++) {
            // console.log('ELEMENT:', i, j, containerData[i][j].segments);
            if (!(containerData[i][j].segments[0].literal.match(/[Ll]/))) {
                decodedMessage.push(decodePattern(maxBitQuantity, accuracy, containerData[i][j].segments, deltaStep, precision, finalParameters[i][j], patternTable));
            }
            // console.error(decodedMessage[j])
        }
    }
    decodedMessage = decodedMessage.filter(el => typeof el !== 'undefined')
    console.log('DECODED MESSAGE:\n', decodedMessage)
    console.log(containerData)

    /*let copy = deepClone(containerData)
    let tmpString = [];
    for (let i = 0; i < copy.length; i++) {
        tmpString.push(initialCurveToString(copy[i]))
    }
    console.log(tmpString)*/
    return {
        decodedMessage: decodedMessage,
        container: containerData
    }
}


function initContainer(container, parentObject, callback) {
    let domObject = document.createElement('object');
    domObject.type = 'image/svg+xml'
    domObject.data = container;
    domObject.classList.add('containerObject')
    parentObject.appendChild(domObject)
    domObject.onload = function () {
        let svgPath = domObject.contentDocument.getElementsByTagName('path');
        let attributeCurves = []
        for (let i = 0; i < svgPath.length; i++) {
            attributeCurves.push(svgPath[i].getAttribute('d'));
        }
        let copyOfOriginalSVG = domObject.contentDocument.cloneNode(true);
        if (attributeCurves.length !== 0) {
            let selectedCurves = []; // объявление внутри блока обеспечивает очистку массива при новой загрузке свг
            console.log('attribute curves: ', attributeCurves)
            for (let i = 0; i < attributeCurves.length; i++) {
                selectedCurves.push(selectCurves(attributeCurves[i]));
            }
            console.log('Array of selected in an image curves: ', selectedCurves)

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
                containerData.push(extractCurves(selectedCurves[i], curveOrder));
            }
            console.log(containerData)

            for (let i = 0; i < containerData.length; i++) {
                getCanonicalForm(containerData[i]);
            }
            console.log(containerData)

            for (let i = 0; i < containerData.length; i++) {
                checkIfCurveIsPolybezierAndTransform(containerData[i]);
            }

            for (let i = 0; i < containerData.length; i++) {
                for (let j = 0; j < containerData[i].length; j++) {
                    for (let k = 0; k < containerData[i][j].segments.length; k++) {
                        containerData[i][j].segments[k].valid = isValid(containerData[i][j].segments[k].points, minDistance)
                    }
                }
            }


            console.log(containerData)
            callback();
            return containerData;
        }
    }

}

function multiplyAffineMatrix(a, b, e5, e6) {
    b = [b.x + e5, b.y + e6, 1]
    let c = [];
    for (let i = 0; i < a.length; i++) {
        let tmp = 0;
        for (let j = 0; j < a[i].length; j++) {
            tmp += a[i][j] * b[j];
        }
        c.push(tmp)
    }
    return new Point(round(c[0], Number(precision)), round(c[1], Number(precision)));
}

function compareBits(decodedMessage, initialMessage) {//decoded message is blocks with length maxBitQuantity
    let incorrectness = 0;
    for (let i = 0; i < decodedMessage.length; i++) {
        for (let j = 0; j < decodedMessage[i].length; j++) {
            if (decodedMessage[i][j] !== initialMessage[i][j]) {
                console.log(i, decodedMessage[i], initialMessage[i])
                incorrectness++;
            }
        }
    }
    return incorrectness;
}

// console.log(Math.trunc(randomNumber(-500,500)))


/*function encodeBit(segments, inputValue, parameter, precision) {
    if (segments.valid === 'yes') {
        let encodedSegment = [], splittedSegment = [];
        let indexOfSegment = 0, finalParameter = 0;
        for (let t = parameter, index = 0; index < inputValue.length; index++) {
            t = parseFloat(t.toFixed(precision))
            if (inputValue[index] === '1') {
                if (indexOfSegment === 0) {
                    splittedSegment.push(splitCurve(t, segments.points, precision))
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                } else {
                    splittedSegment.push(splitCurve(t, splittedSegment[indexOfSegment - 1][1], Number(precision)))
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                }
                indexOfSegment++;
            }
            t += parameter;
            finalParameter = parseFloat(t.toFixed(precision));
        }
        splittedSegment[indexOfSegment - 1][1].shift();
        encodedSegment.push(splittedSegment[indexOfSegment - 1][1])

        return {
            encoded: encodedSegment.map(elem => new segment(segments.valid, segments.literal, elem)),
            finalParameter: finalParameter
        };
    } else {
        segments.points.shift();
        return {
            encoded: [segments],
            finalParameter: null
        }
    }
}*/

function deepClone(arr) {
    let res = []
    // console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i])
        res[i] = []
        for (let j = 0; j < arr[i].length; j++) {
            // console.log(arr[i][j])
            let segments = [];
            for (let k = 0; k < arr[i][j].segments.length; k++) {
                // console.log(arr[i][j].segments)
                let points = []
                for (let l = 0; l < arr[i][j].segments[k].points.length; l++) {
                    // console.log(arr[i][j].segments[k].points[l])
                    points.push(arr[i][j].segments[k].points[l]);
                }
                segments.push(new segment(arr[i][j].segments[k].valid, arr[i][j].segments[k].literal, points))
                // console.log(i,j,k,selectedCurves[i][j].segments[k].points)
            }
            res[i][j] = new Curve(arr[i][j].literal, arr[i][j].startPoint, segments)
        }
    }
    // console.log(res)
    return res;
}


/*let testCurve = new Curve('m', new Point(3,3), [
    new segment('n', 'c', [new Point(3,3),new Point(4,4),new Point(5,5),new Point(6,6)]),
    new segment('n', 'c', [new Point(6,6),new Point(7,7),new Point(8,8),new Point(9,9)]),
])
let testCurve1 = new Curve('m', new Point(11,11), [
    new segment('n', 'c', [new Point(11,11),new Point(12,12),new Point(13,13),new Point(14,14)]),
    new segment('n', 'c', [new Point(14,14),new Point(15,15),new Point(16,16),new Point(17,17)]),
])

let testCurvesArr = [[testCurve],[testCurve1]]

let curvesArr = [];


let clone = deepClone(testCurvesArr)




for (let i = 1; i < 6; i++) {
    affineTransformation(testCurvesArr, 1, 0, 0, 1, i, i, 0, 0, 0, 0, 0, 0)
}*/




