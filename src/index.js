import { 
    Scene, 
    PerspectiveCamera,
    WebGLRenderer,
    Vector3,
    AmbientLight,
    DirectionalLight,
} from "three";
import Player from "./player";

// Setup renderer
/* TODO: use webgl2
const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2')
const renderer = new WebGLRenderer( { canvas: canvas, context: context})
*/
const renderer = new WebGLRenderer()
// to acheive low pixel resolution
renderer.setSize(window.innerWidth, window.innerHeight, false)
renderer.setPixelRatio(0.28)
document.body.appendChild(renderer.domElement)

const scene = new Scene()
const ambientLight = new AmbientLight(0x404040)
scene.add(ambientLight)

const dirLight = new DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 10, 10, 5 );
scene.add(dirLight)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const player = new Player(scene, 10, 0x00ff00)

camera.position.y = 5
camera.lookAt(player.position)
camera.rotateOnWorldAxis(new Vector3(0,1,0), Math.PI)

let now, then = Date.now(), delta
function loop() {
    // to pause rendering on blur
    requestAnimationFrame(loop)
    const dt = getDelta()

    player.update(dt)

    renderer.render(scene, camera)
}

function getDelta() {
    now = Date.now()
    delta = (now - then) / 1000
    then = now

    return Number(delta)
}

loop()