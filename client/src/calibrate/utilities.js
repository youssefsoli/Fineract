export function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    if (!keypoints) return;
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const parts = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip'];
        if (!parts.includes(keypoint.part)) continue;

        if (keypoint.score < minConfidence) {
            continue;
        }

        const { y, x } = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 20, 'blue');
    }
}
