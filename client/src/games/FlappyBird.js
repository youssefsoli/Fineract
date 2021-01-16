import { useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';
import isTouchingShoulder from '../../src/motionDetection';

const FlappyBird = ({ pose, canvasRef, ...props }) => {
    const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const pipeNorth = useRef(null);
    const pipeSouth = useRef(null);

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            // some variables

            this.gap = 85;
            this.constant = 0;

            this.speed = 2;

            this.bX = 10;

            this.score = 0;

            // pipe coordinates

            this.pipe = [];

            this.pipe[0] = {
                x: this.cvs.width,
                y: 0,
            };
        }
    }

    const draw = (ctx) => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        if (!pose || !game) return;
        ctx.fillStyle = '#000000';
        const { x, y } = pose.keypoints[0].position;

        game.bird = bird.current;
        game.bg = bg.current;
        game.pipeNorth = pipeNorth.current;
        game.pipeSouth = pipeSouth.current;

        ctx.drawImage(game.bg, 0, 0);

        for (let i = 0; i < game.pipe.length; i++) {
            game.constant = game.pipeNorth.height + game.gap;
            ctx.drawImage(game.pipeNorth, game.pipe[i].x, game.pipe[i].y);
            ctx.drawImage(
                game.pipeSouth,
                game.pipe[i].x,
                game.pipe[i].y + game.constant
            );

            game.pipe[i].x -= game.speed;

            if (game.pipe[i].x < 0) {
                game.pipe.push({
                    x: game.cvs.width,
                    y:
                        Math.floor(Math.random() * game.pipeNorth.height) -
                        game.pipeNorth.height,
                });
                game.pipe.splice(i, 1);
            }

            // detect collision

            if (
                game.bX + game.bird.width >= game.pipe[i].x &&
                game.bX <= game.pipe[i].x + game.pipeNorth.width &&
                (y <= game.pipe[i].y + game.pipeNorth.height ||
                    y + game.bird.height >= game.pipe[i].y + game.constant)
            ) {
                console.log('fail');
            }

            if (game.pipe[i].x === 4) {
                game.score++;
                playScore();
            }
        }

        //ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.drawImage(bird.current, game.bX, y);

        ctx.fillStyle = '#000';
        ctx.font = '20px Verdana';
        ctx.fillText('Score : ' + game.score, 10, game.cvs.height - 20);
    };

    const render = () => {
        const context = canvasRef.current.getContext('2d');
        draw(context);
        //ctx.drawImage(background, 0, 0);
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
        </>
    );
};

export default FlappyBird;
