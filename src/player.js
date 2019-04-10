import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, Vector3, MeshPhongMaterial } from "three";

export default class Player extends Mesh {

    constructor(scene, speed, color) {
        if (!(scene instanceof Scene)) return
        
        // TODO: change with better mesh
        const geometry = new BoxGeometry(1, 1, 1)
        const material = new MeshPhongMaterial({ color: color })
        const body = super(geometry, material)
        scene.add(this)
        this.speed = speed
        this.velocity = new Vector3(0, 0, 0)
        
        window.addEventListener('keydown', event => {
            const {key} = event
            if (key == "ArrowUp" || key == "w") {
                this.velocity.z = this.speed
            } else if (key == "ArrowLeft" || key == "a") {
                this.velocity.x = this.speed
            } else if (key == "ArrowDown" || key == "s") {
                this.velocity.z = -this.speed
            } else if (key == "ArrowRight" || key == "d") {
                this.velocity.x = -this.speed
            } 
        })

        window.addEventListener('keyup', event => {
            const {key} = event
            if (key == "ArrowUp" || key == "w") {
                this.velocity.z = 0
            } else if (key == "ArrowLeft" || key == "a") {
                this.velocity.x = 0
            } else if (key == "ArrowDown" || key == "s") {
                this.velocity.z = 0
            } else if (key == "ArrowRight" || key == "d") {
                this.velocity.x = 0
            }
        })

        // lookat mouse
        // FIXME: https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
        window.addEventListener('mousemove', event => {
            this.mouse3D = new Vector3(
                -( event.clientX / (window.innerWidth / 2) ) * 0.2,
                1,
                -( event.clientY / (window.innerHeight / 2) ) * 0.2,
            );    
        })

        return body
    }

    shoot(target) {

    }

    update(dt) {
        //this.rotation.x += 0.01
        //this.rotation.y += 0.02
        if (this.mouse3D) {
            this.lookAt(this.mouse3D);
            //this.position.x = this.mouse3D.x
            //this.position.z = this.mouse3D.z
        }

        
        this.rotation.x = 0
        this.rotation.z = 0
        this.position.x += this.velocity.x * dt
        // TODO: implement gravity
        this.position.z += this.velocity.z * dt
    }
}