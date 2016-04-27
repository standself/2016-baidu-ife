$(function(){
function Rocket(id) {
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
/*data = {
 *	id: "1",
 *	command: "start"
 *}
 */
function State(data) {
	this.id = data.id;
	this.command = data.command;
	this.info_command = $(".info .info_command");
	this.info_state = $(".info .info_state");
	this.rocket = $("#"+this.id);
	this.time = new Date();
	this.time_str = this.time.getHours() + ":" + this.time.getMinutes() + ":" + this.time.getSeconds(); 
	this.send = function() {
		//往命令列表里面写命令;
		if ( !data  ) return;
		this.info_command.append($("<p>"+"rocket #"+this.id+": "+this.command+"</br>&nbsp;&nbsp;time:"+this.time_str+"</p>"));
	};
	this.recieved = function() {
		//当对应id的火箭收到消息后，火箭根据消息运行。往火箭状态里面写状态，格式为：rocket #id ：state。如果丢包，就什么也不干。
		if ( !data || !lost() ) return this.info_state.append($("<p>command lost!  time:"+this.time_str+"</p>"));
		if ( this.rocket.length == 0 ) rockets[this.id].createDiv();
		this.info_state.append($("<p>"+"Recieved!&nbsp;rocket #"+this.id+": "+this.command+"</br>&nbsp;&nbsp;time:"+this.time_str+"</p>"));
		rockets[this.id].command = this.command;
		rockets[this.id].operate();
	};
	function lost() {
		//就取随机数，在某个范围（0.3以内）	的就表示成丢包false；不传递。
		var randomNum = Math.random();
		return ( randomNum >  0.3);
	};
}

//控制台
function controller() {
	var $formbtn = $("button");
	$formbtn.on("click",function(e){
		var event = document.event || e;
		var target = event.target || event.srcElement;
		var parentClass = target.parentNode.className;
		var command = target.innerText;
		console.log(command);
		data.id = parentClass[parentClass.length-1];
		data.command = command;  
		state = new State(data);
		state.recieved();
	});
}
var data = {
	id: "2",
	command: "start"
};
/*rockets = {
 *	"1": new Rocket("1"),
 *  "2": new Rocket("2"),
 *}
 */
var rockets = {

    "2": new Rocket("2"),
};
/*rockets["2"].createDiv();
rockets["2"].operate();
rockets["2"].command = "start";//state要改这里的状态。
rockets["2"].operate();*/
controller();
var state = new State(data);
state.recieved();

});