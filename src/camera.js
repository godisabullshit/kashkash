import { PerspectiveCamera, Vector3 } from "three";

let _target
export class MainCamera extends PerspectiveCamera {
    constructor(target) {
        super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.target = target
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
    set target(target) {
        _target = target || _target
    }

    update() {
        if (_target) {
            // TODO: bounded box follow
            this.position.set(
                _target.position.x,
                this.position.y,
                _target.position.z
            )
        }
    }
}