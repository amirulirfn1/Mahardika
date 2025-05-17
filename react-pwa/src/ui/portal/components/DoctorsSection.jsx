import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const DoctorCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: '10px',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: '#3291e6',
  backgroundColor: '#dff3fc',
  margin: '0 5px',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#1977cc',
    color: '#fff'
  }
}));

const doctors = [
  {
    id: 1,
    name: 'Dr. Walter White',
    specialty: 'Chief Medical Officer',
    bio: 'Specializing in advanced cardiac procedures with over 15 years of experience',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-1.jpg',
    social: {
      twitter: '#',
      facebook: '#',
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialty: 'Neurologist',
    bio: 'Expert in neurological disorders with specialized training in stroke management',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-2.jpg',
    social: {
      twitter: '#',
      facebook: '#',
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 3,
    name: 'Dr. William Anderson',
    specialty: 'Pediatrician',
    bio: 'Dedicated to providing compassionate care for children and adolescents',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-3.jpg',
    social: {
      twitter: '#',
      facebook: '#',
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 4,
    name: 'Dr. Amanda Jepson',
    specialty: 'Dermatologist',
    bio: 'Specializes in dermatological conditions and cosmetic procedures',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-4.jpg',
    social: {
      twitter: '#',
      facebook: '#',
      instagram: '#',
      linkedin: '#'
    }
  }
];

const DoctorsSection = () => {
  return (
    <section id="doctors" className="doctors">
      <div className="container">
        <div className="section-title">
          <h2>Doctors</h2>
          <p>Our team of expert doctors are dedicated to providing exceptional healthcare services. With years of experience in their respective fields, they ensure the highest quality of medical care for all our patients.</p>
        </div>

        <Grid container spacing={4}>
          {doctors.map((doctor) => (
            <Grid item key={doctor.id} xs={12} sm={6} md={3}>
              <DoctorCard>
                <CardMedia
                  component="img"
                  height="240"
                  image={doctor.image}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.src = "https://bootstrapmade.com/demo/templates/Medilab/assets/img/doctors/doctors-1.jpg";
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600, color: '#2c4964' }}>
                    {doctor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                    {doctor.specialty}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {doctor.bio}
                  </Typography>
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <SocialButton size="small" aria-label="twitter">
                      <FaTwitter size={16} />
                    </SocialButton>
                    <SocialButton size="small" aria-label="facebook">
                      <FaFacebook size={16} />
                    </SocialButton>
                    <SocialButton size="small" aria-label="instagram">
                      <FaInstagram size={16} />
                    </SocialButton>
                    <SocialButton size="small" aria-label="linkedin">
                      <FaLinkedin size={16} />
                    </SocialButton>
                  </Stack>
                </CardContent>
              </DoctorCard>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default DoctorsSection;
