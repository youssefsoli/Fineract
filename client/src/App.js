// import './App.css';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as posenet from '@tensorflow-models/posenet';
// import FlappyBird from './FlappyBird'

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [pose, setPose] = useState(false);

    //  Load posenet
    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution: { width: 160, height: 120 },
            scale: 0.8,
        });
        //
        setInterval(() => {
            detect(net);
        }, 30);
    };

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Make Detections
            setPose(await net.estimateSinglePose(video));
        }
    };

    runPosenet();

    return (
        <div className="App">
            <header className="App-header">
                {/* <Webcam
                    ref={webcamRef}
                    style={{
                        position: 'absolute',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zindex: 9,
                        width: 640,
                        height: 480,
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
                        width: 640,
                        height: 480,
                    }}
                /> */}
                <FlappyBird />
            </header>
        </div>
    );
}

export default App;
