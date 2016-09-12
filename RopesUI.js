//Constants

var FRAME_RATE = 60; //per second, obviously



var playwindow = document.getElementById("playwindow");
var down = 0; //stores coordinates when mouse is clicked down
var up = 0; //stores coordinated when mouse is clicked up
var drag = false; //is true on mousedown; change to mousedown. 
var mousex; //current mouse X coordinate
var mousey; //current mouse Y coordinate
var rope_hotspots = new Array(); //array of clickable areas associciated with ropes
var ear_hotspots = new Array(); //array of clickable areas associated with ears
var selection = false; //is true if a hotspot is being clicked/held
var selected_item_id; //stores id of last clicked hotspot
var rub_on = false; //true if in delete mode; PHASE OUT.
var snaptrigger = false; //true if hotspot has been clicked and dragged more than thirty pixels; meant to tame double-click jumps. 
//Context Menu: menu that appears when clicking and holding on an item for .5 seconds. 
var context_menu; //stores the DOM element of latest context menu
var show_context = false; //true if context menu is showing 
var click_hold_counter = 0; //acts as a timer for click-hold context menu
var item_moving = false; //is true if an item has been dragged; meant to stop context menu from appearing while dragging

//Mouse Event Functions
//keep track of the mouse
playwindow.onmousemove = function(event){
	mousex = event.clientX;
	mousey = event.clientY;
}
playwindow.onmousedown = function(event){
	if(show_context){
	killContextMenu();
	}
	down = [event.clientX, event.clientY];
	if(!show_context){
	drag = true;
	}
}
playwindow.onmouseup = function(event){
	up = [event.clientX, event.clientY];
	drag = false;
	item_moving= false;
		if(show_context){
	killContextMenu();
	}
	show_context = false;

	click_hold_counter = 0;
	
}
playwindow.onclick = function(event){
	var note = 261.62; 
	if(down[0] > window.innerWidth/4){note = 329.62;}
	if(down[0] > window.innerWidth/2){note = 440.00;}
	if(down[0] > 3 * window.innerWidth/4){note = 587.32;}
	if(distance(down, up) > 30){
		main.addRope(new Rope(down, up, mynote = note));
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
	item_moving = false;
	if(show_context){
		killContextMenu();
	}
	show_context = false;
	click_hold_counter = 0;
	
	
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
function mouseUp(){
	up = [event.clientX, event.clientY];
	drag = false;
	item_moving= false;
	show_context = false;
	killContextMenu();
	click_hold_counter = 0;
	selection = false;
}
function drawContextMenu(){
	var parsedItem = parseHotspotId(document.getElementById(selected_item_id));
	context_menu = document.createElement("DIV");
	context_menu.setAttribute("id", "context");
	context_menu.setAttribute("onmouseup", "mouseUp();");
	context_menu.style.position = "absolute";
	context_menu.style.left = down[0] + "px";
	context_menu.style.top = down[1] + "px";
	context_menu.style.height = "80px";
	context_menu.style.width = "50px";
	context_menu.style.backgroundColor = "white";
	document.body.appendChild(context_menu);
	if(parsedItem[0] == "ropes"){
		context.innerHTML = "ropes";
	}
	else if(parsedItem[0] == "ears"){
		context.innerHTML = "ears";
	}
	//console.log(current_selected);	
	/*var context = document.createElement("DIV");
	context.setAttribute("id", "context");
	context.style.position = "absolute";
	context.style.left = down[0] + "px";
	context.style.top = down[1] + "px";
	context.style.height = "80px";
	context.style.width = "50px";
	context.style.backgroundColor = "white";
	document.body.appendChild(context);*/
}
function killContextMenu(){
	context_menu.parentElement.removeChild(context_menu);
}
function drawLoop(){
	setInterval(function(){
		playwindow.setAttribute("width", window.innerWidth);
		playwindow.setAttribute("height", window.innerHeight);
		ctxt.clearRect(0, 0, window.innerWidth, window.innerHeight);
		console.log("clickHold: " + click_hold_counter + ", showC: " + show_context + ", Selection on: " + selection);
		if(selection){
			if(click_hold_counter == 30){
				selection = false;
				drawContextMenu();
				show_context = true;
				click_hold_counter = 0;
			}
			if(!item_moving && !show_context){
				click_hold_counter++;
			}
			if(distance(down, [mousex, mousey]) > 30){
				snaptrigger = true;
				item_moving = true;
				click_hold_counter = 0;
				console.log("snaptrigger: " + snaptrigger + ", itemMoving: " + item_moving);
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
			drawRope(down, [mousex, mousey], val = 0, create = true);
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

function drawPivot(xy, val, create){
	ctxt.beginPath();
	if(create){
		ctxt.strokeStyle = "snow";
		ctxt.fillStyle = "snow";
	}
	else{
		ctxt.strokeStyle = "DeepPink";
		ctxt.fillStyle = "DeepPink";
	}
	ctxt.arc(xy[0], xy[1], 5, 0, 2 * Math.PI);
	ctxt.fill();
	ctxt.stroke();
}
function drawRod(piv, bob, val, create){
	ctxt.moveTo(piv[0], piv[1]);
	ctxt.lineTo(bob[0], bob[1]);
	ctxt.lineWidth = 15;
	ctxt.strokeStyle = "DeepPink"/*"snow"*/;
	ctxt.stroke();
}
function drawBob(xy, val, create){
	ctxt.beginPath();
	ctxt.arc(xy[0], xy[1], 20, 0, 2 * Math.PI);
	ctxt.strokeStyle = "DeepPink";
	ctxt.fillStyle = "DeepPink";
	ctxt.stroke();
	ctxt.fill();
}
function drawRope(piv, bob, val, create){
	drawRod(piv, bob, val, create);
	drawPivot(piv, val, create);
	drawBob(bob, val, create);
}
function drawEar(xy, val, create){
	ctxt.beginPath();
	ctxt.fillStyle = "#FFEC8B";
	ctxt.arc(xy[0], xy[1], 35, 0, 2 * Math.PI);
	ctxt.fill();
}