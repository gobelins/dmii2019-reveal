/* eslint-disable */

import * as THREE from 'three'

export default class NeonCircle extends THREE.Object3D{
    constructor(opts = {}){
        super()

        this.radius = opts.radius || .5
        this.uniforms = opts.uniforms || {}
        this.opacity = opts.opacity || 1
        this.segments = opts.thetaSegments || 60
        
        this.__material
        this.__mesh
        this.opacity = opts.opacity || .1
        this.init()
    }

    init(){
        this.createMesh()
    }

    createMesh(){
        this.__material	= new THREE.MeshBasicMaterial({
            color : new THREE.Color('#B6B6FF'),
            transparent : true,
            opacity : this.opacity
        })

        let ring_geometry = new THREE.TorusGeometry(this.radius, .05, this.segments, this.segments)

        this.__mesh = new THREE.Mesh(ring_geometry, this.__material)
        this.__mesh.rotateX(15 * Math.PI / 180)
        this.__mesh.updateMatrix() 
    }

    get mesh(){
        return this.__mesh
    }
}