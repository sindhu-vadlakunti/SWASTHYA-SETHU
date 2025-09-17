import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert, 
  Box,
  Button,
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { format } from 'date-fns';

const PreviousBookings = () => {
  const { user: currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});

  // Debug log
  console.log('Current User:', currentUser);
  console.log('Aadhaar Number:', currentUser?.aadhaarNumber);

  const fetchBookings = useCallback(async () => {
    try {
      if (!currentUser?.aadhaarNumber) {
        setError('Aadhaar number not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/health-records/${currentUser.aadhaarNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        // Transform the data to match our expected format if needed
        const formattedBookings = result.data.map(booking => ({
          ...booking,
          // Add any necessary transformations here
        }));
        
        setBookings(formattedBookings);
        setError('');
      } else {
        setError(result.message || 'No bookings found');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error in fetchBookings:', err);
      setError('Error connecting to server. Please try again later.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.aadhaarNumber) {
      fetchBookings();
    }
  }, [currentUser, fetchBookings]);

  // Auto-refresh bookings every 30 seconds
  useEffect(() => {
    if (currentUser?.aadhaarNumber) {
      const interval = setInterval(fetchBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, fetchBookings]);

  const handleAcknowledgement = async (id, action) => {
    try {
      setUpdating(prev => ({ ...prev, [id]: action }));
      
      // Optimistically update the UI
      const newStatus = action === 'confirm' ? 'Confirmed' : 'Cancelled';
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === id 
            ? { 
                ...booking, 
                acknowledgement: newStatus,
                updatedAt: new Date().toISOString()
              }
            : booking
        )
      );
      
      try {
        const response = await fetch(`http://localhost:5001/api/health-records/acknowledge/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action })
        });

        const result = await response.json();
        console.log('Acknowledge Response:', result);

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to update booking');
        }
        
        // Refresh the bookings list to ensure we have the latest data
        await fetchBookings();
        
      } catch (err) {
        console.error('API Error:', err);
        // Only show error if the current status is still what we tried to set
        const currentBooking = bookings.find(b => b._id === id);
        if (currentBooking?.acknowledgement === newStatus) {
          setError(err.message || 'Failed to update booking. Please try again.');
          // Revert the optimistic update
          await fetchBookings();
        }
        return;
      }
      
    } catch (err) {
      console.error('Error in handleAcknowledgement:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const getStatusChip = (booking) => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const slipDateTime = new Date(booking.slipDate);
    
    // If slip time is in the past, show final status
    if (slipDateTime < now) {
      return (
        <Chip 
          label={booking.acknowledgement === 'Confirmed' ? 'Completed' : 'Expired'}
          color={booking.acknowledgement === 'Confirmed' ? 'success' : 'default'}
          variant="outlined"
          size="small"
        />
      );
    }
    
    // For future appointments
    switch(booking.acknowledgement) {
      case 'Confirmed':
        return <Chip label="Confirmed" color="success" size="small" />;
      case 'Cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default: // Pending
        if (slipDateTime <= oneHourFromNow) {
          return <Chip label="Action Required" color="warning" size="small" />;
        }
        return <Chip label="Pending Confirmation" color="warning" size="small" variant="outlined" />;
    }
  };

  const shouldShowActions = (booking) => {
    const now = new Date();
    const slipDateTime = new Date(booking.slipDate);
    // Only show actions for pending bookings that are in the future
    return booking.acknowledgement === 'Pending' && slipDateTime > now;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Previous Bookings</h2>
      
      {bookings.length === 0 ? (
        <Alert severity="info">No previous bookings found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Symptoms</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking._id || `${booking.slipDate}-${booking.slotTime}`}>
                    <TableCell>{new Date(booking.slipDate).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.slotTime}</TableCell>
                    <TableCell>{booking.department}</TableCell>
                    <TableCell>{booking.symptoms}</TableCell>
                    <TableCell>
                      {getStatusChip(booking)}
                    </TableCell>
                    <TableCell>
                      {shouldShowActions(booking) && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => handleAcknowledgement(booking._id, 'confirm')}
                            disabled={updating[booking._id]}
                          >
                            {updating[booking._id] === 'confirm' ? 'Confirming...' : 'Confirm'}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelOutlinedIcon />}
                            onClick={() => handleAcknowledgement(booking._id, 'cancel')}
                            disabled={updating[booking._id]}
                          >
                            {updating[booking._id] === 'cancel' ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PreviousBookings;
