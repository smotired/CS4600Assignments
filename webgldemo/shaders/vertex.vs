precision mediump float;
// The vertex shader runs once for each vertex.

// attributes are variables that we pass in via the buffers
attribute vec3 pos; // position of the vertex in 3d space
attribute vec4 clr; // color of the vertex

// uniforms are parameters of the shader itself, used for all vertices
uniform mat4 transformation;

// varyings are sent onward
varying vec4 vcolor;

void main()
{
    // This is the final variable we set to for the rasterizer, representing the position in the canonical view volume
    // So we apply the transformation matrix
    gl_Position = transformation * vec4(pos, 1);
    // pass color from the vertex shader to the fragment shader
    vcolor = clr;
}