var playwindow = document.getElementById("playwindow");
var down = 0;
var up = 0;
var drag = false;
var mousex;
var mousey;
var rope_hot_spots = new Array();
var ear_hot_spots = new Array();
var selection = false;
var selected_item_id;



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
		rope_hot_spots.push((main.ropes.length - 1).toString());
		var hotspotnode = document.createElement("DIV");
		hotspotnode.style.height = "50px";
		hotspotnode.style.width = "50px";
		hotspotnode.style.position = "absolute";
		hotspotnode.setAttribute("onmousedown", "clickDrag(event, this)");
		hotspotnode.setAttribute("onmouseup", "unclickDrag()");
		hotspotnode.setAttribute("ondblclick", "rub(this)");
		hotspotnode.style.left = (down[0] - 20).toString() + "px"; 
		hotspotnode.style.top = (down[1] - 20).toString() + "px";
		hotspotnode.setAttribute("id", (main.ropes.length - 1).toString());
		document.body.appendChild(hotspotnode);
	}
}
playwindow.oncontextmenu = function(){
	main.addEar(new Ear(down));	
}

function clickDrag(e, elmnt){
	e.preventDefault();
	selection = true;
	selected_item_id = parseInt(elmnt.getAttribute("id"));
}
function unclickDrag(){
		document.getElementById(selected_item_id).style.left = (main.ropes[selected_item_id].pend.pivot[0] - 19).toString() + "px";
		document.getElementById(selected_item_id).style.top = (main.ropes[selected_item_id].pend.pivot[1] - 19).toString() + "px";	
		selection = false;
}
function rub(elmnt){
	var deathnode = document.getElementById(elmnt.getAttribute("id"));
	main.removeRope(parseInt(elmnt.getAttribute("id"), 10));
	elmnt.parentElement.removeChild(deathnode);
}

function drawLoop(){
	setInterval(function(){
		playwindow.setAttribute("width", window.innerWidth);
		playwindow.setAttribute("height", window.innerHeight);
		ctxt.clearRect(0, 0, window.innerWidth, window.innerHeight);
		if(selection){
			main.ropes[selected_item_id].pend.pivot = [mousex, mousey];
			document.getElementById(selected_item_id).style.left = mousex + "px";
			document.getElementById(selected_item_id).style.top = mousey + "px";
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
				drawEar(main.ears[i], i);
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