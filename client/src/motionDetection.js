import keypointIndex from './keypointIndex';

const isTouchingLeftShoulder = (pose) => {
    if (pose === false) {
        return false;
    }
    const leftWristPos = pose.keypoints[keypointIndex.leftWrist].position;
    const leftShoulderPos = pose.keypoints[keypointIndex.leftShoulder].position;

    const leftDistance = Math.sqrt(
        Math.pow(leftWristPos.x - leftShoulderPos.x, 2) +
            Math.pow(leftWristPos.y - leftShoulderPos.y, 2)
    );

    return leftDistance < 130 && leftWristPos.y < 200;
};

const isTouchingRightShoulder = (pose) => {
    if (pose === false) {
        return false;
    }
    const rightWristPos = pose.keypoints[keypointIndex.rightWrist].position;
    const rightShoulderPos =
        pose.keypoints[keypointIndex.rightShoulder].position;

    const rightDistance = Math.sqrt(
        Math.pow(rightWristPos.x - rightShoulderPos.x, 2) +
            Math.pow(rightWristPos.y - rightShoulderPos.y, 2)
    );

    return rightDistance < 130 && rightWristPos.y < 200;
};

const isInAir = (pose, normalHeight = 120, peakHeight = -30, factor = 0.75) => {
    const leftHipPos = pose.keypoints[keypointIndex.leftHip].position;
    const rightHipPos = pose.keypoints[keypointIndex.rightHip].position;
    const averageHipHeight = (leftHipPos.y + rightHipPos.y) / 2;
    const verticalDistance = normalHeight - peakHeight;

    return normalHeight - averageHipHeight > verticalDistance * factor;
};

export { isTouchingLeftShoulder, isTouchingRightShoulder, isInAir };
