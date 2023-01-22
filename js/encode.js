/**
 * Input is array of Curve.segments, inputValue is bit to encode ('1'|'0'),
 * parameter is a step of parameter t growth. Function is for encoding part
 * of a binary message in curve (its segments).
 *
 * @param segments : segment
 * @param inputValue : String
 * @param parameter : number
 * @param precision : number
 * @returns {*}
 */
function encodeBit(segments, inputValue, parameter, precision) {
    console.log("Encoding...")
    if (segments.valid === 'yes' && typeof inputValue !== 'undefined') {
        let encodedSegment = [], splittedSegment = [];
        // console.log('Встраивание последовательности: ', inputValue)
        // console.log('Длина последовательности: ', inputValue.length)
        let indexOfSegment = 0, finalParameter = 0;
        // console.log('\t\tсегмент', segments); //segment
        for (let t = parameter, index = 0; index < inputValue.length; index++) {
            t = parseFloat(t.toFixed(precision))
            // console.log('бит:',inputValue[index])
            if (inputValue[index] === '1') {
                if (indexOfSegment === 0) {
                    splittedSegment.push(splitCurve(t, segments.points, precision))
                    // console.log(t, splittedSegment[indexOfSegment])
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                    // console.log(i, t, encodedSegment)
                } else {
                    splittedSegment.push(splitCurve(t, splittedSegment[indexOfSegment - 1][1], Number(precision)))
                    // console.log(t, splittedSegment[indexOfSegment])
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                }
                indexOfSegment++;
                // console.log(index, inputValue[index], indexOfSegment);
            }
            t += parameter;
            finalParameter = parseFloat(t.toFixed(precision));
        }
        splittedSegment[indexOfSegment - 1][1].shift();
        encodedSegment.push(splittedSegment[indexOfSegment - 1][1])

        // console.log(encodedSegment.map(elem => new segment(segments.valid,segments.literal, elem)))

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
}

function encodePattern(segments, inputValue, precision, startStep, patternLength, maxBitQuantity, patternTable) {
    console.log("Encoding...")
    // console.log(segments)
    if (segments.valid === 'yes' && typeof inputValue !== 'undefined') {
        // let patternTable = initTableOfPatterns(patternLength, maxBitQuantity);
        // console.table(testPatternTable)
        let encodedSegment = [], splittedSegment = [];
        // console.log('Input segment:', segments)
        // console.log('8 битная последовательность:', inputValue)
        inputValue = chunkString(inputValue, patternLength)
        // console.log('Встраивание последовательности: ', inputValue)
        let indexOfSegment = 0;
        // console.log('\t\tсегмент', segments); //segment
        let finalParameter = 0;
        for (let t = startStep, index = 0; index < inputValue.length; index++) {
            // console.log(index, 'value of step t:', t)
            // console.log('input elem:', inputValue[index]);
            if (patternTable.find(elem => elem.pattern === inputValue[index])) {
                let currentPosition = patternTable.find(elem => elem.pattern === inputValue[index]);
                // console.log(currentPosition.step, parseFloat((t + currentPosition.step).toFixed(precision)))
                if (indexOfSegment === 0) {
                    splittedSegment.push(splitCurve(parseFloat((t + currentPosition.step).toFixed(precision)), segments.points, precision))
                    // console.log((t + currentPosition.step), splittedSegment[indexOfSegment])
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                    // console.log(t, encodedSegment)
                } else {
                    splittedSegment.push(splitCurve(parseFloat((t + currentPosition.step).toFixed(precision)), splittedSegment[indexOfSegment - 1][1], Number(precision)))
                    // console.log(t, splittedSegment[indexOfSegment])
                    splittedSegment[indexOfSegment][0].shift();
                    encodedSegment.push(splittedSegment[indexOfSegment][0])
                }
                indexOfSegment++;
                // console.log(index, inputValue[index], indexOfSegment);
                t += currentPosition.step;
                t = parseFloat(t.toFixed(precision))
            }
            finalParameter = parseFloat(t.toFixed(4));
        }
        // console.log(splittedSegment)
        splittedSegment[indexOfSegment - 1][1].shift();
        encodedSegment.push(splittedSegment[indexOfSegment - 1][1])
        return {
            encoded: encodedSegment.map(elem => new segment(segments.valid, segments.literal, elem)),
            finalParameter: finalParameter,
        };
    } else {
        segments.points.shift()
        return {
            encoded: [segments],
            finalParameter: null,
            // patternTable: patternTable
        };
    }
}

