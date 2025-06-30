import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0', color: '#333' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '20px 0', color: '#666' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '1rem', margin: '20px 0', color: '#888' }}>
        The page you are looking for does not exist.
      </p>
      <Link 
        href="/" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1rem'
        }}
      >
        Go back to home
      </Link>
    </div>
  );
} 