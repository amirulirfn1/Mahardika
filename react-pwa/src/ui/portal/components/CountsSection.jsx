import React, { useEffect } from 'react';
import PureCounter from '@srexi/purecounterjs';

const CountsSection = () => {
  useEffect(() => {
    // Initialize PureCounter
    new PureCounter({
      selector: '.purecounter',
      start: 0,
      end: 100,
      duration: 2,
      delay: 10,
      once: true
    });
  }, []);

  return (
    <section id="counts" className="counts">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="bi bi-emoji-smile"></i>
              <span data-purecounter-start="0" data-purecounter-end="85" data-purecounter-duration="1" className="purecounter"></span>
              <p>Happy Patients</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-md-0">
            <div className="count-box">
              <i className="bi bi-journal-richtext"></i>
              <span data-purecounter-start="0" data-purecounter-end="35" data-purecounter-duration="1" className="purecounter"></span>
              <p>Departments</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-lg-0">
            <div className="count-box">
              <i className="bi bi-headset"></i>
              <span data-purecounter-start="0" data-purecounter-end="24" data-purecounter-duration="1" className="purecounter"></span>
              <p>Hours Of Support</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-lg-0">
            <div className="count-box">
              <i className="bi bi-people"></i>
              <span data-purecounter-start="0" data-purecounter-end="48" data-purecounter-duration="1" className="purecounter"></span>
              <p>Doctors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountsSection;
