const VertexShader = `
varying vec2 vUv;

void main()
{
  vUv = uv;
  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default VertexShader
