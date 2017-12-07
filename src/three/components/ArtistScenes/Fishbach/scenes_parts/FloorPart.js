/* eslint-disable */

import * as THREE from 'three'
import NeonRectangle from '../primitifs/NeonRectangle'

export default class FloorPart {
    constructor(opts = {}){
        this.uniforms = opts.uniforms
        this.scene = opts.scene
        this.position = {
            x : opts.position.x || 0,
            y : opts.position.y || 0,
            z : opts.position.z || 0
        }
        
        this.widthFloor = 30

        this.width = opts.width || 8
        this.height = opts.height || 4

        this.thickness = opts.thickness || .1
        this.depth = opts.depth || .1

        this.tabBackFloor = {
            firstLine : [],
            secondLine : [],
            thirdLine : []
        } 

        this.tabFrontFloor = {
            firstLine : [],
            secondLine : [],
            thirdLine : []
        }

        this.initPosYTabs = {
            firstLine : 0,
            secondLine : 0,
            thirdLine : 0 
        }
        
        this.center_floor
        this.nb_back_rectangle_floor = 13
        this.nb_front_rectangle_floor = Math.round(this.nb_back_rectangle_floor * .5)

        this.init()
    }

    init(){
        this.createBackFloor()
        this.createFrontFloor()
    }

    createBackFloor(){
       
        // ------ FIRST LINE FLOOR -------- // 
        let offsetX = 1,
            offsetY = 2,
            width_rectangle = this.widthFloor / this.nb_back_rectangle_floor 

        this.center_floor = -((this.nb_back_rectangle_floor  * this.width)  + (this.nb_back_rectangle_floor  * offsetX))/2


       for(let i = 0; i < this.nb_back_rectangle_floor; i ++){
        let rectangle = new NeonRectangle({
            uniforms : this.uniforms,
            height : this.height,
            width : this.width
        })

        rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
        rectangle.mesh.translateY(this.position.y)
        rectangle.mesh.translateZ(this.position.z)
        
        rectangle.mesh.rotateX(90*Math.PI/180)
        
        this.tabBackFloor.firstLine.push(rectangle.mesh)
        
        this.scene.add(rectangle.mesh)
       }

       // ------ SECOND LINE FLOOR -------- //

       for(let i = 0; i < this.nb_back_rectangle_floor ; i ++){
        let rectangle = new NeonRectangle({
            uniforms : this.uniforms,
            height : this.height,
            width : this.width
        })

        rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
        rectangle.mesh.translateY(this.position.y - offsetY)
        rectangle.mesh.translateZ(this.position.z)
        
        rectangle.mesh.rotateX(90*Math.PI/180)
        this.tabBackFloor.secondLine.push(rectangle.mesh)
        this.scene.add(rectangle.mesh)
        }

        // ------ THIRD LINE FLOOR -------- //
    
        for(let i = 0; i < this.nb_back_rectangle_floor ; i ++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : this.height,
                width : this.width
            })
    
            rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
            rectangle.mesh.translateY(this.position.y -(offsetY * 2))
            rectangle.mesh.translateZ(this.position.z)
            
            rectangle.mesh.rotateX(90*Math.PI/180)
            this.tabBackFloor.thirdLine.push(rectangle.mesh)
            this.scene.add(rectangle.mesh)
        }

        this.initPosYTabs.firstLine = this.tabBackFloor.firstLine[0].position.y
        this.initPosYTabs.secondLine = this.tabBackFloor.secondLine[0].position.y
        this.initPosYTabs.thirdLine = this.tabBackFloor.thirdLine[0].position.y
    }

    createFrontFloor(){
        let offsetY = 5,
            offsetX = 10
            
       for(let i = 0; i < this.nb_front_rectangle_floor; i ++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : this.widthFloor * .5,
                width : this.widthFloor * .5
            })

            rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
            rectangle.mesh.translateY(this.position.y - offsetY)
            rectangle.mesh.translateZ(this.position.z + 10)
            
            rectangle.mesh.rotateX(90*Math.PI/180)
            this.tabFrontFloor.firstLine.push(rectangle.mesh)
            
            this.scene.add(rectangle.mesh)
        }

        for(let i = 0; i < this.nb_front_rectangle_floor; i ++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : this.widthFloor * .4,
                width : this.widthFloor * .4
            })

            rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
            rectangle.mesh.translateY(this.position.y - offsetY)
            rectangle.mesh.translateZ(this.position.z + 10)
            
            rectangle.mesh.rotateX(90*Math.PI/180)
            this.tabFrontFloor.secondLine.push(rectangle.mesh)
            
            this.scene.add(rectangle.mesh)
        }

        for(let i = 0; i < this.nb_front_rectangle_floor; i ++){
            let rectangle = new NeonRectangle({
                uniforms : this.uniforms,
                height : this.widthFloor * .3,
                width : this.widthFloor * .3
            })

            rectangle.mesh.translateX(this.position.x + this.center_floor + (i * (this.width + offsetX)))
            rectangle.mesh.translateY(this.position.y - offsetY)
            rectangle.mesh.translateZ(this.position.z + 10)
            
            rectangle.mesh.rotateX(90*Math.PI/180)
            this.tabFrontFloor.thirdLine.push(rectangle.mesh)

            this.scene.add(rectangle.mesh)
        }
        
    }
    

    update(audioValue, opacityNeon){
        // Back rectangles
        for(let i = 0; i < this.nb_back_rectangle_floor; i++){
            let currentFirstLineRec = this.tabBackFloor.firstLine[i]
            let currentSecondLineRec = this.tabBackFloor.secondLine[i]
            let currentThirdLineRec = this.tabBackFloor.thirdLine[i]

            if( i % 2 === 0 ){
                currentFirstLineRec.material.opacity = audioValue.bass * opacityNeon
                currentFirstLineRec.position.y = this.initPosYTabs.firstLine + audioValue.bass * .5

                currentSecondLineRec.material.opacity = audioValue.kick * opacityNeon
                currentSecondLineRec.position.y = this.initPosYTabs.secondLine + audioValue.kick * .5

                currentThirdLineRec.material.opacity = audioValue.all * opacityNeon
                currentThirdLineRec.position.y = this.initPosYTabs.thirdLine + audioValue.all * .5
            } else {
                currentFirstLineRec.material.opacity = audioValue.all * opacityNeon
                currentFirstLineRec.position.y = this.initPosYTabs.firstLine + audioValue.all * .5

                currentSecondLineRec.material.opacity = audioValue.high * opacityNeon
                currentSecondLineRec.position.y = this.initPosYTabs.secondLine + audioValue.bass * .5

                currentThirdLineRec.material.opacity = audioValue.bass * opacityNeon
                currentThirdLineRec.position.y = this.initPosYTabs.thirdLine + audioValue.all * .5
            }
        }
        
        // Front rectangles
        for(let i = 0; i < this.nb_front_rectangle_floor; i++){
            let currentFirstLineRec = this.tabFrontFloor.firstLine[i]
            let currentSecondLineRec = this.tabFrontFloor.secondLine[i]
            let currentThirdLineRec = this.tabFrontFloor.thirdLine[i]
            if( i % 2 === 0 ){
                currentFirstLineRec.material.opacity = audioValue.bass * opacityNeon
                currentSecondLineRec.material.opacity = audioValue.kick * opacityNeon 
                currentThirdLineRec.material.opacity = audioValue.all * opacityNeon
            } else {
                currentFirstLineRec.material.opacity = audioValue.all * opacityNeon
                currentSecondLineRec.material.opacity = audioValue.high * opacityNeon
                currentThirdLineRec.material.opacity = audioValue.kick * opacityNeon
            }
        }

    }
} 