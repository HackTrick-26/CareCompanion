// Wellness tips array
const wellnessTips = [
    "Take a 5-minute break to stretch and breathe deeply.",
    "Stay hydrated! Aim for 8 glasses of water daily.",
    "Get 7-9 hours of sleep for optimal health.",
    "Practice gratitude by writing down 3 things you're thankful for.",
    "Take a short walk outside to boost your mood.",
    "Try a 10-minute meditation session.",
    "Eat a balanced meal with plenty of vegetables.",
    "Connect with a friend or loved one today.",
    "Limit screen time before bed for better sleep.",
    "Practice deep breathing exercises when feeling stressed."
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Load saved entries
    loadEntries();
    
    // Display random wellness tip
    displayWellnessTip();
    
    // Add form submit handler
    document.getElementById('wellness-form').addEventListener('submit', handleFormSubmit);
});

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('date').value,
        symptoms: Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value),
        mood: document.getElementById('mood').value,
        water: document.getElementById('water').value,
        sleep: document.getElementById('sleep').value,
        journal: document.getElementById('journal').value.trim()
    };
    
    saveEntry(entry);
    loadEntries(); // Reload all entries after saving
    resetForm();
}

// Save entry to localStorage
function saveEntry(entry) {
    const entries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
    entries.push(entry);
    localStorage.setItem('wellnessEntries', JSON.stringify(entries));
}

// Load entries from localStorage
function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
    displayEntries(entries);
    updateChart(entries);
}

// Display entries in the history section
function displayEntries(entries) {
    const entriesList = document.getElementById('entries-list');
    const journalEntries = document.getElementById('journal-entries');
    
    entriesList.innerHTML = '';
    journalEntries.innerHTML = '';
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No entries yet. Start tracking your wellness journey!</p>';
        journalEntries.innerHTML = '<p class="no-entries">No journal entries yet. Start writing your thoughts!</p>';
        return;
    }
    
    // Display wellness entries
    entries.slice(-5).reverse().forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-card';
        entryElement.innerHTML = `
            <strong>${formatDate(entry.date)}</strong>
            <p>Mood: ${'😊'.repeat(entry.mood)}</p>
            <p>Symptoms: ${entry.symptoms.join(', ') || 'None'}</p>
            <p>Water: ${entry.water} cups</p>
            <p>Sleep: ${entry.sleep} hours</p>
        `;
        entriesList.appendChild(entryElement);
    });

    // Display journal entries
    entries
        .filter(entry => entry.journal) // Only show entries with journal content
        .slice(-5)
        .reverse()
        .forEach(entry => {
            const journalElement = document.createElement('div');
            journalElement.className = 'journal-entry';
            journalElement.innerHTML = `
                <div class="date">
                    ${formatDate(entry.date)}
                    <span class="mood-indicator">${'😊'.repeat(entry.mood)}</span>
                </div>
                <div class="content">${entry.journal}</div>
            `;
            journalEntries.appendChild(journalElement);
        });
}

// Update the chart with entry data
function updateChart(entries) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    if (entries.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No data to display yet', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = entries.map(entry => formatDate(entry.date));
    const moodData = entries.map(entry => entry.mood);
    const waterData = entries.map(entry => entry.water);
    const sleepData = entries.map(entry => entry.sleep);
    
    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mood',
                    data: moodData,
                    borderColor: '#4a90e2',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Water (cups)',
                    data: waterData,
                    borderColor: '#28a745',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Sleep (hours)',
                    data: sleepData,
                    borderColor: '#ffc107',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Display a random wellness tip
function displayWellnessTip() {
    const tipContent = document.getElementById('tip-content');
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    tipContent.textContent = randomTip;
}

// Format date for display
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Reset form after submission
function resetForm() {
    document.getElementById('wellness-form').reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('journal').value = ''; // Clear journal textarea
} 