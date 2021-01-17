import React from 'react';

const Footer = () => {
    return (
        <footer id="footer" class="footer">
        <div class="container">
            <div class="row">
            <div class="col-md-6 col-12">
                <div class="footer-text">
                <p>© Iyad Okal 2021.</p>
                </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="footer-menu">
                <ul>
                    <li>
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    </li>
                    <li>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    </li>
                    <li>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </li>
                    <li>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    </li>
                    <li>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                    </li>
                </ul>
                </div>
            </div>
            </div>
        </div>
        </footer>
    )
}

export default Footer;