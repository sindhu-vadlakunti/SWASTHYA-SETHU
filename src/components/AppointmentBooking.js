import React, { useState, useRef } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Stepper, Step, StepLabel, Grid, Card,
  CardContent, Chip, FormControl, InputLabel,
  Select, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { useAuth } from './Auth/AuthContext';
import OPSlip from './OPSlip';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

// In a real app, this would likely come from the backend
const availableSymptoms = [
    'fever', 'cough', 'headache', 'nausea', 'fatigue', 'sore throat', 'vomiting',
    'diarrhea', 'cold', 'flu symptoms', 'abdominal pain', 'weight loss', 'weakness',
    'chest pain', 'heart palpitations', 'shortness of breath', 'dizziness',
    'fainting', 'swelling in legs', 'high blood pressure', 'irregular heartbeat',
    'joint pain', 'back pain', 'fracture', 'swelling in joints', 'stiffness',
    'difficulty walking', 'bone pain', 'muscle weakness', 'neck pain', 'shoulder pain'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AppointmentBooking() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  // Single, unified state for the entire form to prevent race conditions
  const [appointmentData, setAppointmentData] = useState({
    date: today,
    time: '',
    department: '',
    doctor: '',
    symptomList: [],
    notes: '',
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState({
    checked: false,
    timeSlots: [],
    count: 0,
  });

  const [showOPSlip, setShowOPSlip] = useState(false);
  const [opSlipDetails, setOpSlipDetails] = useState(null);
  const opSlipRef = useRef();

  // Handle all form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
    if (name === 'date') {
      setAvailability({ checked: false, timeSlots: [], count: 0 });
    }
  };

  // Handle symptom selection
  const handleSymptomsChange = (event) => {
    const { target: { value } } = event;
    const newSelectedSymptoms = typeof value === 'string' ? value.split(',') : value;
    // Reset doctor/department when symptoms change to force re-analysis
    setAppointmentData(prev => ({
        ...prev,
        symptomList: newSelectedSymptoms,
        doctor: '',
        department: ''
    }));
  };

  // Check for slot availability
  const checkAvailability = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/availability?date=${appointmentData.date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch availability.');
      }
      const data = await response.json();
      setAvailability({ 
        checked: true, 
        timeSlots: data.availableSlots, 
        count: data.availableSlotCount 
      });
    } catch (err) {
      setError(err.message);
      setAvailability({ checked: true, timeSlots: [], count: 0 });
    } finally {
      setLoading(false);
    }
  };

  // State to store analysis results
  const [analysisResults, setAnalysisResults] = useState(null);

  // Analyze symptoms to find a doctor
  const analyzeSymptoms = async () => {
    if (appointmentData.symptomList.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/symptoms/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: appointmentData.symptomList }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to analyze symptoms.');
      }
      const data = await response.json();
      console.log('Analysis API Response:', data); // Debug log
      
      if (!data.department || !data.recommendedDoctor) {
        console.error('Missing department or doctor in response:', data);
        throw new Error('Invalid response from symptom analysis service');
      }
      
      setAnalysisResults(data);
      setAppointmentData(prev => ({
        ...prev,
        department: data.department,
        doctor: data.recommendedDoctor,
      }));
      
      console.log('Updated appointment data:', { 
        ...appointmentData, 
        department: data.department, 
        doctor: data.recommendedDoctor 
      });
    } catch (err) {
      setError(err.message);
      setAnalysisResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Final submission of the appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const finalData = {
        userAadhaar: user.aadhaarNumber,
        patientName: user.name,
        ...appointmentData,
      };

      // First, create the appointment
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to book appointment.');
      }

      const newAppointment = await response.json();
      console.log('New appointment data from API:', newAppointment);
      
      // Save to HealthRecords collection
      try {
        const healthRecordData = {
          aadhaar: user.aadhaarNumber,
          symptoms: appointmentData.symptomList.join(', '),
          department: appointmentData.department,
          slipDate: appointmentData.date,
          slotTime: appointmentData.time
        };
        
        const healthRecordResponse = await fetch(`${API_BASE_URL}/api/health-records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(healthRecordData),
        });
        
        if (!healthRecordResponse.ok) {
          console.error('Failed to save health record, but appointment was booked');
          // Don't throw error here, as the appointment was successfully booked
        }
      } catch (healthRecordError) {
        console.error('Error saving health record:', healthRecordError);
        // Continue with the flow even if health record save fails
      }

      setOpSlipDetails(newAppointment);
      setShowOPSlip(true);
      
      // Reset form for next booking
      setStep(0);
      setAppointmentData({
        date: today,
        time: '',
        department: '',
        doctor: '',
        symptomList: [],
        notes: '',
      });
      setAvailability({ checked: false, timeSlots: [], count: 0 });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  const renderDateSelection = () => (
    <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
      <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white' }}>
        <Typography variant="h6">1. Select Appointment Date</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              name="date"
              label="Appointment Date"
              type="date"
              fullWidth
              value={appointmentData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={checkAvailability}
              disabled={loading || !appointmentData.date}
              sx={{
                height: '40px',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Check Availability'}
            </Button>
          </Grid>
        </Grid>

        {availability.checked && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Alert 
              severity={availability.count > 0 ? 'success' : 'error'}
              sx={{ borderRadius: 1, mb: 2 }}
            >
              {availability.count > 0
                ? `✅ ${availability.count} slots available`
                : '❌ No available slots for the selected date'}
            </Alert>
            
            {availability.timeSlots.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>Available Time Slots:</Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 1,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  {availability.timeSlots.map((slot, index) => (
                    <Chip 
                      key={index}
                      label={slot}
                      color={appointmentData.time === slot ? 'primary' : 'default'}
                      onClick={() => setAppointmentData(prev => ({ ...prev, time: slot }))}
                      variant={appointmentData.time === slot ? 'filled' : 'outlined'}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => setStep(1)} 
            disabled={availability.count === 0}
            sx={{
              textTransform: 'none',
              px: 3,
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'text.disabled',
              },
            }}
          >
            Continue to Next Step
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAppointmentForm = () => (
    <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
      <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white' }}>
        <Typography variant="h6">2. Your Symptoms & Details</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!appointmentData.symptomList.length} variant="outlined">
              <InputLabel id="symptoms-label">Select Symptoms *</InputLabel>
              <Select
                labelId="symptoms-label"
                multiple
                value={appointmentData.symptomList}
                onChange={handleSymptomsChange}
                input={<OutlinedInput label="Select Symptoms *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 100, overflow: 'auto' }}>
                    {selected.length === 0 ? (
                      <Typography color="textSecondary" variant="body2">No symptoms selected</Typography>
                    ) : (
                      selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small"
                          sx={{ 
                            m: 0.5,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.contrastText',
                              '&:hover': {
                                color: 'white'
                              }
                            }
                          }}
                          onDelete={() => {
                            setAppointmentData(prev => ({
                              ...prev,
                              symptomList: prev.symptomList.filter(item => item !== value)
                            }));
                          }}
                        />
                      ))
                    )}
                  </Box>
                )}
                MenuProps={{
                  ...MenuProps,
                  PaperProps: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                      width: 250,
                    },
                  },
                }}
              >
                {availableSymptoms.map((symptom) => (
                  <MenuItem key={symptom} value={symptom}>
                    <Checkbox checked={appointmentData.symptomList.indexOf(symptom) > -1} />
                    <ListItemText primary={symptom} />
                  </MenuItem>
                ))}
              </Select>
              {!appointmentData.symptomList.length && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1.5 }}>
                  Please select at least one symptom
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" onClick={analyzeSymptoms} disabled={loading || appointmentData.symptomList.length === 0} fullWidth>{loading ? <CircularProgress size={24} /> : 'Analyze Symptoms & Find Doctor'}</Button>
          </Grid>
          {appointmentData.department && appointmentData.doctor && analysisResults?.analysisDetails && (
            <Grid item xs={12}>
              <Alert 
                severity="success" 
                sx={{ 
                  '& .MuiAlert-message': { width: '100%' },
                  '& .MuiAlert-action': { alignItems: 'flex-start' }
                }}
              >
                <Box width="100%">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Recommended Department: {appointmentData.department}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Doctor: {appointmentData.doctor}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Box 
                          sx={{
                            width: '100px',
                            height: '8px',
                            bgcolor: 'grey.200',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            mr: 1
                          }}
                        >
                          <Box 
                            sx={{
                              width: `${analysisResults.confidence}%`,
                              height: '100%',
                              bgcolor: 'success.main',
                              transition: 'width 0.5s ease-in-out'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {analysisResults.confidence}% Confidence
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`${analysisResults.analysisDetails?.matchedCount || 0}/${analysisResults.analysisDetails?.totalSymptoms || 0} symptoms matched`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {analysisResults.analysisDetails?.matchedSymptoms?.length > 0 && (
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Matched symptoms:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {analysisResults.analysisDetails?.matchedSymptoms?.map((symptom, index) => (
                          <Chip 
                            key={index} 
                            label={symptom} 
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {analysisResults.confidenceScores && (
                    <Box mt={1.5}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        Department Confidence Levels:
                      </Typography>
                      <Box>
                        {Object.entries(analysisResults.confidenceScores).map(([dept, score]) => (
                          <Box key={dept} display="flex" alignItems="center" mb={0.5}>
                            <Typography variant="body2" sx={{ width: '120px' }}>
                              {dept}:
                            </Typography>
                            <Box flexGrow={1} ml={1} mr={1}>
                              <Box 
                                sx={{
                                  height: '6px',
                                  bgcolor: 'grey.200',
                                  borderRadius: '3px',
                                  overflow: 'hidden'
                                }}
                              >
                                <Box 
                                  sx={{
                                    width: `${score}%`,
                                    height: '100%',
                                    bgcolor: dept === analysisResults.department ? 'success.main' : 'grey.400',
                                    transition: 'width 0.5s ease-in-out'
                                  }}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.primary" sx={{ width: '40px', textAlign: 'right' }}>
                              {score}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth error={!appointmentData.time} variant="outlined">
              <InputLabel id="time-slot-label">Preferred Time Slot *</InputLabel>
              <Select
                labelId="time-slot-label"
                name="time"
                value={appointmentData.time}
                onChange={handleChange}
                label="Preferred Time Slot *"
                disabled={availability.timeSlots.length === 0}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '40px',
                    padding: '10px 14px',
                  },
                  mb: 1
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                      width: 250,
                    },
                  },
                }}
              >
                {availability.timeSlots.length === 0 ? (
                  <MenuItem disabled>
                    <Typography variant="body2" color="textSecondary">
                      {availability.checked ? 'No slots available' : 'Check availability first'}
                    </Typography>
                  </MenuItem>
                ) : (
                  availability.timeSlots.map(slot => (
                    <MenuItem 
                      key={slot} 
                      value={slot}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          '&:hover': {
                            bgcolor: 'primary.light',
                          },
                        },
                      }}
                    >
                      <AccessTimeIcon fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{slot}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(`2000-01-01T${slot}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {!appointmentData.time && availability.timeSlots.length > 0 && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1.5 }}>
                  Please select a time slot
                </Typography>
              )}
              {availability.checked && availability.timeSlots.length > 0 && (
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                  {availability.timeSlots.length} slots available
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              name="notes" 
              label="Additional Notes" 
              multiline 
              rows={3} 
              fullWidth 
              value={appointmentData.notes} 
              onChange={handleChange}
              variant="outlined"
              placeholder="Any additional information you'd like to share with the doctor..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 1.5 }}>
              Optional: Any specific concerns or questions for the doctor
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={() => setStep(0)}>Back</Button>
          <Button variant="contained" onClick={() => setStep(2)} disabled={!appointmentData.doctor || !appointmentData.time}>Review & Confirm</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSummary = () => (
    <Card sx={{ p: 3, mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Confirm Your Appointment</Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Grid container spacing={1.5}>
            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Name:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{user?.name}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Date:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{formatDisplayDate(appointmentData.date)}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Time:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{appointmentData.time}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Department:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{appointmentData.department}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Doctor:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{appointmentData.doctor}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Symptoms:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{appointmentData.symptomList.join(', ')}</Typography></Grid>

            <Grid item xs={4}><Typography variant="body1" fontWeight="bold">Notes:</Typography></Grid>
            <Grid item xs={8}><Typography variant="body1">{appointmentData.notes || 'None'}</Typography></Grid>
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', alignItems: 'center' }}>
          <Button 
            onClick={() => setStep(1)}
            variant="outlined"
            sx={{ textTransform: 'none', px: 3 }}
          >
            ← Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            disabled={loading}
            sx={{ textTransform: 'none', px: 4, minWidth: 180 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm & Book'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>Book Appointment</Typography>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {['Select Date', 'Provide Details', 'Summary'].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {step === 0 && renderDateSelection()}
        {step === 1 && renderAppointmentForm()}
        {step === 2 && renderSummary()}
      </Paper>
      <Dialog open={showOPSlip} onClose={() => setShowOPSlip(false)} maxWidth="md">
        <DialogTitle>OP Slip</DialogTitle>
        <DialogContent>
          <Box ref={opSlipRef}>
            {opSlipDetails && (() => {
              console.log('Rendering OPSlip with details:', {
                ...opSlipDetails,
                patientName: user?.name,
                patientId: user?.aadhaarNumber,
                date: opSlipDetails.date,
                time: opSlipDetails.time,
                department: opSlipDetails.department,
                doctor: opSlipDetails.doctor,
                symptomList: opSlipDetails.symptomList || [],
                notes: opSlipDetails.notes
              });
              return (
                <OPSlip 
                  {...opSlipDetails}
                  patientName={user?.name}
                  patientId={user?.aadhaarNumber}
                  date={opSlipDetails.date}
                  time={opSlipDetails.time}
                  department={opSlipDetails.department}
                  doctor={opSlipDetails.doctor}
                  symptomList={opSlipDetails.symptomList || []}
                  notes={opSlipDetails.notes}
                />
              );
            })()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setShowOPSlip(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              const printWindow = window.open('', '_blank');
              const content = opSlipRef.current.innerHTML;
              printWindow.document.write(`
                <html>
                  <head>
                    <title>OP Slip</title>
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
                    <style>
                      body { font-family: 'Roboto', sans-serif; padding: 20px; }
                      @media print { 
                        @page { size: auto; margin: 0; }
                        body { -webkit-print-color-adjust: exact; }
                      }
                    </style>
                  </head>
                  <body>${content}</body>
                </html>
              `);
              printWindow.document.close();
              setTimeout(() => {
                printWindow.print();
                printWindow.close();
              }, 500);
            }}
          >
            Print Slip
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AppointmentBooking;