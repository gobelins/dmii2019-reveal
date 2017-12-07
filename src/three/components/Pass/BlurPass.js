/* eslint-disable */

import { LinearFilter, RGBFormat, WebGLRenderTarget, Scene } from "three";

/**
 * A blur pass.
 */

export default class BlurPass{
	constructor(renderer, scene, camera, kernel) {
        this.KernelSize = {
                VERY_SMALL: 0,
                SMALL: 1,
                MEDIUM: 2,
                LARGE: 3,
                VERY_LARGE: 4,
                HUGE: 5
		};
		
		this.renderer = renderer
		this.scene = new Scene()
		this.camera = camera
		this.kernel = kernel

		this.kernelPresets = [
			new Float32Array([0.0, 0.0]),
			new Float32Array([0.0, 1.0, 1.0]),
			new Float32Array([0.0, 1.0, 1.0, 2.0]),
			new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]),
			new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]),
			new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])
		];

		this.name = "BlurPass";
		this.needsSwap = true;

		this.renderTargetX = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer: false,
			depthBuffer: false
		});

		this.renderTargetX.texture.name = "Blur.TargetX";
		this.renderTargetX.texture.generateMipmaps = false;

		this.renderTargetY = this.renderTargetX.clone();
		this.renderTargetY.texture.name = "Blur.TargetY";

		this.resolutionScale = 0.5

		this.convolutionMaterial  = kernel.mat

		this.kernelSize = this.KernelSize.HUGE;
	}

	/**
	 * The absolute width of the internal render targets.
	 *
	 * @type {Number}
	 */

	get width() {

		return this.renderTargetX.width;

	}

	/**
	 * The absolute height of the internal render targets.
	 *
	 * @type {Number}
	 */

	get height() {

		return this.renderTargetX.height;

	}

	/**
	 * The kernel size.
	 *
	 * @type {KernelSize}
	 * @default KernelSize.LARGE
	 */

	get kernelSize() {
		return this.KernelSize.HUGE;
	}

	/**
	 * @type {KernelSize}
	 */

	set kernelSize(value = KernelSize.LARGE) {

		this.convolutionMaterial.kernelSize = value;

	}

	/**
	 * Blurs the read buffer.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer.
	 */

	render(opts = {} ) {
		this.scene.add(this.kernel.mesh)

		let toScreen = opts.toScreen || false
		let source = opts.source
		let output = opts.output

		const renderTargetX = this.renderTargetX;
		const renderTargetY = this.renderTargetY;

		const material = this.convolutionMaterial;
		const uniforms = material.uniforms;
		const kernel = this.getKernel();

		let lastRT = source;
		let destRT;
		let i, l;

		// Apply the multi-pass blur.
		for(i = 0, l = kernel.length - 1; i < l; ++i) {

			// Alternate between targets.
			destRT = ((i % 2) === 0) ? renderTargetX : renderTargetY;

			uniforms.kernel.value = kernel[i];
			uniforms.tInput.value = lastRT.texture;
			this.renderer.render(this.scene, this.camera, destRT);

			lastRT = destRT;

		}

		uniforms.kernel.value = kernel[i];
		uniforms.tInput.value = lastRT.texture;

		this.renderer.render(this.scene, this.camera, toScreen == true ? null : output);
		this.scene.remove(this.kernel.mesh)
	}

	/**
	 * Adjusts the format of the render targets.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 */

	initialise(renderer, alpha) {

		if(!alpha) {

			this.renderTargetX.texture.format = RGBFormat;
			this.renderTargetY.texture.format = RGBFormat;

		}

	}

	getKernel() {
		return this.kernelPresets[this.kernelSize];
	}

	setTexelSize(x, y) {		
		this.kernel.mat.uniforms.texelSize.value.set(x, y);
		this.kernel.mat.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);
	}
		
		

	/**
	 * Updates this pass with the renderer's size.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.renderTargetX.setSize(width, height);
		this.renderTargetY.setSize(width, height);

		this.setTexelSize(1.0 / width, 1.0 / height);
	}

}