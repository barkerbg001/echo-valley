import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Game from '@/Game.js'
import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'
import PlayerMaterial from './Materials/PlayerMaterial.js'

export default class Player {
    constructor() {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene

        this.setGroup()
        this.setModel()  // Updated to load the model instead of a helper geometry
        this.setDebug()
    }

    setGroup() {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    setModel() {
        const loader = new GLTFLoader()

        loader.load(
            '/player/character-male-a.glb', // Path to your GLB file
            (gltf) => {
                this.model = gltf.scene
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new PlayerMaterial()  // Apply your custom material
                        child.material.uniforms.uColor.value = new THREE.Color('#fa0202')
                        child.material.uniforms.uSunPosition.value = new THREE.Vector3(-0.5, -0.5, -0.5)
                    }
                })

                this.group.add(this.model)
            },
            undefined,
            (error) => {
                console.error('An error occurred loading the model:', error)
            }
        )
    }

    setDebug() {
        if (!this.debug.active) return

        const playerFolder = this.debug.ui.getFolder('view/player')
        playerFolder.addColor(this.helper?.material.uniforms.uColor, 'value')
    }

    update() {
        const playerState = this.state.player
        const sunState = this.state.sun

        this.group.position.set(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )
        
        if (this.model) {
            this.model.rotation.y = playerState.rotation
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.uniforms.uSunPosition.value.set(sunState.position.x, sunState.position.y, sunState.position.z)
                }
            })
        }
    }
}
