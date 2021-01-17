import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as posenet from '@tensorflow-models/posenet';
import FlappyBird from './games/FlappyBird';
import Dino from './games/Dino';
import useNet from './useLoadNet';

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const net = useNet({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.5,
        imageScaleFactor: 0.3,
    });
    const [pose, setPose] = useState(false);

    useEffect(() => {
        if (!net) return () => {};
        if ([net].some((elem) => elem instanceof Error)) return () => {};

        //  Load posenet
        const runPosenet = async () => {
            setInterval(() => {
                detect(net);
            }, 30);
        };
        runPosenet();
    }, [net]);

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4 &&
            net !== null
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;

            // Make Detections
            const pose = await net.estimateSinglePose(video);
            pose.keypoints = pose.keypoints.map((keypoint) => {
                keypoint.position.x *= window.innerWidth / videoWidth;
                keypoint.position.y *= window.innerHeight / videoHeight;
                return keypoint;
            });

            setPose(pose);
        }
    };

    return (
        <div className="App">
            <Webcam
                ref={webcamRef}
                style={{
                    position: 'absolute',
                    marginLeft: '0',
                    marginRight: '0',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 8,
                    width: 'auto',
                    height: '10%',
                }}
            />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zindex: 9,
                        width: '100%',
                        height: '100%',
                    }}
                />
                {canvasRef.current && <Dino pose={pose} canvasRef={canvasRef} />}
        </div>
    );
}

export default App;
