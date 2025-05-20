import React from 'react';

const HeroSection = () => {
  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
            <h1>BETTER HEALTHCARE FOR YOU</h1>
            <h2>We provide comprehensive healthcare services with compassion and excellence</h2>
            <div className="d-flex justify-content-center justify-content-lg-start mt-3">
              <a href="#appointment" className="btn-get-started scrollto d-inline-flex align-items-center justify-content-center align-self-center">
                <span>Make an Appointment</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </a>
              <a href="https://www.youtube.com/watch?v=jDDaplaOz7Q" className="glightbox btn-watch-video ms-3 d-inline-flex align-items-center">
                <i className="bi bi-play-circle me-2"></i>
                <span>Watch Video</span>
              </a>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
            <img src="https://bootstrapmade.com/demo/templates/Medilab/assets/img/hero-img.png" className="img-fluid animated" alt="Healthcare Hero" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
