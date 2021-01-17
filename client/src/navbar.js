import React from 'react';

const Navbar = () => {
    return (
        // <section className="nav_area">
        // <div className="container">
        // <div className="logo_container">
        //     <a href="index.html"
        //     ><img src="images/logo.png" className="img-fluid" alt="logo" 
        //     /></a>
        // </div>
        // <input type="checkbox" id="toggle" style="display:none;" />
        // </div>
        // </section>
        <header className="nav_area">
            <div className="container">
                <div className="logo_container">
                    <a href="index.html"><img src="images/logo.png" className="img-fluid" alt="logo" /></a>
                </div>
                <label className="toggle-btn toggle-btn__cross" for="toggle">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </label>
                <nav>
                    <ul>
                        <li><a href="#banner">Home</a></li>
                        <li><a href="about-us.html">About us</a></li>
                        <li><a href="our-gallery.html">Our Gallery</a></li>
                        <li><a href="our-instructor.html">our instructor</a></li>
                        <li><a href="404-page.html">404 page</a></li>
                        <li><a href="#contact">Contact us</a></li>
                    </ul>
                </nav>
         </div>
        </header>
    )
}

export default Navbar;

