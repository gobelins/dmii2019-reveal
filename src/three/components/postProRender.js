/* eslint-disable */

import * as THREE from 'three'
import dat from 'dat-gui'

import { WebGLRenderTarget, Vector2, Uniform } from 'three';
import UnrealBloomPass from './Pass/UnrealBloomPass'
import BlurPass from './Pass/BlurPass'

import fxaaVertexShader from '../shaders/fxaa_shader.vert'
import fxaaFragmentShader from '../shaders/fxaa_shader.frag'
import blendVertexShader from '../shaders/blend_shader.vert'
import blendFragmentShader from '../shaders/blend_shader.frag'
import blurVertexShader from '../shaders/blur_shader.vert'
import blurFragmentShader from '../shaders/blur_shader.frag'


export default class postProRender{
    constructor(renderer, bgOnBloomScene, optsPostPro){
        this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        this.geom = new THREE.PlaneBufferGeometry(2,2)
        this.renderTarget = new THREE.WebGLRenderTarget(1, 1)
        this.renderTargetB = new THREE.WebGLRenderTarget(1, 1)
        this.fxaaOutput = this.createFbo()
        this.fxaa2Output = this.createFbo()
        this.blurKernelOutput = this.createFbo()
        this.scene = new THREE.Scene()
        this.renderer = renderer

        this.kernels = []

        this.resolution = new THREE.Vector2(window.innerHeight, window.innerWidth)
        
        this.optsPostPro = optsPostPro || null

        this.bgOnBloomScene = bgOnBloomScene || null


        // this.gui = new dat.GUI()
        // this.gui.add(this.optsPostPro.bloom, 'strength', 0., 5.)
        // this.gui.add(this.optsPostPro.bloom, 'radius', 0., 3.)
        // this.gui.add(this.optsPostPro.bloom, 'threshold', 0., 10.)
        
        this.initKernel()
    }

    initKernel(){

        this.FXAAKernel = {
            geom : this.geom,
            mat : new THREE.ShaderMaterial({
                uniforms : {
                    tInput : {
                        value : this.renderTarget,
                        type : "t"
                    },
                    resolution: { type: 'v2', value: this.resolution || new THREE.Vector2() }
                },
                vertexShader: fxaaVertexShader,
                fragmentShader: fxaaFragmentShader,
                depthTest : false,
                depthWrite : false
            })
        }
   
        //this.kernels.push(this.FXAAKernel)

        this.unrealPass = new UnrealBloomPass(this.renderer, this.optsPostPro.bloom.strength, this.optsPostPro.bloom.radius, this.optsPostPro.bloom.threshold)
        this.UnrealBloomKernel = {
            pass: this.unrealPass,
            output: this.unrealPass.output
        }

        this.blendKernel = {
            geom : this.geom,
            mat : new THREE.ShaderMaterial({
                uniforms : {
                    tInputA : {
                        value : this.fxaaOutput,
                        type : "t"
                    },                    
                    tInputB : {
                        value : this.UnrealBloomKernel.output,
                        type : "t"
                    }
                },
                vertexShader: blendVertexShader,
                fragmentShader: blendFragmentShader,
                depthTest : false,
                depthWrite : false
            }),
            output : this.createFbo()
        }
        
        this.blurKernel = {
            geom : this.geom,
            mat : new THREE.ShaderMaterial({
                uniforms : {
                    tInput : {
                        value : this.renderTargetB,
                        type : "t"
                    },
                    resolution: { type: 'v2', value: this.resolution || new THREE.Vector2() },
                    texelSize: new Uniform(new Vector2()),
                    halfTexelSize: new Uniform(new Vector2()),
                    kernel: new Uniform(0.0),
                    u_opacityBlur : { type: 'f', value : this.optsPostPro.blur.intensityBlur}
                },
                vertexShader: blurVertexShader,
                fragmentShader: blurFragmentShader,
                depthTest : false,
                depthWrite : false
            }),
            output : this.blendKernel.output
        }
        
        this.FXAAKernel.mesh = new THREE.Mesh(this.FXAAKernel.geom, this.FXAAKernel.mat)
        this.blendKernel.mesh = new THREE.Mesh(this.blendKernel.geom, this.blendKernel.mat)
        this.blurKernel.mesh = new THREE.Mesh(this.blurKernel.geom, this.blurKernel.mat)
        this.blurPass = new BlurPass(this.renderer, this.scene, this.cam, this.blurKernel)
        this.blurKernel.pass = this.blurPass
    }

    setSize(width, height, pixelRatio){
        let w = width * pixelRatio
        let h = height * pixelRatio
        this.renderTarget.setSize(w, h)
        this.renderTargetB.setSize(w, h)
        this.fxaaOutput.setSize(w, h)
        this.fxaa2Output.setSize(w, h)
        this.blurKernel.output.setSize(w, h)
        this.blurKernel.pass.setSize(w, h)
       /*
        
        for(let i = 0; i < this.kernels.length; i++){
            let kernel = this.kernels[i]
            
            if(kernel.output)
                kernel.output.setSize(width * pixelRatio, height * pixelRatio)
        }
        
        */
      this.unrealPass.setSize(w, h)
    }

    renderKernel(){
        this.computeKernel(this.FXAAKernel,{
            toScreen : false,
            source: this.renderTarget,
            output: this.fxaaOutput
        })
        
        this.computeKernel(this.FXAAKernel,{
            toScreen : false,
            source: this.renderTargetB,
            output: this.fxaa2Output
        })
        
        this.UnrealBloomKernel.pass.render(
            {
                source: this.fxaa2Output,
                toScreen : false
            }
        )

        this.computeKernel(this.blendKernel, {
            toScreen: false,
        })

        this.blurKernel.pass.render({
            kernel : this.blurKernel,
            source : this.blendKernel.output,
            toScreen : true
        })

        // this.computeKernel(this.blurKernel.output, {
        //     toScreen: true
        // })    


        // this.computeKernel(this.negativeKernel)
        // this.computeKernel(this.pixelateKernel, {
        //     toScreen : true
        // })
    }

    computeKernel(kernel,opts = {}){
        opts.toScreen = opts.toScreen != null ? opts.toScreen : false

        this.scene.add(kernel.mesh)

        if(opts.source){
            kernel.mat.uniforms.tInput.value = opts.source
        }

        if(!opts.toScreen){
            if(opts.output){
                this.renderer.render(this.scene, this.cam, opts.output) 
            }
            else{
                this.renderer.render(this.scene, this.cam, kernel.output) 
            }
        }
        else{
            this.renderer.render(this.scene, this.cam)
        }
        
        this.scene.remove(kernel.mesh) 
    }

    createFbo(){
        return new WebGLRenderTarget(1,1)
    }

    render(scene, camera){
        this.unrealPass.strength = this.optsPostPro.bloom.strength
        this.unrealPass.radius = this.optsPostPro.bloom.radius
        this.unrealPass.threshold = this.optsPostPro.bloom.strength

        this.blurKernel.mat.uniforms.u_opacityBlur.value = this.optsPostPro.blur.intensityBlur

        this.bgOnBloomScene.visible = true
        this.renderer.setClearColor('rgb(25, 27, 51)', 1)
        this.renderer.render(scene, camera, this.renderTarget)

        this.bgOnBloomScene.visible = false
        this.renderer.setClearColor('rgb(0, 0, 0)', 1)
        this.renderer.render(scene, camera, this.renderTargetB)

        this.renderKernel()
    }
}