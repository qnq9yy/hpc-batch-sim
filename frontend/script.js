const healthEl = document.getElementById('health');
const jobsEl = document.getElementById('jobs');
const tableBody = document.querySelector('#resultsTable tbody');
const csvSelect = document.getElementById('csvSelect');
const csvContent = document.getElementById('csvContent');
const rerunBtn = document.getElementById('rerun');
const canvas = document.getElementById('meanChart');
const ctx = canvas.getContext('2d');

let chartData = [];

// -----------------------------
// Fetch system health
// -----------------------------
async function fetchHealth() {
  const res = await fetch('/health');
  const data = await res.json();
  healthEl.innerText = data.status;
}

// -----------------------------
// Fetch job count + load data
// -----------------------------
async function fetchJobs() {
  const res = await fetch('/jobs/count');
  const data = await res.json();
  jobsEl.innerText = data.num_jobs;
  await loadCSVData(data.num_jobs);
}

// -----------------------------
// Read all CSV job files
// -----------------------------
async function loadCSVData(numJobs) {
  tableBody.innerHTML = '';
  csvSelect.innerHTML = '';
  chartData = [];

  for (let i = 1; i <= numJobs; i++) {
    const res = await fetch(`/outputs/job_${i}.csv`);
    const text = await res.text();
    const cleaned = text.trim();

    // Extract list of numbers inside [...]
    const listMatch = cleaned.match(/\[(.*?)\]/);
    const numbers = JSON.parse(listMatch[0]);

    // Extract last two values: sum, mean
    const parts = cleaned.split(',');
    const sum = Number(parts[parts.length - 2]);
    const mean = Number(parts[parts.length - 1]);

    // ---- Table row ----
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i}</td>
      <td>${numbers.join(', ')}</td>
      <td>${sum}</td>
      <td>${mean}</td>
    `;
    tableBody.appendChild(tr);

    // ---- Dropdown ----
    const option = document.createElement('option');
    option.value = i;
    option.innerText = `Job ${i}`;
    csvSelect.appendChild(option);

    // ---- Chart data ----
    chartData.push(mean);
  }

  drawChart();
}

// -----------------------------
// Dropdown CSV preview
// -----------------------------
csvSelect.addEventListener('change', async () => {
  const jobNum = csvSelect.value;
  const res = await fetch(`/outputs/job_${jobNum}.csv`);
  csvContent.innerText = await res.text();
});

// -----------------------------
// Rerun jobs
// -----------------------------
rerunBtn.addEventListener('click', async () => {
  await fetch('/rerun', { method: 'POST' });
  setTimeout(fetchJobs, 2000);
});

// -----------------------------
// Draw chart
// -----------------------------
function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (chartData.length === 0) return;

  // chart padding
  const padding = 50;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;

  // find max mean for scaling
  const maxMean = Math.max(...chartData) * 1.1;

  // draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // draw chart title
  ctx.font = "18px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("Mean Values Across Jobs", canvas.width / 2, 30);

  // draw y-axis label
  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Mean", 0, 0);
  ctx.restore();

  // draw x-axis label
  ctx.font = "14px Arial";
  ctx.fillText("Job Number", canvas.width / 2, canvas.height - 10);

  // plot points and line
  ctx.beginPath();
  chartData.forEach((mean, i) => {
    const x = padding + (i + 0.5) * (width / chartData.length);
    const y = padding + height - (mean / maxMean) * height;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    // draw point
    ctx.fillStyle = "#007bff";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // draw y-axis ticks
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const tickVal = (maxMean / numTicks) * i;
    const y = padding + height - (tickVal / maxMean) * height;
    ctx.fillText(tickVal.toFixed(1), padding - 5, y + 4);
    // horizontal grid line
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }
}

// -----------------------------
// Auto-refresh
// -----------------------------
setInterval(() => {
  fetchHealth();
  fetchJobs();
}, 60000);

// Initial load
fetchHealth();
fetchJobs();