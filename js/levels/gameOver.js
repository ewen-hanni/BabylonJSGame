canvas = document.getElementById("menuCanvas"); // Get the canvas element
engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var createStartMenuUI = function(){
	
	startTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    startTexture.addControl(UiPanel);

    
	
	// creating a button on the whole screen
    var playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "");
    playBtn.padding = "0px";
    playBtn.width = "1080px";
    playBtn.height = "720px";
    playBtn.opacity = "0";
    playBtn.onPointerDownObservable.add(()=> {
        window.location.href = './gameOver.html';
    });
    UiPanel.addControl(playBtn);
}


var createScene = function(){  

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-4, 0, -10), scene);
    
    camera.setTarget(BABYLON.Vector3.Zero());

    var background = new BABYLON.Layer("back", "../images/gameOver.jpg", scene);
	background.isBackground = true;
    background.texture.level = 0;
    
    createStartMenuUI();

    return scene;
}

var scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
	
});

window.addEventListener("resize", function () {
	engine.resize();
});
