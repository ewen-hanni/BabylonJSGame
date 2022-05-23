import Wave from "./Wave.js"; 
import Salve from "./Salve.js"; 

var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var dashingD=false;
var dashingG=false;
var dashingDAvailable = true;
var dashingGAvailable = true;
var dashingDIteration = 0 ;
var dashingGIteration = 0 ;
var nombreEnnemyR = 10 ;
var gameOver = false;
var vagues = 1 ;

var  salve1= new Salve (1,10);

var Wave1 = new Wave (salve1,1,2,);
	
	// scene
    var falling = false ;
    var scene = new BABYLON.Scene(engine);
	var bgcolor = BABYLON.Color3.FromHexString('#101230');
	var redcolor = BABYLON.Color3.FromHexString('#960018');
    var jumping = false;
	var jumpSpeed = 1;
	//inversement proportionnel à la distance de dash
    var dashSpeed=8; 
	var initialdashSpeed = dashSpeed;

var createScene = function () {

	scene.clearColor = bgcolor;
	scene.ambientColor = bgcolor;
	scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
	scene.fogColor = bgcolor;
	scene.fogDensity = 0.03;
	scene.fogStart = 300.0;
	scene.fogEnd = 370.0;
	scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

	// camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI , Math.PI / 2, 90, new BABYLON.Vector3(0, 3, 0), scene);

	// lights
		var torch = new BABYLON.PointLight("light1",BABYLON.Vector3.Zero(), scene);
		torch.intensity = 0.5;
		torch.diffuse = BABYLON.Color3.FromHexString('#ff9944');
		
	var sky = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
	sky.intensity = 1;
	sky.diffuse = bgcolor;
	
	// shadow
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, torch);
	shadowGenerator.setDarkness(0.2);
	//shadowGenerator.usePoissonSampling = true;
	shadowGenerator.useBlurVarianceShadowMap = true;
	shadowGenerator.blurBoxOffset = 1.0;
	shadowGenerator.blurScale = 20.0;
	//shadowGenerator.bias = 0.00001;
	
	//var customProcTextmacadam = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
	var customProcTextmacadam  =  new BABYLON.Texture("../images/ground.jpg", scene);

	var groundMat = new BABYLON.StandardMaterial("gmat", scene);
	groundMat.diffuseTexture = customProcTextmacadam;
	groundMat.diffuseTexture.uScale = 10;
	groundMat.diffuseTexture.vScale = 10;
	groundMat.specularPower = 5;

	var player1Mat = new BABYLON.StandardMaterial("pmat", scene);
	player1Mat.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
	player1Mat.specularPower = 128;

	var playereMat = new BABYLON.StandardMaterial("pemat", scene);
	playereMat.emissiveColor = BABYLON.Color3.FromHexString('#ffffff');
	playereMat.specularPower = 128;

	var playerbMat = new BABYLON.StandardMaterial("pbmat", scene);
	playerbMat.diffuseColor = BABYLON.Color3.Black();
		
	//player ----
	var player = BABYLON.Mesh.CreateSphere("playerbody", 8, 1.8, scene);
	player.material = player1Mat;
	player.position.y = 0.9;

	var playere1 = BABYLON.Mesh.CreateSphere("eye1", 8, 0.5, scene);
	playere1.material = playereMat;
	playere1.position.y = 0.5;
	playere1.position.z = 0.5;
	playere1.position.x = -0.3;
	playere1.parent = player;

	var playere2 = BABYLON.Mesh.CreateSphere("eye2", 8, 0.5, scene);
	playere2.material = playereMat;
	playere2.position.y = 0.5;
	playere2.position.z = 0.5;
	playere2.position.x = 0.3;
	playere2.parent = player;

	var playereb1 = BABYLON.Mesh.CreateSphere("eye1b", 8, 0.25, scene);
	playereb1.material = playerbMat;
	playereb1.position.y = 0.5;
	playereb1.position.z = 0.7;
	playereb1.position.x = -0.3;
	playereb1.parent = player;

	var playereb2 = BABYLON.Mesh.CreateSphere("eye2b", 8, 0.25, scene);
	playereb2.material = playerbMat;
	playereb2.position.y = 0.5;
	playereb2.position.z = 0.7;
	playereb2.position.x = 0.3;
	playereb2.parent = player;

	shadowGenerator.getShadowMap().renderList.push(player);
	player.checkCollisions = true;
	player.applyGravity = true;
	player.ellipsoid = new BABYLON.Vector3(0.9, 0.45, 0.9);
	player.speed = new BABYLON.Vector3(0, 0, 0.08);
	player.nextspeed = new BABYLON.Vector3.Zero();
	player.nexttorch = new BABYLON.Vector3.Zero();

	var lightImpostor = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.1, scene);
	var lightImpostorMat = new BABYLON.StandardMaterial("mat", scene);
	lightImpostor.material = lightImpostorMat;
	lightImpostorMat.emissiveColor = BABYLON.Color3.Yellow();
	lightImpostorMat.linkEmissiveWithDiffuse = true;
	lightImpostor.position.y = 4.0;
	lightImpostor.position.z = 0.7;
	lightImpostor.position.x = 1.2;
	lightImpostor.parent = player;

	for (var k = 1; k < Wave1; k++) {
	  for (var i = 1; i < nombreEnnemyR; i++) {

		var ennemyMat = new BABYLON.StandardMaterial("pematE", scene);
		ennemyMat.emissiveColor = BABYLON.Color3.FromHexString('#960018');
		ennemyMat.specularPower = 128;
		
		var ennemy = BABYLON.Mesh.CreateSphere("ennemybodyR" + i, 8, 1.8, scene);
		
		ennemy.material = ennemyMat;
		ennemyMat.emissiveColor = BABYLON.Color3.FromHexString('#960018');
		ennemyMat.specularPower = 128;
		
		ennemy.ellipsoid = new BABYLON.Vector3(0.9, 0.45, 0.9);
		ennemy.speed =  new BABYLON.Vector3.Zero();
		
		var lightEnnemy = BABYLON.Mesh.CreateSphere("sphere" +i, 16, 0.1, scene);
		var lightEnnemyMat = new BABYLON.StandardMaterial("matEnnemy"+i, scene);
		lightEnnemy.Color =  BABYLON.Color3.FromHexString('#960018');
		
		ennemyMat.emissiveColor = BABYLON.Color3.FromHexString('#960018');
		ennemyMat.specularPower = 128;
		
		lightEnnemy.material = lightEnnemyMat;
		lightEnnemyMat.emissiveColor = BABYLON.Color3.Red();
		lightEnnemyMat.linkEmissiveWithDiffuse = true;
		lightEnnemy.position.y = ennemy.position.y;  
		lightEnnemy.position.z =ennemy.position.z;
		lightEnnemy.position.x =ennemy.position.x;
		lightEnnemy.parent = ennemy;
		lightEnnemy.diffuseColor =  BABYLON.Color3.FromHexString('#960018');
		lightEnnemy.specularColor =  BABYLON.Color3.FromHexString('#960018');
		lightEnnemy.emissiveColor =  BABYLON.Color3.FromHexString('#960018');
		lightEnnemy.ambientColor =  BABYLON.Color3.FromHexString('#960018');
		
		shadowGenerator.getShadowMap().renderList.push(ennemy);

	}
}

for (var k = 1; k < vagues; k++) {
	if(salve==1){
		for(var l = 1; l < nombreEnnemyR; l++){
		
		// ne supporte pas le 0, compensé avec le i-1 
		//initialisation des positions des ennemis
			var ennemyName =  "ennemybodyR" + k ;
			scene.getMeshByName(ennemyName).position.x = player.position.x;	scene.getMeshByName(ennemyName).position.y = player.position.y+(i-1)*8  ;	scene.getMeshByName(ennemyName).position.z = player.position.z+(i*8)+50*k ;
			console.log("ennemy.position.x : " + ennemy.position.x + "ennemy.position.y : "+ ennemy.position.y+ "ennemy.position.z : "+ ennemy.position.z);
		}
	}
salve++;
}

// ground	 
	var ground = BABYLON.Mesh.CreatePlane("g", 1200, scene);
	ground.position = new BABYLON.Vector3(0, 0, 0);
	ground.rotation.x = Math.PI / 2;
	ground.material = groundMat;
	ground.receiveShadows = true;
	window.keyisdown = {};
	window.addEventListener('keydown', function (event) {
		window.keyisdown[event.keyCode] = true;
		
	});

	window.addEventListener('keyup', function (event) {
		window.keyisdown[event.keyCode] = false;
	});

	window.addEventListener('blur', function (event) {
		for (var k in window.keyisdown) {
			window.keyisdown[k] = false;
		}
	});

	window.tempv = new BABYLON.Vector3.Zero();


	scene.registerBeforeRender(function () {


		for (var k = 1; k < vagues; k++) {
		for (var j = 1; j < nombreEnnemyR; j++) {

			//mouvement ennemis

			scene.getMeshByName("ennemybodyR"+j).position.z--;
			//ennemy.position.z++;ennemy.position.x++;ennemy.position.y++;
			
			//sortie d'écran 
			if (scene.getMeshByName("ennemybodyR"+j).position.z<0){k++;}

			//collisions 
			if(	ennemy.position.x <=player.position.x +5 && ennemy.position.x >=player.position.x +5 && ennemy.positiony <=player.position.y +5 && ennemy.position.y >=player.position.y +5 && ennemy.position.z <=player.position.z +5 && ennemy.position.z >=player.position.z +5  ){
				gameOver = true;
				fetch("../js/levels/gameOver.js");
			}
		}
	}
		var v = 0.5;
		player.nextspeed.x = 0.0;
		player.nextspeed.z = 0.00001;
		//if (window.keyisdown[32]){console.log("jumping" +jumping + "falling" + falling)}
	
    //    if (window.keyisdown[40]) { player.nextspeed.x = -v;}
	//	if (window.keyisdown[38]) { player.nextspeed.x =  v;}
	//	if (window.keyisdown[37]) { player.nextspeed.z =  v;}
	//	if (window.keyisdown[39]) { player.nextspeed.z = -v;}

	
	//console.log( "bool + " + (window.keyisdown[39]&&dashingDAvailable&&!dashingD &&  dashingDIteration==0 ));
     	if ((window.keyisdown[37]&&dashingDAvailable&&!dashingD &&  dashingDIteration==0)) {console.log("in");dashSpeed=-initialdashSpeed; dashingD=true;}
		 if ((window.keyisdown[39]&&dashingGAvailable)&&!dashingG &&  dashingGIteration==0) {dashSpeed= initialdashSpeed; dashingG=true;}
	//console.log("player.position.z :  "+player.position.z );

	//pour que les dash fassent la même longueur
	//set timeout trop inconsistants
if(dashingDIteration==10){
	dashingD=false;dashSpeed=initialdashSpeed;
	setTimeout(dashingDAvailable=true,150);
	dashingDIteration = 0 ;
	//dashSpeed+=10;
}
if(dashingDIteration==2){
	dashingDAvailable=false;
	dashingD=true;
	// pour que l'arrêt soit plus smooth
	//dashSpeed+=10;
}

	if(dashingGIteration==10){
		console.log("dashigGIteration + " + dashingGIteration);
		dashingG=false;dashSpeed=initialdashSpeed;
		setTimeout(dashingGAvailable=true,150);
		dashingGIteration = 0 ;
	}
	if(dashingGIteration==2){
		dashingG=true;
		dashingGAvailable=false;
		//dashSpeed+=10;
	}

if(dashingD){
	dashingG = false;
	player.position.z += 5000/((dashSpeed*dashSpeed*dashSpeed*dashSpeed));
	dashingDIteration++;
}
if(dashingG){
	dashingD = false;
	player.position.z -= 5000/((dashSpeed*dashSpeed*dashSpeed*dashSpeed));
	dashingGIteration++;	
}

		//player.speed = BABYLON.Vector3.Lerp(player.speed, player.nextspeed, 0.1);
		
if(jumping){

	player.position.y+= 1/((jumpSpeed*jumpSpeed*jumpSpeed)/5);
	setTimeout(falling = true, 400);
	jumpSpeed +=1

    setTimeout(function(){falling = true,jumping = false,jumpSpeed=1}, 400);
    falling = false;
}else{
    if(player.position.y>1){
        falling = true;
       // console.log("FALLING");

        player.position.y-=0.4;

    }else{
		falling = false;
	}
 }
//console.log("player.position.x" +player.position.x);
//console.log("player.position.y" +player.position.y);
// console.log("player.position.z" +player.position.z);
//keep player in the screen, do not match with pixel T_T
 if (player.position.x > 540) { player.position.x = 540.0; }
 if (player.position.x < -540.0) { player.position.x = -540.0; }
 if (player.position.z > 150.0) { player.position.z = 150.0; }
 if (player.position.z < -150.0) { player.position.z = -150.0; }


 //if(falling==false){console.log("jumping" +jumping + "falling" + falling)};
 if (window.keyisdown[32] && (falling==false) && !jumping) {
	  jumping = true;//console.log("in");
}

		//turn to dir
		if (player.speed.length() > 0.01) {
			tempv.copyFrom(player.speed); 
			var dot = BABYLON.Vector3.Dot(tempv.normalize(), BABYLON.Axis.Z );
			var al = Math.acos(dot);
			if (tempv.x<0.0) { al = Math.PI * 2.0 - al;}
			if (window.keyisdown[9]) {		
			}
			if (al > player.rotation.y) {
				var t = Math.PI / 30;
			} else {
				var t = -Math.PI / 30;
			}
			var ad = Math.abs(player.rotation.y - al); 
			if (ad > Math.PI) {
				t = -t;
			}
			if (ad < Math.PI / 15) {
				t = 0;
			}
			player.rotation.y += t;
			if (player.rotation.y > Math.PI * 2) { player.rotation.y -= Math.PI * 2; }
			if (player.rotation.y < 0 ) { player.rotation.y += Math.PI * 2; }
		}
	
		
		player.nexttorch = lightImpostor.getAbsolutePosition(); 
		torch.position.copyFrom(player.nexttorch);
		torch.intensity = 0.6;
		torch.position.x += Math.random() * 0.125 - 0.0625;
		torch.position.z += Math.random() * 0.125 - 0.0625;
		//camera.target = BABYLON.Vector3.Lerp(camera.target, player.position.add(player.speed.scale(15.0)), 0.05);
        //camera.target = player.position;

        camera.target =  BABYLON.Vector3.Zero() ;
	
		camera.radius=200;
		//camera.beta=0.4 *Math.PI;
	//	console.log("camera.beta" + camera.beta);
		//camera.beta = Math.PI/3;
	});

    return scene;

};


engine.runRenderLoop(function () {
    scene.render();
});


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
var scene = createScene();