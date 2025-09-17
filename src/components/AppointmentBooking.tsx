import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  InputAdornment,
  Autocomplete,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocalHospital,
  Event,
  AccessTime,
  Person,
  Phone,
  Email,
  MedicalServices,
  Assignment,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #0396FF 30%, #ABDCFF 90%)',
  color: 'white',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(45deg, #0378CC 30%, #8FB8D9 90%)',
  },
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const steps = ['Personal Details', 'Medical Information', 'Appointment Details'];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  selectedSymptoms: string[];
  daysExperiencing: string;
  appointmentDate: string;
  appointmentTime: string;
  department: string;
  doctor: string;
}

const AppointmentBooking: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    selectedSymptoms: [],
    daysExperiencing: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    doctor: '',
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [error, setError] = useState('');

  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Dermatology',
    'ENT',
    'Ophthalmology',
  ];

  const doctors: { [key: string]: string[] } = {
    'General Medicine': ['Dr. James Miller', 'Dr. Patricia Moore'],
    'Cardiology': ['Dr. John Smith', 'Dr. Sarah Johnson'],
    'Orthopedics': ['Dr. David Wilson', 'Dr. Lisa Anderson'],
    'Pediatrics': ['Dr. Robert Taylor', 'Dr. Maria Garcia'],
    'Neurology': ['Dr. Michael Brown', 'Dr. Emily Davis'],
    'Dermatology': ['Dr. William Lee', 'Dr. Jennifer White'],
    'ENT': ['Dr. Richard Clark', 'Dr. Susan Martinez'],
    'Ophthalmology': ['Dr. Thomas Wright', 'Dr. Laura Thompson'],
  };

  const availableSymptoms = [
    'Fever',
    'Headache',
    'Cough',
    'Fatigue',
    'Shortness of breath',
    'Chest pain',
    'Back pain',
    'Joint pain',
    'Nausea',
    'Dizziness',
    'Sore throat',
    'Runny nose',
    'Muscle aches',
    'Loss of appetite',
    'Rash',
    'Vision problems',
    'Hearing problems',
    'Stomach pain',
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSymptomChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: newValue,
    }));
    setError('');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.dateOfBirth || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          setError('Invalid phone number format (10 digits required)');
          return false;
        }
        break;
      case 1:
        if (!formData.selectedSymptoms.length) {
          setError('Please select at least one symptom');
          return false;
        }
        if (!formData.daysExperiencing) {
          setError('Please enter how long you have been experiencing the symptoms');
          return false;
        }
        break;
      case 2:
        if (!formData.appointmentDate || !formData.appointmentTime || !formData.department || !formData.doctor) {
          setError('Please fill in all appointment details');
          return false;
        }
        if (!validateDate(formData.appointmentDate)) {
          setError('Please select a future date for the appointment');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      address: '',
      selectedSymptoms: [],
      daysExperiencing: '',
      appointmentDate: '',
      appointmentTime: '',
      department: '',
      doctor: '',
    });
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAlert({
        open: true,
        message: 'Appointment booked successfully!',
        severity: 'success',
      });
      resetForm();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error booking appointment. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false,
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ mr: 1 }} />
              Medical Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={availableSymptoms}
                  value={formData.selectedSymptoms}
                  onChange={handleSymptomChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Symptoms"
                      required
                      helperText="Select all symptoms that apply"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        sx={{
                          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                          color: 'white',
                        }}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="How long have you been experiencing these symptoms?"
                  name="daysExperiencing"
                  value={formData.daysExperiencing}
                  onChange={handleChange}
                  required
                  helperText="e.g., 3 days, 1 week, 2 months"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Date"
                name="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Event />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Time"
                name="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <MedicalServices />
                    </InputAdornment>
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  disabled={!formData.department}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalHospital />
                    </InputAdornment>
                  }
                >
                  {formData.department && doctors[formData.department]?.map((doc) => (
                    <MenuItem key={doc} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: '#1a237e',
              fontWeight: 600,
              mb: 4,
            }}
          >
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
            Book Your Appointment
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <StyledButton
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
              endIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
            >
              {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
            </StyledButton>
          </Box>
        </StyledPaper>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AppointmentBooking;