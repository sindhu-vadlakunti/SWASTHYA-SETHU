import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const healthTips = [
    {
      image: 'https://img.freepik.com/free-photo/healthy-vegetables-wooden-table_1150-38014.jpg',
      tip: 'Eat a balanced diet rich in fruits and vegetables'
    },
    {
      image: 'https://img.freepik.com/free-photo/young-woman-doing-fitness-exercises_1303-22440.jpg',
      tip: 'Exercise at least 30 minutes daily'
    },
    {
      image: 'https://img.freepik.com/free-photo/woman-drinking-water-after-training_1303-22421.jpg',
      tip: 'Stay hydrated - drink 8 glasses of water daily'
    },
    {
      image: 'https://img.freepik.com/free-photo/young-woman-sleeping-bed_1303-27050.jpg',
      tip: 'Get 7-9 hours of quality sleep'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => 
        prevIndex === healthTips.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to HealthCare Plus</h1>
          <p>Your trusted partner in healthcare management</p>
          <div className="health-tips-carousel">
            <div className="tip-container">
              <img 
                src={healthTips[currentTipIndex].image} 
                alt="Health Tip" 
                className="tip-image"
              />
              <p className="tip-text">{healthTips[currentTipIndex].tip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/appointment')}
          >
            <div className="feature-image appointment-img"></div>
            <h3>Online Appointments</h3>
            <p>Book appointments with our specialists anytime, anywhere</p>
            <span className="book-now-btn">Book Now →</span>
          </div>
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/records')}
          >
            <div className="feature-image records-img"></div>
            <h3>Digital Records</h3>
            <p>Access your medical history and reports securely</p>
            <span className="book-now-btn">View Records →</span>
          </div>
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/support')}
          >
            <div className="feature-image support-img"></div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock medical assistance and support</p>
            <span className="book-now-btn">Get Help →</span>
          </div>
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/prescriptions')}
          >
            <div className="feature-image prescription-img"></div>
            <h3>Prescription Management</h3>
            <p>Easy access to prescriptions and medication reminders</p>
            <span className="book-now-btn">View Prescriptions →</span>
          </div>
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/lab-tests')}
          >
            <div className="feature-image lab-img"></div>
            <h3>Lab Tests</h3>
            <p>Comprehensive diagnostic tests and quick results</p>
            <span className="book-now-btn">Book Test →</span>
          </div>
          <div 
            className="feature-card clickable"
            onClick={() => navigate('/emergency')}
          >
            <div className="feature-image emergency-img"></div>
            <h3>Emergency Care</h3>
            <p>24/7 emergency medical services and ambulance support</p>
            <span className="book-now-btn">Emergency Contact →</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us-section">
        <div className="why-us-image"></div>
        <div className="why-us-content">
          <h2>Why Choose Us</h2>
          <div className="why-us-grid">
            <div className="why-us-item">
              <div className="why-us-icon doctors-icon"></div>
              <h3>Expert Doctors</h3>
              <p>Access to highly qualified and experienced medical professionals</p>
            </div>
            <div className="why-us-item">
              <div className="why-us-icon tech-icon"></div>
              <h3>Modern Technology</h3>
              <p>State-of-the-art facilities and digital health solutions</p>
            </div>
            <div className="why-us-item">
              <div className="why-us-icon care-icon"></div>
              <h3>Patient-Centric Care</h3>
              <p>Personalized healthcare approach focused on your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-overlay"></div>
        <div className="stats-container">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Patients Served</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Specialist Doctors</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Emergency Care</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Patient Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <h2>Get in Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon emergency-icon"></div>
              <h3>Emergency Contact</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon email-icon"></div>
              <h3>Email</h3>
              <p>contact@healthcareplus.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon location-icon"></div>
              <h3>Location</h3>
              <p>123 Medical Center Drive, Healthcare City</p>
            </div>
          </div>
        </div>
        <div className="contact-image"></div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>HealthCare Plus</h3>
            <p>Your Health, Our Priority</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>About Us</li>
                <li>Services</li>
                <li>Doctors</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Emergency Care</li>
                <li>Online Consultation</li>
                <li>Medical Records</li>
                <li>Pharmacy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 HealthCare Plus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 