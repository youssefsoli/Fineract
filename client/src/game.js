import React from 'react';

const Game = (props) => {
    const { title, description, icon} = props
    return (
        <div class="col-md-4">
            <div class="about-inner text-center">
                <i class={icon}></i>
                <h4 class="heading-font">{title}</h4>
                <p>{description}
                </p>
            </div>
          </div>
    )
}

export default Game;