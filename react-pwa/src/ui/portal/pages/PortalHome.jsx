import React, { useEffect } from 'react';

// Import necessary CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// Import CSS
import '../../../../src/assets/portal/css/main.css';
import '../components/PortalComponents.css';

function PortalHome() {
  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    const loadAOS = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    };
    
    loadAOS();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="hero section light-background">
        <img 
          src="/assets/img/hero-bg.jpg" 
          alt="Mahardika Healthcare" 
          data-aos="fade-in" 
          onError={(e) => { e.target.style.display = 'none' }} 
        />
        
        <div className="container position-relative">
          <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
            <h2>WELCOME TO MAHARDIKA</h2>
            <p>Your health and well-being are our top priority</p>
          </div>

          <div className="content row gy-4">
            <div className="col-lg-4 d-flex align-items-stretch">
              <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
                <h3>Why Choose Mahardika?</h3>
                <p>
                  We provide the best healthcare services with experienced doctors and modern facilities.
                  Your health and well-being are our top priority. We are committed to providing compassionate care
                  and excellent medical services to our community.
                </p>
                <div className="text-center">
                  <a href="#about" className="more-btn">
                    <span>Learn More</span> <i className="bi bi-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="d-flex flex-column justify-content-center">
                <div className="row gy-4">
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                      <i className="bi bi-clipboard-pulse"></i>
                      <h4>Professional Doctors</h4>
                      <p>Our team of experienced doctors is here to provide you with the best care.</p>
                    </div>
                  </div>

                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                      <i className="bi bi-hospital"></i>
                      <h4>Modern Facilities</h4>
                      <p>State-of-the-art medical equipment and facilities for accurate diagnosis and treatment.</p>
                    </div>
                  </div>

                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                      <i className="bi bi-people"></i>
                      <h4>Patient Care</h4>
                      <p>Compassionate and personalized care for all our patients.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="container">
          <div className="row gy-4 gx-5">
            <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="200">
              <img 
                src="/assets/img/about.jpg" 
                className="img-fluid" 
                alt="About Mahardika" 
                onError={(e) => { e.target.style.display = 'none' }} 
              />
              <a 
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8" 
                className="glightbox pulsating-play-btn"
                aria-label="Play video about Mahardika"
              ></a>
            </div>

            <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
              <h3>About Us</h3>
              <p>
                Mahardika is a leading healthcare provider dedicated to delivering high-quality medical services to our community. 
                With a team of experienced professionals and state-of-the-art facilities, we are committed to providing 
                compassionate care and excellent medical services to all our patients.
              </p>
              <ul>
                <li>
                  <i className="fas fa-heartbeat"></i>
                  <div>
                    <h5>Our Mission</h5>
                    <p>To provide compassionate, high-quality healthcare services that improve the health of our community.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-eye"></i>
                  <div>
                    <h5>Our Vision</h5>
                    <p>To be the most trusted healthcare provider, recognized for excellence in patient care and medical innovation.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-star"></i>
                  <div>
                    <h5>Our Values</h5>
                    <p>Compassion, Excellence, Integrity, Respect, and Teamwork guide everything we do.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer">
        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong><span>Medilab</span></strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default PortalHome;
