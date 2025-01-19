// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    // Get the width and height information
    const bgWidth = bgImg.width, bgHeight = bgImg.height;
    const fgWidth = fgImg.width, fgHeight = fgImg.height;

    // Bounds of iteration
    const lx = Math.max(0, fgPos.x), rx = Math.min(bgWidth,  fgPos.x + fgWidth);
    const ly = Math.max(0, fgPos.y), ry = Math.min(bgHeight, fgPos.y + fgHeight);
    const bx = rx - lx, by = ry - ly;

    // Offset of foreground in the negatives, or 0 if it's all positive
    const ox = Math.max(0, -fgPos.x), oy = Math.max(0, -fgPos.y);

    // Modify the background's imageData
    for (let y = 0; y < by; y++) {
        for (let x = 0; x < bx; x++) {
            // Positions of the pixels that we are modifying in the background and foreground
            const bx = x + lx, by = y + ly;
            const fx = x + ox, fy = y + oy;
            // Calculate the scanline index of this pixel in both imageDatas
            // Multiply by 4 because of R, G, B, and A
            const bgPx = (by * bgWidth + bx) * 4;
            const fgPx = (fy * fgWidth + fx) * 4;
            // For RGB, lerp the values based on the foreground's opacity
            const fgAlpha = fgImg.data[fgPx + 3] / 256;
            bgImg.data[bgPx + 0] = lerp(bgImg.data[bgPx + 0], fgImg.data[fgPx + 0], fgOpac * fgAlpha);
            bgImg.data[bgPx + 1] = lerp(bgImg.data[bgPx + 1], fgImg.data[fgPx + 1], fgOpac * fgAlpha);
            bgImg.data[bgPx + 2] = lerp(bgImg.data[bgPx + 2], fgImg.data[fgPx + 2], fgOpac * fgAlpha);
            // For A, assume 255
            bgImg.data[bgPx + 3] = 255;
        }
    }
}

// I created this helper function for linear interpolation
function lerp(a, b, x) {
    return a + (b-a) * x;
}