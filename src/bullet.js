import { Mesh } from "three";

class Bullet extends Mesh {
    constructor(scene) {
        if (!(scene instanceof Scene)) return

        this.physics = new MDDPhysics()
    }


}