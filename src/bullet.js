import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";
import Game from "./game";
import Player from "./player"
import "cannon";
import Console from "./utils/console";

export default class Bullet extends Mesh {
    constructor(player) {
        super(
            new SphereGeometry(0.25, 8, 8),
            new MeshBasicMaterial({color: 0xffffff})
        )

        this.bulletSpeed = 100
        this.rigidBody = new CANNON.Body( {
            mass: 1, 
            shape: new CANNON.Sphere(0.25)
        } )

        Game.addObjectWithTag(this, 'bullet')

        // TODO: use weapon spawn point
        if (player instanceof Player) {
            this.rigidBody.position.copy(player.position)
            this.target = new Vector3().copy(player.mouse3D)

            this.velocity = this.target.sub(player.position)
                .normalize().multiplyScalar(this.bulletSpeed)

            this.rigidBody.velocity.copy(this.velocity)
            // this.rigidBody.position.copy(player.position.add(this.velocity.normalize().multiplyScalar(2)))
        } else {
            Console.error("Huston we got an problem...")
        }

        this.rigidBody.addEventListener('collide', ({body}) => {
            const {id} = body

            if (Game.getTag(id) == "player") {
                // Bullet.destroy(this)
            }
        })

        setTimeout(() => Bullet.destroy(this), 1000)
    }

    static destroy(bullet) {
        Game.removeObject(bullet)
    }
}