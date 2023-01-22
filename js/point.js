'use strict';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    multiplyPointOnNumber(number) {
        return new Point(this.x * number, this.y * number);
    }

    toString() {
        return (JSON.stringify(this.x) + ',' + JSON.stringify(this.y) + ' ');
    };
}





function dividePointOnNumber(point, number){
    return new Point(round((point.x / number), precision), round((point.y / number), precision));
}

function addPoints(point1, point2) {
    return new Point(round((point1.x + point2.x), precision), round((point1.y + point2.y), precision));
}

function subtractPoints(point1, point2){
    return new Point(point1.x - point2.x, point1.y - point2.y);

}

function getCurvePoint(parameter, point1, point2) {//get point as expression (1-t)*P1+t*P2 (de Casteljau), i.e. to get point of curve
    return addPoints(point1.multiplyPointOnNumber(1 - parameter),
        point2.multiplyPointOnNumber(parameter));
}

function getAdditionalPoint(parameter, point1, point2){//get point as expression (point1 - t*point2)/(1 - t)
    return dividePointOnNumber(subtractPoints(point1,(point2.multiplyPointOnNumber(parameter))), (1 - parameter))
}

function getInterimPointOnAdditionalLines(parameter, point1, point2, precision){ //for splitting curve
    let res = addPoints(point1, subtractPoints(point2, point1).multiplyPointOnNumber(parameter))
    return new Point(round(res.x, Number(precision)), round(res.y, Number(precision)));
}

function getDifferenceBetweenPoints(point1, point2){
    return [Math.abs(point1.x - point2.x), Math.abs(point1.y - point2.y)];
}

function isDifferenceSmaller(point1, point2, number){
    let values = getDifferenceBetweenPoints(point1, point2);
    // console.log('DIFFERENCE', point1, point2, values)
    return values[0] <= number && values[1] <= number;
}

function getDistanceBetween2points(point1, point2) {
    return Math.sqrt(
        ((Math.pow(point1.x - point2.x, 2)) + (Math.pow(point1.y - point2.y, 2)))
    );
}
function isPointsTheSame(point1, point2){
    if (point1.x === point2.x && point1.y === point2.y) return true;
}





