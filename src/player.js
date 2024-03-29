import { Mesh, BoxGeometry, Vector3, MeshPhongMaterial } from "three";
import Game from "./game";
import Bullet from "./bullet";

let _rigidBody, _health
export default class Player extends Mesh {

    get health() {
        return _health
    }

    get rigidBody() {
        return _rigidBody
    }

    constructor(speed, color, isOwner) {
        // TODO: change with better mesh
        super(
            new BoxGeometry(1, 1, 1),
            new MeshPhongMaterial({ color: color })
        )

        this.speed = speed
        this.velocity = new Vector3(0, 0, 0)
        this.bulletsMesh = []
        _health = 100
        this.castShadow = true
        
        _rigidBody = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(1, 3, 1)),
        })
        
        Game.addObjectWithTag(this, 'player')

        _rigidBody.addEventListener('collide', ({ body }) => {
            const { id } = body

            if (Game.getTag(id) == "bullet") {
                _health -= 5
                if (_health <= 0) {
                    _health = 0
                    this.die()
                }
            }
        })

        if (isOwner) {
            window.addEventListener('keydown', event => {
                const { key, keyCode } = event
                if (key == "ArrowUp" || key == "w") {
                    this.velocity.z = -this.speed
                } else if (key == "ArrowLeft" || key == "a") {
                    this.velocity.x = -this.speed
                } else if (key == "ArrowDown" || key == "s") {
                    this.velocity.z = this.speed
                } else if (key == "ArrowRight" || key == "d") {
                    this.velocity.x = this.speed
                } else if (keyCode == 32) {
                    this.shoot()
                }
            })

            window.addEventListener('keyup', event => {
                const { key } = event
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

            window.addEventListener('mousemove', event => {
                const { camera } = Game

                var vec = new Vector3(); // create once and reuse
                var pos = new Vector3(); // create once and reuse

                vec.set(
                    (event.clientX / window.innerWidth) * 2 - 1,
                    - (event.clientY / window.innerHeight) * 2 + 1,
                    0.5);

                vec.unproject(camera);

                vec.sub(camera.position).normalize();

                var distance = - camera.position.y / vec.y;

                pos.copy(camera.position).add(vec.multiplyScalar(distance));
                pos.y = 0
                this.mouse3D = pos
            })

            window.addEventListener('mousedown', () => {
                this.shoot()
            })
        }
    }

    shoot() {
        this.bulletsMesh.push(new Bullet(this))
    }

    update(dt) {
        //this.rotation.x += 0.01
        //this.rotation.y += 0.02
        if (this.mouse3D) {

            // FIXME: unwanted rotation by x
            this.lookAt(this.mouse3D)
            //this.position.x = this.mouse3D.x
            //this.position.z = this.mouse3D.z
        }

        this.bulletsMesh.forEach((bullet, i) => {
            const { visible, position, rigidBody } = bullet
            if (!visible) {
                this.bulletsMesh.splice(i, 1)
                return
            }

            if (rigidBody.position)
                position.copy(rigidBody.position)

            // static movement
            // position.x += velocity.x * dt
            // position.z += velocity.z * dt
        });

        this.rigidBody.position.copy(this.position)
        this.rigidBody.quaternion.copy(this.quaternion)

        this.position.x += this.velocity.x * dt
        // TODO: implement gravity
        this.position.z += this.velocity.z * dt
    }

    die() {
        // TODO: play explosion particle
        // TODO: play die sound
        Game.removeObject(this)
    }
}