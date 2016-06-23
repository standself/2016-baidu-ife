var openArr = [],
	closedArr = [],
	parentArr = [];

var Aim = function(x, y) {
	this.x = x;
	this.y = y;
	this.G = 0;
}
var End = {
	x: x,
	y: y;
}
var Neightbor = function(parent, direct) {
	this.parent = parent || aim;
	switch (direct) {
		case "left":
			this.x = this.parent.x - 1;
			break;
		case "right":
			this.x = x + 1;
			break;
		case "top":
			this.y = y - 1;
			break;
		case "bottom":
			this.y = y + 1;
			break;
	}
	this.direct = direct;
	this.G = 1;
	this.H = x0 + y0;
	this.F = this.G + this.H;
	this.init = function() {
		this.getH();
		this.getG();
		this.getF();
	};
	this.init();
}
neightbor.prototype.getH = function() {
	var x = this.x,
		y = this.y;
	this.H = Math.abs(y - End.y) + Math.abs(x - end.x);
}
Neightbor.prototype.getG = function() {
	this.G = this.parent.G + 1;
}
neightbor.prototype.getF = function(parent) {
	this.F = this.G + this.H;
}

function checkIn(obj, openArr) {
	if ( !object.prototype.toString.call(obj) == "[object Object]" ) {
		console.log("line 53，checkIn: 	参数obj不是对象。");
		return false;
	}
	for ( var  i = 0, len = openArr.length; i < len; i++ ) {
		if ( obj == openArr[i] ) return false; 
	}
	return true;
}

function compare() {
	var args = [].slice.call(arguments),
		len = args.length,
		bigger = args[0];
	for ( var i = 0; i < len; i++ ) {
		bigger = (bigger.F < args[i].F) ? bigger : args[i];
	}
	return bigger;
}

function findPath(parent) {
	var parent = parent || aim;
	
}

