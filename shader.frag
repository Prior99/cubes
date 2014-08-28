precision lowp float;

uniform sampler2D uSampler;
uniform float uAlpha;

varying vec2 vTextureCoord;

void main(void) {
    gl_FragColor = vec4(texture2D(uSampler, vec2(vTextureCoord.x, 1. - vTextureCoord.y)).rgb, uAlpha);
}
