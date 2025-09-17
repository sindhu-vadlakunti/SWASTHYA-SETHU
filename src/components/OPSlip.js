import React, { forwardRef } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  Chip, 
  Paper,
  Container
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospital from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const OPSlip = forwardRef(({
  hospitalName = 'City Hospital',
  hospitalAddress = '123 Main Road, Metro City, 123456',
  patientId,
  patientName,
  date,
  time,
  department,
  symptomList = [],
  notes,
  _id,
  doctor
}, ref) => {
  const today = new Date();
  const issueDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Format the appointment date
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <Box sx={{ 
        bgcolor: 'primary.light',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
        flexShrink: 0
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
  return (
    <Container maxWidth="md" sx={{ py: 4 }} ref={ref}>
      <Paper 
        elevation={3} 
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          fontFamily: 'Roboto, Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          p: 3,
          textAlign: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <LocalHospital sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{hospitalName}</Typography>
              <Typography variant="body2">{hospitalAddress}</Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ 
            mt: 2, 
            fontWeight: 'medium',
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            Outpatient Department Slip
          </Typography>
        </Box>

        <Box sx={{ px: 4, pb: 4 }}>
          {/* Meta Info */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 3,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1
          }}>
            <Typography variant="body2">
              <b>Appointment ID:</b> {_id || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <b>Issued:</b> {issueDate}
            </Typography>
          </Box>

          {/* Patient and Appointment Info */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4
          }}>
            <Box>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 0.5,
                display: 'inline-block'
              }}>
                Patient Information
              </Typography>
              
              <InfoRow 
                icon={<PersonIcon fontSize="small" color="primary" />}
                label="Patient Name"
                value={patientName}
              />
              <InfoRow 
                icon={<PersonIcon fontSize="small" color="primary" />}
                label="Patient ID"
                value={patientId}
              />
              <InfoRow 
                icon={<MedicalServicesIcon fontSize="small" color="primary" />}
                label="Department"
                value={(department && department !== 'N/A') ? department.toUpperCase() : 'GENERAL MEDICINE'}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 0.5,
                display: 'inline-block'
              }}>
                Appointment Details
              </Typography>
              
              <InfoRow 
                icon={<CalendarTodayIcon fontSize="small" color="primary" />}
                label="Appointment Date"
                value={date && formatAppointmentDate(date)}
              />
              <InfoRow 
                icon={<AccessTimeIcon fontSize="small" color="primary" />}
                label="Time Slot"
                value={time}
              />
              <InfoRow 
                icon={<LocalHospital fontSize="small" color="primary" />}
                label="Doctor"
                value={doctor}
              />
            </Box>
          </Box>

          {/* Symptoms and Notes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              color: 'text.secondary'
            }}>
              SYMPTOMS
            </Typography>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 1,
              minHeight: 60,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center'
            }}>
              {symptomList && symptomList.length > 0 ? (
                symptomList.map((sym, idx) => (
                  <Chip 
                    key={idx} 
                    label={sym} 
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                      fontWeight: 500
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No symptoms reported</Typography>
              )}
            </Box>
          </Box>

          {notes && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: 'text.secondary'
              }}>
                ADDITIONAL NOTES
              </Typography>
              <Box sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 60
              }}>
                <Typography variant="body2">{notes}</Typography>
              </Box>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  borderBottom: '1px solid', 
                  borderColor: 'divider', 
                  width: 180,
                  mb: 1,
                  mx: 'auto'
                }} />
                <Typography variant="caption">Patient's Signature</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  borderBottom: '1px solid', 
                  borderColor: 'divider', 
                  width: 180,
                  mb: 1,
                  mx: 'auto'
                }} />
                <Typography variant="caption">Doctor's Signature</Typography>
              </Box>
            </Box>

            <Typography 
              variant="caption" 
              color="textSecondary" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 3,
                fontSize: '0.7rem',
                lineHeight: 1.4
              }}
            >
              This is an electronically generated document and does not require a physical signature.<br />
              Please bring this slip and a valid ID on the day of your appointment.<br />
              For any queries, please contact our helpdesk at helpdesk@hospital.com or call +91-XXXXXXXXXX.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
});

export default OPSlip; 