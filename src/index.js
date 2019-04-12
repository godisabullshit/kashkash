import { 
    Scene,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Mesh,
    PlaneGeometry,
    MeshLambertMaterial,
    Matrix4,
} from "three";
import {Player} from "./player";
import {Game} from "./game";
import "cannon";

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { MainCamera } from "./camera";

// Setup renderer
/* TODO: use webgl2
const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2')
const renderer = new WebGLRenderer( { canvas: canvas, context: context})
*/
const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight, false)
// to acheive low pixel resolution
renderer.setPixelRatio(0.28) 
document.body.appendChild(renderer.domElement)

const camera = new MainCamera();

window.addEventListener('resize', function(event) {
    camera.aspect = this.innerWidth / this.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( this.innerWidth, this.innerHeight );
})

// PHYSICS
const world = new CANNON.World()
world.gravity.set(0, -20, 0)

const solver = new CANNON.GSSolver()
solver.iterations = 7
solver.tolerance = 0.1
world.solver = solver

// SCENE
const scene = new Scene()
const ambientLight = new AmbientLight(0x404040)
scene.add(ambientLight)

const dirLight = new DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 10, 10, 5 );
scene.add(dirLight)

const planeRigidBody = new CANNON.Body( {
    mass: 0,
    shape: new CANNON.Plane()
} )
planeRigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2)
world.addBody(planeRigidBody)

const loader = new GLTFLoader()
loader.load(
    'res/models/shop1.gltf', 
    model => {
        model.scene.scale.setScalar(10)

        scene.add(model.scene)
    },
    xhr => console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded'),
    console.error
)

const plane = new Mesh(
    new PlaneGeometry(300, 300, 50, 50),
    new MeshLambertMaterial({color: 0xdddddd})
)
plane.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2))
plane.matrixAutoUpdate = false
plane.receiveShadow = true
plane.castShadow = true
scene.add(plane)

const game = new Game(scene, camera, world)
const player = new Player(scene, 10, 0x00ff00, true)
camera.setTarget = player

// TODO : extend player to enemy class with AI
const enemy1 = new Player(scene, 5, 0xff0000)
enemy1.position.x = 10

// TODO: implement building with shopkeeper

const fixedTimeStep = 1.0/60.0
const maxSubSteps = 3

function loop() {
    // to pause rendering on blur
    requestAnimationFrame(loop)
    const dt = getDelta()

    world.step(fixedTimeStep, dt, maxSubSteps);

    camera.update()
    player.update(dt)
    enemy1.update(dt)

    renderer.render(scene, camera)
}

let now, then = Date.now(), delta
function getDelta() {
    now = Date.now()
    delta = (now - then) / 1000
    then = now

    return Number(delta)
}

loop()