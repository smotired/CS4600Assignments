// This function is called in the body's onload function
async function init() {
    // Get the canvas and the WebGL context
    const canvas = document.getElementById("main-canvas");
    const gl = canvas.getContext("webgl");

    // A context is kind of like a class object with a lot of functions we call to work with our GPU

    // Set up our canvas and viewport
    const pixelRatio = window.devicePixelRatio || 1; // Account for correct scaling factor
    canvas.width  = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Setup drawing parameters
    gl.clearColor(1,0.9,1,1); // RGBA color to reset to when clearing the screen
    gl.lineWidth(1.0); // 0-1, used when drawing lines

    // This represents the XYZ coordinates of the vertices of 2 triangles, winding in CCW order
    // 6 vertices with 3 attributes, totalling 18 values.
    const positions = [
        -0.8,  0.4, 0,
         0.8,  0.4, 0,
         0.8, -0.4, 0,
        -0.8,  0.4, 0,
         0.8, -0.4, 0,
        -0.8, -0.4, 0,
    ];

    // And this represents the RGBA colors of those vertices
    // 6 vertices with 4 attributes, totalling 24 values.
    const colors = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 0, 0, 1,
        0, 0, 1, 1,
        1, 0, 1, 1,
    ];

    // Create a buffer to pass data to the GPU
    const position_buffer = gl.createBuffer();  // Just something that contains data.
    gl.bindBuffer(
        gl.ARRAY_BUFFER,              // Bind it as an array buffer
        position_buffer );            // Bind that to our new buffer
    gl.bufferData(
        gl.ARRAY_BUFFER,              // Send to the most recently bound array buffer
        new Float32Array(positions),  // Positions (in the correct type)
        gl.STATIC_DRAW );             // Won't be modified often
        // Memory allocation happens in bufferData

    const color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Read in our shader code
    const vs_source = await fetch("shaders/vertex.vs").then(res => res.text());
    const fs_source = await fetch("shaders/fragment.fs").then(res => res.text());
    // const vs_source = document.getElementById("vertexShader").text;
    // const fs_source = document.getElementById("fragmentShader").text;

    // Compile the shader code
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vs_source); // vs_source is a string
    gl.compileShader(vs);

    // Validate (won't get any JS errors if GL doesn't compile it correctly)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        alert( gl.getShaderInfoLog(vs) );
        gl.deleteShader(vs);
    }

    // Do the same with the fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        alert( gl.getShaderInfoLog(fs) );
        gl.deleteShader(fs);
    }

    // The Program is the combination of the vertex and fragment shaders
    // Link them together
    const program = gl.createProgram()
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    // Validate linkage
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(prog));
    }
    gl.useProgram(program);
    
    // GLSL code is compiled by your graphics driver into the best-optimized code by your GPU. Might not be the same binary code for each.

    // Add the Uniform variable
    const m = gl.getUniformLocation(program, "transformation"); // The variable is called `transformation` in the vertex shader
    const matrix = [ // COLUMN MAJOR ORDER.
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]; // just use the identity matrix for now
    gl.uniformMatrix4fv( m, false, matrix );
    // 4 means 4 dimensions, f means float (can also be d or i), v means an array of values instead of the values individually

    // Pass in the Attributes
    const p = gl.getAttribLocation(program, "pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(
        p,              // The attribute
        3,              // How many values in this attribute
        gl.FLOAT,       // The type of this attribute
        false,          // Normalized: I forgor
        0,              // Stride: I forgor
        0               // Offset (how many bytes from the start of this vertex this attribute starts)
    );
    gl.enableVertexAttribArray(p); // Enable the attribute for this type of object

    const c = gl.getAttribLocation(program, "clr");
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(
        c,              // The attribute
        4,              // How many values in this attribute
        gl.FLOAT,       // The type of this attribute
        false,          // Normalized: I forgor
        0,              // Stride: I forgor
        0               // Offset (how many bytes from the start of this vertex this attribute starts)
    );
    gl.enableVertexAttribArray(c); // Enable the attribute for this type of object

    // RENDERING TIME!
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // Clear the screen
    gl.useProgram( program ); // Use these shaders
    gl.drawArrays( gl.TRIANGLES, 0, 6 ); // GO! Draw 6 vertexes as triangles with 0 offset.
}