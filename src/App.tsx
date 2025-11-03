import './App.css';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* This shows your actual game components */}
      <h1>🚀 Starship Booster Buddy</h1>
      
      {/* Your game content here */}
      <div style={{
        background: 'black',
        color: 'white',
        padding: '20px',
        margin: '20px',
        borderRadius: '10px'
      }}>
        <h2>Game Content</h2>
        <p>Your starship game will display here!</p>
        <button>Launch Rocket</button>
        <button>Calculate Boost</button>
      </div>

      {/* Floating Assistant */}
      <div style={{
        position: 'fixed',
        bottom: '20px', 
        right: '20px',
        background: 'green',
        color: 'white',
        padding: '10px',
        borderRadius: '10px'
      }}>
        <h4>🛸 Assistant</h4>
        <p>I'm floating!</p>
      </div>
    </div>
  );
}

export default App;
