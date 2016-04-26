$(function(){
function NewRocket(id) {
	this.id = id;
	this.createDiv = function () {
		var $rocket = $("<div/>"),
			$energy = $("<div/>"),
			$energy_rest = $("<div/>");
			$img = $("<img src='./image/rocket-active.png'/>");
		$rocket.addClass("rocket");
		$energy.addClass("energy");
		$energy_rest.addClass("energy-rest");
		$rocket.append($energy.append($energy_rest)).append($img).attr("id", this.id);
		var $interface = $(".interface");
		$interface.append($rocket);
		return $rocket;
	};

	var operate_timer;
	var energy_timer;
	var deg = 0;//运行的位置存储，旋转的角度。
	var that = this;//用于同一对象内部各方法的相互调用.
	//火箭运行
	this.command = "stop";
	this.operate = function (speed) {
		speed = speed || 1; // 如果没设置运行速度，就默认为1;
		var $div = $("#"+this.id);
		switch (this.command){
			case "stop":
				clearInterval(operate_timer);
				clearInterval(energy_timer);
				break;
			case "destory":
				$parent = $div.parentNode;
				$parent.removeChild($div);
				break;
			case "start":
				operate_timer = setInterval(function(){
					deg = deg + 10*speed;
					console.log(deg);
					$div.css({
						"transform": "rotate("+deg+"deg)",
						"transform-origin": "140px 40px",
					});
					that.energy();
				}, 500);
				break;
		}
	};
	//火箭耗能、充能
	this.energy = function () {
		var $energy_rest = $("#"+this.id).find(".energy-rest");
		var width = $energy_rest.css("width");
		width = parseInt(width)*(1-0.1);
		$energy_rest.text((width/40).toFixed(2)*100 + "%");
		$energy_rest.css("width", width + "px");
		if ( width < 12 ) {
			clearInterval(operate_timer);
			energy_timer = setInterval(function(){
				if ( width >= 40 ) {
					clearInterval(energy_timer);
					that.operate();
				}
				width = width*(1+0.1);
				$energy_rest.css("width", width+"px");
				$energy_rest.text((width/40).toFixed(2)*100 + "%");
			},200);
		}
	};

}

//状态变化
function state(data) {
	this.data = data;
	this.send = function() {
		//往命令列表里面写命令;
	};
	this.recieved = function() {
		//当对应id的火箭收到消息后，往火箭状态里面写状态，格式为：rocket #id ：state。
	}
	this.lost = function() {
		//就取随机数，在某个范围的就表示成丢包；不传递。
	};
}

//控制台
function controller() {
	//
}
var div1 = new NewRocket("1");
div1.createDiv();
div1.operate();
});