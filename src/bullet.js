import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene } from "three";
import {Game} from "./game";
import {Player} from "./player"
import "cannon";

export class Bullet extends Mesh {
    constructor(player) {
        super(
            new SphereGeometry(0.25, 8, 8),
            new MeshBasicMaterial({color: 0xffffff})
        )

        this.bulletSpeed = 100
        this.rigidbody = new CANNON.Body( {
            mass: 1, 
            shape: new CANNON.Sphere(0.25)
        } )

        Game.getInstance.addObjectWithTag(this, 'bullet')

        // TODO: use weapon spawn point
        if (player instanceof Player) {
            this.rigidbody.position.copy(player.position)
            this.target = new Vector3().copy(player.mouse3D)

            this.velocity = this.target.sub(player.position)
                .normalize().multiplyScalar(this.bulletSpeed)

            this.rigidbody.velocity.copy(this.velocity)
            // this.rigidbody.position.copy(player.position.add(this.velocity.normalize().multiplyScalar(2)))
        } else {
            console.error('We need player in bullet constructor')
        }

        this.rigidbody.addEventListener('collide', ({body}) => {
            const {id} = body

            if (Game.getInstance.getTag(id) == "player") {
                // Bullet.destroy(this)
            }
        })

        setTimeout(() => Bullet.destroy(this), 1000)
    }

    static destroy(bullet) {
        Game.getInstance.removeObject(bullet)
    }
}