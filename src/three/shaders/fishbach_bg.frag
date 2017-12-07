varying vec2 vUv;
uniform vec2 u_resolution;
void main() {

   vec3 h_color_top = vec3(0.03529411764, 0.04705882352, 0.07450980392);
   vec3 h_color_bottom = vec3(0.12843137254, 0.11666666666, 0.2225490196);
   gl_FragColor = vec4(h_color_top * (gl_FragCoord.y / u_resolution.y), 1) + vec4(h_color_bottom * (1.4 - (gl_FragCoord.y / u_resolution.y)), 1);

    // gl_FragColor = vec4(vec3(0.0784313725, 0.07450980392, .1215686275), vUv.y);
}
