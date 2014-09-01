precision lowp float;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float uAlpha;
uniform float uDamage;

varying vec2 vTextureCoord;

void main(void) {
    vec4 fragColor = texture2D(uSampler, vec2(vTextureCoord.x, 1. - vTextureCoord.y));
    vec4 fragColor2 = texture2D(uSampler2, vec2(vTextureCoord.x, 1. - (vTextureCoord.y * 0.1 + uDamage)));
    fragColor = fragColor * vec4(vec3(1., 1., 1.) * (1. - fragColor2.a) + fragColor2.rgb * fragColor2.a, 1);
    gl_FragColor = vec4(fragColor.rgb, uAlpha*fragColor.a);
}
