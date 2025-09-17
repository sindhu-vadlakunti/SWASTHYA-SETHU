import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAuth } from './Auth/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function UserAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.aadhaarNumber) {
      return;
    }

    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${user.aadhaarNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching appointments.');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  if (!user || !user.aadhaarNumber) {
    return <Alert severity="warning">You must be logged in to view your appointments.</Alert>;
  }

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Appointments
      </Typography>
      {appointments.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No appointments found.</Typography>
          <Typography color="text.secondary">You have not booked any appointments yet.</Typography>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <List>
            {appointments.map((appt, index) => (
              <React.Fragment key={appt._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Dr. ${appt.doctor}`}
                    secondary={`On ${appt.date} at ${appt.time}`}
                  />
                </ListItem>
                {index < appointments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default UserAppointments;
