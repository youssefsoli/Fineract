import { useEffect, useRef, useState } from 'react';
import { isInAir, isCrouching } from '../../src/motionDetection';
import { updatePositions } from '../../src/utils';
import { drawPoint } from './utilities';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';
import { drawKeypoints } from '../utilities';
import keypointIndex from '../keypointIndex';
import {
    isTouchingLeftShoulder,
    isTouchingRightShoulder,
} from '../../src/motionDetection';

const drawPosition = (xCoor, yCoor, ctx, name, keypoints) => {
    // Radii of the white glow.
    let innerRadius = 5,
        outerRadius = 70,
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

const Dino = ({ pose, canvasRef, webcamRef, setNav, ...props }) => {
    const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const dino = useRef(null);
    const cactus = useRef(null);
    const crouchdino = useRef(null);
    const [calibration, setCalibration] = useState(true);

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            setNav(false);

            //restart
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

            // some variables
            this.tick = 0;
            this.constant = 0;
            this.over = false;
            this.upwards = 0;
            this.speed = 10;
            this.bX = 10;
            this.score = 0;
            this.dinoState = 'ground';
            this.crouchLeft = 10;
            this.dinoY = canvasRef.current.height - 450;
            this.dinoYBase = canvasRef.current.height - 450;
            this.dinoMaxHeight = canvasRef.current.height * 0.5;
            this.cablibrationMode = true;
            this.pause = false;

            this.bodyPositions = {
                count: 0,
                leftShoulder: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
                rightShoulder: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
                leftHip: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
                rightHip: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
                leftKnee: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
                rightKnee: {
                    sum: 0,
                    count: 0,
                    avg: 0,
                },
            };

            // pipe coordinates
            this.obstacles = [];
        }
    }

    const calibrationDraw = (ctx, keypoints) => {
        const x = window.innerWidth;
        const y = window.innerHeight;
        // fill background with grey

        // draw video
        ctx.drawImage(webcamRef.current.video, 0, 0, x, y);

        let numValid = 0;
        // left hip
        if (
            drawPosition(6 * (x / 11), 2 * (y / 3), ctx, 'leftHip', keypoints)
        ) {
            numValid++;
        }

        // right hip
        if (
            drawPosition(5 * (x / 11), 2 * (y / 3), ctx, 'rightHip', keypoints)
        ) {
            numValid++;
        }

        // left shoulder
        if (drawPosition(4 * (x / 7), y / 3, ctx, 'leftShoulder', keypoints)) {
            numValid++;
        }

        // right shoulder
        if (drawPosition(3 * (x / 7), y / 3, ctx, 'rightShoulder', keypoints)) {
            numValid++;
        }

        return numValid === 4;
    };

    const draw = (ctx) => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        if (!pose || !game) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, game.cvs.width, game.cvs.height);
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

        ctx.fillStyle = '#000000';

        game.tick += 1;

        game.bird = bird.current;
        game.bg = bg.current;
        game.dino = dino.current;
        game.cactus = cactus.current;
        game.crouchdino = crouchdino.current;

        const cvWidth = canvasRef.current.width;
        const cvHeight = canvasRef.current.height;

        const cactusHeight = cvHeight * 0.12;
        // const cactusWidth = (cactusHeight * 309) / 533;
        const cactusWidth = cactusHeight;

        const birdHeight = cvHeight * 0.15;
        const birdWidth = birdHeight * 1.75;

        const dinoHeight = 200;
        const dinoWidth = 200;

        const crouchingDinoWidth = 400;
        const crouchingDinoHeight = crouchingDinoWidth * (65 / 134);

        drawPoint(ctx, game.bodyPositions.leftHip.avg, 20, 5, 'red');

        if (game.tick > 40 && game.bodyPositions.count < 100) {
            updatePositions(pose, game.bodyPositions);
        }

        // check collisions
        let collision = false;

        let dinoTop = game.dinoY;
        if (game.dinoState === 'crouching') {
            dinoTop += dinoHeight - crouchingDinoHeight;
        }
        const dinoBottom = game.dinoY + dinoHeight;
        const dinoX = dinoWidth;
        for (let i = 0; i < game.obstacles.length; i++) {
            let obstacle = game.obstacles[i];

            if (obstacle.type === 'cactus') {
                const front = obstacle.x;
                const back = obstacle.x + cactusWidth;
                const top = obstacle.y;
                const bottom = obstacle.y + cactusHeight;

                if (front < dinoX && back > dinoX && dinoBottom > top) {
                    collision = true;
                }
            } else {
                const front = obstacle.x;
                const back = obstacle.x + birdWidth;
                const top = obstacle.y;
                const bottom = obstacle.y + birdHeight;

                if (front < dinoX && back > dinoX && dinoTop < bottom) {
                    collision = true;
                }
            }
        }

        if (collision) {
            game.over = true;
            setNav(true);
        }

        game.dinoYBase = canvasRef.current.height - 450;

        const jumping = isInAir(
            pose,
            game.bodyPositions,
            webcamRef.current.video.height
        );
        const crouching = isCrouching(
            pose,
            game.bodyPositions,
            webcamRef.current.video.height
        );

        if (game.dinoState === 'jumping') {
            console.log('jumping actions');
            game.upwards += 0.8;
        } else if (jumping) {
            game.upwards = -28;
            game.dinoState = 'jumping';
        } else if (game.dinoState === 'crouching') {
            if (crouching) {
                game.crouchLeft = 10;
            } else {
                if (game.crouchLeft > 0) {
                    game.crouchLeft -= 1;
                } else {
                    game.dinoState = 'ground';
                }
            }
        } else if (crouching) {
            console.log('crouching');
            game.dinoState = 'crouching';
        }

        ctx.drawImage(game.bg, 0, 0, window.innerWidth, window.innerHeight);

        let max_x = 0;
        for (let i = game.obstacles.length - 1; i >= 0; i--) {
            if (game.obstacles[i].type === 'cactus') {
                ctx.drawImage(
                    game.cactus,
                    game.obstacles[i].x,
                    game.obstacles[i].y,
                    cactusHeight,
                    cactusWidth
                );
            } else {
                ctx.drawImage(
                    game.bird,
                    game.obstacles[i].x,
                    game.obstacles[i].y,
                    birdWidth,
                    birdHeight
                );
            }

            if (game.obstacles[i].x > max_x) {
                max_x = game.obstacles[i].x;
            }

            game.obstacles[i].x -= game.speed;

            if (
                game.obstacles[i].x >= 0 &&
                game.obstacles[i].x < game.speed - 1
            ) {
                game.score += 1;
                playScore();
            }

            if (game.obstacles[i].x < -30) {
                game.obstacles.splice(i, 1);
            }
        }

        if (max_x < 200 && game.tick > 140) {
            if (Math.random() < 0.1) {
                const obsType = Math.random() < 0.7 ? 'cactus' : 'bird';
                game.obstacles.push({
                    x: cvWidth,
                    y:
                        obsType === 'cactus'
                            ? cvHeight - cactusHeight - 40
                            : cvHeight * 0.6,
                    type: obsType,
                });
            }
        }

        if (game.bodyPositions.count < 100) {
            game.dinoY = canvasRef.current.height - dinoHeight - 50;
        } else {
            const newDinoHeight = game.dinoY + game.upwards;
            if (newDinoHeight > game.dinoYBase) {
                game.dinoY = game.dinoYBase;
                game.upwards = 0;
                game.dinoState = 'ground';
            } else {
                game.dinoY = newDinoHeight;
            }
        }

        if (game.dinoState === 'crouching') {
            ctx.drawImage(
                crouchdino.current,
                game.bX,
                game.dinoY + (dinoHeight - crouchingDinoHeight),
                crouchingDinoWidth,
                crouchingDinoHeight
            );
        } else {
            ctx.drawImage(
                dino.current,
                game.bX,
                game.dinoY,
                dinoHeight,
                dinoWidth
            );
        }

        ctx.fillStyle = '#000';
        ctx.font = '20px Verdana';
        ctx.fillText('Score : ' + game.score, 10, game.cvs.height - 20);
    };

    const calibrationRender = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (calibrationDraw(context, canvasRef.current.pose.keypoints)) {
            setCalibration(false);
            console.log('done');
            return;
        }
        drawKeypoints(canvasRef.current.pose.keypoints, 0.6, context);
        requestAnimationFrame(calibrationRender);
    };

    const render = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        draw(context);
        requestAnimationFrame(render);
    };

    useEffect(() => {
        canvasRef.current.game = new Game();
        render();
    }, []);

    // When pose updates
    useEffect(() => {
        canvasRef.current.pose = pose;
        if (calibration) {
            calibrationRender();
        } else {
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
                src="assets/dinobird2.png"
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
                ref={cactus}
                src="assets/cactus.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <img
                ref={dino}
                src="assets/unnamed-removebg-preview.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
            <img
                ref={crouchdino}
                src="assets/crouchdino.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
        </>
    );
};

export default Dino;
