


let star = "assets/textures/starsBackground.jpg";
let snakeSkin = "assets/textures/greenSnakeSkin.svg";


let scene, camera, renderer, cube, sphere, snake, group, body, head;

var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var ambientLight, light, meshFloor, mesh;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let ASPECT_RATIO = window.innerWidth/window.innerHeight;

function init(){
    scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, ASPECT_RATIO, 0.1, 1000);
    
    //var stars = createStarBackground(30, 64);
    //scene.add(stars);


	createFood()
	
    //createLights();
    
    //createHead();
	
	camera.position.set(0, 4, -5);
	camera.lookAt(new THREE.Vector3(0,2,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	
	// Enable Shadows in the Renderer
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	renderer.render(scene, camera)

}

function createFood(){
    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}

function createStarBackground(radius, segments) {
    // Adds a background of stars to a sphere to visualize space

    var texture = new THREE.TextureLoader().load(star);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    var sphere = new THREE.SphereGeometry(radius, segments, segments);
    return new THREE.Mesh(sphere, material);
}



function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, true);

init();



