import React from 'react';
import '../styles/QuantumGate.css';

const QuantumGate = ({ type }) => {
  // Define gate colors based on type
  const getGateStyle = () => {
    switch (type) {
      case 'H':
        return { backgroundColor: '#f87171' }; // Red
      case 'X':
        return { backgroundColor: '#93c5fd' }; // Blue
      case 'Z':
        return { backgroundColor: '#a7f3d0' }; // Green
      case 'T':
        return { backgroundColor: '#818cf8' }; // Purple
      case 'S':
        return { backgroundColor: '#c4b5fd' }; // Lavender
      case 'RZ':
        return { backgroundColor: '#a7f3d0' }; // Green
      case 'RX':
      case 'RY':
        return { backgroundColor: '#fda4af' }; // Pink
      case 'CNOT':
        return { backgroundColor: '#86efac' }; // Light green
      default:
        return { backgroundColor: '#e5e7eb' }; // Gray
    }
  };

  return (
    <div className="quantum-gate" style={getGateStyle()}>
      {type}
    </div>
  );
};

export default QuantumGate; 