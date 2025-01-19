precision mediump float;
// The fragment shader runs after the rasterizer, once for every pixel

// GPU automatically interpolates the color for these vertexes
varying vec4 vcolor;

void main()
{
    // This is our final variable for the fragment shader
    gl_FragColor = vcolor;
}