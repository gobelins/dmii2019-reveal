varying vec2 vUv;
uniform sampler2D tInputA;
uniform sampler2D tInputB;

void main() {

    vec4 base = texture2D( tInputA, vUv );
    vec4 blend = texture2D( tInputB, vUv );

    gl_FragColor = (1.0 - ((1.0 - base) * (1.0 - blend)));

}