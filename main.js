/*const URL = 'http://localhost:8000';
let star = `${URL}/assets/textures/starsBackground.jpg`;
let snakeSkin = `${URL}/assets/textures/greenSnakeSkin.svg`;*/

let star = `assets/textures/starsBackground.jpg`;
let snakeSkin = `assets/textures/greenSnakeSkin.svg`;
let moon = `assets/textures/moon_1024.jpg`
let scene, camera, renderer, cube, sphere, snake, group, body, head, bodypart;
let foodBall, ground, plane ;

let gameOverFlag = false;
let score = 0;
let changeColor= false;
let a = score;
var foods = [];
var trees = [];
var bodyparts = [];
var cubes = [];
var life = 5;

var ambientLight, light, meshFloor, mesh;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let ASPECT_RATIO = window.innerWidth/window.innerHeight;

function init(){
    scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, ASPECT_RATIO, 0.1, 1000);
    
    var stars = createStarBackground(30, 64);
    scene.add(stars);
    
    document.getElementById("scoreLife").innerHTML = "Score: " + score + " Lives left: "+ life;
    document.getElementById("instructions").style.display = "block";
    document.getElementById("clickMouse").style.display = "block";
    document.getElementById("header").style.display = "block";

    start();
    
	createSnakeBody();
    
    createFoods()
    
    fail();
    
	createPlaneGround();
	
    createLights();

    createTrees();
    
	
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


//////////////////////////////////Create Snake\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function createSnakeBody(){
    var geometry;
    var material;
    var texture = new THREE.TextureLoader().load(snakeSkin);
    for (let i=0; i < 10; i+=0.15){

        if (i==0){
            geometry = new THREE.CylinderGeometry( 0.1, 0.3, 0.4, 15 );
            material = new THREE.MeshPhongMaterial( { map: texture} );
            head = new THREE.Mesh( geometry, material );
            head.position.y += 0.5;
            head.position.z += -0.5;
            head.rotation.x = Math.PI / 2;
            head.castShadow = true;
            head.receiveShadow = true;
            
        } else if (i==0.15){
            geometry = new THREE.CylinderGeometry( 0.3, 0.2, 0.3, 15 );
            material = new THREE.MeshPhongMaterial( { map: texture} );
    
            head2 = new THREE.Mesh( geometry, material );
            head2.position.y += -0.2-i;
            head2.position.z = 0;
            head2.rotation.x = 0;
            head2.castShadow = true;
            head2.receiveShadow = true;
            head.add(head2)
            scene.add(head)
        }else {
            geometry = new THREE.CylinderGeometry( 0.2, 0.2, 0.1, 15 );
            material = new THREE.MeshPhongMaterial( { map: texture} );
    
            bodypart = new THREE.Mesh( geometry, material );
            bodypart.position.y -= i;
            bodypart.position.z = 0;
            bodypart.rotation.x = 0;
            bodypart.castShadow = true;
            bodypart.receiveShadow = true;
            bodyparts.push(bodypart);
            head.add(bodypart)
            bodyparts.forEach(bodypart =>{
                bodypart.visible = false;
            })   
        }   
    }
    scene.add(head);
}

//////////////////////////////LIGHTS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function createLights() {

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

////////////////////////Background and Ground\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff, opacity: 0.3, transparent: true});
    ground = new THREE.Mesh( geometry, material );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
    
}


//////////////////////////////////Food\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function createFoodElement(){
    var geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    foodBall = new THREE.Mesh( geometry, material );
    foodBall.castShadow = true;
    foodBall.receiveShadow = true;
    return foodBall;
}

function createFoods(){
    for (let i = 0; i < 10; i += 1){
        food = createFoodElement();
        food.position.y += 0.2;
        food.position.z += getRandomInt(30,100);
        food.position.x += getRandomInt(-4,4);
        food.rotation.x = Math.PI / 2;
        foods.push(food);
    } 
}

///////////////////////Snake movement\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function handleUserInteraction(event){
    if (event.code == 'ArrowRight' && head.position.x > -4) {
        animateSnake('right');
    } else if (event.code == 'ArrowLeft' && head.position.x < 4){
        animateSnake('left');
    } else if (event.code == 'Space'){
        window.location.href=window.location.href

    }
}

function animateSnake(direction){
    const moveAmount = 0.3
    const newXvalue = direction === 'right' ? head.position.x - moveAmount : head.position.x + moveAmount;
    const newPosition = {
        ...head.position,
        x: newXvalue,
    }
    var snakeTween = new TWEEN.Tween(head.position)
    .to(newPosition, 50)
    .start()
    
}

///////////////////////Obstical moontree\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function createSmallMoonTree(){
    var texture = new THREE.TextureLoader().load(moon);
    var geometry = new THREE.CylinderGeometry( 0.2, 0.2, 0, 15 );
    var material= new THREE.MeshPhongMaterial( { color: 0x0000} );
    tree = new THREE.Mesh( geometry, material );
    var geometryMoon1 = new THREE.SphereGeometry( 0.4, 32, 32 );
    var materialMoon = new THREE.MeshPhongMaterial( { map: texture} );
    moon1 = new THREE.Mesh( geometryMoon1, materialMoon );
    var geometryMoon2 = new THREE.SphereGeometry( 0.3, 32, 32 );
    moon2 = new THREE.Mesh( geometryMoon2, materialMoon );
    var geometryMoon3 = new THREE.SphereGeometry( 0.2, 32, 32 );
    moon3 = new THREE.Mesh( geometryMoon3, materialMoon );

    tree.position.y += 0.5;
    tree.position.z += 1;
    tree.position.x += 0;

    moon1.position.y += 0.3;
    moon2.position.y += 0.8;
    moon3.position.y += 1.2;
    
    tree.add(moon1);
    tree.add(moon2);
    tree.add(moon3);
    tree.castShadow = true;
    tree.receiveShadow = true;

    return tree;
}

function createTrees(){
    for (let i = 0; i < 20; i += 1){
        tree = createSmallMoonTree();
        tree.position.y += 0.2;
        tree.position.z += getRandomInt(30,100);
        tree.position.x += getRandomInt(-4,4);
        trees.push(tree);
    } 
}

//////////////////////////////////Change Game status\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function fail(){
    var geometry = new THREE.PlaneGeometry( 10,100,10,10);
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000, opacity: 0.1, transparent: true} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
}


function gameOver(){
    gameOverFlag = true;
    var x = document.getElementById("gameoverDiv");
    document.getElementById("finalScore").innerHTML = "Final score : " + score;
    if (gameOverFlag) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
  }
    
}

function handleclick(id){
    id.style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("header").style.display = "none";
    animate();
   
   
}

function start(){
    gameOverFlag = false;
    var x = document.getElementById("gameoverDiv");
    if (!gameOverFlag) {
        x.style.display = "none";
    } else{
        animate();
    }
     
}


//////////////////////////////////Animation\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function animate() {
    
    if (gameOverFlag) return;

    let speed = 0.13

    if (score > 30){
        speed = 0.2;
    } else if (score > 50){
        speed = 0.25;
    }
    


        foods.forEach(food =>{
            food.position.z -= speed;
            scene.add(food);
            if (food.position.z < -4){
                food.visible = true;
                food.position.z += getRandomInt(30,100);
            }
            let in_collision_range =
                Math.abs(food.position.x - head.position.x) < 0.7 &&
                Math.abs(food.position.z - head.position.z) < 0.7;
                if (in_collision_range) {
                    if (food.visible){
                        score += 1;
                        bodyparts[score].visible = true;
                        food.visible = false;
                    } document.getElementById("scoreLife").innerHTML = "Score: " + score + " Lives left: "+ life;
                } else { 
                    score = score
                    document.getElementById("scoreLife").innerHTML = "Score: " + score + " Lives left: "+ life;
                }
            }
        )

        trees.forEach(tree =>{
            tree.position.z -= speed;
            scene.add(tree);
            if (tree.position.z < -4){
                tree.visible = true
                tree.position.z += getRandomInt(30,100);
                
            }

            let in_collision_range =
                Math.abs(tree.position.x - head.position.x) < 0.5 &&
                Math.abs(tree.position.z - head.position.z) < 0.5;
                
                if (in_collision_range) {
                    if (tree.visible){
                        life -= 1;
                        scene.add(fail())
                        tree.visible = false;
                    }
                }
                    document.getElementById("scoreLife").innerHTML = "Score: " + score + " Lives left: "+ life;
                    
                if (life < 1){
                    gameOver();
                }
    })
    

    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
   
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, true);

document.onkeydown = handleUserInteraction;


init();



