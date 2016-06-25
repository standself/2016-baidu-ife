/***
 *出现的问题在 line 112， this.openList.push(neighbor);
 *只要这句话存在，这个程序就启动一直卡着。
 */


var FindPath = function(startX, startY, endX, endY, walls) {
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.startNode = {
		x: startX,
		y: startY,
		g: 0,
		f: 0,
		preCurrent: null
	};
	this.openList = new Array();
	this.closeList = new Array();
	this.walls = walls;
};

FindPath.prototype.getNeighbors = function(preCurrentNode) {
	var neighbors = [],
		x = preCurrentNode.x || this.startX;
		y = preCurrentNode.y || this.startY;

	// 计算x， y;checkwalk判断是否是和墙。；
	if ( this.checkWalk(x - 1, y) && !this.inArray([x-1, y], this.walls) ) {
		neighbors.push(this.getneighbor(x-1, y)); 
	}
	if ( this.checkWalk(x, y -1) && !this.inArray([x, y-1], this.walls) ) {
		neighbors.push(this.getneighbor(x, y-1));
	}
	if ( this.checkWalk(x+1, y) && !this.inArray([x+1, y], this.walls) ) {
		neighbors.push(this.getneighbor(x+1, y));
	}
	if ( this.checkWalk(x, y+1) && !this.inArray([x, y+1], this.walls) ) {
		neighbors.push(this.getneighbor(x, y+1));
	}
	return neighbors;
};

FindPath.prototype.getneighbor = function(x, y) {
	var Neighbor = {};
	Neighbor.x = x;
	Neighbor.y = y;
	Neighbor.g = 0;
	Neighbor.h = Math.abs(x - this.endX) + Math.abs(y - this.endY);
	Neighbor.f = 0;
	return Neighbor;
};

//动态更新墙壁或障碍使用。
FindPath.prototype.getWalls = function(walls) {
	this.walls = this.walls.concat(walls);
};

FindPath.prototype.openUpdate = function(openList) {
	this.openList.sort(function(a, b) {
		return b.f - a.f;
	});
};
FindPath.prototype.checkWalk = function(x, y) {
	//当新格子不在表格里面，返回false。
	if ( (x > 0 && x <= 10) && (y > 0 && y <= 10 ) ) return true;
};
/**
 * @name 检查arr1 是否是arr2 的子元素
 **/
FindPath.prototype.inArray = function(arr1, arr2) {
	//没进行错误处理。
	//如果arr2的子元素是对象，表明arr2是neighbors数组,  arr1如果也是对象，则是neighbor元素；
	if ( Object.prototype.toString.call(arr1) == "[object Object]" && Object.prototype.toString.call(arr2[0]) == "[object Object]" ) {
		for ( var i = 0, len = arr2.length; i < len; ++i ) {
			if ( arr1 == arr2[i] ) return true;
		}
	//如果arr2的子元素是数组，表明这个函数是判断arr2是否包含了arr1数组。
	} else if ( Object.prototype.toString.call(arr2[0]) == "[object Array]" ) {
		for ( var i = 0, len = arr2.length; i < len; ++i ) {
			//[1, 2] 和 [1, 2]在这里==为false。
			if ( arr1[0] == arr2[i][0] && arr1[1] == arr2[i][1] ) return true;
		}
	}
	return false;
}
FindPath.prototype.findpath = function() {
	var cur = this.startNode, neighbors, neighbor, ng;
	this.openList.push(cur);
	while ( this.openList.length > 0) {
		//获得openList中F值最小的格子，并加入到关闭列表closeList。
		cur = this.openList.pop();
		this.closeList.push(cur);

		//如果目标格子在开启列表中，就返回。表明找到路径。
		if ( this.inArray([this.endX, this.endY], this.openList) ) return this.traceBack(cur);

		//获得当前格子的相邻格子。
		neighbors = this.getNeighbors(cur);

		//计算当前相邻格子的G值
		ng = cur.g + 1;

		for ( var i = 0, len = neighbors.length; i < len; i++ ) {			
			neighbor = neighbors[i];

			//如果这个格子不可通过（已经在getNeighbors中判断了）或者已经在关闭列表中,( 格子的关闭和开启属性都默认为false)
			if ( this.inArray(neighbor, this.closeList) ) continue;

			//如果格子不在开启列表中, 加入至开启列表，计算f值。
			//如果格子在开启列表中，计算新的G值和原来的G值大小，如果新的G值更小，那就重新计算f值，并更新openList.
			if ( !this.inArray(neighbor, this.openList) || ng < neighbor.g ) {
				//this.openList.push(neighbor);
				neighbor.g = ng;
				neighbor.f = neighbor.h + neighbor.g;
				if ( !this.inArray(neighbor, this.openList) ) {
					this.openList.push(neighbor);
				} else {
					this.openUpdate();
				}
			}
		}
	}
	//没有找到路径
	return [];
};

FindPath.prototype.traceBack = function(cur) {
	var road = [];
	road.unshift([this.endX, this.endY]);
	road.unshift([cur.x, cur.y]);
	console.log("cur.pre", cur.preCurrent);
	var flag = true;
	while ( flag ) {
		var currentArr = [cur.preCurrent.x, cur.preCurrent.y];
		road.unshift(currentArr);
		if ( cur.preCurrent == this.startNode ) break;
		cur = cur.preCurrent;
	}
	return road;
};