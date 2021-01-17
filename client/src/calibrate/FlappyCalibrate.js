import { useEffect, useRef, useState } from 'react';
// TODO: make is in pushup position function

const FlappyCalibrate = ({ pose, canvasRef, webcamRef, ...props }) => {
    const draw = (ctx) => {
        // fill background with grey

        ctx.drawImage(
            webcamRef.current.video,
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
    };

    const render = () => {
        if (!canvasRef.current) return;
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

        let eventName;
        if (canvasRef.current.game.over && isTouchingRightShoulder(pose)) {
            eventName = 'restart';
        } else if (canvasRef.current.game.over && isTouchingLeftShoulder(pose)) {
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
    }, [pose]);
    
    return (<></>);
};