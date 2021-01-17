import { useEffect, useRef } from 'react';
import { isInAir, isCrouching } from '../../src/motionDetection';
import {updatePositions} from '../../src/utils';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';

const Dino = ({ pose, canvasRef, ...props }) => {
    // const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const dino = useRef(null);
    const cactus = useRef(null);

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            document.addEventListener('keypress', (e) => {
                if(canvasRef.current.game.over && e.key === ' ')
                    canvasRef.current.game = new Game();
            }, false);

            // some variables
            this.constant = 0;
            this.over = false;
            this.upwards = 0;
            this.speed = 5;
            this.bX = 10;
            this.score = 0;
            this.dinoState = 'ground';
            this.lastGround = 10;
            this.dinoY = canvasRef.current.height - 450;
            this.dinoYBase = canvasRef.current.height - 450;
            this.dinoMaxHeight = canvasRef.current.height * 0.5;

            this.bodyPositions = {
                count: 0,
                leftShoulder: {
                    sum: 0,
                    count: 0,
                    avg: 0
                },
                rightShoulder: {
                    sum: 0,
                    count: 0,
                    avg: 0
                },
                leftHip: {
                    sum: 0,
                    count: 0,
                    avg: 0
                },
                rightHip: {
                    sum: 0,
                    count: 0,
                    avg: 0
                },
                leftKnee: {
                    sum: 0,
                    count: 0,
                    avg: 0
                },
                rightKnee: {
                    sum: 0,
                    count: 0,
                    avg: 0
                }
            };

            // pipe coordinates
            this.obstacles = [];
        }
    }

    const draw = (ctx) => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        if (!pose || !game) return;
        ctx.fillStyle = '#000000';

        game.bird = bird.current;
        game.bg = bg.current;
        game.dino = dino.current;
        game.cactus = cactus.current;

        const cvWidth = canvasRef.current.width;
        const cvHeight = canvasRef.current.height;

        const cactusHeight = cvHeight * 0.2;
        // const cactusWidth = (cactusHeight * 309) / 533;
        const cactusWidth = cactusHeight;

        const birdHeight = cvHeight * 0.15;
        const birdWidth = birdHeight * 1.75;

        const dinoHeight = 400;
        const dinoWidth = 400;

        const crouchingDinoHeight = 200;
        const crouchingDinoWidth = 200;

        if(game.over) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.font = '60px Verdana';
            ctx.fillText('Score : ' + game.score, game.cvs.width/2, game.cvs.height/2);

            ctx.font = '30px Verdana';
            ctx.fillText('Press Space to restart', game.cvs.width/2, game.cvs.height/2 + 60);
            return;
        }

        if (game.bodyPositions.count < 100) {
            updatePositions(pose, game.bodyPositions);
        }

        // check collisions
        let collision = false;

        const dinoTop = game.dinoY;
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
            // game.over = true
        }

        game.dinoYBase = canvasRef.current.height - 450;

        if (game.dinoState === 'jumping') {
            console.log('jumping actions');
            game.upwards += 2;
        } else if (game.dinoState === 'crouching') {

        } else {
            // if (isInAir(pose, game.bodyPositions, canvasRef.current.height)) {
            //     game.upwards = -50
            //     console.log("taking action")
            //     game.dinoState = 'jumping';
            //     // jump stuff
            // } else
            if (isCrouching(pose, game.bodyPositions, canvasRef.current.height)) {
                console.log('crouching');
            }
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

            // detect collision

            // if( game.bX + game.bird.width >= game.pipe[i].x && game.bX <= game.pipe[i].x + game.pipeNorth.width && (y <= game.pipe[i].y + game.pipeNorth.height || y + game.bird.height >= game.pipe[i].y + game.constant)){
            //     console.log('fail');
            // }

            if (game.obstacles[i].x === 5) {
                game.score++;
                // playScore();
            }

            if (game.obstacles[i].x < 0) {
                game.obstacles.splice(i, 1);
            }
        }

        if (max_x < 200) {
            if (Math.random() < 0.1) {
                const obsType = Math.random() < 0.7 ? 'cactus' : 'bird';
                game.obstacles.push({
                    x: cvWidth,
                    y: obsType === 'cactus'? cvHeight - cactusHeight : cvHeight * 0.6,
                    type: obsType,
                });
            }
        }

        // ctx.drawImage(fg, 0, cvs.height - fg.height);

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
                bird.current,
                game.bX,
                game.dinoY,
                dinoHeight,
                dinoWidth
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

    const render = () => {
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
        </>
    );
};

export default Dino;
