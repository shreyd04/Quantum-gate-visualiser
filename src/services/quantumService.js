// Quantum API Service
// This service handles all interactions with the quantum computing API

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_QUANTUM_API_KEY;

/**
 * Simulate a quantum circuit with the given configuration
 * @param {Array} qubits - Array of qubits with their gates
 * @returns {Promise} - Promise resolving to simulation results
 */
export const simulateCircuit = async (qubits) => {
  try {
    // Convert the circuit configuration to the format expected by the API
    const circuitData = prepareCircuitData(qubits);
    
    // In a real implementation, you would make an API call like:
    // const response = await fetch('https://quantum-api.example.com/simulate', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify(circuitData)
    // });
    // return await response.json();
    
    // For now, we'll return mock data based on the circuit
    return getMockSimulationResults(qubits);
  } catch (error) {
    console.error('Error simulating quantum circuit:', error);
    throw error;
  }
};

/**
 * Convert the internal circuit representation to API format
 */
const prepareCircuitData = (qubits) => {
  const circuit = [];
  
  // Map each qubit and its gates to the API format
  qubits.forEach((qubit, qubitIndex) => {
    qubit.gates.forEach((gate, position) => {
      if (gate) {
        circuit.push({
          gate: gate,
          qubits: [qubitIndex],
          position: position
        });
      }
    });
  });
  
  return { circuit };
};

/**
 * Generate mock simulation results for testing
 */
const getMockSimulationResults = (qubits) => {
  // Count the number of qubits
  const numQubits = qubits.length;
  
  // Calculate the number of possible states (2^n)
  const numStates = Math.pow(2, numQubits);
  
  // Generate probability distribution
  const results = {};
  
  // Initialize with equal probabilities
  let probabilities = Array(numStates).fill(1/numStates);
  
  // Apply simple gate effects to probabilities
  qubits.forEach((qubit, qubitIndex) => {
    qubit.gates.forEach(gate => {
      if (gate === 'X') {
        // X gate flips 0 and 1 states for that qubit
        probabilities = applyXGateEffect(probabilities, qubitIndex, numQubits);
      } else if (gate === 'H') {
        // H gate creates superposition for that qubit
        probabilities = applyHGateEffect(probabilities, qubitIndex, numQubits);
      }
    });
  });
  
  // Format the results
  for (let i = 0; i < numStates; i++) {
    const stateLabel = i.toString(2).padStart(numQubits, '0');
    results[stateLabel] = probabilities[i];
  }
  
  return {
    results,
    stateVector: probabilities.map(p => Math.sqrt(p)),
    numQubits,
    success: true
  };
};

/**
 * Simulate the effect of an X gate on the probabilities
 */
const applyXGateEffect = (probabilities, targetQubit, numQubits) => {
  const newProbabilities = [...probabilities];
  const numStates = probabilities.length;
  
  // For each state, apply the X gate effect
  for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
    // Calculate the bit mask for the target qubit
    const mask = 1 << (numQubits - targetQubit - 1);
    
    // Flip the bit at the target qubit position
    const flippedStateIndex = stateIndex ^ mask;
    
    // Swap the probabilities
    [newProbabilities[stateIndex], newProbabilities[flippedStateIndex]] = 
      [newProbabilities[flippedStateIndex], newProbabilities[stateIndex]];
  }
  
  return newProbabilities;
};

/**
 * Simulate the effect of an H gate on the probabilities
 */
const applyHGateEffect = (probabilities, targetQubit, numQubits) => {
  // This is a simplified model - in reality, H gates create quantum superposition
  // which would require complex amplitude calculations
  const mask = 1 << (numQubits - targetQubit - 1);
  const newProbabilities = [...probabilities];
  
  // For each pair of states that differ only in the target qubit
  for (let stateIndex = 0; stateIndex < newProbabilities.length; stateIndex++) {
    // Only process each pair once
    if ((stateIndex & mask) === 0) {
      const pairedStateIndex = stateIndex | mask;
      
      // Create equal superposition
      const avgProb = (newProbabilities[stateIndex] + newProbabilities[pairedStateIndex]) / 2;
      newProbabilities[stateIndex] = avgProb;
      newProbabilities[pairedStateIndex] = avgProb;
    }
  }
  
  return newProbabilities;
};

export default {
  simulateCircuit
}; 