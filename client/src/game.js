import React from 'react';
import { Link } from 'react-router-dom';

const Game = props => {
    const { title, description, icon, link } = props;
    return (
        <div class="col-md-4">
            <Link to={link}>
                <div class="about-inner text-center">
                    <i class={icon}></i>
                    <h4 class="heading-font">{title}</h4>
                    <p>{description}</p>
                </div>
            </Link>
        </div>
    );
};

export default Game;
