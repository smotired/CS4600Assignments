// [TO-DO] Complete the implementation of the following class and the vertex shader below.

class CurveDrawer {
	constructor()
	{
		this.prog   = InitShaderProgram( curvesVS, curvesFS );
		// [TO-DO] Other initializations should be done here.
		// [TO-DO] This is a good place to get the locations of attributes and uniform variables.

		gl.useProgram( this.prog );

		// Get uniform and attribute locations

		// Points
		this.pt = [];
		this.pt.push( gl.getUniformLocation(this.prog, "p0") );
		this.pt.push( gl.getUniformLocation(this.prog, "p1") );
		this.pt.push( gl.getUniformLocation(this.prog, "p2") );
		this.pt.push( gl.getUniformLocation(this.prog, "p3") );

		// Transformation matrix
		this.mvp = gl.getUniformLocation(this.prog, "mvp");

		// t attribute
		this.t = gl.getAttribLocation(this.prog, "t");
		
		// Initialize the attribute buffer
		this.steps = 100;
		var tv = []; // t values
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}

		// [TO-DO] This is where you can create and set the contents of the vertex buffer object
		// for the vertex attribute we need.

		// we will represent it as lines i guess so each point appears twice except first and last
		const lines = [ tv[0] ];
		for (let i = 1; i < tv.length - 1; i++) {
			lines.push(tv[i]);
			lines.push(tv[i]);
		}
		lines.push(tv[-1]);
		this.lineCount = lines.length / 2; // lines.length is the number of vertices and we have 2 lines per vertex

		// Set up the vertex buffer
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
	}
	setViewport( width, height )
	{
		// [TO-DO] This is where we should set the transformation matrix.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		gl.useProgram( this.prog );	// Bind the program

		// the transformation matrix was taken from lineDrawer
		const matrix = [ // column major order
			 2/width,         0, 0, 0,
			 0,       -2/height, 0, 0,
			 0,       0,         1, 0,
			-1,       1,         0, 1,
		]; // just scales by 2/width and 2/height and translates by -1, 1

		gl.uniformMatrix4fv(this.mvp, false, matrix);
	}
	updatePoints( pt )
	{
		// [TO-DO] The control points have changed, we must update corresponding uniform variables.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		// [TO-DO] We can access the x and y coordinates of the i^th control points using
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");
		
		// Bind the program
		gl.useProgram(this.prog);

		// Set each position
		for (let i = 0; i < 4; i++) {
			const x = pt[i].getAttribute("cx");
			const y = pt[i].getAttribute("cy");
			gl.uniform2f( this.pt[i], x, y );
		}
	}
	draw()
	{
		// [TO-DO] This is where we give the command to draw the curve.
		// [TO-DO] Do not forget to bind the program and set the vertex attribute.

		// Bind the program
		gl.useProgram(this.prog);

		// Set the t attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(
			this.t,
			2,
			gl.FLOAT,
			false,
			0,
			0,
		);
		gl.enableVertexAttribArray(this.t)

		// Draw the lines
		gl.drawArrays(gl.LINES, 0, this.lineCount);
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;

	uniform mat4 mvp;

	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;

	void lerpv2(in vec2 p1, in vec2 p2, in float k, out vec2 res)
	{
		res = p1 + k * (p2 - p1);
	}

	void main()
	{
		// [TO-DO] Replace the following with the proper vertex shader code
		
		// Try with de Casteljau's algorithm
		vec2 pa0;
		vec2 pa1;
		vec2 pa2;
		lerpv2(p0, p1, t, pa0);
		lerpv2(p1, p2, t, pa1);
		lerpv2(p2, p3, t, pa2);

		vec2 pb0;
		vec2 pb1;
		lerpv2(pa0, pa1, t, pb0);
		lerpv2(pa1, pa2, t, pb1);

		vec2 final;
		lerpv2(pb0, pb1, t, final);

		gl_Position = mvp * vec4(final,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;