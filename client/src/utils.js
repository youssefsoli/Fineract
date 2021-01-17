export const updatePositions = (pose, bodyPositions) => {
    bodyPositions.count += 1
    const measuredPositions = ["leftShoulder", "rightShoulder", "leftHip", "rightHip", "leftKnee", "rightKnee"]
    for (let i = 0; i < pose.keypoints.length; i++) {
        let keypoint = pose.keypoints[i]
        let bodypart = keypoint.part

        if (measuredPositions.indexOf(keypoint.part) > -1 && keypoint.score > 0.6) {
            bodyPositions[bodypart].sum += keypoint.position.y
            bodyPositions[bodypart].count += 1
            bodyPositions[bodypart].avg =  bodyPositions[bodypart].sum / bodyPositions[bodypart].count
        }
    }
}