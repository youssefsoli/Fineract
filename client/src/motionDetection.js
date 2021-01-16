import keypointIndex from './keypointIndex';

const isTouchingShoulder = (pose) => {
    if (pose === false) {
        return false;
    }
    const leftWristPos = pose.keypoints[keypointIndex.leftWrist].position;
    const rightWristPos = pose.keypoints[keypointIndex.rightWrist].position;
    const leftShoulderPos = pose.keypoints[keypointIndex.leftShoulder].position;
    const rightShoulderPos =
        pose.keypoints[keypointIndex.rightShoulder].position;

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
