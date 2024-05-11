export default `
varying vec2 vUv;

void main()
{
  vUv = uv;
  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
