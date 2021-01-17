import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { drawKeypoints } from './utilities';
import keypointIndex from '../keypointIndex';
// TODO: make (is in pushup position) function

const drawPosition = (x, y, xCoor, yCoor, ctx, name, keypoints) => {
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

const DinoCalibrate = ({ pose, canvasRef, webcamRef, ...props }) => {
    const history = useHistory();
    document.addEventListener(
        'dinoCalibrated',
        () => {
            history.push('/flappy');
        },
        false
    );

    const draw = (ctx, keypoints) => {
        const x = window.innerWidth;
        const y = window.innerHeight;
        // fill background with grey

        // draw video
        ctx.drawImage(webcamRef.current.video, 0, 0, x, y);

        let numValid = 0;
        // left hip
        if (
            drawPosition(
                x,
                y,
                6 * (x / 11),
                2 * (y / 3),
                ctx,
                'leftHip',
                keypoints
            )
        ) {
            numValid++;
        }

        // right hip
        if (
            drawPosition(
                x,
                y,
                5 * (x / 11),
                2 * (y / 3),
                ctx,
                'rightHip',
                keypoints
            )
        ) {
            numValid++;
        }

        // left shoulder
        if (
            drawPosition(
                x,
                y,
                4 * (x / 7),
                y / 3,
                ctx,
                'leftShoulder',
                keypoints
            )
        ) {
            numValid++;
        }

        // right shoulder
        if (
            drawPosition(
                x,
                y,
                3 * (x / 7),
                y / 3,
                ctx,
                'rightShoulder',
                keypoints
            )
        ) {
            numValid++;
        }

        return numValid === 4;
    };

    const render = () => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (draw(context, canvasRef.current.pose.keypoints)) {
            const event = new Event('dinoCalibrated');
            document.dispatchEvent(event);
            return;
        }
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
