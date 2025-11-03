import './App.css';

function App() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      background: 'linear-gradient(135deg, #000000, #1a0000)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* MAIN GAME CONTENT */}
      <div style={{ padding: '20px' }}>
        <h1 style={{ 
          color: '#ff0000',
          textAlign: 'center',
          textShadow: '0 0 10px #ff0000'
        }}>
          🚀 STATION BOOSTER BUDDY
        </h1>
        
        {/* Game Area */}
        <div style={{
          background: 'rgba(255, 0, 0, 0.1)',
          border: '2px solid #ff0000',
          color: 'white',
          padding: '25px',
          margin: '20px',
          borderRadius: '15px',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
        }}>
          <h2 style={{ color: '#ff0000' }}>🎮 GAME STATION</h2>
          <p>Your starship game content here!</p>
          <button style={{
            padding: '12px 24px',
            margin: '5px',
            background: 'linear-gradient(45deg, #ff0000, #cc0000)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            🚀 LAUNCH STATION
          </button>
          <button style={{
            padding: '12px 24px',
            margin: '5px',
            background: 'linear-gradient(45deg, #990000, #660000)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            ⚡ BOOST POWER
          </button>
        </div>
      </div>

      {/* RED MAGIC 9 PRO FLOATING ASSISTANT */}
      <div style={{
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        background: 'linear-gradient(135deg, #ff0000, #990000)',
        color: 'white',
        padding: '15px',
        borderRadius: '12px',
        minWidth: '180px',
        border: '1px solid #ff4444',
        boxShadow: '0 0 25px rgba(255, 0, 0, 0.5)',
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#00ff00',
            borderRadius: '50%',
            marginRight: '8px',
            animation: 'pulse 1.5s infinite'
          }}></div>
          <h4 style={{ 
            margin: 0, 
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            🎮 GAME ASSISTANT
          </h4>
        </div>
        
        <div style={{ fontSize: '12px' }}>
          <div>⚡ Performance: Optimal</div>
          <div>🎯 FPS: 144Hz</div>
          <div>🔥 CPU: 78°C</div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '5px',
          marginTop: '10px'
        }}>
          <button style={{
            padding: '5px 10px',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            border: '1px solid #ff4444',
            borderRadius: '5px',
            fontSize: '10px'
          }}>
            BOOST
          </button>
          <button style={{
            padding: '5px 10px',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            border: '1px solid #ff4444',
            borderRadius: '5px',
            fontSize: '10px'
          }}>
            COOL
          </button>
        </div>
      </div>

      {/* Add this to your App.css for the pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default App;