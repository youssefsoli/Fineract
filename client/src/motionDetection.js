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

const isInAir = (pose, bodyPositions, screenHeight) => {
    // const measuredPositions = ["leftShoulder", "rightShoulder", "leftHip", "rightHip", "leftKnee", "rightKnee"]
    const measuredPositions = ["leftHip", "rightHip"]

    let diffSum = 0
    let count = 0
    let partsUsed = []

    for (let i = 0; i < pose.keypoints.length; i++) {
        let keypoint = pose.keypoints[i]
        let bodypart = keypoint.part

        if (measuredPositions.indexOf(bodypart) > -1 && keypoint.score > 0.6) {
            let diff = Math.max(0, bodyPositions[bodypart].avg - keypoint.position.y)

            if (diff > 0) {
                partsUsed.push({part: bodypart, diff: diff})
                diffSum += diff
                count += 1
            }
        }
    }

    const jumping = (diffSum / count) > screenHeight * 0.1

    if (jumping) {
        console.log("decided to jump")
        console.log(bodyPositions)
        console.log(partsUsed)
    }

    if(diffSum > 0) {
        console.log("diffs")
        console.log(diffSum)
        console.log(count)
        console.log(partsUsed)
    }


    // const leftHipPos = pose.keypoints[keypointIndex.leftHip].position;
    // const rightHipPos = pose.keypoints[keypointIndex.rightHip].position;
    // const averageHipHeight = (leftHipPos.y + rightHipPos.y) / 2;
    // const verticalDistance = normalHeight - peakHeight;

    // return averageHipHeight - normalHeight > verticalDistance * factor;

    return jumping
};

const isCrouching = (
    pose,
    bodyPositions,
    screenHeight
) => {
    // const leftShoulderPos = pose.keypoints[keypointIndex.leftShoulder].position;
    // const rightShoulderPos =
    //     pose.keypoints[keypointIndex.rightShoulder].position;
    // const averageShoulderHeight = (leftShoulderPos.y + rightShoulderPos.y) / 2;
    // const verticalDistance = bottomHeight - normalHeight;

    // return averageShoulderHeight - normalHeight > verticalDistance * factor;
    const measuredPositions = ["leftShoulder", "rightShoulder", "leftHip", "rightHip"]

    let diffSum = 0
    let count = 0

    for (let i = 0; i < pose.keypoints.length; i++) {
        let keypoint = pose.keypoints[i]
        let bodypart = keypoint.part

        if (measuredPositions.indexOf(bodypart) > -1 && keypoint.score > 0.6) {
            let diff = Math.max(keypoint.position.y - bodyPositions[bodypart].avg, 0)
            diffSum += diff
            count += 1
        }
    }
    return (diffSum / count) > screenHeight * 0.4
};

export {
    isTouchingLeftShoulder,
    isTouchingRightShoulder,
    isInAir,
    isCrouching,
};
