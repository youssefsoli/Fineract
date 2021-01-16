import { useEffect, useRef } from 'react';
import isTouchingShoulder from '../../src/motionDetection';

const FlappyBird = ({ pose, canvasRef, ...props }) => {
    const draw = (ctx, Game) => {
        const pose = canvasRef.current.pose;
        if(!pose) return;
        ctx.fillStyle = '#000000';
        const {x, y} = pose.keypoints[0].position;


        ctx.drawImage(Game.bg,0,0);
        
        for(let i = 0; i < Game.pipe.length; i++){
            
            Game.constant = Game.pipeNorth.height + Game.gap;
            ctx.drawImage(Game.pipeNorth, Game.pipe[i].x, Game.pipe[i].y);
            ctx.drawImage(Game.pipeSouth, Game.pipe[i].x, Game.pipe[i].y + Game.constant);
                 
            Game.pipe[i].x--;
            
            if( Game.pipe[i].x === 125 ){
                Game.pipe.push({
                    x : Game.cvs.width,
                    y : Math.floor(Math.random() * Game.pipeNorth.height) - Game.pipeNorth.height
                }); 
            }
    
            // detect collision
            
            if( Game.bX + Game.bird.width >= Game.pipe[i].x && Game.bX <= Game.pipe[i].x + Game.pipeNorth.width && (y <= Game.pipe[i].y + Game.pipeNorth.height || y + Game.bird.height >= Game.pipe[i].y + Game.constant)){
                console.log('fail');
            }
            
            if(Game.pipe[i].x === 5){
                Game.score++;
                Game.scor.play();
            }
            
            
        }
    
        //ctx.drawImage(fg, 0, cvs.height - fg.height);
        
        ctx.drawImage(Game.bird, Game.bX, y);
        
        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : " + Game.score, 10, Game.cvs.height-20);
    };

    const render = (Game) => {
        const context = canvasRef.current.getContext('2d');
        draw(context, Game);
        //ctx.drawImage(background, 0, 0);
        requestAnimationFrame(render);
    }

    useEffect(() => {
        const Game = function() {
        this.cvs = canvasRef.current;
    
        // load images
        
        this.bird = new Image();
        this.bg = new Image();
        this.pipeNorth = new Image();
        this.pipeSouth = new Image();
        
        this.bird.src = "assets/bird.png";
        this.bg.src = "assets/background.png";
        this.pipeNorth.src = "assets/pipetop.png";
        this.pipeSouth.src = "assets/pipebottom.png";
        
        
        // some variables
        
        this.gap = 85;
        this.constant = 0;
        
        this.bX = 10;
        
        this.score = 0;
    
        this.scor = new Audio();
    
        this.scor.src = "assets/score.mp3";
        
        // pipe coordinates
        
        this.pipe = [];
        
        this.pipe[0] = {
            x : this.cvs.width,
            y : 0
        };
        }
        render(Game());
    }, []);

    // When pose updates
    useEffect(() => {
        canvasRef.current.pose = pose;
    }, [pose]);

    return (
        <>
        </>
    );
};

export default FlappyBird;
