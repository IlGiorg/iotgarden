async function water() {
  await fetch('/water', { method: 'POST' });
  alert('Watered!');
}

async function fetchData() {
  const res = await fetch('/data');
  const data = await res.json();

  const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString());
  const values = data.map(d => d.moisture);

  new Chart(document.getElementById('moistureChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Soil Moisture',
        data: values,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      scales: {
        y: { suggestedMin: 0, suggestedMax: 1 }
      }
    }
  });
}
async function loadWateringLog() {
  const res = await fetch('/watering-log');
  const data = await res.json();

  const logEl = document.getElementById('watering-log');
  logEl.innerHTML = '';

  data.reverse().forEach(event => {
    const li = document.createElement('li');
    const date = new Date(event.timestamp).toLocaleString();
    li.textContent = `${event.type.toUpperCase()} at ${date}`;
    logEl.appendChild(li);
  });
}

loadWateringLog();

fetchData();
