var ropeAudioContext = (new AudioContext() || new webkitAudioContext());
/*
//EffectsChain: defines a chain of audio effects. Has an input gainstage, an array of effects, and an output gainstage.
var EffectsChain = function(){
	this.i = ropeAudioContext.createGain();
	this.o = ropeAudioContext.createGain();
	this.chain = new Array();
	this.chain.push(this.i);
	this.chain.push(this.o);
	console.log(this.chain);
	console.log(this.chain.length);
	this.mylength = this.chain.length;
//Wires all effects in the effects chain in order. 	
	this.wireUp = function(){
		var chain = this.chain;
		for(i = 0; i <= chain.length - 2; i++){
			chain[i].connect(chain[i + 1]);
		}
		chain[chain.length - 1].connect(ropeAudioContext.destination);
	}
	this.wireUp();
//Adds an effect in the position after the indicated effect. Will add to the position before the out gainstage by default.	
	this.addEffect = function(effect, prevEffect = this.chain[this.mylength - 2]){
		var chain = this.chain;
		var newChain = new Array();
		for(i = 0; i <= chain.length - 1; i++){
			newChain.push(chain[i]);
			if(chain[i] == prevEffect){
				newChain.push(effect);
			}
		}
		this.chain = newChain;
		console.log(this.chain);
		this.wireUp();
		this.mylength = chain.length;
	}
//Removes the indicated effect.
	this.removeEffect = function(effect){
		chain = this.chain;
		for(i = 0; i < chain.length; i++){
			if(this.chain[i] == effect){
				var newChain = new Array();
				for(j = 0; j < chain.length; j++){
					if(j == i){
						continue;
					}else{
						newChain.push(chain[j]);
					}
				}
				chain = newChain;
				return;
			}
		}
		effect.disconnect();
		chain = newChain;
		this.wireUp;
		this.mylength = chain.length;
		//handle error;
	}
	this.volume = function(vol){
		this.o.gain.value = vol;
	}
}

//test

var fx = new EffectsChain();
var g1 = ropeAudioContext.createGain();
var g2 = ropeAudioContext.createGain();
var g3 = ropeAudioContext.createGain();
var osc = ropeAudioContext.createOscillator();
osc.connect(fx.i);

*/

var inp = ropeAudioContext.createGain();
inp.gain.value = 0.7;
var compressor = ropeAudioContext.createDynamicsCompressor();
	compressor.threshold.value = -35;
	compressor.knee.value = 40;
	compressor.ratio.value = 20;
	compressor.reduction.value = -100;
	compressor.attack.value = 0;
	compressor.release.value = .5;

var maingain = ropeAudioContext.createGain();
maingain.gain.value = .5;
compressor.connect(maingain);
maingain.connect(ropeAudioContext.destination);
var feedback = ropeAudioContext.createGain();
feedback.gain.value = .2;
var delay = ropeAudioContext.createDelay();
delay.delayTime.value = 0.2;
inp.connect(delay);
inp.connect(compressor);
delay.connect(compressor);
delay.connect(feedback);
feedback.connect(delay);

function osc(main_out, note, type/* = "sine"*/){
	this.osci = ropeAudioContext.createOscillator();
	this.osci.frequency.value = note;
	this.osci.detune.value = 0;
	this.osci.style = type;
	this.volume = ropeAudioContext.createGain();
	this.volume.gain.value = 0;
	this.osci.connect(this.volume);
	this.volume.connect(main_out);
	this.play = function(){
		this.osci.start(0);
	}
	this.mute = function(){
		this.volume.gain.value = 0;
	}
	this.vol = function(val){
		this.volume.gain.value = val;
	}
	this.kill = function(){
		this.osci.stop(0);
		this.osci.disconnect(0);
	}
}






