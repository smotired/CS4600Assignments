// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	const rad = rotation * 3.1415926 / 180;
	// I really don't like that this is in column major order because it makes it harder to visualize,
	// so assume it's the transpose of this visualized matrix
	return Array(
		scale *  Math.cos(rad), scale * Math.sin(rad), 0,
		scale * -Math.sin(rad), scale * Math.cos(rad), 0,
		positionX,              positionY,             1
	);
}

// Takes in 2 3x3 arrays and multiplies them as if they were matrices
function MatrixMultiply(m1, m2) {
	const getIndex = (i,j) => i * 3 + j;

	const product = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const target = getIndex(i,j);
			for (let k = 0; k < 3; k++) {
				const e1 = m1[getIndex(i,k)];
				const e2 = m2[getIndex(k,j)];
				product[target] += e1 * e2;
			}
		}
	}
	return product;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	return MatrixMultiply(trans1, trans2);
}
