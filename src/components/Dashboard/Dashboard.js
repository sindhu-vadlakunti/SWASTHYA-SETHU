import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { 
  Card, CardContent, Typography, Button, Box, Divider, Grid, Avatar,
  Paper, Container, IconButton, Chip, Tooltip, Stack, LinearProgress
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { keyframes } from '@mui/system';

const healthTips = [
  'Stay hydrated and drink plenty of water every day.',
  'Regular exercise boosts your immune system and mood.',
  'Eat a balanced diet rich in fruits and vegetables.',
  'Wash your hands frequently to prevent illness.',
  'Get enough sleep for better health and productivity.',
  'Take breaks and manage stress for mental well-being.',
  'Regular health check-ups can detect issues early.',
  'Maintain good posture to prevent back and neck pain.'
];

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const doctorList = [
  { name: 'Dr. Aditi Sharma', specialty: 'Cardiologist' },
  { name: 'Dr. Ravi Kumar', specialty: 'Neurologist' },
  { name: 'Dr. Priya Patel', specialty: 'Pediatrician' },
  { name: 'Dr. Sanjay Singh', specialty: 'Orthopedic Surgeon' },
  { name: 'Dr. Meera Nair', specialty: 'Gynecologist' },
  { name: 'Dr. Anil Gupta', specialty: 'Dermatologist' },
  { name: 'Dr. Sunita Rao', specialty: 'Oncologist' },
  { name: 'Dr. Vikram Desai', specialty: 'ENT Specialist' },
  { name: 'Dr. Ritu Kapoor', specialty: 'Psychiatrist' },
  { name: 'Dr. Ajay Verma', specialty: 'General Physician' },
  { name: 'Dr. Neha Joshi', specialty: 'Endocrinologist' },
  { name: 'Dr. Manish Sethi', specialty: 'Urologist' },
];

const Dashboard = () => {
  const [openContact, setOpenContact] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = React.useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Stats - would normally come from API
  const stats = [
    { label: 'Appointments', value: 28, icon: <EventAvailableIcon fontSize="large" />, color: '#bbdefb' },
    { label: 'Doctors', value: 12, icon: <MedicalServicesIcon fontSize="large" />, color: '#e1bee7' },
    { label: 'Departments', value: 8, icon: <HealthAndSafetyIcon fontSize="large" />, color: '#c8e6c9' },
    { label: 'Patients', value: 1024, icon: <HealingIcon fontSize="large" />, color: '#ffcdd2' }
  ];
  
  const [tipIndex, setTipIndex] = React.useState(0);
  const [openDoctors, setOpenDoctors] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf5 100%)',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Header/Profile Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 4,
            background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
            color: 'white'
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    mr: 3
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon fontSize="large" />}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {getGreeting()}, {user?.name || 'User'}!
                  </Typography>
                  <Typography variant="subtitle1">
                    Welcome to your healthcare management dashboard
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ 
                  py: 1.5, 
                  px: 3, 
                  borderRadius: 3,
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: '100%',
                  background: `linear-gradient(135deg, white 0%, ${stat.color} 100%)`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                  {stat.icon}
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {stat.value.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Divider sx={{ my: 6 }} />
        <Typography variant="h5" align="center" fontWeight={500} color="text.secondary" sx={{ mb: 4 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>

          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <EventAvailableIcon />
                  </Avatar>
                  <Typography variant="h6">
                    Book Appointment
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Schedule a new appointment with our specialists
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/appointment')}
                  sx={{ borderRadius: 2 }}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Typography variant="h6">
                    Update Profile
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manage your personal information and preferences
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/update-profile')}
                  sx={{ borderRadius: 2 }}
                >
                  Update
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <MedicalServicesIcon />
                  </Avatar>
                  <Typography variant="h6">
                    View Doctors
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Browse our list of qualified healthcare professionals
                </Typography>
                <Button 
                  variant="contained" 
                  color="success" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => setOpenDoctors(true)}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <SupportAgentIcon />
                  </Avatar>
                  <Typography variant="h6">
                    Contact Support
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get help with appointments, billing, or general inquiries
                </Typography>
                <Button 
                  variant="contained" 
                  color="warning" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => setOpenContact(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Contact
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Health Tips */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Health Tip of the Day
            </Typography>
          </Box>
          <Typography variant="h6" fontStyle="italic" color="text.secondary">
            "{healthTips[tipIndex]}"
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(tipIndex / (healthTips.length - 1)) * 100} 
            sx={{ mt: 2, height: 6, borderRadius: 3 }} 
          />
        </Paper>
      {/* Contact Modal */}
      <Dialog open={openContact} onClose={() => { setOpenContact(false); setContactSubmitted(false); }} maxWidth="xs" fullWidth>
        <DialogTitle>Contact Support</DialogTitle>
        <DialogContent dividers>
          {contactSubmitted ? (
            <Box textAlign="center" py={3}>
              <Typography variant="h6" gutterBottom>Thank you for reaching out!</Typography>
              <Typography variant="body1">Our support team will get back to you soon.</Typography>
            </Box>
          ) : (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Name"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                type="email"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Message"
                multiline
                minRows={3}
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {contactSubmitted ? (
            <Button onClick={() => { setOpenContact(false); setContactSubmitted(false); }} color="primary" variant="contained">Close</Button>
          ) : (
            <>
              <Button onClick={() => setOpenContact(false)} color="secondary">Cancel</Button>
              <Button
                onClick={() => setContactSubmitted(true)}
                color="primary"
                variant="contained"
                disabled={!contactForm.name || !contactForm.email || !contactForm.message}
              >
                Send
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Doctors Modal */}
      <Dialog open={openDoctors} onClose={() => setOpenDoctors(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          All Doctors
          <IconButton
            aria-label="close"
            onClick={() => setOpenDoctors(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {doctorList.map((doc, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{doc.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{doc.specialty}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDoctors(false)} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;