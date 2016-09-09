//Constants

var FRAME_RATE = 60; //per second



var playwindow = document.getElementById("playwindow");
var down = 0;
var up = 0;
var drag = false;
var mousex;
var mousey;
var rope_hotspots = new Array();
var ear_hotspots = new Array();
var selection = false;
var selected_item_id;
var rub_on = false;
var snaptrigger = false;



playwindow.onmousemove = function(event){
	mousex = event.clientX;
	mousey = event.clientY;
}

playwindow.onmousedown = function(event){
	down = [event.clientX, event.clientY];
	drag = true;
}
playwindow.onmouseup = function(event){
	up = [event.clientX, event.clientY];
	drag = false;
	if(selection){
//		document.getElementById(selected_item_id).style.left = (main.ropes[selected_item_id].pend.pivot[0]).toString() + "px";
//		document.getElementById(selected_item_id).style.top = (main.ropes[selected_item_id].pend.pivot[0]).toString + "px";
		//selection = false;
	}
	
}
playwindow.onclick = function(){
	if(distance(down, up) > 30){
		main.addRope(new Rope(down, up, mynote = 440));
		rope_hotspots.push(document.body.appendChild(createHotspot("rope")));
	}else{
		main.addEar(new Ear(up));
		ear_hotspots.push(document.body.appendChild(createHotspot("ear")));
	}
}
function createHotspot(type){
	var hotspotnode = document.createElement("DIV");
	hotspotnode.style.height = "50px";
	hotspotnode.style.width = "50px";
	hotspotnode.style.position = "absolute";
	hotspotnode.setAttribute("onmousemove", "mousex = event.clientX; mousey = event.clientY");
	hotspotnode.setAttribute("onmousedown", "clickDrag(event, this)");
	hotspotnode.setAttribute("onmouseup", "unclickDrag()");
	hotspotnode.setAttribute("ondblclick", "rub(this, event)");
	hotspotnode.style.left = (down[0] - 20).toString() + "px"; 
	hotspotnode.style.top = (down[1] - 20).toString() + "px";
	if(type == "rope"){
		hotspotnode.setAttribute("id", type + "s-" + (main.ropes.length - 1).toString());
		hotspotnode.setAttribute("class", type + "-hotspot");
	}else if(type == "ear"){
		hotspotnode.setAttribute("id", type + "s-" + (main.ears.length - 1).toString());
		hotspotnode.setAttribute("class", type + "-hotspot");
	}
	return hotspotnode;
}
function clickDrag(e, elmnt){
	down = [mousex, mousey];
	if(rub_on == false){
		e.preventDefault();
		selection = true;
		var item = parseHotspotId(elmnt);
		selected_item_id = elmnt.getAttribute("id");
	}else{
		rub(elmnt, e);
	}
}
function unclickDrag(){
	if(drag){
		up = [event.clientX, event.clientY];
		drag = false;
		if(selection == false){
			if(distance(down, up) > 30){
			main.addRope(new Rope(down, up, mynote = 440));
			rope_hotspots.push(document.body.appendChild(createHotspot("rope")));
		}else{
			main.addEar(new Ear(up));
			ear_hotspots.push(document.body.appendChild(createHotspot("ear")));
		}
		}
	}else{
		up = [mousex, mousey];
		snaptrigger = false;
		console.log("snaptrigger: " + snaptrigger);
		if(rub_on == false){
			var selected_item = document.getElementById(selected_item_id);
			var parsedItemId = parseHotspotId(selected_item);
			if(parseHotspotId(selected_item)[0] == "ropes"){
				selected_item.style.left = (main.ropes[(parsedItemId[1])].pend.pivot[0] - 19).toString() + "px";
				selected_item.style.top = (main.ropes[(parsedItemId[1])].pend.pivot[1] - 19).toString() + "px";	
				selection = false;
			}else if(parseHotspotId(selected_item)[0] == "ears"){
				selected_item.style.left = (main.ears[(parsedItemId[1])].xy[0] - 19).toString() + "px";
				selected_item.style.top = (main.ears[(parsedItemId[1])].xy[1] - 19).toString() + "px";	
				selection = false;
			}
		}
	}
	
}
function rub(elmnt, e){
	e.preventDefault();
	var hotspots;
	var parsedId = parseHotspotId(elmnt);
	console.log(parsedId);
	if(parsedId[0] == "ropes"){
		console.log(parsedId[1]);
		main.removeRope(parseInt(parsedId[1], 10));
		rope_hotspots[parsedId[1]].parentElement.removeChild(rope_hotspots[parsedId[1]]);
		var new_hotspots = new Array(); 
		for(var i = 0; i < rope_hotspots.length; i++){
			console.log(parsedId[1] + " is equal to " + i + ": " + (i == parsedId[1]))
			if(i != parsedId[1]){
				new_hotspots.push(rope_hotspots[i]);
			}
		}
		rope_hotspots = new_hotspots;
		console.log(rope_hotspots);
		for(var i = 0; i < rope_hotspots.length; i++){
				rope_hotspots[i].setAttribute("id", "ropes-" + i);
		}
	}else if(parsedId[0] == "ears"){
		main.removeEar(parseInt(parsedId[1], 10));
		ear_hotspots[parsedId[1]].parentElement.removeChild(ear_hotspots[parsedId[1]]);
		var new_hotspots = new Array();
		for(var i = 0; i < ear_hotspots.length; i++){
			console.log(parsedId[1] + " is equal to " + i + ": " + (i == parsedId[1]))
			if(i != parsedId[1]){
				new_hotspots.push(ear_hotspots[i]);
			}
		}
		ear_hotspots = new_hotspots;
		console.log(ear_hotspots);
		for(var i = 0; i < ear_hotspots.length; i++){
				ear_hotspots[i].setAttribute("id", "ears-" + i);
		}
	}
		//var deathnode = document.getElementById(selected_item_id);
		//main.removeRope(parseInt(elmnt.getAttribute("id"), 10));
		//elmnt.parentElement.removeChild(elmnt);
}
function parseHotspotId(elmnt){
	var name = elmnt.getAttribute("id");
	var id = name.split("-");
	return id;
}

function toggleRub(){
	var toggle = document.getElementById("rubtoggle");
	if(rub_on){
		rub_on = false;
		toggle.style.backgroundColor = "black";
	}else{
		rub_on = true;
		toggle.style.backgroundColor = "red";
	}
	console.log(rub_on);
}

function drawLoop(){
	setInterval(function(){
		playwindow.setAttribute("width", window.innerWidth);
		playwindow.setAttribute("height", window.innerHeight);
		ctxt.clearRect(0, 0, window.innerWidth, window.innerHeight);
		if(selection){
			if(distance(down, [mousex, mousey]) > 30){
				snaptrigger = true
				console.log("snaptrigger: " + snaptrigger);
			}
			if(snaptrigger){
				var itemId = parseHotspotId(document.getElementById(selected_item_id));
				if(itemId[0] == "ropes"){
					main.ropes[itemId[1]].pend.pivot = [mousex, mousey];
					document.getElementById(selected_item_id).style.left = (mousex - 25) + "px";
					document.getElementById(selected_item_id).style.top = (mousey - 25) + "px";
				}else if(itemId[0] == "ears"){
					main.ears[itemId[1]].xy = [mousex, mousey];
					document.getElementById(selected_item_id).style.left = (mousex - 25) + "px";
					document.getElementById(selected_item_id).style.top = (mousey - 25) + "px";
				}
			}
		}
		if(drag){
			drawRope(down, [mousex, mousey]);
		}
		if(main.ropes.length > 0){
			for(var i = 0; i < main.ropes.length; i ++){
					drawRope(main.ropes[i].pend.pivot, main.ropes[i].pend.bob);
			}
			main.updateRopes();
		}
		if(main.ears.length > 0){
			for(var i = 0; i < main.ears.length; i++){
				drawEar(main.ears[i].xy);
			}
			main.updateEars();
		}

	}, 1000/60);
}
var playwindow = document.getElementById("playwindow");
var ctxt = playwindow.getContext("2d");

function drawPivot(xy){
	ctxt.beginPath();
	ctxt.arc(xy[0], xy[1], 5, 0, 2 * Math.PI);
	ctxt.fillStyle = "snow";
	ctxt.fill();
}
function drawRod(piv, bob){
	ctxt.moveTo(piv[0], piv[1]);
	ctxt.lineTo(bob[0], bob[1]);
	ctxt.lineWidth = 10;
	ctxt.strokeStyle = "snow";
	ctxt.stroke();
}
function drawBob(xy){
	ctxt.beginPath();
	ctxt.arc(xy[0], xy[1], 20, 0, 2 * Math.PI);
	ctxt.fillStyle = "snow";
	ctxt.fill();
}

function drawRope(piv, bob){
	drawPivot(piv);
	drawRod(piv, bob);
	drawBob(bob);
}
function drawEar(xy){
	ctxt.beginPath();
	ctxt.arc(xy[0], xy[1], 25, 0, 2 * Math.PI);
	ctxt.fillStyle = "#FFEC8B";
	ctxt.fill();
}