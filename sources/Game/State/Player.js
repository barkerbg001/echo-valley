import { vec3 } from 'gl-matrix'

import Game from '@/Game.js'
import State from '@/State/State.js'
import Camera from './Camera.js'

export default class Player {
    constructor() {
        this.game = Game.getInstance()
        this.state = State.getInstance()
        this.time = this.state.time
        this.controls = this.state.controls

        this.rotation = 0
        this.inputSpeed = 10
        this.inputBoostSpeed = 30
        this.speed = 0

        this.position = {}
        this.position.current = vec3.fromValues(10, 0, 1)
        this.position.previous = vec3.clone(this.position.current)
        this.position.delta = vec3.create()

        this.camera = new Camera(this)

        // Initialize jump-related properties
        this.isJumping = false
        this.jumpVelocity = 0
        this.gravity = -9.8
        this.jumpStrength = 5
    }

    update() {
        if (this.camera.mode !== Camera.MODE_FLY && (this.controls.keys.down.forward || this.controls.keys.down.backward || this.controls.keys.down.strafeLeft || this.controls.keys.down.strafeRight)) {
            this.rotation = this.camera.thirdPerson.theta;

            if (this.controls.keys.down.forward) {
                if (this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.25;
                else if (this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.25;
            } else if (this.controls.keys.down.backward) {
                if (this.controls.keys.down.strafeLeft)
                    this.rotation += Math.PI * 0.75;
                else if (this.controls.keys.down.strafeRight)
                    this.rotation -= Math.PI * 0.75;
                else
                    this.rotation -= Math.PI;
            } else if (this.controls.keys.down.strafeLeft) {
                this.rotation += Math.PI * 0.5;
            } else if (this.controls.keys.down.strafeRight) {
                this.rotation -= Math.PI * 0.5;
            }

            const speed = this.controls.keys.down.boost ? this.inputBoostSpeed : this.inputSpeed;

            const x = Math.sin(this.rotation) * this.time.delta * speed;
            const z = Math.cos(this.rotation) * this.time.delta * speed;

            this.position.current[0] -= x;
            this.position.current[2] -= z;
        }

        // Handle jump input
        if (this.controls.keys.down.jump && !this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = this.jumpStrength;
        }

        // Update vertical position based on jump state
        if (this.isJumping) {
            this.position.current[1] += this.jumpVelocity * this.time.delta;
            this.jumpVelocity += this.gravity * this.time.delta;

            // Check if the player has landed (assuming ground level is y = 0)
            const chunks = this.state.chunks;
            const elevation = chunks.getElevationForPosition(this.position.current[0], this.position.current[2]);

            if (elevation !== null && elevation !== undefined) {
                if (this.position.current[1] <= elevation) {
                    // Player has landed
                    this.position.current[1] = elevation;
                    this.isJumping = false;
                    this.jumpVelocity = 0;
                }
            } else {
                // Default to ground level if no elevation is available
                if (this.position.current[1] <= 0) {
                    this.position.current[1] = 0;
                    this.isJumping = false;
                    this.jumpVelocity = 0;
                }
            }
        } else {
            // Update elevation only when not jumping or falling
            const chunks = this.state.chunks;
            const elevation = chunks.getElevationForPosition(this.position.current[0], this.position.current[2]);

            if (elevation !== null && elevation !== undefined) {
                // Smoothly adjust to the terrain height to prevent jittering
                const elevationDifference = elevation - this.position.current[1];
                const adjustmentSpeed = 0.1; // Factor to smooth the adjustment
                if (Math.abs(elevationDifference) > 0.01) {
                    this.position.current[1] += elevationDifference * adjustmentSpeed;
                } else {
                    this.position.current[1] = elevation; // Snap if close enough
                }
            }
        }

        // Update position delta and speed
        vec3.sub(this.position.delta, this.position.current, this.position.previous);
        vec3.copy(this.position.previous, this.position.current);

        this.speed = vec3.len(this.position.delta);

        // Update view
        this.camera.update();
    }
}