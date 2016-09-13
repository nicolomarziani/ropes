//CONSTANTS

var METER = 200; //in px

//takes a comma-separated string, gives an tuple. Not employed here, but will be helpful in the future.
	function point(string){
		return string.split(",");
	}
//takes two coordinate sets, gives the pixel distance between them. 
	function distance(p1, p2){
		var a = p2[0] - p1[0]; 
		var b = p2[1] - p1[1];
		return Math.sqrt((a*a)+(b*b));
	}

//Playboard: Keeps track of the units on the board.
	function Playboard(){
		this.ropes = new Array(); //All active ropes
		this.ears = new Array(); //All active ears
		this.addRope = function(rope){
			this.ropes.push(rope);
			for(var i = 0; i < this.ears.length; i++){
				var ear = this.ears[i];
				var thisrope = this.ropes[this.ropes.length - 1];
				var thissound = new osc(main_out = inp, note = thisrope.tone);
				ear.ropes.push(thissound);
				ear.ropes[ear.ropes.length - 1].play();
			}
			for(var i = 0; i < this.pulseears.length; i++){
				var pulseear = this.pulseears[i];
				var thisrope = this.ropes[this.ropes.length - 1];
				var thissound = new pulse(thisrope.tone/2, inp);
				pulseear.ropes.push(thissound);
				//pulseear.ropes[pulseear.ropes.length - 1].play();
			}
		}
		this.addEar = function(ear){
			for(var i = 0; i < this.ropes.length; i++){
				var rope = this.ropes[i];
				var thisosc = new osc(main_out = inp, note = rope.tone)
				thisosc.play();
				ear.ropes.push(thisosc);
				//ear.ropes[ear.ropes.length - 1].play();
			}
			this.ears.push(ear);
		}
		this.updateRopes = function(){
			for(var i = 0; i < this.ropes.length; i++){
				this.ropes[i].update();
			}
		}
		this.updateEars = function(){
			for(var i = 0; i < this.ears.length; i++){
				this.ears[i].update();
			}
		}
		this.removeRope = function(index){
			var temp_rope_array = new Array();
			//var new_osc_array = new Array();
			
			for(var i = 0; i < this.ropes.length; i++){
				if(i != index){
					temp_rope_array.push(this.ropes[i]);
				}
			}
			this.ropes = temp_rope_array;
			//for(var i = 0; i < this.ropes.length; i++){
			//	new_osc_array.push(new osc(main_out = delay, note = this.ropes[i].tone));
			//}
			//console.log(new_osc_array.length);
			for(var i = 0; i < this.ears.length; i++){
				var new_osc_array = new Array();
				for(var j = 0; j < this.ropes.length; j++){
					new_osc_array.push(new osc(main_out = inp, note = this.ropes[j].tone));
				}
				for(var j = 0; j < this.ears[i].ropes.length; j++){
					this.ears[i].ropes[j].kill();
				}
				this.ears[i].ropes = new Array();
				for(var j = 0; j < new_osc_array.length; j++){
					this.ears[i].ropes.push(new_osc_array[j]);
					console.log(this.ears[i]);
					console.log("now playing rope " + j + ": " + this.ears[i].ropes[j])
					this.ears[i].ropes[j].play();
				}
				
				/*for(var j = 0; j < this.ears[i].length; j++){
					if(j != index){
						temp_osc_array.push(this.ears[i].ropes[j]);
					}
				}
				this.ears[i].ropes = temp_osc_array;*/
			}
			for(var i = 0; i < this.pulseears.length; i++){
				var new_osc_array = new Array();
				for(var j = 0; j < this.ropes.length; j++){
					new_osc_array.push(new pulse(this.ropes[j].tone/2, inp));
				}
				/*for(var j = 0; j < this.pulseears[i].ropes.length; j++){
					this.pulseears[i].ropes[j].kill();
				}*/
				this.pulseears[i].ropes = new Array();
				for(var j = 0; j < new_osc_array.length; j++){
					this.pulseears[i].ropes.push(new_osc_array[j]);
					console.log(this.ears[i]);
					console.log("now playing rope " + j + ": " + this.ears[i].ropes[j])
					//this.ears[i].ropes[j].play();
				}
				
				/*for(var j = 0; j < this.ears[i].length; j++){
					if(j != index){
						temp_osc_array.push(this.ears[i].ropes[j]);
					}
				}
				this.ears[i].ropes = temp_osc_array;*/
			}
		}
		this.removeEar = function(index){
			var temp_ear_array = new Array();
			for(var i = 0; i < this.ears[index].ropes.length; i++){
				this.ears[index].ropes[i].kill();
			}
			for(var i = 0; i < this.ears.length; i++){
				if(i != index){
					temp_ear_array.push(this.ears[i]);
				}
			}
			this.ears = temp_ear_array;
		}
		this.Run = function(){
			drawLoop();
		}
	}
	var main = new Playboard();
//Pendulum: defines the behavior of a unique pendulum using two (x,y) points: (1) a pivot point,  and (2) a starting point for the bob. Employs standard gravitational acceleration by default (~9.8 mps^2, where a "meter" is understood to be 200px).
	function Pendulum(piv, b){
		this.pivot = piv;
		this.bob = b;
		this.length = distance(this.pivot, this.bob);
		this.angle = Math.atan2(this.bob[0] - this.pivot[0], this.bob[1] - this.pivot[1]);
		this.velocity =0;
		this.gravity = 9.80665;
		var pend = this;
		this.update = function(){
			var k = -pend.gravity/(pend.length/METER);
			var step = 1/FRAME_RATE;
			var acceleration = k * Math.sin(pend.angle);
			pend.velocity += acceleration * step;
			pend.angle += pend.velocity * step;
			pend.bob[0] = Math.sin(pend.angle) * pend.length + pend.pivot[0];
			pend.bob[1] = Math.cos(pend.angle) * pend.length + pend.pivot[1];
		};
	}
//Rope: defines a swinging sound source. Has a pendulum, a sound, and an ear to which it is relative. Useless until copied into an ear. 	
	function Rope(piv, b, snd){
		this.pend = new Pendulum(piv, b);
		this.tone = snd;
		this.update = function(){
			this.pend.update();
		}
	}
	function Ear(xy){
		this.ropes = new Array();
		this.xy = xy;
		this.update = function(){ 
				for(var i = 0; i < this.ropes.length; i++){
					var bob_distance = distance(this.xy, main.ropes[i].pend.bob);
					if(bob_distance > 250){
						this.ropes[i].vol(0);
					}else{
						this.ropes[i].vol(1-(bob_distance/250));
					}
				}
		}
	}
