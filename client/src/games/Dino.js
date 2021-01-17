import { useEffect, useRef } from 'react';
import { isInAir, isCrouching } from '../../src/motionDetection';
import useSound from 'use-sound';
import scoreSfx from './assets/score.mp3';

const Dino = ({ pose, canvasRef, ...props }) => {
    const [playScore] = useSound(scoreSfx);
    const bird = useRef(null);
    const bg = useRef(null);
    const dino = useRef(null);
    const cactus = useRef(null);

    class Game {
        constructor() {
            this.cvs = canvasRef.current;

            // some variables
            this.constant = 0;
            this.speed = 5;
            this.bX = 10;
            this.score = 0;
            this.dinoState = 'ground';

            // pipe coordinates
            this.obstacles = [];
        }
    }

    const draw = (ctx) => {
        const game = canvasRef.current.game;
        const pose = canvasRef.current.pose;
        if (!pose || !game) return;
        ctx.fillStyle = '#000000';

        if (isInAir(pose) && game.dinoState === 'ground') {
            game.dinoState = 'jumping';
            // jump stuff
        }
        if (isCrouching(pose) && game.dinoState === 'ground') {
            game.dinoState = 'crouching';
            // crouch stuff
        }

        game.bird = bird.current;
        game.bg = bg.current;
        game.dino = dino.current;
        game.cactus = cactus.current;

        const cvWidth = canvasRef.current.width;
        const cvHeight = canvasRef.current.height;

        const cactusHeight = cvHeight * 0.2;
        // const cactusWidth = (cactusHeight * 309) / 533;
        const cactusWidth = cactusHeight

        const birdHeight = cvHeight * 0.15;
        const birdWidth = birdHeight * 1.75;

        const dinoHeight = 300;
        const dinoWidth = 300;

        // ctx.drawImage(game.bg, 0, 0);
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
                playScore();
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
                    y: obsType === 'cactus'? cvHeight - cactusHeight : cvHeight * 0.5,
                    type: obsType,
                });
            }
        }

        // ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.drawImage(
            dino.current,
            game.bX,
            cvHeight - dinoHeight,
            dinoHeight,
            dinoWidth
        );

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
                src="assets/purple bird.png"
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
                src="assets/dino.png"
                style={{ display: 'none' }}
                className="hidden"
                alt=""
            />
        </>
    );
};

export default Dino;
