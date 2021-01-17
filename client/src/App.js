// import './App.css';
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import * as posenet from '@tensorflow-models/posenet';
import Game from './game';
import Navbar from './navbar';
import About from './about';
import Footer from './footer';

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

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
            const pose = await net.estimateSinglePose(video);
            console.log(pose);
        }
    };

    runPosenet();

    return (
        <div className="App">   
            <Navbar/>
            
            <header className="nav_area">
                {/* <!-- back to top start --> */}
                <a href="#" id="back-top-btn"><i className="fas fa-arrow-circle-up"></i></a> 
                {/* <!-- back to top end -->*/}

                {/* Preloader Start */}
                {/* <div className="loading">
                <div className="preloader">
                    <div className="animation-circle-inverse left"> 
                    <span></span>
                    <span></span>
                    <span></span>
                    </div>
                </div>
                </div> */}
            {/* Preloader End */}

            <section id="banner" className="banner">
                <div className="container">
                    <div className="row">
                    <div className="col-md-6 banner-l">
                        <div className="banner-text">
                        <h3>Welcome To **SUPER COOL APP NAME**</h3>
                        {/* TODO: Write Cool APP name and better moto */}
                        <h1 className="heading-font">Challenge yourself to enjoy your excercises</h1>
                        <p>
                            **APP NAME** Allows you to gamify your excercises, by literally playing a game with your body.
                            Choose from a list of muscles to improve, and you will have a game to play that focuses on training those muscles.
                            The game levels are progressively generated to target those muscles. 
                            You can also compete with friends <b>live</b> to keep the action going!
                        </p>
                        <div className="banner-btn">
                            <a href="#">Learn More</a>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 banner-img d-md-block d-none">
                        <div className="banner-block">
                        <img
                            src="images/squats.gif" className="img-fluid" alt="banner"/>
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
                            <h2 class="heading-font">Choose a muscle to train:</h2>
                            </div>
                        </div>
                        </div>
                        <div class="row choose-slick">
                            <Game title="Upper Chest" description="Train your upper chest" icon="push-up_2548518" />
                            <Game title="Thighs" description="Jump Duck but dont roll!" icon="flaticon-icon-135439" />
                            <Game title="General Workout Routines" description="Generic things" icon="flaticon-workout" />
                        </div>

                        <div class="col-md-12 text-center">
                            <div class="section-head">
                            <h4 class="heading-font">Coming Soon:</h4>
                            </div>
                        </div>
                        <div class="row choose-slick">
                            <Game title="Lower Chest" description="Train your upper chest" icon="push-up_2548518" />
                            <Game title="Neck Muscles" description="Jump Duck but dont roll!" icon="flaticon-icon-135439" />
                            <Game title="General Workout Routines" description="Generic things" icon="flaticon-workout" />
                        </div>
                        </div>
                        </section>

                <About />
                <Footer />


                <Webcam
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
                />
            </header>
        </div>
    );
}

export default App;
