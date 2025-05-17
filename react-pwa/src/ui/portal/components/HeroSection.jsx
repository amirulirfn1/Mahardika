import React from 'react';

const HeroSection = () => {
  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
            <h1>Better Healthcare For You</h1>
            <h2>We provide comprehensive healthcare services with compassion and excellence</h2>
            <div className="d-flex">
              <a href="#appointment" className="btn-get-started">Make an Appointment</a>
              <a href="https://www.youtube.com/watch?v=jDDaplaOz7Q" className="glightbox btn-watch-video">
                <span>Watch Video</span>
              </a>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
            <img src="https://bootstrapmade.com/demo/templates/Medilab/assets/img/hero-img.png" className="img-fluid" alt="Healthcare Hero" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
