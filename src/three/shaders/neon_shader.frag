precision highp float;
precision highp int;

varying vec2 vUv;

void main() {
    vec3 color;
    float brightness;
    float falloff;

    color = vec3(.6784313725, .6784313725, 1.);
    brightness = 10.;
    falloff = 8.;


    vec2 multiplier = pow( abs( vUv - 0.5 ), vec2( falloff ) );
    gl_FragColor = vec4( color * brightness * length( multiplier ) + color, 1.0 );
}