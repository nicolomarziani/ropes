var pulse_catch_counter = 0;

function PulseEar(xy){
	this.ropes = new Array();
	this.xy = xy;
	this.update = function(){
		for(var i = 0; i < this.ropes.length; i++){
			var angle1 = Math.ceil(10 * main.ropes[i].pend.angle);
			var angle2 = Math.ceil(10 * Math.atan2(this.xy[0] - main.ropes[i].pend.pivot[0], this.xy[1] - main.ropes[i].pend.pivot[1]));
			console.log(angle1 + ", " + angle2);
			var bob_distance = distance(this.xy, main.ropes[i].pend.bob);
			if(angle1 == angle2 && pulse_catch_counter > 20 && bob_distance < 150){
				//this.ropes[i].gain.gain.value = 1 - (bob_distance/250);
				console.log("MATCH");
				this.ropes[i].play();
				pulse_catch_counter = 0;
			}
		}
	}
}	
main.pulseears = new Array();
main.addPulseEar = function(pulseear){
	for(var i = 0; i < this.ropes.length; i++){
		var rope = this.ropes[i];
		var thispulse = new pulse(rope.tone/2, inp);
		pulseear.ropes.push(thispulse);
		//ear.ropes[ear.ropes.length - 1].play();
	}
	this.pulseears.push(pulseear);
}
main.removePulseEar = function(index){
	var temp_ear_array = new Array();
	for(var i = 0; i < this.pulseears.length; i++){
		if(i != index){
			temp_ear_array.push(this.pulseears[i]);
		}
	}
	this.pulseears = temp_ear_array;
}
main.updatePulseEars = function(){
	for(var i = 0; i < this.pulseears.length; i++){
		this.pulseears[i].update();
		console.log("updated");
	}
}
var pulseear_hotspots = new Array();

function pulse(note, main_out, type = "sine", len = 1){
	this.osc;
	this.gain;
	this.envelope;
	this.note = note;
	this.main_out = main_out;
	this.type = type;
	this.len = len;
	this.play = function(){
		console.log("playing");
		this.osc = ropeAudioContext.createOscillator(); 
		this.osc.frequency.value = this.note; 
		this.osc.type.value = this.type;
		this.gain = ropeAudioContext.createGain(); 
		//this.gain.gain.value = 1;
		this.osc.connect(this.gain);
		this.gain.connect(this.main_out);
		this.osc.start(0);
		this.gain.gain.linearRampToValueAtTime(.00001, ropeAudioContext.currentTime + len);
		this.osc.stop(ropeAudioContext.currentTime + 2);
	}
}