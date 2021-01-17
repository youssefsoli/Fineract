import React from 'react';

const About = () => {
    return (
        <section id="next-level" class="next-level">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-12">
                        <div class="next-block">
                            <img src="images/about-us.png" class="img-fluid" alt="banner" />
                            <div class="animation-circle-inverse left">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                        <div class="level-detail">
                            <h3>Welcome To Fineract</h3>
                            <h1 class="heading-font">
                Let's get you started
                            </h1>
                            <p>
                Choose a Muscle you would like to work on and we'll help you achieve your goal!
                            </p>
                            <p>
                Or Use our app to flex your push up king status to your friends with out live multiplayer!
                            </p>
                            <div class="banner-btn">
                                <a href="#">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

