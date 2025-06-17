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

const achievements = [
    {
        id: 'first_entry',
        title: 'First Step',
        description: 'Logged your first wellness entry',
        icon: 'fa-bullseye'
    },
    {
        id: 'streak_3',
        title: 'Getting Started',
        description: 'Logged entries for 3 consecutive days',
        icon: 'fa-fire'
    },
    {
        id: 'water_goal',
        title: 'Hydration Hero',
        description: 'Met your water intake goal for 5 days',
        icon: 'fa-glass-water'
    },
    {
        id: 'sleep_goal',
        title: 'Sleep Champion',
        description: 'Got 8+ hours of sleep for 3 days',
        icon: 'fa-moon'
    },
    {
        id: 'mood_high',
        title: 'Sunshine Spirit',
        description: 'Logged 5 days with high mood ratings',
        icon: 'fa-sun'
    }
];

// Wellness glossary
const wellnessGlossary = [
    {
        term: "Mindfulness",
        definition: "The practice of being fully present and engaged in the current moment, without judgment."
    },
    {
        term: "Sleep Hygiene",
        definition: "Practices and habits that help you get a good night's sleep."
    },
    {
        term: "Stress Management",
        definition: "Techniques and strategies used to control and reduce stress levels."
    },
    {
        term: "Self-Care",
        definition: "Activities and practices that help maintain physical, mental, and emotional health."
    }
];

// Community posts (simulated data)
const communityPosts = [
    {
        id: 1,
        content: "Started my wellness journey today! Feeling optimistic about the changes ahead.",
        timestamp: "2024-01-15T10:30:00"
    },
    {
        id: 2,
        content: "Reached my water intake goal for the third day in a row! Small victories matter.",
        timestamp: "2024-01-14T15:45:00"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${year}-${month}-${day}`;
    
    // Load saved entries
    loadEntries();
    
    // Display random wellness tip
    displayWellnessTip();
    
    // Add form submit handler
    document.getElementById('wellness-form').addEventListener('submit', handleFormSubmit);

    // Add tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize community features
    initializeCommunity();
    
    // Initialize educational content
    initializeEducationalContent();
});

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('date').value,
        symptoms: Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value),
        mood: document.querySelector('input[name="mood"]:checked').value,
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
    
    entriesList.innerHTML = '';
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No entries yet. Start tracking your wellness journey!</p>';
        return;
    }
    
    // Group entries by date
    const entriesByDate = entries.reduce((acc, entry) => {
        const date = entry.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
    }, {});

    // Display wellness entries
    Object.entries(entriesByDate)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
        .forEach(([date, dayEntries]) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-day';
            
            const latestEntry = dayEntries[0];
            const moodEmoji = getMoodEmoji(latestEntry.mood);
            
            entryElement.innerHTML = `
                <div class="entry-day-header">
                    <span class="date">${formatDate(date)}</span>
                    <span class="mood">${moodEmoji}</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="entry-day-content">
                    ${dayEntries.map(entry => `
                        <div class="entry-details">
                            <div class="symptoms">
                                ${entry.symptoms.map(symptom => `
                                    <span class="symptom-tag">
                                        ${getSymptomEmoji(symptom)} ${symptom}
                                    </span>
                                `).join('')}
                            </div>
                            <div class="stats">
                                <div class="stat-item">
                                    <div class="stat-label">Mood</div>
                                    <div class="stat-value">${getMoodEmoji(entry.mood)}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Water</div>
                                    <div class="stat-value">${entry.water} cups</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Sleep</div>
                                    <div class="stat-value">${entry.sleep} hours</div>
                                </div>
                            </div>
                            ${entry.journal ? `
                                <div class="journal-content">
                                    ${entry.journal}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
            entriesList.appendChild(entryElement);
            
            // Add click handler for the header
            const header = entryElement.querySelector('.entry-day-header');
            const content = entryElement.querySelector('.entry-day-content');
            
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                content.classList.toggle('active');
            });
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
    const date = new Date(dateString + 'T00:00:00'); // Ensure consistent timezone handling
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Reset form after submission
function resetForm() {
    document.getElementById('wellness-form').reset();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${year}-${month}-${day}`;
    document.getElementById('journal').value = ''; // Clear journal textarea
}

// Get emoji for mood
function getMoodEmoji(mood) {
    const moodEmojis = {
        '1': '😢',
        '2': '😕',
        '3': '😐',
        '4': '🙂',
        '5': '😊'
    };
    return moodEmojis[mood] || '😐';
}

// Get emoji for symptom
function getSymptomEmoji(symptom) {
    const symptomEmojis = {
        'energetic': '⚡',
        'tired': '😴',
        'headache': '🤕',
        'anxious': '😰',
        'happy': '😊',
        'sad': '😢',
        'stressed': '😤',
        'calm': '😌',
        'productive': '💪',
        'sick': '🤒'
    };
    return symptomEmojis[symptom] || '•';
}

function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    
    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-card ${userAchievements.includes(achievement.id) ? 'unlocked' : 'locked'}">
            <div class="achievement-icon"><i class="fas ${achievement.icon}"></i></div>
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
            ${userAchievements.includes(achievement.id) 
                ? '<span class="achievement-status"><i class="fas fa-trophy"></i> Unlocked!</span>'
                : '<span class="achievement-status locked"><i class="fas fa-lock"></i> Locked</span>'}
        </div>
    `).join('');
}

function showAchievementNotification(newAchievements) {
    newAchievements.forEach(achievementId => {
        const achievement = achievements.find(a => a.id === achievementId);
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon"><i class="fas ${achievement.icon}"></i></div>
            <div class="achievement-content">
                <h3>Achievement Unlocked!</h3>
                <p>${achievement.title}</p>
                <small>${achievement.description}</small>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    });
}

// Accessibility Features
function initializeAccessibility() {
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    
    // High contrast mode
    highContrastToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'high-contrast' ? '' : 'high-contrast';
        localStorage.setItem('theme', document.body.dataset.theme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
    
    // Font size increase
    let currentFontSize = 1;
    fontSizeIncrease.addEventListener('click', () => {
        currentFontSize = currentFontSize === 1 ? 1.2 : 1;
        document.body.style.fontSize = `${currentFontSize}rem`;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Community Features
function initializeCommunity() {
    const communityPostsContainer = document.getElementById('community-posts');
    
    // Display community posts
    function displayCommunityPosts() {
        communityPostsContainer.innerHTML = communityPosts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(post => `
                <div class="post-card">
                    <div class="post-header">
                        <i class="fas fa-user-circle"></i>
                        <span class="post-time">${formatTimestamp(post.timestamp)}</span>
                    </div>
                    <div class="post-content">${post.content}</div>
                </div>
            `).join('');
    }
    
    displayCommunityPosts();
    
    // Add event listeners for community features
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent.trim();
            if (action === 'Find a Buddy') {
                // Implement buddy matching logic
                alert('Buddy matching feature coming soon!');
            } else if (action === 'Share Your Story') {
                // Implement story sharing logic
                alert('Story sharing feature coming soon!');
            }
        });
    });
}

// Educational Content
function initializeEducationalContent() {
    const glossaryContainer = document.getElementById('glossary-container');
    
    // Display glossary
    glossaryContainer.innerHTML = wellnessGlossary
        .map(item => `
            <div class="glossary-item">
                <h3>${item.term}</h3>
                <p>${item.definition}</p>
            </div>
        `).join('');
}

// Utility Functions
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
} 