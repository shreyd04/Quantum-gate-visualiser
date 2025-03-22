import React, { useState } from 'react';
import QuantumGate from './QuantumGate';
import '../styles/QuantumCircuit.css';
import { simulateCircuit } from '../services/quantumService';

const QuantumCircuit = () => {
  const [qubits, setQubits] = useState([{ id: 'q[0]', gates: [] }]);
  const [selectedGate, setSelectedGate] = useState(null);
  const [probabilities, setProbabilities] = useState({ '0': 0.5, '1': 0.5 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);
  
  const addQubit = () => {
    const newId = `q[${qubits.length}]`;
    setQubits([...qubits, { id: newId, gates: [] }]);
  };

  const addGateToQubit = (qubitIndex, position) => {
    if (!selectedGate) return;
    
    const updatedQubits = [...qubits];
    
    // Make sure the gates array has enough positions
    while (updatedQubits[qubitIndex].gates.length <= position) {
      updatedQubits[qubitIndex].gates.push(null);
    }
    
    updatedQubits[qubitIndex].gates[position] = selectedGate;
    setQubits(updatedQubits);
  };

  const runSimulation = async () => {
    try {
      setIsSimulating(true);
      setError(null);
      
      // Call the quantum service to simulate the circuit
      const result = await simulateCircuit(qubits);
      
      // Update the probabilities based on the simulation results
      setProbabilities(result.results);
      
      setIsSimulating(false);
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Failed to run simulation. Please try again.');
      setIsSimulating(false);
    }
  };

  const renderCircuitGrid = () => {
    const gridWidth = 15; // Number of time steps in the grid
    
    return (
      <div className="circuit-grid">
        {qubits.map((qubit, qubitIndex) => (
          <div key={qubit.id} className="qubit-line">
            <div className="qubit-label">{qubit.id}</div>
            {Array.from({ length: gridWidth }).map((_, position) => {
              const gate = qubit.gates[position];
              return (
                <div 
                  key={`${qubit.id}-${position}`} 
                  className="grid-cell"
                  onClick={() => addGateToQubit(qubitIndex, position)}
                >
                  {gate && <QuantumGate type={gate} />}
                </div>
              );
            })}
          </div>
        ))}
        <button className="add-qubit-btn" onClick={addQubit}>+ Add Qubit</button>
      </div>
    );
  };

  const renderOperationsPanel = () => {
    const gateTypes = [
      { id: 'H', label: 'H', color: '#f87171' },
      { id: 'X', label: 'X', color: '#93c5fd' },
      { id: 'Z', label: 'Z', color: '#a7f3d0' },
      { id: 'T', label: 'T', color: '#818cf8' },
      { id: 'S', label: 'S', color: '#c4b5fd' },
      { id: 'RZ', label: 'RZ', color: '#a7f3d0' },
      { id: 'RX', label: 'RX', color: '#fda4af' },
      { id: 'RY', label: 'RY', color: '#fda4af' },
      { id: 'CNOT', label: '⊕', color: '#86efac' },
    ];

    return (
      <div className="operations-panel">
        <h3>Operations</h3>
        <div className="search-box">
          <input type="text" placeholder="Search" />
        </div>
        <div className="gates-grid">
          {gateTypes.map(gate => (
            <div 
              key={gate.id} 
              className={`gate-item ${selectedGate === gate.id ? 'selected' : ''}`}
              style={{ backgroundColor: gate.color }}
              onClick={() => setSelectedGate(gate.id)}
            >
              {gate.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    // Convert probabilities to array format for visualization
    const probabilityData = Object.entries(probabilities).map(([state, prob]) => ({
      state,
      probability: prob * 100
    }));

    return (
      <div className="visualization-panel">
        <div className="visualization-section">
          <h3>Probabilities</h3>
          <div className="probability-chart">
            {probabilityData.map(item => (
              <div key={item.state} className="chart-bar-container">
                <div className="state-label">{item.state}</div>
                <div className="chart-bar" style={{ height: `${item.probability}%` }}></div>
                <div className="probability-value">{Math.round(item.probability)}%</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="visualization-section">
          <h3>Q-sphere</h3>
          <div className="q-sphere">
            <div className="sphere">
              <div className="equator"></div>
              <div className="meridian"></div>
              {probabilityData.map(item => {
                // Simplified visualization - in a real app you'd use proper Bloch sphere coordinates
                const angle = parseInt(item.state, 2) * (360 / Math.pow(2, qubits.length));
                const radius = 75 * Math.sqrt(item.probability / 100);
                const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                
                return (
                  <div 
                    key={item.state}
                    className="state-point" 
                    style={{ 
                      top: `${y}%`, 
                      left: `${x}%`,
                      transform: 'translate(-50%, -50%)',
                      opacity: item.probability / 100
                    }}
                    title={`State ${item.state}: ${item.probability.toFixed(2)}%`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quantum-composer">
      <div className="composer-header">
        <h1>Quantum Gate Visualizer</h1>
        <button 
          className={`run-btn ${isSimulating ? 'simulating' : ''}`} 
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? 'Simulating...' : 'Setup and run'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="composer-main">
        {renderOperationsPanel()}
        
        <div className="circuit-container">
          {renderCircuitGrid()}
        </div>
        
        {renderVisualization()}
      </div>
    </div>
  );
};

export default QuantumCircuit; 