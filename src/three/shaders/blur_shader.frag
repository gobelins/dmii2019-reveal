uniform sampler2D tInput;

varying vec2 vUv0;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec2 vUv3;

void main() {

	// Sample top left texel.
	vec4 sum = texture2D(tInput, vUv0);

	// Sample top right texel.
	sum += texture2D(tInput, vUv1);

	// Sample bottom right texel.
	sum += texture2D(tInput, vUv2);

	// Sample bottom left texel.
	sum += texture2D(tInput, vUv3);

	// Compute the average.
	gl_FragColor = sum * 0.25;

}