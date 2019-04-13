let _scene, _camera, _world, _loader, _renderer, _tags, _players
export default class Game {
    static get scene() {
        return _scene
    }

    static get camera() {
        return _camera
    }

    static get world() {
        return _world
    }

    static get loader() {
        return _loader
    }

    static get renderer() {
        return _renderer
    }

    static init(
        scene,
        camera,
        world,
        loader,
        renderer
    ) {
        _scene = scene
        _camera = camera
        
        const solver = new CANNON.GSSolver()
        solver.iterations = 7
        solver.tolerance = 0.1
        world.solver = solver
        world.gravity.set(0, -20, 0)
        _world = world

        _loader = loader

        renderer.setSize(window.innerWidth, window.innerHeight, false)
        renderer.setPixelRatio(0.28) // to achieve low pixel resolution
        document.body.appendChild(renderer.domElement)
        window.addEventListener('resize', function() {
            camera.aspect = this.innerWidth / this.innerHeight;
            camera.updateProjectionMatrix();
        
            renderer.setSize( this.innerWidth, this.innerHeight );
        })
        _renderer = renderer

        _tags = {
            "player": [],
            "bullet": []
        }

        _players = []
    }

    /**
     * @param {Number} id
     * @returns The globally stored tag from Game singleton
     * @memberof Game
     */
    static getTag(id) {
        for (const key in _tags) {
            if (_tags.hasOwnProperty(key)) {
                if (_tags[key].find(e => e == id)) {
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
    static addObjectWithTag(object, tag) {
        object.tag = tag

        _scene.add(object)
        _world.add(object.rigidBody)
        _tags[tag] = [..._tags[tag], object.rigidBody.id]

        if (tag == "player") {
            _players.push(object)
        }
    }

    /**
     * @param {THREE.Mesh} object
     */
    static removeObject(object) {
        object.visible = false
        _scene.remove(object)
        _world.remove(object.rigidBody)

        const tagIndex = _tags[object.tag].findIndex(id => id == object.rigidBody.id)
        if (tagIndex != -1) {
            _tags[object.tag].splice(tagIndex, 1)
        }

        const playerIndex = _players.findIndex(player => player.id == object.id)
        if (playerIndex != 1) {
            _players.splice(playerIndex, 1)
        }
    } 

    static updatePlayers() {
        _players.forEach(player => {
            player.update()
        });
    }
}