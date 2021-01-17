import { useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';
import isTouchingShoulder from '../../src/motionDetection';

const FlappyBird = ({ pose, canvasRef, webcamRef, ...props }) => {
    const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const pipeNorth = useRef(null);
    const pipeSouth = useRef(null);

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            // some variables

            this.xScale = window.innerWidth / 500;
            this.yScale = window.innerHeight / 500;

            this.gap = 85 * this.yScale;
            this.constant = 0;

            this.speed = 2 * this.xScale;

            this.bX = 10;
            this.score = 0;
            this.distanceBetweenPipes = 200 * this.xScale;

            // pipe coordinates

            this.pipe = [];

            this.pipe[0] = {
                x: this.cvs.width,
                y: -this.cvs.height / 2,
            };
        }
    }

    const randInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const draw = ctx => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        if (!pose || !game) return;
        const { x, y } = pose.keypoints[0].position;

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
                y: randInt(-game.pipeNorth.height * game.yScale + 300, -300),
            });

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
                game.bX + game.bird.width >= game.pipe[i].x &&
                game.bX <=
                    game.pipe[i].x + game.pipeNorth.width * game.xScale &&
                (y <= game.pipe[i].y + game.pipeNorth.height * game.yScale ||
                    y + game.bird.height >= game.pipe[i].y + game.constant)
            ) {
                canvasRef.current.game = new Game();
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
