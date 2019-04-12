let instanceGame

export class Game {
    constructor(
        scene,
        camera,
        world
    ) {
        this.scene = scene
        this.camera = camera
        this.world = world

        this.tags = {
            "player": [],
            "bullet": []
        }

        instanceGame = this
    }

    /**
     * @returns {Game}
     */
    static get getInstance() {
        return instanceGame
    }

    /**
     * @param {Number} id
     * @returns The globally stored tag from Game singleton
     * @memberof Game
     */
    getTag(id) {
        for (const key in this.tags) {
            if (this.tags.hasOwnProperty(key)) {
                if (this.tags[key].find(e => e == id)) {
                    return key
                }
            }
        }

        return "normal"
    }

    /**
     * @param {THREE.Mesh} object
     * @param {String} tag
     * @memberof Game
     */
    addObjectWithTag(object, tag) {
        object.tag = tag

        this.scene.add(object)
        this.world.add(this.rigidbody)
        tags[tag] = [...tags[tag], this.rigidbody.id]
    }

    /**
     * @param {THREE.Mesh} object
     */
    removeObject(object) {
        this.visible = false
        this.scene.remove(object)
        this.world.remove(object.rigidbody)

        const tagIndex = tags[object.tag].findIndex(id => id == object.rigidbody.id)
        if (tagIndex != -1) {
            tags[object.tag].splice(tagIndex, 1)
        }
    }
}