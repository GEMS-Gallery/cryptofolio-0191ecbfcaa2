import { backend } from './declarations/backend';

let holdings = [];

async function refreshHoldings() {
  try {
    holdings = await backend.getHoldings();
    renderHoldings();
  } catch (error) {
    console.error("Error fetching holdings:", error);
  }
}

function renderHoldings() {
  const tbody = document.querySelector('#holdingsTable tbody');
  tbody.innerHTML = '';
  holdings.forEach((holding, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${holding.name || holding.symbol}</td>
      <td>${holding.quantity}</td>
      <td>$${holding.marketValue.toFixed(2)}</td>
      <td>$${holding.currentPrice.toFixed(2)}</td>
      <td>${holding.performance.toFixed(2)}%</td>
      <td>${holding.assetType}</td>
      <td><button onclick="removeHolding(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function addHolding(event) {
  event.preventDefault();
  try {
    const holding = {
      name: document.getElementById('name').value,
      symbol: document.getElementById('name').value,
      quantity: parseFloat(document.getElementById('quantity').value),
      purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
      currentPrice: parseFloat(document.getElementById('purchasePrice').value),
      marketValue: parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('purchasePrice').value),
      performance: 0,
      assetType: document.getElementById('assetType').value,
    };
    await backend.addHolding(holding);
    await refreshHoldings();
    event.target.reset();
  } catch (error) {
    console.error("Error adding holding:", error);
  }
}

async function removeHolding(index) {
  try {
    await backend.removeHolding(index);
    await refreshHoldings();
  } catch (error) {
    console.error("Error removing holding:", error);
  }
}

async function updatePrices() {
  try {
    await backend.updatePrices();
    await refreshHoldings();
  } catch (error) {
    console.error("Error updating prices:", error);
  }
}

function searchHoldings() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const filteredHoldings = holdings.filter(holding => 
    holding.name.toLowerCase().includes(searchTerm) || 
    holding.symbol.toLowerCase().includes(searchTerm)
  );
  renderFilteredHoldings(filteredHoldings);
}

function renderFilteredHoldings(filteredHoldings) {
  const tbody = document.querySelector('#holdingsTable tbody');
  tbody.innerHTML = '';
  filteredHoldings.forEach((holding, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${holding.name || holding.symbol}</td>
      <td>${holding.quantity}</td>
      <td>$${holding.marketValue.toFixed(2)}</td>
      <td>$${holding.currentPrice.toFixed(2)}</td>
      <td>${holding.performance.toFixed(2)}%</td>
      <td>${holding.assetType}</td>
      <td><button onclick="removeHolding(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addHoldingForm').addEventListener('submit', addHolding);
  document.getElementById('updatePrices').addEventListener('click', updatePrices);
  document.getElementById('searchBar').addEventListener('input', searchHoldings);
  
  refreshHoldings();
});

// Make functions globally accessible
window.removeHolding = removeHolding;