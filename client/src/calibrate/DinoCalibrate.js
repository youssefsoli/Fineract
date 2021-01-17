import { useEffect, useRef, useState } from 'react';
import { drawKeypoints } from './utilities';
// TODO: make (is in pushup position) function

const drawPosition = (x, y, xCoor, yCoor, ctx, color) => {
    // Radii of the white glow.
    let innerRadius = 5,
        outerRadius = 70,
        // Radius of the entire circle.
        radius = 60;
    let grd = ctx.createRadialGradient(
        xCoor,
        yCoor,
        innerRadius,
        xCoor,
        yCoor,
        outerRadius
    );
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(xCoor, yCoor, radius, 0, 2 * Math.PI);
    ctx.fill();
};

const DinoCalibrate = ({ pose, canvasRef, webcamRef, ...props }) => {
    const draw = (ctx) => {
        const x = window.innerWidth;
        const y = window.innerHeight;
        // fill background with grey

        // draw video
        ctx.drawImage(webcamRef.current.video, 0, 0, x, y);

        // left hip
        drawPosition(x, y, 5 * (x / 11), 2 * (y / 3), ctx, '#a0ff2b');

        // right hip
        drawPosition(x, y, 6 * (x / 11), 2 * (y / 3), ctx, '#a0ff2b');

        // left shoulder
        drawPosition(x, y, 3 * (x / 7), y / 3, ctx, '#a0ff2b');

        // right shoulder
        drawPosition(x, y, 4 * (x / 7), y / 3, ctx, '#a0ff2b');
    };

    const render = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        draw(context);
        drawKeypoints(canvasRef.current.pose.keypoints, 0.6, context);
        requestAnimationFrame(render);
    };

    // useEffect(() => {
    //     render();
    // }, []);

    // When pose updates
    useEffect(() => {
        canvasRef.current.pose = pose;
        render();
    }, [pose]);

    return <></>;
};

export default DinoCalibrate;
