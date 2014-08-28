precision lowp float;

uniform sampler2D uSampler;
uniform float uAlpha;

varying vec2 vTextureCoord;

void main(void) {
    vec4 fragColor = texture2D(uSampler, vec2(vTextureCoord.x, 1. - vTextureCoord.y));
    gl_FragColor = vec4(fragColor.rgb, uAlpha*fragColor.a);
}
