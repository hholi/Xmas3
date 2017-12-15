
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

addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode;

    if (key === 97) { // 97 is a
    console.log('Switch animation')
    xmasScene.animate = !xmasScene.animate;
    if (xmasScene.animate) {
      animate();
    }
  }

  if (key === 102) { // 102 is f
    console.log('Making a forest adding some trees')
    forest(3);
  }

  if (key === 103) { // 103 is g
    console.log('See growth switch')
    xmasScene.seeGrowth = !xmasScene.seeGrowth;
  }

  if (key === 104) { // 104 is h
    console.log('Grow a hedge')
    hedge(9);
  }

});

function init() {

  xmasScene = {
    seeGrowth: true,
    animate: true,
    places: [], 
    xmas:false, 
    ctx: document.getElementById('xmas').getContext('2d'), 
    canvas: document.getElementById('xmas') 
  };

  xmasScene.canvas.width = window.innerWidth; 
  xmasScene.canvas.height = window.innerHeight; 

  forest(1);
}

function animate() { 
  xmasScene.ctx.clearRect(0,0,xmasScene.canvas.width, xmasScene.canvas.height); 

  for (place of xmasScene.places) {
    xmasScene.ctx.save(); 
    xmasScene.ctx.translate(place.xpos, place.ypos);
    place.thing.render(); 
    xmasScene.ctx.restore(); 
  }

  if (xmasScene.animate) {
    window.requestAnimationFrame(animate); 
  }
}

function forest(numTrees) {
  xmasScene.xmas = false;
  for (i=0; i<numTrees; i++) {
    var distance = 0;
    var x = xmasScene.canvas.width * 0.3;
    var y = xmasScene.canvas.height - 100;
    if (numTrees > 1) {
      distance = random(0.0, 1.0);
      x = random(xmasScene.canvas.width * 0.1, xmasScene.canvas.width * 0.9);
      y = xmasScene.canvas.height * 0.95 * (1.0 - distance);
    }
    var place = {
      xpos: x, 
      ypos: y, 
      thing: new Branch(100 * (1.0 - distance), 0, true, 0, 0)
    };
    xmasScene.places.push ( place ); 
  }
}

function hedge(numTrees) {
  xmasScene.seeGrowth = false;
  xmasScene.xmas = false;
  xmasScene.places = [];

  var startx = xmasScene.canvas.width * 0.2;
  var starty = xmasScene.canvas.height - 100;

  var endx = xmasScene.canvas.width * 0.8;
  var endy = xmasScene.canvas.height * 0.1;

  var size = 100;
  for (i=numTrees-1; i>=0; i--) {
    var x = startx + i * (endx-startx)/numTrees;
    var y = starty + i * (endy-starty)/numTrees;
    size = 100/(numTrees - 2) * (numTrees - i)
    var place = {
      xpos: x, 
      ypos: y, 
      thing: new Branch(size, 0, true, 0, 0)
    };
    xmasScene.places.push ( place );
  }
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
      xmasScene.xmas = true;
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

