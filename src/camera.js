import { PerspectiveCamera, Vector3 } from "three";
import { Player } from "./player";

export class MainCamera extends PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.position.y = 5;
        this.lookAt(new Vector3(0, 0, 0));
        this.rotateY(Math.PI * 2);

        window.addEventListener('wheel', event => {
            this.position.y = Math.max(5, this.position.y+event.deltaY*0.01)
        })
    }

    /**
     * @param {Player} target
     */
    set setTarget(target) {
        this.target = target
    }

    update() {
        if (this.target) {
            // TODO: bounded box follow
            this.position.set(
                this.target.position.x,
                this.position.y,
                this.target.position.z
            )
        }
    }
}