import React, { useState } from 'react';
import { Button, TextField, MenuItem, Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const AppointmentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.1)',
  borderRadius: '7px',
  background: 'rgba(255, 255, 255, 0.95)'
}));

const AppointmentButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1977cc',
  color: '#fff',
  borderRadius: '50px',
  padding: '10px 25px',
  fontWeight: 500,
  transition: 'all 0.4s',
  '&:hover': {
    backgroundColor: '#1c84e3',
    transform: 'scale(1.02)'
  }
}));

const AppointmentSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    department: '',
    message: ''
  });

  const departments = [
    'Cardiology',
    'Neurology',
    'Hepatology',
    'Pediatrics',
    'Ophthalmology',
    'Dermatology',
    'Orthopedics',
    'General Medicine'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment form submitted:', formData);
    // Here you would typically submit the form data to your backend
    alert('Thank you for your appointment request! We will contact you shortly to confirm.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      department: '',
      message: ''
    });
  };

  return (
    <section id="appointment" className="appointment section-bg">
      <div className="container">
        <div className="section-title">
          <h2>Make an Appointment</h2>
          <p>Fill out the form below to schedule an appointment with our specialists. We will confirm your appointment as soon as possible.</p>
        </div>

        <AppointmentPaper elevation={3}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Your Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  name="date"
                  label="Appointment Date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  name="time"
                  label="Appointment Time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  select
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="message"
                  label="Message (Optional)"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <AppointmentButton
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Make an Appointment
                </AppointmentButton>
              </Grid>
            </Grid>
          </Box>
        </AppointmentPaper>
      </div>
    </section>
  );
};

export default AppointmentSection;
