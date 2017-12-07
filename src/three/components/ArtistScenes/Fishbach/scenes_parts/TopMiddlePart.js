/* eslint-disable */

import * as THREE from 'three'
import NeonRectangle from '../primitifs/NeonRectangle'
import NeonCircle from '../primitifs/NeonCircle'

export default class TopMiddlePart {
    constructor(opts = {}){
        this.uniforms = opts.uniforms
        this.scene = opts.scene
        this.position = {
            x : opts.position.x || 0,
            y : opts.position.y || 0,
            z : opts.position.z || 0
        }
        
        this.width_el = 4
        this.nbLongRectangle = opts.nbLongRectangle || 4
        this.nbLittleRectangle = opts.nbLittleRectangle || 3
    
        this.tabLongRectangles = []
        this.initPosLongRectangles = []
        this.tabLittleRectangles = []
        
        this.posBackCirclesZ = {
            middleCircle : 0,
            leftCircle : 0,
            rightCircle : 0
        }    

        this.init()
    }

    init(){
        this.createLongRec()
        this.createCircles()
        this.createLittleRec()
    }

    createLongRec(){
        for(let i = 0; i < this.nbLongRectangle; i++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : 9,
                width : 2.5
            })

            rectangle.mesh.rotateZ(90*Math.PI/180)
            rectangle.mesh.rotateY(90*Math.PI/180)

            // Z axis now
            rectangle.mesh.translateX(-(this.position.z))
            // x axis now
            rectangle.mesh.translateY(-(this.position.x))
            rectangle.mesh.translateZ(((i + 2.5)) + this.position.y)

            this.tabLongRectangles.push(rectangle.mesh)
            this.initPosLongRectangles.push(rectangle.mesh.position)
            this.scene.add(rectangle.mesh)
        }
    }

    createCircles(){
        let offsetZ = 2,
            offsetY = 1.5

        // ------ MIDDLE CIRCLES -------- //

        this.midle_circle_front = new NeonCircle({
            uniforms : this.uniforms
        })
        
        this.midle_circle_front.mesh.translateX(this.position.x)
        this.midle_circle_front.mesh.translateY(this.position.y + offsetY)
        this.midle_circle_front.mesh.translateZ(this.position.z)
        

        this.midle_circle_back = new NeonCircle({
            uniforms : this.uniforms
        })

        this.midle_circle_back.mesh.translateX(this.position.x)
        this.midle_circle_back.mesh.translateY(this.position.y + offsetY)
        this.midle_circle_back.mesh.translateZ(this.position.z + offsetZ)
        this.posBackCirclesZ.middleCircle = this.midle_circle_back.mesh.position.z
        
        
        // ------ LEFT CIRCLES -------- //
        
        this.left_circle_front = new NeonCircle({
            opacity : 0
        }) 

        this.left_circle_front.mesh.translateX(this.position.x - 3)
        this.left_circle_front.mesh.translateY(this.position.y + offsetY)
        this.left_circle_front.mesh.translateZ(this.position.z)
        
        
        this.left_circle_back = new NeonCircle({
            opacity : 0
        })
        this.left_circle_back.mesh.translateX(this.position.x - 3)
        this.left_circle_back.mesh.translateY(this.position.y + offsetY)
        this.left_circle_back.mesh.translateZ(this.position.z + offsetZ)
        
        // ------ RIGHT CIRCLES -------- //
        
        this.right_circle_front = new NeonCircle({
            opacity : 0
        }) 

        this.right_circle_front.mesh.translateX(this.position.x + 3)
        this.right_circle_front.mesh.translateY(this.position.y + offsetY)
        this.right_circle_front.mesh.translateZ(this.position.z)
        
        
        this.right_circle_back = new NeonCircle({
            opacity : 0
        })

        
        this.right_circle_back.mesh.translateX(this.position.x + 3)
        this.right_circle_back.mesh.translateY(this.position.y + offsetY)
        this.right_circle_back.mesh.translateZ(this.position.z + offsetZ)
        
        this.scene.add(this.midle_circle_front.mesh)
        this.scene.add(this.midle_circle_back.mesh)
        
        this.scene.add(this.left_circle_front.mesh)
        this.scene.add(this.left_circle_back.mesh)

        this.scene.add(this.right_circle_front.mesh)
        this.scene.add(this.right_circle_back.mesh)

    }

    createLittleRec(){
        let offsetY = 3

       // ------ MIDDLE RECTANGLES -------- //

        for(let i = 0; i < this.nbLittleRectangle; i++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : 2.5,
                width : 2
            })

            rectangle.mesh.rotateZ(90*Math.PI/180)
            rectangle.mesh.rotateY(90*Math.PI/180)

            // Z axis now
            rectangle.mesh.translateX(-(this.position.z))
            // x axis now
            rectangle.mesh.translateY(-(this.position.x))
            rectangle.mesh.translateZ((i * -1) + this.position.y)

            this.tabLittleRectangles.push(rectangle.mesh)
            this.scene.add(rectangle.mesh)
        }

        for(let i = 0; i < this.nbLittleRectangle; i++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : 2.5,
                width : 2
            })

            rectangle.mesh.rotateZ(90*Math.PI/180)
            rectangle.mesh.rotateY(90*Math.PI/180)

            // Z axis now
            rectangle.mesh.translateX(-(this.position.z))
            // x axis now
            rectangle.mesh.translateY(-(this.position.x + offsetY))
            rectangle.mesh.translateZ((i * -1) + this.position.y)

            this.tabLittleRectangles.push(rectangle.mesh)
            this.scene.add(rectangle.mesh)
        }

        for(let i = 0; i < this.nbLittleRectangle; i++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : 2.5,
                width : 2
            })

            rectangle.mesh.rotateZ(90*Math.PI/180)
            rectangle.mesh.rotateY(90*Math.PI/180)

            // Z axis now
            rectangle.mesh.translateX(-(this.position.z))
            // x axis now
            rectangle.mesh.translateY(-(this.position.x - offsetY))
            rectangle.mesh.translateZ((i * -1) + this.position.y)

            this.tabLittleRectangles.push(rectangle.mesh)
            this.scene.add(rectangle.mesh)
        }
    }

    update(audioValue, opacityNeon){
        let initPos = this.position
        
        // Anim Long rec
        for(let i = 0; i < this.tabLongRectangles.length; i++){
            let values = [audioValue.bass, audioValue.kick, audioValue.high, audioValue.all]

            this.tabLongRectangles[i].material.opacity = values[i] * opacityNeon
            this.tabLongRectangles[i].scale.set(values[i] + .01, 1, 1)
        }

        // Animation on selected circle
        this.midle_circle_front.mesh.material.opacity = audioValue.bass * opacityNeon
        this.midle_circle_front.mesh.scale.set(Math.max(audioValue.bass * 1.5, 1), Math.max(audioValue.bass * 1.5, 1), 1)
        
        this.midle_circle_back.mesh.material.opacity = audioValue.bass * opacityNeon
        this.midle_circle_back.mesh.scale.set(Math.max(audioValue.bass * 1.5, 1), Math.max(audioValue.bass * 1.5, 1), 1)
        this.midle_circle_back.mesh.position.z = this.posBackCirclesZ.middleCircle + audioValue.bass

        this.left_circle_front.mesh.material.opacity = audioValue.kick * opacityNeon
        this.left_circle_front.mesh.scale.set(Math.max(audioValue.kick * 1.5, 1), Math.max(audioValue.kick * 1.5, 1), 1)
        
        this.left_circle_back.mesh.material.opacity = audioValue.kick * opacityNeon
        this.left_circle_back.mesh.scale.set(Math.max(audioValue.kick * 1.5, 1), Math.max(audioValue.kick * 1.5, 1), 1)

        //this.left_circle_front.mesh.rotation.x = 20
        
        this.right_circle_front.mesh.material.opacity = audioValue.kick * opacityNeon
        this.right_circle_front.mesh.scale.set(Math.max(audioValue.kick * 1.5, 1), Math.max(audioValue.kick * 1.5, 1), 1)
        this.right_circle_back.mesh.material.opacity = audioValue.kick * opacityNeon
        this.right_circle_back.mesh.scale.set(Math.max(audioValue.kick * 1.5, 1), Math.max(audioValue.kick * 1.5, 1), 1)

        
        // Anim bottom little rectangles
        // Angle rec 
        this.tabLittleRectangles[3].material.opacity = audioValue.kick * opacityNeon
        this.tabLittleRectangles[5].material.opacity = audioValue.kick * opacityNeon
        this.tabLittleRectangles[6].material.opacity = audioValue.kick * opacityNeon
        this.tabLittleRectangles[8].material.opacity = audioValue.kick * opacityNeon

        // Center rec
        this.tabLittleRectangles[1].material.opacity = audioValue.bass * opacityNeon

        // middle exter rec
        this.tabLittleRectangles[0].material.opacity = audioValue.high * opacityNeon
        this.tabLittleRectangles[2].material.opacity = audioValue.high * opacityNeon
        this.tabLittleRectangles[4].material.opacity = audioValue.high * opacityNeon
        this.tabLittleRectangles[7].material.opacity = audioValue.high * opacityNeon

    }
} 