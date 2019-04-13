import Game from "./game";
import { AmbientLight, DirectionalLight, PlaneGeometry, MeshLambertMaterial, Mesh, Matrix4, Vector3 } from "three";
import Console from "./utils/console";

export default class Level {
    static init() {
        const {scene, world} = Game

        const ambientLight = new AmbientLight(0x404040)
        scene.add(ambientLight)

        const dirLight = new DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( 10, 10, 5 );
        scene.add(dirLight)

        const plane = new Mesh(
            new PlaneGeometry(300, 300, 50, 50),
            new MeshLambertMaterial({color: 0xdddddd})
        )
        plane.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2))
        plane.matrixAutoUpdate = false
        plane.receiveShadow = true
        plane.castShadow = true
        scene.add(plane)

        const planeRigidBody = new CANNON.Body( {
            mass: 0,
            shape: new CANNON.Plane()
        } )
        planeRigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2)
        world.addBody(planeRigidBody)
    }

    static loadVoxelModel(path, position) {
        const {loader, scene} = Game

        loader.load(
            path,
            model => {
                const house = model.scene.children[0];

                house.scale.setScalar(10);
                house.castShadow = true;
                house.receiveShadow = true;
                if (position instanceof Vector3) {
                    house.position.copy(position)
                }

                scene.add(house);
            },
            xhr => Console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded'),
            Console.error
        )
    }
}