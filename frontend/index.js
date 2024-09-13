import { backend } from 'declarations/backend';

let holdings = [];

async function refreshHoldings() {
  holdings = await backend.getHoldings();
  renderHoldings();
}

function renderHoldings() {
  const tbody = document.querySelector('#holdingsTable tbody');
  tbody.innerHTML = '';
  holdings.forEach((holding, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${holding.assetType}</td>
      <td>${holding.symbol}</td>
      <td>${holding.quantity}</td>
      <td>$${holding.purchasePrice.toFixed(2)}</td>
      <td>$${holding.currentPrice.toFixed(2)}</td>
      <td>$${(holding.quantity * holding.currentPrice).toFixed(2)}</td>
      <td><button onclick="removeHolding(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function addHolding(event) {
  event.preventDefault();
  const holding = {
    assetType: document.getElementById('assetType').value,
    symbol: document.getElementById('symbol').value,
    quantity: parseFloat(document.getElementById('quantity').value),
    purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
    currentPrice: parseFloat(document.getElementById('purchasePrice').value),
  };
  await backend.addHolding(holding);
  await refreshHoldings();
  event.target.reset();
}

async function removeHolding(index) {
  await backend.removeHolding(index);
  await refreshHoldings();
}

async function updatePrices() {
  await backend.updatePrices();
  await refreshHoldings();
}

document.getElementById('addHoldingForm').addEventListener('submit', addHolding);
document.getElementById('updatePrices').addEventListener('click', updatePrices);

refreshHoldings();