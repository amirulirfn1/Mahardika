import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import smaller components
import Topbar from '../components/Topbar';
import { Header } from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhyUsSection from '../components/WhyUsSection';
import { Footer } from '../components/Footer';

const PortalHome = () => {
  useEffect(() => {
    // Initialize AOS animation
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="index-page">
      <Topbar />
      <Header />
      
      <main className="main">
        <HeroSection />
        <WhyUsSection />
        
        {/* Other sections will go here */}
      </main>
      
      <Footer />
    </div>
  );
};

export default PortalHome;
