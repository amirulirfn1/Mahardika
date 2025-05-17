import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box, CircularProgress } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Import components
import Topbar from '../components/Topbar';
import { Header } from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyUsSection from '../components/WhyUsSection';
import CountsSection from '../components/CountsSection';
import ServicesSection from '../components/ServicesSection';
import DepartmentsSection from '../components/DepartmentsSection';
import DoctorsSection from '../components/DoctorsSection';
import AppointmentSection from '../components/AppointmentSection';
import GallerySection from '../components/GallerySection';
import { Footer } from '../components/Footer';

// Import CSS for the Medilab template
import '../../../assets/portal/css/style.css';

const PortalHome = () => {
  useEffect(() => {
    // Initialize AOS animation
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Preload images for better user experience
    const preloadImages = () => {
      const imageUrls = [
        'https://bootstrapmade.com/demo/templates/Medilab/assets/img/hero-img.png',
        'https://bootstrapmade.com/demo/templates/Medilab/assets/img/departments-1.jpg',
        'https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-1.jpg',
        'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-1.jpg'
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    preloadImages();

    // Scroll to section if URL has hash
    if (window.location.hash) {
      const elem = document.querySelector(window.location.hash);
      if (elem) {
        setTimeout(() => {
          window.scrollTo({
            top: elem.offsetTop - 60,
            behavior: 'smooth'
          });
        }, 100);
      }
    }

    // Cleanup
    return () => {
      // Any cleanup needed
    };
  }, []);

  // Lazy loading state
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f1f7fd"
      >
        <CircularProgress sx={{ color: '#1977cc' }} />
      </Box>
    );
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Mahardika Healthcare - Your Health Partner</title>
          <meta name="description" content="Mahardika Healthcare provides comprehensive medical services with state-of-the-art facilities and expert professionals." />
          <link rel="icon" href="/favicon.ico" />
          {/* Additional meta tags for SEO */}
          <meta property="og:title" content="Mahardika Healthcare - Your Health Partner" />
          <meta property="og:description" content="Quality healthcare services with compassion and excellence." />
          <meta property="og:type" content="website" />
          {/* Additional Bootstrap icons */}
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
        </Helmet>

        <div id="portal-homepage" className="index-page">
        <Topbar />
        <Header />
        
        <main id="main">
          <HeroSection />
          <WhyUsSection />
          <CountsSection />
          <ServicesSection />
          <AppointmentSection />
          <DepartmentsSection />
          <DoctorsSection />
          <GallerySection />
          
          {/* Frequently Asked Questions Section */}
          <section id="faq" className="faq section-bg">
            <div className="container">
              <div className="section-title">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about our services, appointment scheduling, insurance coverage, and more.</p>
              </div>

              <div className="faq-list">
                <ul>
                  <li data-aos="fade-up">
                    <i className="bi bi-question-circle icon-help"></i>
                    <a data-bs-toggle="collapse" className="collapse" data-bs-target="#faq-list-1">How do I schedule an appointment?<i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></a>
                    <div id="faq-list-1" className="collapse show" data-bs-parent=".faq-list">
                      <p>
                        You can schedule an appointment by using our online appointment form, calling our reception desk, or visiting our facility in person. For urgent cases, we recommend calling directly.
                      </p>
                    </div>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="100">
                    <i className="bi bi-question-circle icon-help"></i>
                    <a data-bs-toggle="collapse" data-bs-target="#faq-list-2" className="collapsed">What insurance plans do you accept?<i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></a>
                    <div id="faq-list-2" className="collapse" data-bs-parent=".faq-list">
                      <p>
                        We accept most major insurance plans. Please contact our billing department or check our insurance page for a detailed list of accepted providers.
                      </p>
                    </div>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="200">
                    <i className="bi bi-question-circle icon-help"></i>
                    <a data-bs-toggle="collapse" data-bs-target="#faq-list-3" className="collapsed">Do I need a referral to see a specialist?<i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></a>
                    <div id="faq-list-3" className="collapse" data-bs-parent=".faq-list">
                      <p>
                        Some specialists require a referral from your primary care physician, while others may not. This often depends on your insurance plan. We recommend checking with your insurance provider or calling our office for specific information.
                      </p>
                    </div>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="300">
                    <i className="bi bi-question-circle icon-help"></i>
                    <a data-bs-toggle="collapse" data-bs-target="#faq-list-4" className="collapsed">What should I bring to my first appointment?<i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></a>
                    <div id="faq-list-4" className="collapse" data-bs-parent=".faq-list">
                      <p>
                        Please bring your ID, insurance card, a list of current medications, your medical history, and any previous test results or medical records relevant to your visit.
                      </p>
                    </div>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="400">
                    <i className="bi bi-question-circle icon-help"></i>
                    <a data-bs-toggle="collapse" data-bs-target="#faq-list-5" className="collapsed">What are your operating hours?<i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></a>
                    <div id="faq-list-5" className="collapse" data-bs-parent=".faq-list">
                      <p>
                        Our regular operating hours are Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 1:00 PM. The emergency department is open 24/7.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact">
            <div className="container">
              <div className="section-title">
                <h2>Contact</h2>
                <p>If you have any questions or need further information about our services, please don't hesitate to contact us using the information below.</p>
              </div>
            </div>

            <div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2904146382076!2d106.82516371527073!3d-6.226259562739298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e4a4c31fb1%3A0x99c8e5677799dda!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1623140342941!5m2!1sen!2sus" 
                style={{ border: 0, width: '100%', height: '350px' }} 
                allowFullScreen 
                loading="lazy"
                title="Mahardika Location Map"
              />
            </div>

            <div className="container">
              <div className="row mt-5">
                <div className="col-lg-4">
                  <div className="info">
                    <div className="address">
                      <i className="bi bi-geo-alt"></i>
                      <h4>Location:</h4>
                      <p>Jl. Sudirman No.123, Jakarta 12930, Indonesia</p>
                    </div>

                    <div className="email">
                      <i className="bi bi-envelope"></i>
                      <h4>Email:</h4>
                      <p>info@mahardika-healthcare.com</p>
                    </div>

                    <div className="phone">
                      <i className="bi bi-phone"></i>
                      <h4>Call:</h4>
                      <p>+62 21 1234 5678</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 mt-5 mt-lg-0">
                  <form action="#" method="post" role="form" className="php-email-form">
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                      </div>
                      <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                    </div>
                    <div className="form-group mt-3">
                      <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                    </div>
                    <div className="my-3">
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">Your message has been sent. Thank you!</div>
                    </div>
                    <div className="text-center"><button type="submit">Send Message</button></div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />

        {/* Back to top button */}
        <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
          <i className="bi bi-arrow-up-short"></i>
        </a>
        </div>
      </HelmetProvider>
    </>
  );
};

export default PortalHome;
