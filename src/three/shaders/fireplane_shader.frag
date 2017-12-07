precision mediump float;

uniform vec3 u_base_color;
uniform vec3 u_fire_color;

varying vec2 v_uv;
varying float v_high_noise;

void main() {
    vec3 noiseColor = mix(u_base_color, u_fire_color, v_high_noise);

    gl_FragColor = vec4(noiseColor, 1.);
}
