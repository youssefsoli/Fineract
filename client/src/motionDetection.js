const isTouchingShoulder = (pose) => {
    if (pose === false) {
        return false;
    }
    const leftWristPos = pose.keypoints[9].position;
    const rightWristPos = pose.keypoints[10].position;
    const leftShoulderPos = pose.keypoints[5].position;
    const rightShoulderPos = pose.keypoints[6].position;

    const leftDistance = Math.sqrt(
        Math.pow(leftWristPos.x - leftShoulderPos.x, 2) +
            Math.pow(leftWristPos.y - leftShoulderPos.y, 2)
    );
    const rightDistance = Math.sqrt(
        Math.pow(rightWristPos.x - rightShoulderPos.x, 2) +
            Math.pow(rightWristPos.y - rightShoulderPos.y, 2)
    );

    if (
        (leftDistance < 130 && leftWristPos.y < 200) ||
        (rightDistance < 130 && rightWristPos.y < 200)
    ) {
        return true;
    }
    return false;
};

export default isTouchingShoulder;
