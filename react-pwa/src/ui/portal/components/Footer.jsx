import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-info">
                <h3>Mahardika</h3>
                <p>
                  123 Example Street<br />
                  City, State 12345<br />
                  Country <br /><br />
                  <strong>Phone:</strong> +1 234 567 8900<br />
                  <strong>Email:</strong> info@example.com<br />
                </p>
                <div className="social-links mt-3">
                  <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li><i className="bx bx-chevron-right"></i> <Link to="/portal">Home</Link></li>
                <li><i className="bx bx-chevron-right"></i> <Link to="/portal#about">About us</Link></li>
                <li><i className="bx bx-chevron-right"></i> <Link to="/portal#services">Services</Link></li>
                <li><i className="bx bx-chevron-right"></i> <Link to="/portal#doctors">Doctors</Link></li>
                <li><i className="bx bx-chevron-right"></i> <Link to="/portal#contact">Contact</Link></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li><i className="bx bx-chevron-right"></i> <a href="#">Medical Checkup</a></li>
                <li><i className="bx bx-chevron-right"></i> <a href="#">Dental Care</a></li>
                <li><i className="bx bx-chevron-right"></i> <a href="#">Cardiology</a></li>
                <li><i className="bx bx-chevron-right"></i> <a href="#">Diagnosis</a></li>
                <li><i className="bx bx-chevron-right"></i> <a href="#">Ambulance Service</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 footer-newsletter">
              <h4>Our Newsletter</h4>
              <p>Subscribe to our newsletter to receive updates on our latest services and health tips.</p>
              <form action="" method="post">
                <input type="email" name="email" placeholder="Your Email" />
                <input type="submit" value="Subscribe" />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
          &copy; Copyright <strong><span>Mahardika</span></strong>. All Rights Reserved
        </div>
        <div className="credits">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </div>
    </footer>
  );
}
