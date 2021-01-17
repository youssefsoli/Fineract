import { useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { drawKeypoints } from '../utilities';
import keypointIndex from '../keypointIndex';
import {
    isTouchingLeftShoulder,
    isTouchingRightShoulder,
} from '../../src/motionDetection';

const drawPosition = (xCoor, yCoor, ctx, name, keypoints) => {
    // Radii of the white glow.
    let innerRadius = 10,
        outerRadius = 130,
        // Radius of the entire circle.
        radius = 120;
    let grd = ctx.createRadialGradient(
        xCoor,
        yCoor,
        innerRadius,
        xCoor,
        yCoor,
        outerRadius
    );
    let color;
    if (keypoints) {
        const keypointPos = keypoints[keypointIndex[name]].position;
        if (
            Math.sqrt(
                Math.pow(xCoor - keypointPos.x, 2) +
                    Math.pow(yCoor - keypointPos.y, 2)
            ) <= radius
        ) {
            color = '#a0ff2b';
        } else {
            color = '#ff2b72';
        }
    } else {
        color = '#ff2b72';
    }

    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(xCoor, yCoor, radius, 0, 2 * Math.PI);
    ctx.fill();

    return color === '#a0ff2b';
};

const FlappyBird = ({ pose, canvasRef, webcamRef, setNav, ...props }) => {
    const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const pipeNorth = useRef(null);
    const pipeSouth = useRef(null);
    const [calibration, setCalibration] = useState(true);
    const history = useHistory();

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            setNav(false);

            // restart
            document.addEventListener(
                'restart',
                () => {
                    canvasRef.current.game = new Game();
                },
                false
            );

            // pause
            document.addEventListener(
                'pause',
                () => {
                    canvasRef.current.game.pause = true;
                    setNav(true);
                },
                false
            );

            // resume
            document.addEventListener(
                'resume',
                () => {
                    canvasRef.current.game.pause = false;
                    setNav(false);
                },
                false
            );

            // exit
            document.addEventListener(
                'exit',
                () => {
                    history.push('/');
                },
                false
            );

            // some variables
            this.yScale = (window.innerHeight + window.innerWidth) / 1500;
            this.xScale = this.yScale;

            //console.log(this.xScale, this.yScale);

            this.gap = 85 * this.yScale;
            this.constant = 0;

            this.speed = 4 * this.xScale;

            this.bX = 10;
            this.score = 0;
            this.distanceBetweenPipes = 300 * this.xScale;
            this.pipe = [];
            this.over = false;
            this.pause = false;

            this.pipe[0] = {
                x: window.innerWidth,
                y: -300 * this.yScale,
            };
        }
    }

    const randInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const calibrationDraw = (ctx, keypoints) => {
        const x = window.innerWidth;
        const y = window.innerHeight;
        // fill background with grey

        // draw video
        ctx.drawImage(webcamRef.current.video, 0, 0, x, y);

        let numValid = 0;
        // left wrist
        if (
            drawPosition(9 * (x / 11), 7 * (y / 8), ctx, 'leftWrist', keypoints)
        ) {
            numValid++;
        }

        // right wrist
        if (
            drawPosition(
                2 * (x / 11),
                7 * (y / 8),
                ctx,
                'rightWrist',
                keypoints
            )
        ) {
            numValid++;
        }

        // left shoulder
        if (drawPosition(2 * (x / 3), y / 8, ctx, 'leftShoulder', keypoints)) {
            numValid++;
        }

        // right shoulder
        if (drawPosition(x / 3, y / 8, ctx, 'rightShoulder', keypoints)) {
            numValid++;
        }

        return numValid === 4;
    };

    const draw = (ctx) => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        const partnerPose = canvasRef.current.partnerPose;
        if (!pose || !game) return;

        if(!canvasRef.current.started || !partnerPose) {
            ctx.textAlign = 'center';
            ctx.font = '60px Verdana';
            ctx.fillText(
                'Waiting for partner',
                game.cvs.width / 2,
                game.cvs.height / 2
            );
            return;
        }

        if (game.over) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.font = '60px Verdana';
            ctx.fillText(
                'Score : ' + game.score,
                game.cvs.width / 2,
                game.cvs.height / 2
            );

            ctx.font = '30px Verdana';
            ctx.fillText(
                'Tap your right shoulder with your right hand to restart',
                game.cvs.width / 2,
                game.cvs.height / 2 + 60
            );
            ctx.fillText(
                'Tap your left shoulder with your left hand to exit',
                game.cvs.width / 2,
                game.cvs.height / 2 + 120
            );
            return;
        }

        if (game.pause) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.font = '60px Verdana';
            ctx.fillText('Paused', game.cvs.width / 2, game.cvs.height / 2);

            ctx.font = '30px Verdana';
            ctx.fillText(
                'Tap your right shoulder with your right hand to resume',
                game.cvs.width / 2,
                game.cvs.height / 2 + 60
            );
            return;
        }

        const { x, y } = pose.keypoints[0].position;
        const { x: partnerX, y: partnerY } = partnerPose.keypoints[0].position;

        game.bird = bird.current;
        game.bg = bg.current;
        game.pipeNorth = pipeNorth.current;
        game.pipeSouth = pipeSouth.current;

        ctx.drawImage(game.bg, 0, 0, window.innerWidth, window.innerHeight);

        if (
            game.pipe[game.pipe.length - 1].x <
            game.cvs.width - game.distanceBetweenPipes
        ) {
            game.pipe.push({
                x: game.cvs.width,
                y: randInt(
                    (100 - game.pipeNorth.height) * game.yScale,
                    game.cvs.height -
                        (game.pipeNorth.height + 100) * game.yScale
                ),
            });

            //cons

            game.speed += 0.1;
        }

        if (game.pipe[0].x < -game.pipeNorth.width * game.xScale) {
            game.pipe.splice(0, 1);
            game.score++;
            playScore();
        }

        for (let i = 0; i < game.pipe.length; i++) {
            game.constant = pipeNorth.current.height * game.yScale + game.gap;
            ctx.drawImage(
                game.pipeNorth,
                game.pipe[i].x,
                game.pipe[i].y,
                game.pipeNorth.width * game.xScale,
                game.pipeNorth.height * game.yScale
            );
            ctx.drawImage(
                game.pipeSouth,
                game.pipe[i].x,
                game.pipe[i].y + game.constant,
                game.pipeSouth.width * game.xScale,
                game.pipeSouth.height * game.yScale
            );

            game.pipe[i].x -= game.speed;

            // detect collision

            if (
                game.bX + (game.bird.width * game.xScale) / 2 >=
                    game.pipe[i].x &&
                game.bX <=
                    game.pipe[i].x + game.pipeNorth.width * game.xScale &&
                (y <= game.pipe[i].y + game.pipeNorth.height * game.yScale ||
                    y + (game.bird.height * game.yScale) / 2 >=
                        game.pipe[i].y + game.constant)
            ) {
                game.over = true;
                setNav(true);
                //canvasRef.current.game = new Game();
                return;
            }
        }

        //ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.drawImage(
            game.bird,
            game.bX,
            y,
            game.bird.width * game.xScale,
            game.bird.height * game.yScale
        );

        ctx.drawImage(
            game.bird,
            game.bX + 100,
            partnerY,
            game.bird.width * game.xScale,
            game.bird.height * game.yScale
        );

        // Draw face
        ctx.drawImage(
            webcamRef.current.video,
            0,
            0,
            window.innerWidth / 8,
            window.innerHeight / 8
        );

        // Draw dot on face

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x / 8, y / 8, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.font = '20px Verdana';
        ctx.fillText('Score : ' + game.score, 60, game.cvs.height - 20);
    };

    const calibrationRender = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (calibrationDraw(context, canvasRef.current.pose.keypoints)) {
            setCalibration(false);
            return;
        }
        drawKeypoints(canvasRef.current.pose.keypoints, 0.6, context, [
            'leftShoulder',
            'rightShoulder',
            'leftWrist',
            'rightWrist',
        ]);
        requestAnimationFrame(calibrationRender);
    };

    const render = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        draw(context);
        requestAnimationFrame(render);
    };

    useEffect(() => {
        canvasRef.current.started = false;
        canvasRef.current.socket = io(window.location.origin.toString());
        canvasRef.current.game = new Game();
        render();

        canvasRef.current.socket.on('startGame', () => (canvasRef.current.started = true));
        canvasRef.current.socket.on('partnerPose', pose => {
            canvasRef.current.partnerPose = pose;
        });
    }, []);

    // When pose updates
    useEffect(() => {
        canvasRef.current.pose = pose;

        if (calibration) {
            calibrationRender();
        } else {
            canvasRef.current.socket.emit('pose', pose);

            let eventName;
            if (canvasRef.current.game.over && isTouchingRightShoulder(pose)) {
                eventName = 'restart';
            } else if (
                canvasRef.current.game.over &&
                isTouchingLeftShoulder(pose)
            ) {
                eventName = 'exit';
            } else if (
                !canvasRef.current.game.pause &&
                !canvasRef.current.game.over &&
                isTouchingLeftShoulder(pose)
            ) {
                eventName = 'pause';
            } else if (
                canvasRef.current.game.pause &&
                !canvasRef.current.game.over &&
                isTouchingRightShoulder(pose)
            ) {
                eventName = 'resume';
            }

            if (eventName) {
                const event = new Event(eventName);
                document.dispatchEvent(event);
            }
        }
    }, [pose]);

    return (
        <>
            <img
                ref={bird}
                src="assets/bird.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <img
                ref={bg}
                src="assets/background.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <img
                ref={pipeNorth}
                src="assets/pipetop.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <img
                ref={pipeSouth}
                src="assets/pipebottom.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <iframe ref={azureFrame} title="a" style={{zIndex: 30, position: 'absolute', right: 30, top: 20}} src="https://gitvideocall.azurewebsites.net/?groupId=1bcc5dd0-58c2-11eb-8ca9-337a2b67a3ce"></iframe>
        </>
    );
};

export default FlappyBird;
