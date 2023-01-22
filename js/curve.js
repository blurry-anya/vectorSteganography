'use strict';

class Curve {
    literal;
    startPoint;
    segments;
    /*constructor(startPoint, segments) {
        this.startPoint = startPoint;
        this.segments = segments;
    }
*/
    constructor(literal, startPoint, segments) {
        this.literal = literal;
        this.startPoint = startPoint;
        this.segments = segments;
    }


    quadraticBezier(parameter, index) {
        // console.log('segment:',index)
        // console.log(this.segments[index][2])
        let point01 = getInterimPoint(parameter, this.segments[index][0], this.segments[index][1]);
        let point12 = getInterimPoint(parameter, this.segments[index][1], this.segments[index][2]);
        return getInterimPoint(parameter, point01, point12);
    }

    cubicBezier(parameter, segment) {

        let point012 = this.quadraticBezier(this.segments[segment][0], this.segments[segment][1], this.segments[segment][2], parameter),
            point123 = this.quadraticBezier(this.segments[segment][1], this.segments[segment][2], this.segments[segment][3], parameter);
        return getInterimPoint(parameter, point012, point123);
    }

   /* toString() {
        let stringOfPoints = '';
        // console.log('TO STRING\n this.segments.length:', this.segments, this.segments.length)
        for (let i = 0; i < this.segments.length; i++) {
            stringOfPoints += 'C';
            for (let j = 0; j < this.segments[i].length; j++) {
                stringOfPoints += this.segments[i][j].toString();
            }
        }
        return 'M' + this.startPoint + stringOfPoints.replace(/\s,/g, ' ');
    }*/
    toString(){
        for (let i = 0; i < this.segments.length; i++) {

        }
    }


    toStringForFragments(){
        let stringOfPoints = '';
        // console.log('TO STRING\n this.segments.length:', this.segments, this.segments.length)
        for (let i = 0; i < this.segments.length; i++) {
            stringOfPoints += 'c';
            for (let j = 0; j < this.segments[i].length; j++) {
                stringOfPoints += this.segments[i][j].toString();
            }
        }
        return 'm' + this.startPoint + stringOfPoints.replace(/\s,/g, ' ');
    }
}

class segment{
    literal;
    points;
    valid;
    constructor(validness, literal, points) {
        this.valid = validness;
        this.literal = literal;
        this.points = points;
    }

    toString(){
        let points = '';
        for (let i = 0; i < this.points.length; i++) {
            points += this.points[i].toString();
        }
        return String(this.literal) + ' ' + points;
    }
}

function initMatrix(size) {
    let matrix = new Array(size);
    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size - i);
    }
    return matrix;
}

function getBernsteinPolynomial(n, i, parameter) {//базисная функция кривой Безье/полином Бернштейна
    return (binomial(n, i) * parameter * Math.pow(1 - parameter, n - i));
}

function binomial(n, i) {
    if ((typeof n !== 'number') || (typeof i !== 'number'))
        return false;
    let coefficient = 1;
    for (let x = n - i + 1; x <= n; x++) coefficient *= x;
    for (let x = 1; x <= i; x++) coefficient /= x;
    return coefficient;
}


function getControlPoints(startPoint, pointsOfCurve, parameterStep) {//передаем один сегмент из массива сегментов
    let controlPoints = [];
    for (let i = 0, parameter = 0.1; i < pointsOfCurve.length; i++) {
        if (parameter > 1) {
            parameter = 1
        }
        if (i === 0) {
            // console.log(pointsOfCurve[i])
            controlPoints.push(calcPoint(pointsOfCurve[i], startPoint, parameter));
        } else {
            controlPoints.push(calcPoint(pointsOfCurve[i], pointsOfCurve[i - 1], parameter));
        }
        parameter += parameterStep;
    }
    console.log(controlPoints)
    return controlPoints;
}

function calcPoint(pointOfCurve1, pointOfCurve2, parameter) {//return P1=(P10 - (1-t)P0)/t
    // console.log(pointOfCurve1, pointOfCurve2)
    return new Point(
        parseFloat(((pointOfCurve1.x - (1 - parameter) * pointOfCurve2.x) / parameter).toFixed(6)),
        parseFloat(((pointOfCurve1.y - (1 - parameter) * pointOfCurve2.y) / parameter).toFixed(6))
        /*(pointOfCurve1.x - (1 - parameter)* pointOfCurve2.x)/parameter,
        (pointOfCurve1.y - (1 - parameter)* pointOfCurve2.y)/parameter*/
    );
}


function new_bezier_point(p0, p0hr, p1hl, p1, t) {
    let t1 = p0 + (p0hr - p0) * t,
        t2 = p0hr + (p1hl - p0hr) * t,
        t3 = p1hr + (p1 - p1hl) * t,
        p2hl = t1 + (t2 - t1) * t,
        p2hr = t2 + (t3 - t2) * t,
        p2 = p2hl + (p2hr - p2hl) * t;
    return [t1, p2hl, p2, p2hr, t3]
}

function splitCurve(parameter, points, precision) {
    let segment1 = [], segment2 = [], matrixDeCasteljau = initMatrix(points.length);
    // console.log('входные значения точек: ', points)
    for (let i = 0; i < matrixDeCasteljau.length; i++) {
        for (let j = 0; j < matrixDeCasteljau[i].length; j++) {
            if (i === 0) {
                matrixDeCasteljau[i][j] = points[j]
            } else {
                matrixDeCasteljau[i][j] = getInterimPointOnAdditionalLines(parameter, matrixDeCasteljau[i - 1][j], matrixDeCasteljau[i - 1][j + 1], precision);
                // console.log(i, j, 'obtained point between ', matrixDeCasteljau[i - 1][j], 'and', matrixDeCasteljau[i - 1][j + 1], 'is', matrixDeCasteljau[i][j])
            }
        }
    }
    for (let i = 0; i < matrixDeCasteljau.length; i++) {
        segment1.push(matrixDeCasteljau[i][0]);
        segment2.push(matrixDeCasteljau[i][matrixDeCasteljau[i].length - 1])
    }
    // console.table(matrixDeCasteljau)
    return [segment1, segment2.reverse()];
}

function mergeSegments(parameter, segment1, segment2){
    let p2 = getAdditionalPoint(parameter, segment2.points[2], segment2.points[3]);
    let p11 = getAdditionalPoint(parameter, segment2.points[1], segment2.points[2]);
    let p1 = getAdditionalPoint(parameter, p11, p2);
    // console.log('input segments: ', segment1, segment2);
    // console.log('merged segments: ', [segment1.points[0], p1, p2, segment2.points[3]])
    return new segment('none', segment1.literal, [segment1.points[0], p1, p2, segment2.points[3]]);
}