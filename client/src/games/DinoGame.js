import { useEffect, useRef } from 'react';

const DinoGame = ({ pose, canvasRef, ...props }) => {
    const draw = (ctx) => {
        const pose = canvasRef.current.pose;
        if(!pose) return;
        console.log(pose);
        ctx.fillStyle = '#000000';
        const {x, y} = pose.keypoints[0].position;
        console.log(ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(x - 100, y - 100, 200, 200);
    };

    const render = () => {
        const context = canvasRef.current.getContext('2d');
        draw(context);
        //ctx.drawImage(background, 0, 0);
        requestAnimationFrame(render);
    }

    useEffect(() => {
        render();
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

export default DinoGame;
