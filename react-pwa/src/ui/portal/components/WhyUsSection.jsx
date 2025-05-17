import React from 'react';
import { FaUserMd, FaHeartbeat, FaClinicMedical } from 'react-icons/fa';

const WhyUsSection = () => {
  return (
    <section id="why-us" className="why-us">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="content">
              <h3>Why Choose Mahardika?</h3>
              <p>
                We are committed to providing high-quality healthcare services with a patient-centered approach.
                Our team of experienced professionals is dedicated to your well-being.
              </p>
            </div>
          </div>
          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="icon-boxes d-flex flex-column justify-content-center">
              <div className="row">
                <div className="col-xl-4 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
                  <div className="icon-box mt-4 mt-xl-0">
                    <FaUserMd className="icon" />
                    <h4>Expert Doctors</h4>
                    <p>Our team consists of highly qualified and experienced medical professionals.</p>
                  </div>
                </div>
                <div className="col-xl-4 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="200">
                  <div className="icon-box mt-4 mt-xl-0">
                    <FaHeartbeat className="icon" />
                    <h4>Advanced Technology</h4>
                    <p>We use the latest medical technology for accurate diagnosis and treatment.</p>
                  </div>
                </div>
                <div className="col-xl-4 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="300">
                  <div className="icon-box mt-4 mt-xl-0">
                    <FaClinicMedical className="icon" />
                    <h4>24/7 Emergency</h4>
                    <p>Round-the-clock emergency services for critical medical situations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
