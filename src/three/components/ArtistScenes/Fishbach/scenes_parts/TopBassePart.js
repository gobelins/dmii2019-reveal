/* eslint-disable */

import * as THREE from 'three'
import NeonRectangle from '../primitifs/NeonRectangle'
import NeonLine from '../primitifs/NeonLine'
import { tween } from '../../../../../utils/maths'


export default class TopMiddlePart {
    constructor(opts = {}){
        this.uniforms = opts.uniforms
        this.scene = opts.scene
        this.position = {
            x : opts.position.x || 0,
            y : opts.position.y || 0,
            z : opts.position.z || 0
        }

        this.widthContainer = 15
        this.heightContainer = 10
        this.depthContainer = 5

        this.thickness = opts.thickness || .1
        this.depth = opts.depth || .1

        this.firstSubWoofer
        this.secondSubWoofer

        this.i = 0
        this.angle = 90
        
        this.bottomLines  = []
        this.linesAsideSubWoofer = []
        this.nb_aside_rec = 15

        this.front_face
        this.top_right_edge
        this.top_left_edge
        this.bottom_right_edge
        this.bottom_left_edge

        // right or left to add rec in the good direction
        this.direction = opts.direction || ''

        this.init()
    }

    init(){
        this.createBasseContainer()
        this.createSubwoofer()
        this.createRecAside()
        this.createBottom()
    }

    createRecAside(){
        if(this.direction === 'right'){
            for(let i = 0; i < this.nb_aside_rec; i++){
                const decoRectangle = new NeonRectangle({
                    height : this.heightContainer + 1.6,
                    width : 2,
                    thickness : this.thickness,
                    depth : this.depth,
                    opacity : 1
                })
    
                decoRectangle.mesh.translateX(this.position.x + this.widthContainer * .6  + i * 3)
                decoRectangle.mesh.translateY(this.position.y - .6)
                decoRectangle.mesh.translateZ(this.position.z)

                this.linesAsideSubWoofer.push(decoRectangle.mesh)
                this.scene.add(decoRectangle.mesh)
            }
        }
        else if (this.direction === 'left'){
            for(let i = 0; i < this.nb_aside_rec; i++){
                const decoRectangle = new NeonRectangle({
                    height : this.heightContainer + 1.6,
                    width : 2,
                    thickness : this.thickness,
                    depth : this.depth,
                    opacity : 1
                })
                
                decoRectangle.mesh.translateX(this.position.x - this.widthContainer * .6 - i * 3)
                decoRectangle.mesh.translateY(this.position.y - .6)
                decoRectangle.mesh.translateZ(this.position.z)
                
                this.linesAsideSubWoofer.push(decoRectangle.mesh)
                this.scene.add(decoRectangle.mesh)
            }
        }
    }

    createBasseContainer(){
        this.front_face = new NeonRectangle({
            uniforms : this.uniforms,
            width : this.widthContainer,
            height : this.heightContainer,
            thickness : this.thickness,
            depth : this.depth,
            opacity : 1
        })

        this.front_face.mesh.translateX(this.position.x)
        this.front_face.mesh.translateY(this.position.y)
        this.front_face.mesh.translateZ(this.position.z)

        // ------ EDGES -------- //

        this.top_right_edge = new NeonLine({
            uniforms : this.uniforms,
            height : this.depthContainer,
            opacity : 1
        })
        
        this.top_right_edge.mesh.translateX(this.position.x + this.widthContainer/2)
        this.top_right_edge.mesh.translateY(this.position.y + this.heightContainer/2 - this.thickness/2)
        this.top_right_edge.mesh.translateZ(this.position.z - this.depthContainer/2 - this.thickness/2)
        this.top_right_edge.mesh.rotateX(this.angle * Math.PI / 180)

        this.top_left_edge = new NeonLine({
            uniforms : this.uniforms,
            height : this.depthContainer,
            opacity : 1
        })
        
        this.top_left_edge.mesh.translateX(this.position.x - this.widthContainer/2)
        this.top_left_edge.mesh.translateY(this.position.y + this.heightContainer/2 - this.thickness/2)
        this.top_left_edge.mesh.translateZ(this.position.z - this.depthContainer/2 - this.thickness/2)
        this.top_left_edge.mesh.rotateX(this.angle * Math.PI / 180)

        this.bottom_left_edge = new NeonLine({
            uniforms : this.uniforms,
            height : this.depthContainer,
            opacity : 1
        })
        
        this.bottom_left_edge.mesh.translateX(this.position.x -this.widthContainer/2)
        this.bottom_left_edge.mesh.translateY(this.position.y - this.heightContainer/2 + this.thickness/2)
        this.bottom_left_edge.mesh.translateZ(this.position.z - this.depthContainer/2 - this.thickness/2)
        this.bottom_left_edge.mesh.rotateX(this.angle * Math.PI / 180)

        this.bottom_right_edge = new NeonLine({
            uniforms : this.uniforms,
            height : this.depthContainer,
            opacity : 1
        })
        
        this.bottom_right_edge.mesh.translateX(this.position.x + this.widthContainer/2)
        this.bottom_right_edge.mesh.translateY(this.position.y - this.heightContainer/2 + this.thickness/2)
        this.bottom_right_edge.mesh.translateZ(this.position.z - this.depthContainer/2 - this.thickness/2)
        this.bottom_right_edge.mesh.rotateX(this.angle * Math.PI / 180)

        this.scene.add(this.front_face.mesh)
        this.scene.add(this.top_right_edge.mesh)
        this.scene.add(this.top_left_edge.mesh)
        this.scene.add(this.bottom_left_edge.mesh)
        this.scene.add(this.bottom_right_edge.mesh)
    }

    createSubwoofer(){
        this.firstSubWoofer = new NeonRectangle({
            uniforms : this.uniforms,
            height : this.heightContainer * .75,
            width : this.widthContainer * .75,
            opacity : 0
        })
        
        this.firstSubWoofer.mesh.translateX(this.position.x)
        this.firstSubWoofer.mesh.translateY(this.position.y)
        this.firstSubWoofer.mesh.translateZ(this.position.z)

        this.firstSubWoofer.mesh.material.opacity = .1
        this.secondSubWoofer = new NeonRectangle({
            uniforms : this.uniforms,
            height : this.heightContainer * .5,
            width : this.widthContainer * .5, 
            opacity : 0
        })

        this.secondSubWoofer.mesh.translateX(this.position.x)
        this.secondSubWoofer.mesh.translateY(this.position.y)
        this.secondSubWoofer.mesh.translateZ(this.position.z)

        this.scene.add(this.firstSubWoofer.mesh)
        this.scene.add(this.secondSubWoofer.mesh)
    }

    createBottom(){
        let offsetY = .5

        for(let i = 0; i < 4; i++){
            let line = new NeonLine({
                uniforms : this.uniforms,
                height : this.widthContainer,
            })
            
            line.mesh.rotateZ(this.angle*Math.PI/180)
            line.mesh.translateX(this.position.y + (i * - .3) - this.heightContainer/2 - offsetY)
            line.mesh.translateY(-this.position.x)
            line.mesh.translateZ(this.position.z)
            line.mesh.opacityRandom = Number(Math.random().toFixed(3) * (1 - .1) + .1)
            this.bottomLines.push(line.mesh)
            this.scene.add(line.mesh)
        }
    }

    update(audioValue, opacityNeon){
        let initPos = this.position

        this.firstSubWoofer.mesh.position.z = initPos.z + audioValue.bass 
        this.firstSubWoofer.mesh.scale.set(1 - audioValue.bass * .2, 1 - audioValue.bass * .2, 1)
        this.firstSubWoofer.mesh.material.opacity = audioValue.bass * opacityNeon

        this.secondSubWoofer.mesh.position.z = initPos.z + audioValue.kick * 1.5
        this.secondSubWoofer.mesh.scale.set(1 - audioValue.kick * .5, 1 - audioValue.kick * .5, 1)
        this.secondSubWoofer.mesh.material.opacity = audioValue.kick * opacityNeon
        
        this.bottomLines[0].material.opacity = audioValue.bass * opacityNeon  //* this.bottomLines[0].opacityRandom
        this.bottomLines[1].material.opacity = audioValue.kick * opacityNeon //* this.bottomLines[2].opacityRandom
        this.bottomLines[2].material.opacity = audioValue.high * opacityNeon //* this.bottomLines[1].opacityRandom
        this.bottomLines[3].material.opacity = audioValue.all  * opacityNeon//* this.bottomLines[3].opacityRandom
       
        // Anim opa box

        this.front_face.mesh.material.opacity = audioValue.kick  * opacityNeon//* this.bottomLines[3].opacityRandom
        this.top_left_edge.mesh.material.opacity = audioValue.kick  * opacityNeon//* this.bottomLines[3].opacityRandom
        this.top_right_edge.mesh.material.opacity = audioValue.kick  * opacityNeon//* this.bottomLines[3].opacityRandom
        this.bottom_right_edge.mesh.material.opacity = audioValue.kick  * opacityNeon//* this.bottomLines[3].opacityRandom
        this.bottom_left_edge.mesh.material.opacity = audioValue.kick  * opacityNeon//* this.bottomLines[3].opacityRandom

        for(let i = 0; i < this.linesAsideSubWoofer.length; i++){
            let currentRec = this.linesAsideSubWoofer[i]

            if( i % 2 === 0 )
                currentRec.material.opacity = audioValue.bass * opacityNeon
            else if ( i % 3 === 0 )
                currentRec.material.opacity = audioValue.kick * opacityNeon
            else
                currentRec.material.opacity = audioValue.high * opacityNeon
        }
    }
} 