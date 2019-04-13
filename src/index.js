import {
    Scene,
    WebGLRenderer
} from "three";
import Player from "./player";
import Game from "./game";
import "cannon";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MainCamera } from "./camera";
import Level from "./level";
import Time from "./utils/time";

// Setup renderer
/* TODO: use webgl2
const canvas = document.createElement('canvas')
const context = canvas.getContext('webgl2')
const renderer = new WebGLRenderer( { canvas: canvas, context: context})
*/
Game.init(
    new Scene(),
    new MainCamera(),
    new CANNON.World(),
    new GLTFLoader(), // FIXME: collision doesn't work use ammo.js
    new WebGLRenderer()
)

const { scene, camera, world, renderer } = Game

Level.init()
Level.loadVoxelModel('res/models/house1.gltf')
Level.loadVoxelModel('res/models/shop1.gltf')

const player = new Player(10, 0x00ff00, true)
camera.target = player

// TODO : extend player to enemy class with AI
const shopkeeper = new Player(5, 0xff0000)
shopkeeper.position.set(
    3, 1, -7
)

const fixedTimeStep = 1.0 / 60.0
const maxSubSteps = 3

function loop() {
    requestAnimationFrame(loop) // pauses rendering on blur
    const dt = Time.getDelta()

    world.step(fixedTimeStep, dt, maxSubSteps);

    camera.update()
    player.update(dt)
    shopkeeper.update(dt)

    renderer.render(scene, camera)
}

loop()