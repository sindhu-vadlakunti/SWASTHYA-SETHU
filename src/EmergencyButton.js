import React, { useState, useRef } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  CircularProgress,
  Alert,
  Box,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from './Auth/AuthContext';
import OPSlip from './OPSlip';
import { useReactToPrint } from 'react-to-print';
import config from '../../config';

const EmergencyButton = ({ onEmergencyBooked }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const { user } = useAuth();
  const opSlipRef = useRef();
  
  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess(false);
    setConfirmed(false);
    setAppointmentDetails(null);
  };

  const handlePrint = useReactToPrint({
    content: () => opSlipRef.current,
    onAfterPrint: handleClose
  });

  const handleClickOpen = () => {
    setOpen(true);
    setError('');
    setSuccess(false);
    setConfirmed(false);
    setAppointmentDetails(null);
  };

  const handleEmergencyBooking = async () => {
    if (!user?.email) {
      setError('Please log in to book an emergency appointment');
      return;
    }

    if (!confirmed) {
      setError('Please confirm that you need an emergency appointment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/appointments/emergency`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: user.name || user.email,
          doctor: 'Emergency Department',
        }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Received an invalid response from the server');
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book emergency appointment');
      }

      if (!data || !data.appointment) {
        throw new Error('Invalid response format from server');
      }

      // Prepare appointment details for OP slip
      const appointment = {
        patientId: user.email,
        appointmentDate: data.appointment?.date || new Date().toISOString().split('T')[0],
        appointmentTime: data.appointment?.time || 'ASAP',
        department: 'Emergency',
        symptoms: ['Emergency Consultation'],
        notes: 'Emergency appointment - Please proceed to the emergency department.',
        appointmentId: data.appointment?.id || `EMG-${Date.now()}`,
        doctor: 'Emergency Department',
        hospitalName: 'City Hospital',
        hospitalAddress: '123 Emergency Lane, Metro City, 123456'
      };
      
      console.log('Appointment details for OP slip:', appointment);

      setAppointmentDetails(appointment);
      setSuccess(true);
      
      if (onEmergencyBooked) {
        onEmergencyBooked(appointment);
      }
      
      // Auto-print the OP slip after a short delay
      setTimeout(() => {
        if (opSlipRef.current) {
          handlePrint();
        }
      }, 500);
    } catch (err) {
      console.error('Error booking emergency appointment:', err);
      setError(err.message || 'Failed to book emergency appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate tomorrow's date for display
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ mt: 3, mb: 4, textAlign: 'center' }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<LocalHospitalIcon />}
        onClick={handleClickOpen}
        sx={{
          padding: '12px 32px',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(211, 47, 47, 0.5)',
          '&:hover': {
            backgroundColor: '#d32f2f',
            boxShadow: '0 6px 25px rgba(211, 47, 47, 0.7)',
          },
          textTransform: 'none',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        BOOK EMERGENCY APPOINTMENT
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth={success ? 'md' : 'sm'} 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: success ? '#e8f5e9' : '#ffebee', 
          borderBottom: '1px solid',
          borderColor: success ? '#c8e6c9' : '#ffcdd2',
          py: 2,
          position: 'relative'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <LocalHospitalIcon 
              color={success ? 'success' : 'error'} 
              fontSize="large" 
              sx={{ 
                bgcolor: 'white',
                borderRadius: '50%',
                p: 0.5,
                boxShadow: 1
              }} 
            />
            <Typography variant="h6" component="div" color={success ? 'success.main' : 'error'}>
              {success ? 'Emergency Appointment Confirmed' : 'Emergency Appointment'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 3 }}>
          {!success ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Important:</strong> This is for medical emergencies only. If this is a life-threatening emergency, please call emergency services immediately.
              </Typography>
              
              <Box sx={{ 
                bgcolor: '#fff8e1', 
                p: 2, 
                borderRadius: 1, 
                borderLeft: '4px solid #ffc107',
                my: 2
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <strong>Next available emergency slot:</strong> {getTomorrowDate()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Department:</strong> Emergency
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Doctor:</strong> Emergency Department
                </Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      color="error"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I confirm this is a medical emergency and I need immediate attention.
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  onClick={handleClose} 
                  color="inherit"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEmergencyBooking}
                  color="error"
                  variant="contained"
                  disabled={!confirmed || loading}
                  startIcon={
                    loading ? <CircularProgress size={20} color="inherit" /> : <LocalHospitalIcon />
                  }
                  sx={{ minWidth: 180 }}
                >
                  {loading ? 'Processing...' : 'Confirm Emergency'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box textAlign="center" mb={3}>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Emergency Appointment Booked Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Your emergency appointment has been scheduled for tomorrow. 
                  Please arrive at least 30 minutes before your scheduled time.
                </Typography>
                <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
                  <strong>Note:</strong> Your OP slip is being prepared. Please keep it with you when visiting the hospital.
                </Alert>
              </Box>
              
              {/* OP Slip Preview */}
              <Box sx={{ 
                border: '1px dashed #bdbdbd', 
                borderRadius: 1, 
                p: 2,
                bgcolor: '#fafafa',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <div ref={opSlipRef} style={{ width: '100%' }}>
                  <OPSlip 
                    patientId={appointmentDetails.patientId}
                    appointmentDate={appointmentDetails.appointmentDate}
                    appointmentTime={appointmentDetails.appointmentTime}
                    department={appointmentDetails.department}
                    symptoms={appointmentDetails.symptoms}
                    notes={appointmentDetails.notes}
                    appointmentId={appointmentDetails.appointmentId}
                    doctor={appointmentDetails.doctor}
                    hospitalName={appointmentDetails.hospitalName}
                    hospitalAddress={appointmentDetails.hospitalAddress}
                    sx={{ 
                      transform: 'scale(0.8)',
                      transformOrigin: 'top center',
                      width: '125%',
                      ml: '-12.5%',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  onClick={handlePrint} 
                  variant="outlined"
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  Print Slip
                </Button>
                <Button 
                  onClick={handleClose} 
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  Done
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmergencyButton;
