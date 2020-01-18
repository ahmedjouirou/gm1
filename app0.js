


var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;

var engine;

var lBods;

var gColors = [];


var gScore = 0;
var gEmpty_fails = 0;

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    var ret_val = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    return color(ret_val[0],ret_val[1],ret_val[2]);
}  



function setup() {
  //createCanvas(800, 600);
  //createCanvas(600, 1200);
  createCanvas(windowWidth, windowHeight);

  // create an engine
  engine = Engine.create();


  gColors = [
    color(255,0,0),
    color(0,255,0),
    color(0,0,255),
    color(255,255,0),
    color(255,0,255),
    color(0,255,255),
    color(255,255,255),
    color(0,0,0),

  ]

  // create two boxes and a ground
  lBods = [];
  lBods.push( Bodies.rectangle(width/2, 40, 30, 30  , {isStatic:true, user_meta:{color:color(255,255,0)}}) );

  //lBods.push( Bodies.rectangle(400, 200, 80, 80 , {user_meta:{color:255}}) );
  //lBods.push( Bodies.rectangle(450, 250, 80, 80  , {user_meta:{color:255}}) );
  lBods.push( Bodies.rectangle(400, 500, 810, 60, {
    isStatic: true,
    friction:0,
    user_meta:{color:127},
    oo:"floor"
  }));

  
  
  /*
  let cont_H  = Bodies.rectangle(width/2-300   , 450, 100, 20  , {isStatic:false, user_meta:{color:255}});
  let cont_V1 = Bodies.rectangle(width/2+40-(10/2)-300, 450-50+(20/2), 10, 100  , {isStatic:false, user_meta:{color:255}});
  let cont_V2 = Bodies.rectangle(width/2-40+(10/2)-300, 450-50+(20/2), 10, 100  , {isStatic:false, user_meta:{color:255}});

  let xbody = Matter.Body.create({parts: [cont_H, cont_V1, cont_V2], user_meta:{color:255}, friction:0,oo:"bucket"});
  //lBods.push( Bodies.rectangle(width/2+40-(10/2), 450-50+(20/2), 10, 100  , {isStatic:true, user_meta:{color:255}}) );
  //lBods.push( Bodies.rectangle(width/2-40+(10/2), 450-50+(20/2), 10, 100  , {isStatic:true, user_meta:{color:255}}) );
  //////lBods.push( xbody );
  */

  // add all of the bodies to the world
  World.add(engine.world, lBods);

  // run the engine
  Engine.run(engine);

  Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
    
    pairs.forEach(({ bodyA, bodyB }) => {
      

      if(bodyA.oo == "candy" && bodyB.oo == "floor") {
        //console.log(bodyA.oo, bodyB.oo) 
        World.remove(engine.world, bodyA);
      }
      else if(bodyB.oo == "candy" && bodyA.oo == "floor") {
        //console.log(bodyA.oo, bodyB.oo) 
        World.remove(engine.world, bodyB);
        //////gScore -= 1;
      }
      
      //if (bodyA !== ball) Matter.World.remove(world, bodyA);
      //if (bodyB !== ball) Matter.World.remove(world, bodyB);
    });
  });

}


function spawn_bucket(){
  //World.remove(engine.world, m[0]);
  let Ofs_x = 40;//40 + parseInt(random(0,100));
  let Wid = 60 + parseInt(random(0,50));
  let buckspeed = 1.5+random(0,2.5);
  let buckcolor = color(255,255,255,40)
  let cont_H  = Bodies.rectangle(Ofs_x   , 450, Wid, 20  , {isStatic:false, user_meta:{color:255}});
  let cont_V1 = Bodies.rectangle(Ofs_x+(Wid/2)-(10/2), 450-(100/2)+(20/2), 10, 100  , {isStatic:false, user_meta:{color:255}});
  let cont_V2 = Bodies.rectangle(Ofs_x-(Wid/2)+(10/2), 450-(100/2)+(20/2), 10, 100  , {isStatic:false, user_meta:{color:255}});
  let xbody = Matter.Body.create({parts: [cont_H, cont_V1, cont_V2], user_meta:{color:buckcolor, w:Wid,ncandies: 0}, friction:0,oo:"bucket", buckspeed:buckspeed});

  //let cont_Hw  = Bodies.rectangle(Ofs_x   , 450-10, Wid-(20), 5  , {isStatic:false, user_meta:{color:255},oo:"bucket_low"});
  World.add(engine.world, xbody);
  //World.add(engine.world, cont_Hw);
}

// Using p5 to render
function draw() {
  // I could ask for everything in the world
  // var bodies = Composite.allBodies(engine.world);

  background(51);

  fill(color(255,255,0));textAlign(LEFT, TOP);
  textSize(40)
  //text(frameRate().toFixed(0),20,20);
  text(gScore,20,20);
  fill(color(255,0,0));textAlign(LEFT, TOP);
  text(gEmpty_fails,20,60);


  var bodies = Composite.allBodies(engine.world);


  bodies.filter((v,i,a)=>v.position.x > width || v.position.y > height).forEach(function(e){ 
    if(e.oo == "bucket" && e.user_meta.ncandies == 0){
      gEmpty_fails += 1;
      if(gEmpty_fails >=3){
        gEmpty_fails = 0;
        gScore = 0;
      }
    }
    World.remove(engine.world, e);
  })

  bodies = Composite.allBodies(engine.world);

  var m =  bodies.filter(x=>x.oo=="bucket").sort(((a,b)=> a.position.x - b.position.x ));
 // Matter.Body.applyForce(m, {x: m.position.x, y: m.position.y}, {x: 0.005, y: 0})
  if(m.length > 0){
    //Matter.Body.setVelocity(m[0],  {x: 1.5, y: 0})
    m.forEach(e=> Matter.Body.setVelocity(e,  {x: min(e.buckspeed+(gScore/150),4.0), y: 0}) )
    if(m[0].position.x >= width/2 + parseInt(random(-0,0))){
      //World.remove(engine.world, m[0]);
      spawn_bucket();
    }
  }
  else{
    spawn_bucket();
  }
  
  bodies = Composite.allBodies(engine.world);

  bodies.forEach(function(pB){
  var vertices = pB.vertices;
    fill(pB.user_meta.color);
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);

    if(pB.oo == "bucket"){
      push();
      fill(color(255,255,0));textAlign(LEFT, TOP);
      textSize(20)
      text(pB.user_meta.ncandies,pB.position.x,pB.position.y-100);
      pop();
    }
  });



  var candies = bodies.filter((v,i,a)=>v.oo == "candy");
  var buckets = bodies.filter((v,i,a)=>v.oo == "bucket");

  buckets.filter((v,i,a)=>v.position.x >= width/2+100).forEach(function(e){
    if(e.user_meta.used != true){
      e.user_meta.used = true;
      gScore += e.user_meta.ncandies;
    }   
  });
  
  if(candies.length != 0 && candies.filter((v,i,a)=>v.position.y<= 378).length == 0){

    for(var i=0;i<buckets.length; i++){
      var cont_x = buckets[i].position.x-(buckets[i].user_meta.w/2)+5;
      var cont_y = buckets[i].position.y-65;
      var cont_w = buckets[i].user_meta.w-10;
      var cont_h = 95;
      for(var j=0;j<candies.length; j++){
        if(candies[j].user_meta.used == true){continue;}

        if(candies[j].position.x >= cont_x 
        && candies[j].position.y >= cont_y
        && candies[j].position.x <= cont_x+cont_w
        && candies[j].position.y <= cont_y+cont_h){
          candies[j].user_meta.used = true;
          buckets[i].user_meta.ncandies +=1;
        }
      }

    }
  }

  /*
  // --------------- CALCULATE Score --------------
  var containers = []
  bodies.filter((v,i,a)=>v.oo == "bucket").forEach(function(pB){
    //push();
    //fill(color(255,0,0));
    let cont_x = pB.position.x-(pB.user_meta.w/2)+5;
    let cont_y = pB.position.y-65;
    let cont_w = pB.user_meta.w-10;
    let cont_h = 95;
    //rect(cont_x, cont_y, cont_w, cont_h);
    //pop();
    containers.push({
      x:cont_x,
      y:cont_y,
      w:cont_w,
      h:cont_h
    })
  });

  var candies = bodies.filter((v,i,a)=>v.oo == "candy")

  if(candies.length != 0 && candies.filter((v,i,a)=>v.position.y<= 378).length == 0){

    var cdx = candies.filter(function(v,i,a){
      if(v.user_meta.used != null){return false;}
      var ret = false;
      containers.forEach(function(eC){
        if(v.position.x >= eC.x 
        && v.position.y >= eC.y
        && v.position.x <= eC.x+eC.w 
        && v.position.y <= eC.y+eC.h){
          ret = true;
          v.user_meta.used = true;
        }
      });
      return ret;
    });
    gScore += cdx.length
  }
  //-----------------------------------------------------
  */
 

}



function mousePressed() {
  var lObjs = [];
  var nObj = parseInt(random(10,30));
  let objRadius = 5+random(-0,3)
  nObj = nObj / (2*objRadius/5);
  nObj = parseInt(nObj);
  var lCand_Speed = {}

  if(random() <= 0.1){
    objRadius = 20;
    nObj = 1;
    lCand_Speed = {x: 0.000, y: 0.01}
  }
  else{
    lCand_Speed = {x: 0.000, y: 0.003}
  }

  for(var i=0;i<nObj;i++){
    //lObjs.push( Bodies.circle(width/2 + random(-18,18), 90+ random(-30,30), 5+random(-0,0)  , {restitution:0.0,user_meta:{color:random(gColors)}}) );  
    lObjs.push( Bodies.circle(width/2 + random(-15,15), 90+ random(-25,25), objRadius  , {restitution:0.0,oo:"candy",user_meta:{color:hslToRgb(random(0,1),1,0.5)}}) );  
  }

  lObjs.forEach(function(e){
    World.add(engine.world, e);
    Matter.Body.applyForce(e, {x: e.position.x, y: e.position.y}, lCand_Speed);
    //Matter.Body.setVelocity(e,  {x:0, y: lCand_Speed})
  });

  //gScore += nObj;
}
