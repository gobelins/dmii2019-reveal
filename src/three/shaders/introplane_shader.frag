precision mediump float;

uniform vec3 u_base_color;
uniform vec3 u_noise_color;
uniform float u_opacity;

varying vec3 v_position;
varying vec2 v_uv;
varying vec2 ss;
varying float v_noise;

void main() {
    vec3 noiseColor = mix(u_base_color, u_noise_color, v_noise * u_opacity);

    gl_FragColor = vec4(noiseColor, 1.);
}
