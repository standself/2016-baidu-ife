var Wall = {
	//存储已经修建墙壁的坐标。
	walls: {
			coordinate:[],
			doms: []
		},
	//判断child是否在parentArray中，是就返回其索引。否则返回-1;.
	inArray: function(child, parentArray) {
		for ( var i = 0, len = parentArray.length; i < len; i++ ) {
			if ( child == parentArray[i] ) return i;
		}
		return -1;
	},
	/***
	 * @name 	修建隔墙
	 * @param x 	欲修建隔墙的横坐标
	 * @param y 	欲修建隔墙的纵坐标
	 ***/
	buildWall: function(x, y) {
		var xCoordinate = x * 40,
			yCoordinate = y * 40;
		var coordinate = [x, y];
		if ( !~inArray(coordinate, walls.coordinate) ) {
			//缓存新建墙壁的坐标
			walls.coordinate.push(coordinate);
			var div = document.createElemen("div"),
				divClass = div.getAttribute("class"),
				wrapper = document.getElementById("wrapper");
			div.setAttribute("class", "wall");
			div.style.position = "absolute";
			div.style.left = xCoordinate + "px";
			div.style.top = yCoordinate + "px";
			wrapper.appendChild(div);
			//缓存新建墙壁的对应dom元素。
			walls.doms.push(div);
		} else {
			console.log("已经有这个墙了。");
			return false;
		}
		return true;
	},
	/***
	 * @name 	粉刷墙
	 * @param color 粉刷的颜色
	 ***/ 
	brushWall: function(color) {
		//获取aim的方向，根据它的rotate角度来定。(rotate degree + 10 * 360 ) % 360 :这样做是为了把负值的degree转换为正值。
		//无法获得rotate degree值，但getComputedStyle(aim, false)["transform"].split(", ")[2]可以获得对应的方向的不同值，如下degrees;
		var aim = document.getElementById("aim"),
			degree = getComputedStyle(aim, false)["transform"].split(", ")[2],
			degrees = {
				"left": 1,
				"top": 0,
				"bottom": -1.24465e-16,
				"right": -1
			},
			xCoordinate = parseInt(aim.style.left) / 40,
			yCoordinate = parseInt(aim.style.top) / 40;
			x, y;//需要粉刷墙壁的坐标
		//获得方块的方向
		function getDirect(degree){
			for ( var i in degrees ) {
				if ( degree == degrees[i] ) return i;
			}
		}
		//根据获得的坐标、方向来确定需要粉刷的墙壁的坐标。如果该坐标在walls.coordinate里面存在，就粉刷对应的dom元素。
		switch( getDirect(degree) ) {
			case "left":
				x = xCoordinate - 1;
				y = yCoordinate;
				break;
			case "top":
				x = xCoordinate;
				y = yCoordinate -1;
				break;
			case "bottom":
				x = xCoordinate;
				y = yCoordinate + 1;
			case "right":
				x = xCoordinate + 1;
				y = yCoordinate;
				break;
		}
		var index = 0, brush;
		if ( !~inArray([x, y], walls.coordinate) ) {
			index = inArray([x, y], walls.coordinate);
			walls.doms[index].style.backgroundColor = "steelblue";
		} else {
			console.log("没有墙壁可供粉刷。");
		}
	},
	randomWall: function() {
		var x = Math.floor(Math.random()) * 10,
			y = Math.floor(Math.random()) * 10;
		if (buildWall(x, y) ) console.log("随机建墙失败。");
	},
	longWall: function(coordinateArr) {

	},
	moveTo: function(x, y) {
		var aim = document.getElementById("aim"),
			x0 = parseInt(aim.style.left) / 40,
			y0 = parseInt(aim.style.top) / 40,
			stepX = ( (x - x0) >= 0 ) ? (x - x0) : (x0 -x),
			stepy = ( (y - y0) >= 0 ) ? (y - y0) : (y0 -y);
		var timer = setInterval(function() {
			console.log("moveTo selfe");
			if ( (x >= x0) && (y >= y0) ) {
				x0 = 
				aim.style.left = x0 * 40 + "px";
				aim.style.top = y0 * 40 + "px";
			} else if ( (x < x0) && ( y >= y0 ) ) {
				if ( x0 != x ) {
					x0 -= 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				} else if ( y0 != y ) {
					y0 += 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				}
			} else if ( x >= x0 && y < y0 ) {
				if ( x0 != x ) {
					x0 += 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				} else if ( y0 != y ) {
					y0 -= 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				}
			} else {
				if ( x0 != x ) {
					x0 -= 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				} else if ( y0 != y ) {
					y0 -= 1;
					aim.style.left = x0 * 40 + "px";
					aim.style.top = y0 * 40 + "px";
				}
			}
			if ( x0 == x && y0 == y ) clearInterval(timer);
		}, 1000);	
	}
}