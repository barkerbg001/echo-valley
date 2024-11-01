import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Game from '@/Game.js'
import View from '@/View/View.js'
import Debug from '@/Debug/Debug.js'
import State from '@/State/State.js'

export default class Player {
    constructor() {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.view = View.getInstance()
        this.debug = Debug.getInstance()

        this.scene = this.view.scene
        this.clock = new THREE.Clock() // To track delta time for animations

        this.setGroup()
        this.addLights()
        this.loadTexture(() => {
            this.setModel()
        })
        this.setDebug()
    }

    setGroup() {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    addLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) 
        this.scene.add(ambientLight)

        // Directional light to simulate sunlight
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        this.scene.add(directionalLight)
    }

    loadTexture(callback) {
        const textureLoader = new THREE.TextureLoader()
        this.colorMap = textureLoader.load(
            '/player/Textures/colormap.png',
            () => {
                console.log("Texture loaded successfully")
                if (callback) callback()
            },
            undefined,
            (error) => console.error("Texture loading error:", error)
        )
    }

    setModel() {
        const loader = new GLTFLoader()

        loader.load(
            '/player/vehicle-racer-low.glb',
            (gltf) => {
                this.model = gltf.scene

                // Scale the model to make it more visible
                this.model.scale.set(5, 5, 5)

                // Set up animations if any are present in the GLB file
                if (gltf.animations && gltf.animations.length) {
                    this.mixer = new THREE.AnimationMixer(this.model)
                    const action = this.mixer.clipAction(gltf.animations[0]) // Play the first animation
                    action.play()
                }

                // Apply texture and set up material for each mesh
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            map: this.colorMap,   // Apply loaded color texture
                        })
                        console.log("Texture applied to mesh:", child)
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
        if (this.helper?.material) {
            playerFolder.addColor(this.helper.material.uniforms.uColor, 'value')
        }
    }

    update(deltaTime) {  // Accept deltaTime as an argument to control animation speed
        const playerState = this.state.player
        const sunState = this.state.sun

        this.group.position.set(
            playerState.position.current[0],
            playerState.position.current[1],
            playerState.position.current[2]
        )
        
        if (this.model) {
            this.model.rotation.y = playerState.rotation
        }

        // Update the animation mixer if it exists
        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }
}
