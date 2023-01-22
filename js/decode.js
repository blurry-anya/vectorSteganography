/**
 *
 * @param steganoKey
 * @param maxBitQuantity
 * @param accuracy
 * @param segments
 * @param parameterStep
 * @param precision
 */

function decodeBit(maxBitQuantity, accuracy, segments, parameterStep, precision, steganoKey) {
    console.log("Decoding...")

    if (segments.length > 1) {
        // if (!segments[0].literal.match(/[ZzLlHhVv]/)) {
        //     console.log('FIRST segment is not ZzLlHhVv')
            let output = [];
            if (typeof steganoKey === 'undefined') {
                steganoKey = (maxBitQuantity + 1) * parameterStep;
                // console.log('STEGANO_KEY:', steganoKey)
            }
            // console.log(segments)
            console.log('steganoKey: ', steganoKey)
            let merged = segments.slice();
            for (let t = steganoKey - parameterStep; t >= 0; t -= parameterStep) {
                let i = merged.length - 1;
                // console.log(merged[i]);
                // console.log(merged[i].literal.match(/[ZzLlHhVv]/))
                if (!(merged[i].literal.match(/[ZzLlHhVv]/))) {
                    // console.log('segment is not ZzLlHhVv')
                    t = parseFloat(t.toFixed(precision))
                    // console.log(i, t)
                    let tmp = [];
                    if (i === segments.length - 1) {
                        tmp = [segments[i - 1], segments[i]];
                        // console.log('tmp if i === segments.length - 1 (first iteration): ', tmp);
                    } else {
                        if (merged.length !== 0) {
                            // console.group()
                            // console.log(i, 'merged in else for tmp: ', merged)
                            // console.log(i, merged[merged.length - 2], merged[merged.length - 1])
                            tmp = [merged[merged.length - 2], merged[merged.length - 1]];
                            // console.log('tmp if i !== segments.length - 1 (next iterations): ', tmp);
                            // console.groupEnd()
                        }
                    }
                    if (i === 0 || t === 0) {
                        // console.log('i===0, merged:', merged);
                        if (output.length !== maxBitQuantity) {
                            merged.splice(1, 1);
                            output.push('0');
                            // console.log('output: ', output);
                        }
                        break;
                    } else {
                        // console.log(i, tmp)
                        let p02_2 = getAdditionalPoint(t, tmp[1].points[0], tmp[1].points[1]);
                        let p11 = getAdditionalPoint(t, tmp[1].points[1], tmp[1].points[2]);
                        let p02_3 = getCurvePoint(t, tmp[0].points[1], p11);
                        /* console.log('addPoint between', tmp[1].points[0], 'and', tmp[1].points[1],'is p02_2:', p02_2)
                         console.log('addPoint between', tmp[1].points[1], 'and', tmp[1].points[2],'is p11:', p11)
                         console.log('addPoint between', tmp[0].points[1], 'and', p11,'is p02_3:', p02_3)*/
                        /*console.group('difference')
                        console.log(p02_2, p02_3, accuracy)
                        console.log(isDifferenceSmaller(p02_2, p02_3, accuracy))
                        console.log(tmp[1].points[2], p02_2, accuracy)
                        console.log(isDifferenceSmaller(tmp[1].points[2], p02_2, accuracy))
                        console.log(tmp[1].points[2], p02_3, accuracy)
                        console.log(isDifferenceSmaller(tmp[1].points[2], p02_3, accuracy))
                        console.groupEnd()*/

                        // isDifferenceSmaller(p02_2, p02_3, accuracy)
                        // isDifferenceSmaller(tmp[1].points[2], p02_2, accuracy)
                        // isDifferenceSmaller(tmp[1].points[2], p02_3, accuracy)

                        if (isDifferenceSmaller(p02_2, p02_3, accuracy) === true ||
                            isDifferenceSmaller(tmp[1].points[2], p02_2, accuracy) === true ||
                            isDifferenceSmaller(tmp[1].points[2], p02_3, accuracy) === true) {
                            output.push('1');
                            /*let testMerged = merged.slice();
                            console.log('merged before splicing:',testMerged)*/
                            merged.splice(i - 1, 2, mergeSegments(t, tmp[0], tmp[1]));
                            /*let currentMerged = merged.slice();
                            console.log('merged after getting 1:', currentMerged)*/
                            i--;
                            // console.log('output: ', output);

                        } else {
                            output.push('0');
                            // console.log('output: ', output);

                        }
                    }
                } else {
                    merged.pop();
                    // console.log(merged)
                }

            }
            // console.log(output)
            if (output.length < maxBitQuantity) {
                // console.log('output is smaller than planned: ', output)
                // console.error('Error of decoding: segments were merged before getting all the message!')
                output = makeNbitAtEnd(output, maxBitQuantity)
                // console.log(output)
            }
            // console.log('ВОССТАНОВЛЕНО КРИВУЮ:', merged)
            // console.log('ИЗВЛЕКЛИ:', output.reverse().join(''));
            return output.reverse().join('');
        // }
    }
}


function decodePattern(maxBitQuantity, accuracy, segments, startStep, precision, steganoKey, patternTable) {
    console.log("Decoding...")

    // patternTable = initTestTableOfPatterns(4, maxBitQuantity);
    // console.log(segments.length)
    if (!segments[0].literal.match(/[ZzLlHhVv]/) && segments.length > maxBitQuantity / patternLength) {
        if (steganoKey !== null) {
            console.log('steganoKey: ', steganoKey)
            // console.log('accuracy:', accuracy)
            let output = [], parameter = 0;
            let merged = segments.slice();
            let t = steganoKey;
            let flag = true;
            do {
                let i = merged.length - 1;
                t = parseFloat(t.toFixed(4))
                // console.log(i, t)
                let tmp = [];
                if (i === segments.length - 1) {
                    // console.error('if i === length-1')
                    merged.splice(merged.length - 2, 2, mergeSegments(t, merged[merged.length - 2], merged[merged.length - 1]));
                    // console.log(merged)
                    i--;
                    tmp = [merged[merged.length - 2], merged[merged.length - 1]];
                    // console.log(tmp)
                    for (let j = 0; j < patternTable.length; j++) {
                        parameter = parseFloat((steganoKey - patternTable[j].step).toFixed(4));
                        let p02_2 = getAdditionalPoint(parameter, tmp[1].points[0], tmp[1].points[1]);
                        let p11 = getAdditionalPoint(parameter, tmp[1].points[1], tmp[1].points[2]);
                        let p02_3 = getCurvePoint(parameter, tmp[0].points[1], p11);

                        if (isDifferenceSmaller(p02_2, p02_3, accuracy) === true ||
                            isDifferenceSmaller(tmp[1].points[2], p02_2, accuracy === true ||
                                isDifferenceSmaller(tmp[1].points[2], p02_3, accuracy) === true)) {

                            output.push(patternTable.find(elem => elem.step === patternTable[j].step).pattern);

                            tmp = mergeSegments(parameter, merged[merged.length - 2], merged[merged.length - 1]);
                            merged.splice(merged.length - 2, 2, tmp);
                            // console.log(merged)
                            t = parameter;
                            break;
                        }
                    }
                } else if (merged.length === 1) {
                    for (let j = 0; j < patternTable.length; j++) {
                        // console.log(parameter)
                        let nextParameter = parseFloat((parameter - patternTable[j].step).toFixed(4));
                        if (nextParameter === startStep) {
                            // console.log(j, 'found next parameter:', nextParameter, patternTable[j].step)
                            // console.log(j, 'elem:', patternTable[j].pattern)
                            output.push(patternTable.find(elem => elem.step === patternTable[j].step).pattern);
                            flag = false;
                            break;
                        }
                    }
                } else {
                    // console.log('Center segments')
                    let tmp = [merged[merged.length - 2], merged[merged.length - 1]];

                    for (let j = 0; j < patternTable.length; j++) {
                        parameter = parseFloat((t - patternTable[j].step).toFixed(precision));
                        let p02_2 = getAdditionalPoint(parameter, tmp[1].points[0], tmp[1].points[1]);
                        let p11 = getAdditionalPoint(parameter, tmp[1].points[1], tmp[1].points[2]);
                        let p02_3 = getCurvePoint(parameter, tmp[0].points[1], p11);

                        if (isDifferenceSmaller(p02_2, p02_3, accuracy) === true ||
                            isDifferenceSmaller(tmp[1].points[2], p02_2, accuracy === true ||
                                isDifferenceSmaller(tmp[1].points[2], p02_3, accuracy) === true)) {

                            output.push(patternTable.find(elem => elem.step === patternTable[j].step).pattern);

                            tmp = mergeSegments(parameter, merged[merged.length - 2], merged[merged.length - 1]);

                            merged.splice(merged.length - 2, 2, tmp);
                            t = parameter
                            break;
                        }
                        if (j === patternTable.length - 1) {
                            console.error('Error of decoding! Could not find parameter..')
                            return;
                        }
                    }
                }

            }
            while (flag !== false);
            console.log(output)
            // console.log('ВОССТАНОВЛЕНО КРИВУЮ:', merged)
            // console.log('ИЗВЛЕКЛИ:', output.reverse().join(''));
            return output.reverse().join('');
        }
    }
}