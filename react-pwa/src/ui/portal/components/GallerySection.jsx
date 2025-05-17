import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const GalleryItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '10px',
  margin: '0 10px 20px 10px',
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  height: '300px',
  '&:hover img': {
    transform: 'scale(1.1)',
    transition: 'transform 0.4s ease'
  },
  '&:hover .gallery-info': {
    opacity: 1,
    right: 0
  }
}));

const GalleryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease'
});

const GalleryInfo = styled(Box)({
  position: 'absolute',
  right: '-100%',
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(25, 119, 204, 0.75)',
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  opacity: 0,
  color: '#fff',
  textAlign: 'center'
});

const galleryItems = [
  {
    id: 1,
    title: 'Modern Operating Room',
    description: 'State-of-the-art equipment for surgical procedures',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-1.jpg'
  },
  {
    id: 2,
    title: 'Advanced Imaging Center',
    description: 'High-precision diagnostic imaging equipment',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-2.jpg'
  },
  {
    id: 3,
    title: 'Laboratory Facilities',
    description: 'Modern labs for accurate medical testing',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-3.jpg'
  },
  {
    id: 4,
    title: 'Patient Rooms',
    description: 'Comfortable and well-equipped patient rooms',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-4.jpg'
  },
  {
    id: 5,
    title: 'Rehabilitation Center',
    description: 'Facilities for physical therapy and rehabilitation',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-5.jpg'
  },
  {
    id: 6,
    title: 'Emergency Room',
    description: '24/7 emergency care with rapid response capabilities',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-6.jpg'
  },
  {
    id: 7,
    title: 'Dental Care Unit',
    description: 'Specialized equipment for comprehensive dental care',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-7.jpg'
  },
  {
    id: 8,
    title: 'Reception Area',
    description: 'Welcoming space for patients and visitors',
    image: 'https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-8.jpg'
  }
];

const GallerySection = () => {
  return (
    <section id="gallery" className="gallery">
      <Container>
        <div className="section-title">
          <h2>Gallery</h2>
          <p>Explore our state-of-the-art medical facilities designed to provide the highest quality healthcare services. Our modern equipment and comfortable spaces are part of our commitment to exceptional patient care.</p>
        </div>

        <Grid container spacing={2}>
          {galleryItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <GalleryItem>
                <GalleryImage 
                  src={item.image} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "https://bootstrapmade.com/demo/templates/Medilab/assets/img/gallery/gallery-1.jpg";
                  }}
                />
                <GalleryInfo className="gallery-info">
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                </GalleryInfo>
              </GalleryItem>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default GallerySection;
