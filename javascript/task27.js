$(function(){
function Rocket(id, model, atten) {
	this.id = id;
	this.command = "stop";
	this.model = model;
	this.atten = atten;
	var operate_timer;
	var energy_timer;
	var bus_timer;
	var deg = 0;//运行的位置存储，旋转的角度。
	var that = this;//用于同一对象内部各方法的相互调用.
	//火箭运行
	this.createDiv = function () {
		var $rocket = $("<div/>"),
			$energy = $("<div/>"),
			$energy_rest = $("<div>#"+this.id+"-100%"+"</div>");
			$img = $("<img src='./image/rocket-active.png'/>");
		$rocket.addClass("rocket");
		$energy.addClass("energy");
		$energy_rest.addClass("energy-rest");
		$rocket.append($energy.append($energy_rest)).append($img).attr("id", this.id);
		var $interface = $(".interface");
		$interface.append($rocket);
		//用bus进行广播；
		that.bus();
		return $rocket;
	};

	this.operate = function () {
		var operate_model = getModel(that.model) || 500; // 如果没设置运行速度，就默认为1;
		var $div = $("#"+this.id);
		switch (that.command){
			case "stop":
				clearInterval(operate_timer);
				clearInterval(energy_timer);
				break;
			case "destory":
				clearInterval(operate_timer);
				clearInterval(energy_timer);
				clearInterval(bus_timer);
				$div.remove();
				rockets[that.id] = "";
				break;
			case "start":
				operate_timer = setInterval(function(){
					deg = deg + 10;
					$div.css({
						"transform": "rotate("+deg+"deg)",
						"transform-origin": "140px 40px"
					});
					that.energy();
				}, operate_model);
				break;
		}
	};
	//火箭耗能、充能
	this.energy = function () {
		var default_atten = [0.1, 0.1];
		var attenuation = getAtten(that.atten) || default_atten;
		var $energy_rest = $("#"+this.id).find(".energy-rest");
		var width = $energy_rest.css("width");
		width = parseInt(width)*(1-attenuation[0]);//在原来的基础上自减；
		var name = this.id;
		$energy_rest.text("#"+name+"-"+(width/40).toFixed(2)*100 + "%");
		$energy_rest.css("width", width + "px");
		if ( width < 12 ) {
			clearInterval(operate_timer);
			energy_timer = setInterval(function(){
				if ( width >= 40 ) {
					clearInterval(energy_timer);
					that.operate();
				}
				width = width*(1+attenuation[1]);//自增；
				$energy_rest.css("width", width+"px");
				$energy_rest.text("#"+name+"-"+(width/40).toFixed(2)*100 + "%");
			},400);
		}
	};
	this.bus = function() {
		var podcast = $(".cast fieldset");
		var	bus_adpater;
		bus_timer = setInterval(function(){
			bus_adpater = new Adpater();
			var podcast_text = bus_adpater.binary(that.id, that.model, that.atten);
			podcast.append("<p>广播："+podcast_text+"</p>");
			bus_adpater.dispaly();
		},2000);
	}
}

//指令
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
	var that = this;
	this.send = function() {
		//往命令列表里面写命令;
		if ( !data  ) return;
		that.info_command.prepend($("<p>"+"rocket #"+that.id+": "+that.command+"</br>&nbsp;&nbsp;time:"+getTime()+"</p>"));
	};
	this.recieved = function() {
		//当对应id的火箭收到消息后，火箭根据消息运行。往火箭状态里面写状态，格式为：rocket #id ：state。如果丢包，就什么也不干。
		if ( !data || !lost() ) {
			this.info_state.prepend($("<p>command lost!</br>&nbsp;&nbsp;time:"+getTime()+"</br>&nbsp;&nbsp;send again!</p>"));
			var timer = setTimeout(function(){
				return that.recieved(); 
			}, 2000);
		}
		if ( that.rocket.length == 0 )  return alert("尚未创建 rocket"+that.id+"号！你不能执行此操作。");
		that.info_state.prepend($("<p>"+"Recieved!&nbsp;rocket #"+that.id+": "+that.command+"</br>&nbsp;&nbsp;time:"+getTime()+"</p>"));
		rockets[that.id].command = that.command;
		rockets[that.id].operate();
	};
	function lost() {
		//就取随机数，在某个范围（0.3以内）	的就表示成丢包false；不传递。
		var randomNum = Math.random();
		return ( randomNum >  0.3);
	};
}

//控制台
function controller() {
	var $formbtn = $(".controller button");
	var $input = $(".controller input");
	$formbtn.on("click",function(e){
		var event = document.event || e;
		var target = event.target || event.srcElement;
		var parentClass = target.parentNode.className;
		var command = target.innerText;
		data.id = parentClass[parentClass.length-1];
		data.command = command;  
		state = new State(data);
		state.send();
		state.recieved();
	});
	$input.on("click", function(){
		for (attr in rockets) {
			console.log("attr:"+attr);
			if ( rockets[attr] == "") {
				var model = $(".model input:checked").val();
				var atten = $(".attenuation input:checked").val();
				rockets[attr] = new Rocket(attr, model, atten);
				rockets[attr].createDiv(attr);
				data.id = attr;
				data.command = "stop";
				$(".info .info_command").prepend($("<p>"+"new rocket: #"+attr+"</br>&nbsp;&nbsp;time:"+getTime()+"</p>"));
				break;
			}
		}
	});

}
//获得当前时间
function getTime(){
	var time = new Date();
	var time_str = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds(); 
	return time_str;
}

//数据处理中心，adapter模块
function Adpater(){
	var states = {
		"destory": 1100,
		"stop": 0010,
		"start": 0001
	};
	var models = {
		"model1": 1,
		"model2": 2,
		"model3": 3
	};
	var attens = {
		"atten1": 1,
		"atten2": 2,
		"atten3": 3
	}; 
	this.binary = function(id, model, atten) {
		var energy_rest = parseInt($("#"+id).find(".energy-rest").css("width"));
		energy_rest = toBinary(energy_rest, 8);
		var rocket_id = parseInt(id);
		rocket_id = toBinary(rocket_id, 4);
		model = models[model];
		atten = attens[atten];
		model = toBinary(model, 4);
		atten = toBinary(atten, 4);
		data_center[id] =  rocket_id+model+atten+energy_rest;
		return data_center[id];
	}
	this.dispaly = function() {
		var table_state = $(".nowState tbody");
		var table_state_firstChild = $("<tr><th>编号</th><th>型号</th><th>动力</th><th>状态</th></tr>");
		table_state.empty().append(table_state_firstChild);
		for ( attr in data_center ) {
			var id = attr, model, atten, energy_rest;
			for ( attrModel in models ) {
					if ( data_center[attr].substr(4,4) == toBinary(models[attrModel], 4) ) model = attrModel;
				}
				for ( attrAtten in attens ) {
					if ( data_center[attr].substr(8,4) == toBinary(attens[attrAtten], 4) ) atten = attrAtten;
				}
				energy_rest = parseFloat(data_center[attr].substr(12,4)).toFixed(2)*100 + "%";
				table_state.append("<tr><td>"+id+"</td><td>"+model+"</td><td>"+atten+"</td><td>"+energy_rest+"</td></tr>");
		}
	}
}
//获得火箭型号
function getModel(model){
	console.log("model:"+model);
	switch (model){
		case "model1":
			model = 600;
			break;
		case "model2":
			model = 400;
			break;
		case "model3":
			model = 200;
			break;
	}
	return model;
}
//获得火箭动力
function getAtten(atten){
	switch (atten){
		case "atten1":
			atten = [0.2, 0.04];
			break;
		case "atten2":
			atten = [0.1, 0.06];
			break;
		case "atten3":
			atten = [0.05, 0.1];
			break;
	}
	return atten;
}

//将数字变成指定位数的二进制字符
function toBinary(num, len){
	var str = num.toString(2);
	while( str.length<len ) {
		str = "0" + str;
	}
	return str;
}
var data = {
	id: "",
	command: ""
};
/*rockets = {
 *	"1": new Rocket("1"),
 *  "2": new Rocket("2"),
 *}
 */
var rockets = {
	"1": "",
    "2": "",
    "3": "",
    "4": "",
};
var data_center = {};
controller();
});