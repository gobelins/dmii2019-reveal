varying vec2 vUv;

void main() {
    
    vUv = vec2(.5) + (position.xy) * .5;
    gl_Position = vec4( position, 1.0 );

}