import React from 'react';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem',
    textAlign: 'center'
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.25rem'
  },
  paragraph: {
    fontSize: '1.25rem',
    color: '#4b5563',
    maxWidth: '42rem',
    lineHeight: '1.625'
  }
};

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        Hello ipan
      </h1>
      <p style={styles.paragraph}>
        Welcome to the application!
      </p>
    </div>
  );
}

export default App;
