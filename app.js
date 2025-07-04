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

// Initialize goals
const defaultGoals = [
    {
        id: 'water',
        title: 'Daily Water Intake',
        target: 8,
        unit: 'cups',
        icon: 'fa-tint'
    },
    {
        id: 'sleep',
        title: 'Sleep Duration',
        target: 8,
        unit: 'hours',
        icon: 'fa-moon'
    },
    {
        id: 'mood',
        title: 'Positive Mood Days',
        target: 5,
        unit: 'days',
        icon: 'fa-face-smile'
    }
];

// Personalized insights based on user data
function generateInsights(entries) {
    if (entries.length < 3) {
        return [{
            title: "Getting Started",
            message: "Keep logging your entries to receive personalized insights about your wellness patterns."
        }];
    }

    const insights = [];
    
    // Analyze sleep patterns
    const weekdaySleep = entries.filter(entry => {
        const day = new Date(entry.date).getDay();
        return day >= 1 && day <= 5; // Monday to Friday
    });
    const weekendSleep = entries.filter(entry => {
        const day = new Date(entry.date).getDay();
        return day === 0 || day === 6; // Saturday and Sunday
    });

    if (weekdaySleep.length > 0 && weekendSleep.length > 0) {
        const avgWeekdaySleep = weekdaySleep.reduce((sum, entry) => sum + Number(entry.sleep), 0) / weekdaySleep.length;
        const avgWeekendSleep = weekendSleep.reduce((sum, entry) => sum + Number(entry.sleep), 0) / weekendSleep.length;
        
        if (avgWeekdaySleep < avgWeekendSleep - 1) {
            insights.push({
                title: "Sleep Pattern Detected",
                message: `You sleep ${(avgWeekendSleep - avgWeekdaySleep).toFixed(1)} hours less on weekdays. Try winding down earlier during the week.`
            });
        }
    }

    // Analyze mood and water correlation
    const highMoodEntries = entries.filter(entry => Number(entry.mood) >= 4);
    const lowMoodEntries = entries.filter(entry => Number(entry.mood) <= 2);
    
    if (highMoodEntries.length > 0 && lowMoodEntries.length > 0) {
        const avgWaterHighMood = highMoodEntries.reduce((sum, entry) => sum + Number(entry.water), 0) / highMoodEntries.length;
        const avgWaterLowMood = lowMoodEntries.reduce((sum, entry) => sum + Number(entry.water), 0) / lowMoodEntries.length;
        
        if (avgWaterHighMood > avgWaterLowMood + 1) {
            insights.push({
                title: "Hydration Impact",
                message: `Your mood tends to be better when you drink more water. On high-mood days, you average ${avgWaterHighMood.toFixed(1)} cups vs ${avgWaterLowMood.toFixed(1)} cups on low-mood days.`
            });
        }
    }

    // Analyze symptom patterns
    const symptomCounts = {};
    entries.forEach(entry => {
        entry.symptoms.forEach(symptom => {
            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
    });

    const mostCommonSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostCommonSymptom && mostCommonSymptom[1] >= 3) {
        insights.push({
            title: "Frequent Symptom",
            message: `You've logged "${mostCommonSymptom[0]}" ${mostCommonSymptom[1]} times. Consider discussing this with a healthcare provider.`
        });
    }

    // Analyze streaks
    const recentEntries = entries.slice(-7);
    const goodMoodStreak = recentEntries.filter(entry => Number(entry.mood) >= 4).length;
    if (goodMoodStreak >= 5) {
        insights.push({
            title: "Great Streak!",
            message: `You've had ${goodMoodStreak} positive mood days in the last week. Keep up the great work!`
        });
    }

    // Add personalized wellness tips based on recent symptoms
    const recentSymptoms = entries.slice(-3).flatMap(entry => entry.symptoms);
    if (recentSymptoms.includes('stressed') || recentSymptoms.includes('anxious')) {
        insights.push({
            title: "Stress Management",
            message: "You've been feeling stressed lately. Try the Mindful Moment breathing exercise to help you relax."
        });
    }

    if (recentSymptoms.includes('tired')) {
        insights.push({
            title: "Energy Boost",
            message: "You've been feeling tired. Consider taking short walks or trying some gentle stretching exercises."
        });
    }

    return insights.length > 0 ? insights : [{
        title: "Keep Going",
        message: "Continue tracking your wellness to discover more personalized insights about your patterns."
    }];
}

// Update insights display
function updateInsights(entries) {
    const insightsContainer = document.getElementById('insights-container');
    const insights = generateInsights(entries);
    
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <h3>${insight.title}</h3>
            <p>${insight.message}</p>
        </div>
    `).join('');
}

// Mindful Moment functionality
function initializeMindfulMoment() {
    const modal = document.getElementById('mindful-modal');
    const startButton = document.getElementById('start-mindful-moment');
    const closeButton = document.getElementById('close-mindful-modal');
    const pauseButton = document.getElementById('pause-session');
    const completeButton = document.getElementById('complete-session');
    const timer = document.getElementById('session-timer');
    const breathingCircle = document.querySelector('.breathing-circle');
    
    let sessionInterval;
    let timeLeft = 120; // 2 minutes
    let isPaused = false;
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startSession() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        timeLeft = 120;
        isPaused = false;
        updateTimer();
        
        sessionInterval = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                updateTimer();
                
                if (timeLeft <= 0) {
                    completeSession();
                }
            }
        }, 1000);
    }
    
    function pauseSession() {
        isPaused = !isPaused;
        if (isPaused) {
            pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
            breathingCircle.style.animationPlayState = 'paused';
        } else {
            pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
            breathingCircle.style.animationPlayState = 'running';
        }
    }
    
    function completeSession() {
        clearInterval(sessionInterval);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Save session completion
        const sessions = JSON.parse(localStorage.getItem('mindfulSessions') || '[]');
        sessions.push({
            date: new Date().toISOString(),
            duration: 120 - timeLeft
        });
        localStorage.setItem('mindfulSessions', JSON.stringify(sessions));
        
        // Show completion message
        alert('Great job! You completed your mindful moment session.');
    }
    
    function closeModal() {
        clearInterval(sessionInterval);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        isPaused = false;
        pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        breathingCircle.style.animationPlayState = 'running';
    }
    
    // Event listeners
    startButton.addEventListener('click', startSession);
    closeButton.addEventListener('click', closeModal);
    pauseButton.addEventListener('click', pauseSession);
    completeButton.addEventListener('click', completeSession);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

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

    // Initialize community features
    initializeCommunity();
    
    // Initialize educational content
    initializeEducationalContent();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Add chart period button handlers
    document.querySelectorAll('.chart-period').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.chart-period').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const entries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
            updateChart(entries);
        });
    });

    // Initialize mindful moment
    initializeMindfulMoment();
    
    // Add refresh insights button handler
    document.getElementById('refresh-insights').addEventListener('click', () => {
        const entries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
        updateInsights(entries);
    });
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
    updateMoodCalendar(entries);
    updateStats(entries);
    updateGoalsProgress(entries);
    updateInsights(entries);
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
                    ${dayEntries.map((entry, index) => `
                        <div class="entry-details">
                            <div class="entry-header">
                                <div class="symptoms">
                                    ${entry.symptoms.map(symptom => `
                                        <span class="symptom-tag">
                                            ${getSymptomEmoji(symptom)} ${symptom}
                                        </span>
                                    `).join('')}
                                </div>
                                <button class="remove-entry" data-date="${date}" data-index="${index}" aria-label="Remove entry">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
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

            // Add click handlers for remove buttons
            entryElement.querySelectorAll('.remove-entry').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent header toggle
                    const date = button.dataset.date;
                    const index = parseInt(button.dataset.index);
                    removeEntry(date, index);
                });
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

    const period = document.querySelector('.chart-period.active').dataset.period;
    const filteredEntries = filterEntriesByPeriod(entries, period);
    
    const labels = filteredEntries.map(entry => formatDate(entry.date));
    const moodData = filteredEntries.map(entry => entry.mood);
    const waterData = filteredEntries.map(entry => entry.water);
    const sleepData = filteredEntries.map(entry => entry.sleep);
    
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

// Filter entries by period
function filterEntriesByPeriod(entries, period) {
    const now = new Date();
    const startDate = new Date();
    
    switch(period) {
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }
    
    return entries.filter(entry => new Date(entry.date) >= startDate);
}

// Update mood calendar
function updateMoodCalendar(entries) {
    const calendar = document.getElementById('mood-calendar');
    calendar.innerHTML = '';
    
    // Create calendar grid
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365);
    
    // Create entries map for quick lookup
    const entriesMap = entries.reduce((acc, entry) => {
        acc[entry.date] = entry;
        return acc;
    }, {});
    
    // Generate calendar days
    for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const entry = entriesMap[dateString];
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        if (entry) {
            dayElement.classList.add(`mood-${entry.mood}`);
        }
        calendar.appendChild(dayElement);
    }
}

// Update stats
function updateStats(entries) {
    if (entries.length === 0) return;
    
    // Calculate averages
    const waterAverage = entries.reduce((sum, entry) => sum + Number(entry.water), 0) / entries.length;
    const sleepAverage = entries.reduce((sum, entry) => sum + Number(entry.sleep), 0) / entries.length;
    const moodAverage = entries.reduce((sum, entry) => sum + Number(entry.mood), 0) / entries.length;
    
    // Update DOM
    document.getElementById('water-average').textContent = waterAverage.toFixed(1);
    document.getElementById('sleep-average').textContent = sleepAverage.toFixed(1);
    document.getElementById('mood-average').textContent = moodAverage.toFixed(1);
}

// Update goals progress
function updateGoalsProgress(entries) {
    const goalsContainer = document.getElementById('goals-container');
    goalsContainer.innerHTML = '';
    
    defaultGoals.forEach(goal => {
        const progress = calculateGoalProgress(entries, goal);
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <i class="fas ${goal.icon}"></i>
            <div class="goal-info">
                <h3>${goal.title}</h3>
                <p>${progress.current} / ${goal.target} ${goal.unit}</p>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${(progress.current / goal.target) * 100}%"></div>
            </div>
        `;
        goalsContainer.appendChild(goalElement);
    });
}

// Calculate goal progress
function calculateGoalProgress(entries, goal) {
    switch(goal.id) {
        case 'water':
            return {
                current: Math.round(entries.reduce((sum, entry) => sum + Number(entry.water), 0) / entries.length)
            };
        case 'sleep':
            return {
                current: Math.round(entries.reduce((sum, entry) => sum + Number(entry.sleep), 0) / entries.length)
            };
        case 'mood':
            return {
                current: entries.filter(entry => Number(entry.mood) >= 4).length
            };
        default:
            return { current: 0 };
    }
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

// Add function to remove an entry
function removeEntry(date, index) {
    if (confirm('Are you sure you want to remove this entry?')) {
        const entries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
        const entryToRemove = entries.findIndex(entry => entry.date === date);
        
        if (entryToRemove !== -1) {
            entries.splice(entryToRemove, 1);
            localStorage.setItem('wellnessEntries', JSON.stringify(entries));
            loadEntries(); // Reload the entries display
        }
    }
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const tabsContainer = document.getElementById('tabs-container');
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        tabsContainer.classList.toggle('mobile-open');
        
        // Update hamburger icon
        const icon = mobileMenuToggle.querySelector('i');
        if (tabsContainer.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !tabsContainer.contains(e.target)) {
            tabsContainer.classList.remove('mobile-open');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu when selecting a tab
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                tabsContainer.classList.remove('mobile-open');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            tabsContainer.classList.remove('mobile-open');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
} 