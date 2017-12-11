
// Growing a spruce and decorating it with lights and star.
// Animating swaying and twinkling.

// Based on swaying tree by Seb Lee-Delisle
// https://github.com/sebleedelisle/live-coding-presentations

var xmasScene;

init();
animate();


// Grow a new tree
addEventListener("click", function(event) {
	init();
});

function init() {

	xmasScene = {
		seeGrowth: true,
		trees: [], 
		xmas:false, 
		ctx: document.getElementById('xmas').getContext('2d'), 
		canvas: document.getElementById('xmas') 
	};	

	xmasScene.canvas.width = window.innerWidth; 
	xmasScene.canvas.height = window.innerHeight; 

	xmasScene.trees.push ( new Branch(100, 0, true, 0, 0) ); 	
}

function animate() { 
	xmasScene.ctx.save(); 
	xmasScene.ctx.clearRect(0,0,xmasScene.canvas.width, xmasScene.canvas.height); 
	xmasScene.ctx.translate(xmasScene.canvas.width*0.3, xmasScene.canvas.height-100); 
	for (tree of xmasScene.trees) {
		tree.render(); 
	}
	xmasScene.ctx.restore(); 

	window.requestAnimationFrame(animate); 
}

function Branch(size, rotation, stem, generation, absdirection) { 
	generation = generation + 1; 
	var sway = 0; 
	var swaySpeed = random(0.005,0.02); 
	var delay = generation*10; 

	var growth;
	if (xmasScene.seeGrowth) {
		growth = 0;
	} else {
		growth = 1;
	}

	// modify rotation to go after the light
	if (absdirection < -10) {
		rotation = rotation + 4
	}
	if (absdirection > 10) {
		rotation = rotation - 4
	}
	absdirection = absdirection + rotation

	this.children = [];

	if(size>10) {
		// Continue growing
		if (stem) {
			// stem continues
			this.children.push(new Branch(size*random(0.83,0.91), random(-2,2), stem, generation, absdirection)); 

			//branches in front and back
			this.children.push(new Branch(size*random(0.4,0.5), random(-30,30), false, generation, absdirection)); 
			if (generation > 1) {
				this.children.push(new Branch(size*random(0.2,0.3), random(110,250), false, generation, absdirection)); 
			}
		} else {
			// branch continues after junction
			this.children.push(new Branch(size*random(0.70,0.85), random(-10,10), stem, generation, absdirection)); 
		}

		//branches to the sides
		this.children.push(new Branch(size*random(0.53,0.58), random(55,70), false, generation, absdirection)); 
		this.children.push(new Branch(size*random(0.53,0.58), random(-55,-70), false, generation, absdirection)); 


	} else {
		// Lights in the ends
		if(stem) {
			// Star in the top
			this.children.push(new Star(size*1.5, true)); 
		} else {
			// small lights
			if (random(1,20) < 5) { // only somewhere
				this.children.push(new Star(2, false)); 
			}
		}
	}

	
	this.render = function() { 
		var ctx = xmasScene.ctx;
		ctx.save(); 
		ctx.rotate((rotation+Math.sin(sway)) * Math.PI/180); 
		ctx.beginPath(); 
		ctx.lineWidth = size*0.13*growth;
		ctx.strokeStyle = 'Sienna'; 
		ctx.moveTo(0,0); 
		ctx.lineTo(0,-size*growth);
		ctx.stroke();
		if(ctx.lineWidth < 10) {
			drawNeedles(size*growth);
		}
		ctx.stroke();

		ctx.translate(0,-size*growth); 
		
		for(var i = 0; i<this.children.length; i++) { 
			this.children[i].render(); 
		}

		ctx.restore(); 
		sway+=swaySpeed;
		if(delay>0) { 
			delay--; 
		} else { 
			growth+=(1-growth) * 0.1; 
		}

		// Is it Christmas??
		if (growth > 0.99999) {
			xmasScene.xmas = true
		}

	}

}

function Star(size, top) { 
	this.render = function() { 
		if (xmasScene.xmas) {
			var ctx = xmasScene.ctx;
			ctx.beginPath(); 
			ctx.strokeStyle = 'orange'; 
			ctx.fillStyle = 'yellow'; 
			if (top) {
				drawStar(0,0,5,size*1.5,size/2);
			} else {
				if (random(1,20) < 19) { // twinkle			
					ctx.arc(0, 0, size, 0, 2*Math.PI);
				}
			}
			ctx.fill();  
			ctx.stroke();
			ctx.closePath(); 			
		}
	}
}

function drawStar(cx,cy,spikes,outerRadius,innerRadius){
	var ctx = xmasScene.ctx;
	var rot=Math.PI/2*3;
	var x=cx;
	var y=cy;
	var step=Math.PI/spikes;

	ctx.beginPath();
	ctx.moveTo(cx,cy-outerRadius)
	for(i=0;i<spikes;i++){
		x=cx+Math.cos(rot)*outerRadius;
		y=cy+Math.sin(rot)*outerRadius;
		ctx.lineTo(x,y);
		rot+=step;

		x=cx+Math.cos(rot)*innerRadius;
		y=cy+Math.sin(rot)*innerRadius;
		ctx.lineTo(x,y);
		rot+=step;
	}
	ctx.lineTo(cx,cy-outerRadius);
	ctx.closePath();
	ctx.lineWidth=2;
	ctx.strokeStyle='gold';
	ctx.stroke();
	ctx.fillStyle='yellow';
	ctx.fill();
}

function drawNeedles(length) {
	var ctx = xmasScene.ctx;
	ctx.beginPath(); 
	ctx.strokeStyle = 'OliveDrab'; 
	ctx.lineWidth = 0.7;
	for(var y = 0; y < length; y = y+3) {
		ctx.moveTo( 0, -y); 
		ctx.lineTo(-3, -y-6);		
		ctx.moveTo( 0, -y); 
		ctx.lineTo( 3, -y-6);		
		ctx.moveTo( 0, -y); 
		ctx.lineTo( 0, -y-8);		
	}
}

function random(min, max) { 
	return Math.random()*(max-min) +min; 
}

