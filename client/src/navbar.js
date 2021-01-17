import React from 'react';

const Navbar = () => {
    return (
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
                    </ul>
                </nav>
         </div>
        </header>
    )
}

export default Navbar;

