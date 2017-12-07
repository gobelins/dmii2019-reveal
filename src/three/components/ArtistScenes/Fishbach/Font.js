/* eslint-disable */

import * as THREE from 'three'
import { FRAGMENT_SCALE, FRAGMENT_BASE_ROTATION_X, FRAGMENT_BASE_ROTATION_Y } from '../../../constants/superpoze'

export default class Font{
    constructor(opts = {}){

        this.scene = opts.scene 
        this.position = opts.position || { x : 0, y : 0, z : 0}
        this.customPos = opts.customPos || { x : 0, y : 0, z : 0}
        this.material
        this.geometry = opts.geometry 
        this.mesh
        this.opacity = opts.opacity
        this.randomOpacityMultiplier = Math.min(Number(Math.random().toFixed(2)), .7) 
        this.init()
    }

    init(){
        this.createFont()
    }

    createFont(){
        this.material = new THREE.MeshBasicMaterial({
            color : new THREE.Color('#B6B6FF'),
            transparent : true,
            opacity : this.opacity
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(this.position.x * .02 + this.customPos.x, this.position.y * .02 + this.customPos.y, this.position.z * .02 + this.customPos.z)
        this.mesh.rotation.x = FRAGMENT_BASE_ROTATION_X
        this.mesh.rotation.y = FRAGMENT_BASE_ROTATION_Y
        this.mesh.scale.z = .01
        this.mesh.scale.x = .02
        this.mesh.scale.y = .02
        
        this.mesh.rotateX(-20 * Math.PI / 180)
        this.scene.add(this.mesh)
    }
}