import React from 'react';

const ServicesSection = () => {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title">
          <h2>Services</h2>
          <p>Mahardika provides a comprehensive range of medical services with state-of-the-art equipment and highly trained specialists to ensure the best healthcare for our patients.</p>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-heart-pulse"></i></div>
              <h4><a href="">Cardiology</a></h4>
              <p>Comprehensive heart care including diagnostics, treatment, and prevention of cardiovascular diseases</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-lungs"></i></div>
              <h4><a href="">Neurology</a></h4>
              <p>Expert diagnosis and treatment for disorders of the nervous system, brain, spinal cord, and nerves</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-capsule"></i></div>
              <h4><a href="">Pediatrics</a></h4>
              <p>Specialized healthcare for infants, children, and adolescents, focusing on growth and development</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-dpad"></i></div>
              <h4><a href="">Orthopedics</a></h4>
              <p>Treatment of musculoskeletal system including bones, joints, ligaments, tendons, and muscles</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-droplet"></i></div>
              <h4><a href="">Dermatology</a></h4>
              <p>Diagnosis and treatment of skin, hair, and nail conditions through advanced dermatological care</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
            <div className="icon-box">
              <div className="icon"><i className="bi bi-brightness-high"></i></div>
              <h4><a href="">Ophthalmology</a></h4>
              <p>Comprehensive eye care services including diagnostics, treatment, and surgical procedures</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
