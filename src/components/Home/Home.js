import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Link, 
  IconButton,
  Button
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MemoryIcon from '@mui/icons-material/Memory';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SpeedIcon from '@mui/icons-material/Speed';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './HomeStyles.css';

const AnimatedFeatureCard = ({ feature, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1,    // Trigger when 10% of the card is visible
  });

  return (
    <Grid item xs={12} sm={6} md={6} ref={ref}>
      <Paper
        elevation={3}
        className={`feature-card ${inView ? 'is-visible' : ''}`}
        sx={{
          height: '100%',
          transitionDelay: `${index * 150}ms`,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={feature.image}
          alt={feature.title}
        />
        <CardContent sx={{ p: 3 }}>
          {feature.icon}
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
            {feature.title}
          </Typography>
          <Typography color="text.secondary">
            {feature.description}
          </Typography>
        </CardContent>
      </Paper>
    </Grid>
  );
};

const Home = () => {

  const healthTips = [
    {
      title: 'Daily Exercise',
      description: '30 minutes of daily exercise can significantly improve your heart health and boost immunity.',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: '🏃‍♂️',
      category: 'Fitness'
    },
    {
      title: 'Balanced Diet',
      description: 'A balanced diet with fruits, vegetables, and whole grains provides essential nutrients for optimal health.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: '🥗',
      category: 'Nutrition'
    },
    {
      title: 'Adequate Sleep',
      description: '7-9 hours of quality sleep each night helps with memory, mood, and overall health.',
      image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: '😴',
      category: 'Wellness'
    }
  ];

  const healthTipsSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out',
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const features = [
    {
      icon: <MemoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered OP Slip Generation',
      description: 'Automatically generate OP slips in seconds, minimizing wait time and manual errors.',
      image: 'https://img.freepik.com/free-vector/robotic-process-automation-concept-illustration_114360-9413.jpg',
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-Time Doctor Availability',
      description: 'View doctor schedules and availability before visiting the hospital.',
      image: 'https://img.freepik.com/free-vector/online-doctor-appointment-concept_23-2148514435.jpg',
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'SMS & Email Reminders',
      description: 'Get automated reminders via SMS and email for upcoming appointments.',
      image: 'https://img.freepik.com/free-vector/appointment-booking-mobile_23-2148559952.jpg',
    },
    {
      icon: <PrintIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Printable OP Slips',
      description: 'Download and print your OP slip with one click—simple and ready to present.',
      image: 'https://img.freepik.com/free-vector/printer-printing-paper-concept-illustration_114360-3613.jpg',
    },
  ];

  const whyChooseUsSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      quote: 'The AI-powered system made my visit incredibly fast and efficient. I was in and out in record time!',
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote: 'Booking an appointment and getting reminders was seamless. The best hospital experience I’ve ever had.',
      name: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      quote: 'Accessing my lab reports online was so convenient. The platform is user-friendly and secure.',
      name: 'Samuel Green',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  const testimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const specialists = [
    {
      name: 'Dr. Evelyn Reed',
      specialty: 'Cardiologist',
      image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
    },
    {
      name: 'Dr. Marcus Chen',
      specialty: 'Neurologist',
      image: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg',
    },
    {
      name: 'Dr. Sofia Ramirez',
      specialty: 'Pediatrician',
      image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
    },
    {
      name: 'Dr. Ben Carter',
      specialty: 'Orthopedic Surgeon',
      image: 'https://img.freepik.com/free-photo/doctor-smiling-with-stethoscope_1154-36.jpg',
    },
  ];

  return (
    <Box className="home-container">
      {/* Hero Section */}
      <Box className="hero-section">
        {/* Floating Elements */}
        <Box className="floating-element"></Box>
        <Box className="floating-element"></Box>
        
        <Box className="hero-overlay"></Box>
        <Container maxWidth="lg" className="hero-content">
          <Typography variant="h1" component="h1" gutterBottom>
            Your Health, Our Priority
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Experience world-class healthcare with our expert medical professionals and state-of-the-art facilities.
            Your journey to better health starts here.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              className="cta-button"
              size="large"
              href="/appointment"
            >
              Book Appointment Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                } 
              }}
              href="#services"
            >
              Our Services
            </Button>
          </Box>
          
          {/* Stats Counter */}
          <Box className="hero-stats" sx={{ mt: 8 }}>
            <Box className="stat-item">
              <Typography variant="h3" className="stat-number">100+</Typography>
              <Typography variant="subtitle1" className="stat-label">Expert Doctors</Typography>
            </Box>
            <Box className="stat-item">
              <Typography variant="h3" className="stat-number">50+</Typography>
              <Typography variant="subtitle1" className="stat-label">Specialties</Typography>
            </Box>
            <Box className="stat-item">
              <Typography variant="h3" className="stat-number">24/7</Typography>
              <Typography variant="subtitle1" className="stat-label">Emergency Care</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Health Tips Section */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ 
              fontWeight: 700, 
              color: '#0d47a1',
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, #1976d2, #0d47a1)',
                borderRadius: 2,
              }
            }}>
              Health & Wellness Tips
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Discover simple yet effective ways to improve your health and wellbeing
            </Typography>
          </Box>
          
          <Slider {...healthTipsSettings}>
            {healthTips.map((tip, index) => (
              <Box key={index} sx={{ px: 2, height: '100%' }}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <Box 
                      component="img"
                      src={tip.image}
                      alt={tip.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      {tip.icon}
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline" color="primary" sx={{ 
                      fontWeight: 600, 
                      letterSpacing: 1,
                      display: 'block',
                      mb: 1
                    }}>
                      {tip.category}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: '#0d47a1'
                    }}>
                      {tip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tip.description}
                    </Typography>
                    <Button 
                      size="small" 
                      color="primary"
                      endIcon={<span>→</span>}
                      sx={{ 
                        mt: 1,
                        px: 0,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Read more
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>



      {/* Why Choose Us Section */}
      <Box className="why-choose-us-section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              className="gradient-text"
              sx={{ fontWeight: 800, mb: 3 }}
            >
              Why Choose Our Healthcare?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.8 }}>
              Experience exceptional healthcare with our commitment to excellence, innovation, and patient care
            </Typography>
          </Box>
          
          <Slider {...whyChooseUsSliderSettings}>
            <Box sx={{ px: 2 }}>
              <Card className="why-choose-card interactive-hover" sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Advanced Medical Technology"
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <VerifiedUserIcon className="why-choose-icon" color="primary" sx={{ fontSize: 50, mb: 2 }} />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2, color: '#0d47a1' }}>
                    Advanced Technology
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                    State-of-the-art medical equipment and cutting-edge technology for accurate diagnosis and treatment.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ px: 2 }}>
              <Card className="why-choose-card interactive-hover" sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image="https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Expert Medical Team"
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <FavoriteIcon className="why-choose-icon" color="primary" sx={{ fontSize: 50, mb: 2 }} />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2, color: '#0d47a1' }}>
                    Expert Medical Team
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Highly qualified doctors and medical professionals dedicated to providing exceptional patient care.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ px: 2 }}>
              <Card className="why-choose-card interactive-hover" sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image="https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="24/7 Emergency Care"
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <SpeedIcon className="why-choose-icon" color="primary" sx={{ fontSize: 50, mb: 2 }} />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2, color: '#0d47a1' }}>
                    24/7 Emergency Care
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Round-the-clock emergency services with rapid response times for critical medical situations.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Slider>
        </Container>
      </Box>

      {/* Patient Testimonials Section */}
      <Box className="testimonials-section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Patient Success Stories
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 1px 5px rgba(0,0,0,0.2)'
              }}
            >
              Real experiences from our valued patients who trust us with their health
            </Typography>
          </Box>
          
          <Slider {...testimonialSliderSettings}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <Card className="testimonial-card interactive-hover" sx={{ p: 5, textAlign: 'center', height: '100%', position: 'relative' }}>
                  <Box sx={{ mb: 4 }}>
                    <FormatQuoteIcon 
                      sx={{ 
                        fontSize: 60, 
                        color: '#1976d2', 
                        opacity: 0.2,
                        position: 'absolute',
                        top: 20,
                        left: 20
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      color: '#333',
                      fontSize: '1.2rem',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
                    <CardMedia
                      component="img"
                      className="testimonial-avatar"
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        mr: 3,
                        objectFit: 'cover'
                      }}
                      image={testimonial.image}
                      alt={testimonial.name}
                    />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#0d47a1' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verified Patient
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3,
                    '& svg': {
                      color: '#ffd700',
                      fontSize: 20
                    }
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>

      {/* Meet Our Specialists Section */}
      <Box className="specialists-section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Meet Our Expert Specialists
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 1px 5px rgba(0,0,0,0.2)'
              }}
            >
              Our team of highly qualified medical professionals dedicated to your health and wellbeing
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: { xs: 4, sm: 6, md: 8 },
            flexWrap: 'wrap'
          }}>
            {specialists.map((specialist, index) => (
              <Box 
                key={index} 
                className="specialist-item interactive-hover"
                sx={{ 
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.05)'
                  }
                }}
              >
                <Box sx={{ mb: 2, position: 'relative' }}>
                  <CardMedia
                    component="img"
                    className="specialist-circle-image"
                    image={specialist.image}
                    alt={specialist.name}
                    sx={{ 
                      width: { xs: 120, sm: 140, md: 160 },
                      height: { xs: 120, sm: 140, md: 160 },
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: '4px solid #1976d2',
                        boxShadow: '0 15px 40px rgba(25, 118, 210, 0.3)'
                      }
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    bgcolor: '#1976d2',
                    borderRadius: '50%',
                    width: 35,
                    height: 35,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 18,
                    border: '3px solid white',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    👨‍⚕️
                  </Box>
                </Box>
                
                <Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 0.5,
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {specialist.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {specialist.specialty}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Enhanced Footer */}
      <Box component="footer" className="footer-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            {/* About Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" className="footer-heading" sx={{ color: 'white', mb: 2, fontWeight: '600' }}>
                <LocalHospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Healthease
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, lineHeight: 1.6 }}>
                Your trusted healthcare partner, providing compassionate and comprehensive medical services with a focus on patient-centered care.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <IconButton href="#" className="social-icon" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', mr: 1, '&:hover': { backgroundColor: 'primary.main' } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton href="#" className="social-icon" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', mr: 1, '&:hover': { backgroundColor: '#1DA1F2' } }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton href="#" className="social-icon" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: '#0077B5' } }}>
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: '600' }}>Quick Links</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                <li><Link href="/" underline="none" className="footer-link">Home</Link></li>
                <li><Link href="/appointment" underline="none" className="footer-link">Appointments</Link></li>
                <li><Link href="#" underline="none" className="footer-link">Services</Link></li>
                <li><Link href="#" underline="none" className="footer-link">Doctors</Link></li>
                <li><Link href="#" underline="none" className="footer-link">About Us</Link></li>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: '600' }}>Contact Us</Typography>
              <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                  <Box component="span" sx={{ mr: 1.5, mt: '2px' }}>📍</Box>
                  <span>123 Wellness Avenue<br />Health City, HC 12345</span>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1.5 }}>📞</Box>
                  <span>+1 (123) 456-7890</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1.5 }}>✉️</Box>
                  <span>info@healthease.com</span>
                </Box>
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={4} md={3}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: '600' }}>Newsletter</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                Subscribe to our newsletter for health tips and updates.
              </Typography>
              <Box component="form" sx={{ display: 'flex', mt: 2 }}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  style={{
                    padding: '10px',
                    border: 'none',
                    borderRadius: '4px 0 0 4px',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ 
                    borderRadius: '0 4px 4px 0',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: { xs: 'center', sm: 'left' } }}>
              © {new Date().getFullYear()} Healthease. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" underline="none" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Privacy Policy</Link>
              <Link href="#" underline="none" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Terms of Service</Link>
              <Link href="#" underline="none" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>Sitemap</Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};



export default Home;