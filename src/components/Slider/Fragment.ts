const FragmentShader = `
uniform sampler2D uTextureOne;
uniform sampler2D uTextureTwo;
uniform float uProgress;

varying vec2 vUv;

void main()
{
  vec4 textureOne = texture2D(uTextureOne, vUv);
  vec4 textureTwo = texture2D(uTextureTwo, vUv);

  // Final color
  gl_FragColor = mix(textureOne, textureTwo, uProgress);
}
`

export default FragmentShader
