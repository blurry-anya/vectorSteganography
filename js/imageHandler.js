'use strict';

function selectCurves(stringPath) {
    let res = [];
    let splittedPath = stringPath.split(' ').filter(elem => elem !== '');
    // console.log(splittedPath)

    let curveLiterals = getAllIndexes(splittedPath, /[Mm]/)

    let segmentPoints = [], segments = [];
    for (let i = 0; i < curveLiterals.length; i++) {
        if (i === curveLiterals.length - 1) {
            segmentPoints.push(splittedPath.slice(curveLiterals[i], splittedPath.length))
        } else {
            segmentPoints.push(splittedPath.slice(curveLiterals[i], curveLiterals[i + 1]))
        }
        // console.log(segmentPoints[i])
        let segmentsLiterals = getAllIndexes(segmentPoints[i], /[CcLlHhVvZz]/);//add other cases
        let splittedPoints = [];
        for (let index = 0; index < segmentsLiterals.length; index++) {
            let points = [];
            if (index === segmentsLiterals.length - 1) {
                points = segmentPoints[i].slice(segmentsLiterals[index], splittedPath.length)
            } else {
                points = segmentPoints[i].slice(segmentsLiterals[index], segmentsLiterals[index + 1])
            }
            // console.log(points, points[0], points.slice(1, points.length))
            splittedPoints.push(new segment('none', points[0], points.slice(1, points.length)))
            // console.log(splittedPoints[index])
        }
        res.push(new Curve(segmentPoints[i][0], segmentPoints[i][1], splittedPoints))
    }
    // console.log(res)
    return res;
}


function getAllIndexes(arr, val) {
    let indexes = [], i;
    for (i = 0; i < arr.length; i++)
        if (arr[i].match(val))
            indexes.push(i);
    return indexes;
}

function getSegmentsAmount(curves) {
    let amount = 0;
    for (let i = 0; i < curves.length; i++) {
        for (let j = 0; j < curves[i].length; j++) {
            amount += curves[i][j].segments.length;
        }
    }
    return amount;
}


function stringPointToPoint(stringPoint) {
    if (typeof stringPoint === 'string') {
        return new Point(Number(stringPoint.slice(0, stringPoint.indexOf(','))), Number(stringPoint.slice(stringPoint.indexOf(',') + 1, stringPoint.length)))
    }
}

function getCanonicalForm(curves) {// represent points in the canonical view {startPoint, p1, p2, p3}, where startPoint is previous point if i != 0;
    // console.log('curve to be presented in canonical form: ', curve)
    for (let i = 0; i < curves.length; i++) {
        // console.log(i, 'curve[i]:', curves[i])
        for (let j = 0; j < curves[i].segments.length; j++) {
            if (!curves[i].segments[j].literal.match(/[LlVvHhZz]/)) {
                if (j === 0) {
                    curves[i].segments[j].points.unshift(curves[i].startPoint)
                } else {
                    curves[i].segments[j].points.unshift(curves[i].segments[j - 1].points[curves[i].segments[j - 1].points.length - 1])
                }
            } else {
                console.log(curves[i].segments[j].literal)

            }
        }
    }
    console.log('getCanonicalForm curve:', curve)
    return curves;
}

function checkIfCurveIsPolybezierAndTransform(curves) {
    let register = "C";
    for (let i = 0; i < curves.length; i++) {
        // console.log(curves[i])
        if (curves[i].segments.length >= 1) {
            for (let j = 0; j < curves[i].segments.length; j++) {
                if (curves[i].segments[j].literal !== register) {
                    // console.log(i, j, curves[i].segments[j])
                    if (curves[i].segments[j].literal.match(/[Zz]/)) {
                        curves[i].segments[j].literal = curves[i].segments[j].literal.toUpperCase();
                        curves[i].segments[j].points.shift();
                        break;
                    }
                    // console.log(i, j, curves[i].segments[j].literal)
                    let startPoint = curves[i].segments[j].points[0];
                    curves[i].segments[j].points = curves[i].segments[j].points.map(el => addPoints(el, startPoint));
                    curves[i].segments[j].points[0] = subtractPoints(curves[i].segments[j].points[0], startPoint);
                    curves[i].segments[j].literal = curves[i].segments[j].literal.toUpperCase();
                    curves[i].segments = refreshSegments(curves[i].segments);


                }
            }
        }
    }
    // console.log(curves)
    return curves;
}


function refreshSegments(segments) {
    for (let i = 0; i < segments.length; i++) {
        if (i > 0) {
            if (segments[i].points[0] !== segments[i - 1].points[segments[i - 1].points.length - 1]) {
                segments[i].points[0] = segments[i - 1].points[segments[i - 1].points.length - 1];
            }
        }
    }
    return segments;
}

function chunkByFixedLength(segmentObj, length) {
    let chunked = [];
    // console.log(segmentObj)
    for (let i = 0; i < Math.ceil(segmentObj.points.length / length); i++) {
        chunked.push(new segment('none',segmentObj.literal, segmentObj.points.slice(i * length, i * length + length)))
    }
    return chunked;
}


function extractCurves(curveObj, requiredOrder) {
    let res = [];
    for (let i = 0; i < curveObj.length; i++) {
        let chunkedSegments = [];
        for (let j = 0; j < curveObj[i].segments.length; j++) {
            // console.log(i, j, curveObj[i].segments[j])
            if (curveObj[i].segments[j].points.length > requiredOrder) {
                chunkedSegments.push(chunkByFixedLength(curveObj[i].segments[j], 3));
            } else if (curveObj[i].segments[j].literal.match(/[Ll]/)) {
                // console.log('curveObj[i].segments[j].literal.match(/[Ll]/):', curveObj[i].segments[j])
                console.log(curveObj[i].segments[j].literal)
                // chunkedSegments.push(new segment(curveObj[i].segments[j].literal, curveObj[i].segments[j].points));
                chunkedSegments.push(curveObj[i].segments[j]);
                console.log(chunkedSegments[j])
            } else {
                chunkedSegments.push(new segment('none', curveObj[i].segments[j].literal, curveObj[i].segments[j].points));
            }
        }
        if (chunkedSegments.length > 0) {
            res.push(new Curve(curveObj[i].literal, curveObj[i].startPoint, chunkedSegments.flat()))
        } else {
            res.push(curveObj[i])
        }
    }
    // console.log(res)
    return res;
}

function isValid(points, minDistance) {
    let validness = 'yes'
    if (points.length < curveOrder){
        return validness = 'no'
    }
    for (let i = 1; i < points.length; i++) {
        if (getDistanceBetween2points(points[i-1], points[i]) <= minDistance) {
            validness = 'no';
            break;
        }
    }
    return validness;
}