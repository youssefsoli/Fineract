import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import * as posenet from '@tensorflow-models/posenet';
import FlappyBird from './games/FlappyBird';
import useNet from './useLoadNet';
// Frontend:
import Game from './game';
import Navbar from './navbar';
import About from './about';
import Footer from './footer';

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const net = useNet({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 160, height: 120 },
        multiplier: 0.5,
        imageScaleFactor: 0.3,
    });
    const [pose, setPose] = useState(false);
    const [nav, setNav] = useState(false);

    useEffect(() => {
        if (!net) return () => {};
        if ([net].some(elem => elem instanceof Error)) return () => {};

        //  Load posenet
        const runPosenet = async () => {
            setInterval(() => {
                detect(net);
            }, 30);
        };
        runPosenet();
    }, [net]);

    const detect = async net => {
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
            pose.keypoints = pose.keypoints.map(keypoint => {
                keypoint.position.x *= window.innerWidth / videoWidth;
                keypoint.position.y *= window.innerHeight / videoHeight;
                return keypoint;
            });

            setPose(pose);
        }
    };

    return (
        <div className="parent">
            <Router>
            <Switch>
            <Route exact path="/">
                        <div className="html">
                        <Navbar />
                            <section id="banner" className="banner">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6 banner-l">
                                            <div className="banner-text">
                                                <h3>
                                                    Welcome To **SUPER COOL APP
                                                    NAME**
                                                </h3>
                                                {/* TODO: Write Cool APP name and better moto */}
                                                <h1 className="heading-font">
                                                    Challenge yourself to enjoy
                                                    your excercises
                                                </h1>
                                                <p>
                                                    **APP NAME** Allows you to
                                                    gamify your excercises, by
                                                    literally playing a game
                                                    with your body. Choose from
                                                    a list of muscles to
                                                    improve, and you will have a
                                                    game to play that focuses on
                                                    training those muscles. The
                                                    game levels are
                                                    progressively generated to
                                                    target those muscles. You
                                                    can also compete with
                                                    friends <b>live</b> to keep
                                                    the action going!
                                                </p>
                                                <div className="banner-btn">
                                                    <a href="#">Learn More</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 banner-img d-md-block d-none">
                                            <div className="banner-block">
                                                <img
                                                    src="images/squats.gif"
                                                    className="img-fluid"
                                                    alt="banner"
                                                />
                                                <div className="animation-circle-inverse left">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="about" class="about common">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-12 text-center">
                                            <div class="section-head">
                                                <h2 class="heading-font">
                                                    Choose a muscle to train:
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row choose-slick">
                                        <Game
                                            title="Upper Chest"
                                            description="Train your upper chest"
                                            icon="push-up_2548518"
                                            link="/flappy"
                                        />
                                        <Game
                                            title="Thighs"
                                            description="Jump Duck but dont roll!"
                                            icon="flaticon-icon-135439"
                                        />
                                        <Game
                                            title="General Workout Routines"
                                            description="Generic things"
                                            icon="flaticon-workout"
                                        />
                                    </div>

                                    <div class="col-md-12 text-center">
                                        <div class="section-head">
                                            <h4 class="heading-font">
                                                Coming Soon:
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="row choose-slick">
                                        <Game
                                            title="Lower Chest"
                                            description="Train your upper chest"
                                            icon="push-up_2548518"
                                        />
                                        <Game
                                            title="Neck Muscles"
                                            description="Jump Duck but dont roll!"
                                            icon="flaticon-icon-135439"
                                        />
                                        <Game
                                            title="General Workout Routines"
                                            description="Generic things"
                                            icon="flaticon-workout"
                                        />
                                    </div>
                                </div>
                            </section>

                            <About />
                            <Footer />
                        </div>
                    </Route>
                    <Route path="/flappy">
                        <div className="App">
                        {nav && (<Navbar />)}
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
                                    zIndex: 9,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            {canvasRef.current && (
                                <FlappyBird
                                    pose={pose}
                                    canvasRef={canvasRef}
                                    webcamRef={webcamRef}
                                    setNav={(nav) => setNav(nav)}
                                />
                            )}
                        </div>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
