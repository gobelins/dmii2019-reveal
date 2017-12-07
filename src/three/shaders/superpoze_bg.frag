precision mediump float;

uniform vec3 u_base_first_color;
uniform vec3 u_base_second_color;
uniform vec3 u_accent_color;
uniform float u_accent_opacity;
uniform float u_base_frequency;
uniform float u_accent_frequency;
uniform float u_noise_intensity;
uniform float u_time;

varying vec2 v_uv;

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);

  return 2.3 * n_xy;
}

float randomNoise(vec2 st) {
  return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    float baseNoise = cnoise(u_base_frequency * v_uv + u_time);
    float accentNoise = cnoise(u_accent_frequency * v_uv - u_time);
    float randomNoise = randomNoise(u_base_frequency * v_uv);
    vec3 randomNoiseColor = vec3(randomNoise, randomNoise, randomNoise);

    vec3 baseMix = mix(u_base_first_color, u_base_second_color, baseNoise);
    vec3 accentMix = mix(baseMix, u_accent_color, accentNoise - (1. - u_accent_opacity));
    vec3 noiseMix = mix(accentMix, randomNoiseColor, u_noise_intensity);

    gl_FragColor = vec4(noiseMix, 1.);
}
