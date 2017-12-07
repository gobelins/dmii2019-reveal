/* eslint-disable */

import * as THREE from 'three'

export default class NeonRectangle extends THREE.Object3D{
    constructor(opts = {}){
        super()

        this.height = opts.height || 10
        this.width = opts.width || 10
        this.thickness = .1
        this.depth = opts.depth || .1
        this.uniforms = opts.uniforms || {}
        this.opacity = opts.opacity || .1
        this.randOpacityVal = Math.min(Math.random(), .3)
        
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
        
        let left_geometry = new THREE.BoxGeometry(this.thickness, this.height - this.thickness * .5, this.depth )
        left_geometry.translate(this.width * -.5, 0, 0)

        let right_geometry = new THREE.BoxGeometry(this.thickness, this.height - this.thickness * .5, this.depth )
        right_geometry.translate(this.width * .5, 0, 0)

        let top_geometry = new THREE.BoxGeometry(this.thickness, this.width - this.thickness * .5, this.depth )
        top_geometry.translate(this.height * .5 - this.thickness * .5, 0, 0)
        top_geometry.rotateZ(90 * Math.PI / 180)
        

        let bot_geometry = new THREE.BoxGeometry(this.thickness, this.width - this.thickness * .5, this.depth )
        bot_geometry.translate(this.height * -.5 + this.thickness * .5, 0, 0)
        bot_geometry.rotateZ(90 * Math.PI / 180)
        
        // Creation mesh complete
        this.__geometry.merge(left_geometry)
        this.__geometry.merge(right_geometry)
        this.__geometry.merge(top_geometry)
        this.__geometry.merge(bot_geometry)

        this.__mesh = new THREE.Mesh(this.__geometry, this.__material)
        this.__mesh.rotateX(15 * Math.PI / 180)
        this.__mesh.updateMatrix()    
    }

    get mesh(){
        return this.__mesh
    }
}