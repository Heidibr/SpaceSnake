


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
    
    var stars = createStarBackground(30, 64);
    scene.add(stars);

	
	createPlaneGround();
	createFood()
	
    createLights();
    
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
    var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}
   // LIGHTSs
function createLights() {

	// LIGHTS
	ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	// Will not light anything closer than 0.1 units or further than 25 units
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
}


function createHead(){
    var geometryheadpart1 = new THREE.CylinderGeometry( 0.2, 0.3, 0.1, 15  );
    var geometryheadpart2 = new THREE.CylinderGeometry( 0.3, 0.2, 0.1, 15  );
    var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    
    var headpart1 = new THREE.Mesh( geometryheadpart1, material );
    var headpart2 = new THREE.Mesh( geometryheadpart2, material );

    
    headpart1.position.set( 0, 0, 1 );
    headpart2.position.set( 0, 0, 1 );
    headpart1.rotation.x = 1.3;
    headpart1.rotation.x = 1.3;
    scene.add(headpart2)
    scene.add(headpart1)
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

function createPlaneGround(){
    var geometry = new THREE.PlaneGeometry( 10,100,10,10);
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff, opacity: 0.3, transparent: true} );
    var ground = new THREE.Mesh( geometry, material );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
}

function handleUserInteraction(event){

   console.log(event.code);
   if (event.code == 'ArrowRight'){
       console.log('inni iffen')
    head.position.x += 3;
   }

}

function animate() {
    requestAnimationFrame(animate);

   
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    //sphere.rotation.x += 0.01;
    //sphere.rotation.y += 0.01;
    //group.rotation.x += 0.02;

    renderer.render(scene, camera)
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, true);

document.onkeydown = handleUserInteraction;

init();
animate();


