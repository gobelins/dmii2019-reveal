/* eslint-disable */

import * as THREE from 'three'

export default class NeonLine extends THREE.Object3D{
    constructor(opts = {}){
        super()

        this.height = opts.height || 10
        this.width = opts.width || 10
        this.thickness = .1
        this.depth = opts.depth || .1
        this.uniforms = opts.uniforms || {}
        this.opacity = opts.opacity || .1
        
        this.__geometry = new THREE.Geometry()
        this.__material

        this.__mesh
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
        
        this.__geometry = new THREE.BoxGeometry(this.thickness, this.height, this.depth )
        
        this.__mesh = new THREE.Mesh(this.__geometry, this.__material)
        this.__mesh.rotateX(15 * Math.PI / 180)

        this.__mesh.updateMatrix()    
    }

    get mesh(){
        return this.__mesh
    }
}