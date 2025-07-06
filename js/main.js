// ================================
// CPS TEST PRO - MAIN JAVASCRIPT
// ================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 CPS Test Pro loaded!');
    
    // Initialize all modules
    initializeCPSTest();
    initializeAimTrainer();
    initializeReactionTest();
    initializeNavigation();
    initializeLiveTime();
});

// ================================
// NAVIGATION SYSTEM
// ================================
function initializeNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main .section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and sections
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// ================================
// LIVE TIME DISPLAY
// ================================
function initializeLiveTime() {
    const timeElement = document.getElementById('liveTime');
    if (!timeElement) return;
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ================================
// CPS TEST MODULE
// ================================
function initializeCPSTest() {
    const clickButton = document.getElementById('clickButton');
    const clickCount = document.getElementById('clickCount');
    const timeLeft = document.getElementById('timeLeft');
    const cpsValue = document.getElementById('cpsValue');
    const testDuration = document.getElementById('testDuration');
    const resetTest = document.getElementById('resetTest');
    const testResults = document.getElementById('testResults');
    
    let isTestActive = false;
    let testTimer = null;
    let startTime = null;
    let clicks = 0;
    let duration = 5;
    
    if (!clickButton) return;
    
    // Update duration when selector changes
    if (testDuration) {
        testDuration.addEventListener('change', function() {
            duration = parseInt(this.value);
            if (timeLeft) timeLeft.textContent = duration + 's';
        });
    }
    
    // Click button event
    clickButton.addEventListener('click', function() {
        if (!isTestActive) {
            startCPSTest();
        } else {
            registerClick();
        }
    });
    
    // Reset button event
    if (resetTest) {
        resetTest.addEventListener('click', resetCPSTest);
    }
    
    function startCPSTest() {
        isTestActive = true;
        clicks = 0;
        startTime = Date.now();
        
        // Update UI
        clickButton.querySelector('.click-text').textContent = '¡CLICK!';
        clickButton.querySelector('.click-subtitle').textContent = 'Haz clic lo más rápido que puedas';
        
        // Start countdown
        let remainingTime = duration;
        if (timeLeft) timeLeft.textContent = remainingTime + 's';
        
        testTimer = setInterval(() => {
            remainingTime--;
            if (timeLeft) timeLeft.textContent = remainingTime + 's';
            
            if (remainingTime <= 0) {
                endCPSTest();
            }
        }, 1000);
        
        // Register first click
        registerClick();
    }
    
    function registerClick() {
        if (!isTestActive) return;
        
        clicks++;
        if (clickCount) clickCount.textContent = clicks;
        
        // Calculate real-time CPS
        const elapsed = (Date.now() - startTime) / 1000;
        const currentCPS = (clicks / elapsed).toFixed(1);
        if (cpsValue) cpsValue.textContent = currentCPS;
        
        // Add click animation
        clickButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickButton.style.transform = 'scale(1)';
        }, 50);
    }
    
    function endCPSTest() {
        isTestActive = false;
        clearInterval(testTimer);
        
        // Calculate final results
        const finalCPS = (clicks / duration).toFixed(1);
        const level = getCPSLevel(parseFloat(finalCPS));
        
        // Update UI
        clickButton.querySelector('.click-text').textContent = '¡TEST COMPLETADO!';
        clickButton.querySelector('.click-subtitle').textContent = 'Presiona Reiniciar para volver a intentar';
        
        // Show results
        showCPSResults(finalCPS, level, clicks, duration);
        
        // Save to history
        saveCPSToHistory(finalCPS, level, clicks, duration);
    }
    
    function resetCPSTest() {
        isTestActive = false;
        clearInterval(testTimer);
        clicks = 0;
        
        // Reset UI
        clickButton.querySelector('.click-text').textContent = '¡HAZ CLIC!';
        clickButton.querySelector('.click-subtitle').textContent = 'Presiona para comenzar';
        
        if (clickCount) clickCount.textContent = '0';
        if (timeLeft) timeLeft.textContent = duration + 's';
        if (cpsValue) cpsValue.textContent = '0.0';
        if (testResults) testResults.style.display = 'none';
    }
    
    function getCPSLevel(cps) {
        if (cps >= 19) return { name: 'GUEPARDO', icon: '🐆', desc: '¡Eres increíblemente rápido!' };
        if (cps >= 15) return { name: 'TIGRE', icon: '🐅', desc: '¡Velocidad profesional!' };
        if (cps >= 11) return { name: 'LEÓN', icon: '🦁', desc: '¡Muy buena velocidad!' };
        if (cps >= 8) return { name: 'OSO', icon: '🐻', desc: '¡Buen ritmo!' };
        if (cps >= 5) return { name: 'PERRO', icon: '🐕', desc: '¡Sigue practicando!' };
        return { name: 'KOALA', icon: '🐨', desc: '¡Puedes mejorar!' };
    }
    
    function showCPSResults(cps, level, totalClicks, testDuration) {
        if (!testResults) return;
        
        // Update result elements
        const finalCPSElement = document.getElementById('finalCPS');
        const levelIcon = document.getElementById('levelIcon');
        const levelName = document.getElementById('levelName');
        const levelDescription = document.getElementById('levelDescription');
        const totalClicksElement = document.getElementById('totalClicks');
        const testDurationResult = document.getElementById('testDurationResult');
        const averageCPS = document.getElementById('averageCPS');
        
        if (finalCPSElement) finalCPSElement.textContent = cps;
        if (levelIcon) levelIcon.textContent = level.icon;
        if (levelName) levelName.textContent = level.name;
        if (levelDescription) levelDescription.textContent = level.desc;
        if (totalClicksElement) totalClicksElement.textContent = totalClicks;
        if (testDurationResult) testDurationResult.textContent = testDuration + 's';
        if (averageCPS) averageCPS.textContent = cps + ' CPS';
        
        // Show results section
        testResults.style.display = 'block';
        testResults.scrollIntoView({ behavior: 'smooth' });
        
        // Add animation
        testResults.style.opacity = '0';
        testResults.style.transform = 'translateY(20px)';
        setTimeout(() => {
            testResults.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            testResults.style.opacity = '1';
            testResults.style.transform = 'translateY(0)';
        }, 100);
    }
    
    function saveCPSToHistory(cps, level, clicks, duration) {
        const history = JSON.parse(localStorage.getItem('cps-history') || '[]');
        const newEntry = {
            cps: parseFloat(cps),
            level: level.name,
            icon: level.icon,
            clicks: clicks,
            duration: duration,
            date: new Date().toLocaleString('es-ES')
        };
        
        history.unshift(newEntry);
        if (history.length > 10) history.pop(); // Keep only last 10
        
        localStorage.setItem('cps-history', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        const history = JSON.parse(localStorage.getItem('cps-history') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-chart-line"></i>
                    <p>Completa tu primer test para ver el historial</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = history.map(entry => `
            <div class="history-item">
                <div class="history-icon">${entry.icon}</div>
                <div class="history-details">
                    <div class="history-cps">${entry.cps} CPS</div>
                    <div class="history-level">${entry.level}</div>
                    <div class="history-stats">${entry.clicks} clicks en ${entry.duration}s</div>
                    <div class="history-date">${entry.date}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Initialize history display
    updateHistoryDisplay();
}

// ================================
// AIM TRAINER MODULE (Basic)
// ================================
function initializeAimTrainer() {
    const startButton = document.getElementById('startAimTraining');
    const canvas = document.getElementById('aimCanvas');
    const instructions = document.getElementById('aimInstructions');
    
    if (!startButton || !canvas) return;
    
    startButton.addEventListener('click', function() {
        if (instructions) {
            instructions.innerHTML = `
                <h3>🎯 Aim Trainer Activado</h3>
                <p>¡Haz clic en los targets que aparezcan!</p>
                <p><strong>Modo:</strong> Tracking Básico</p>
            `;
        }
        
        // Basic aim trainer logic would go here
        console.log('🎯 Aim Trainer started!');
    });
}

// ================================
// REACTION TEST MODULE (Basic)
// ================================
function initializeReactionTest() {
    const startButton = document.getElementById('startReactionTest');
    const reactionBox = document.getElementById('reactionBox');
    
    if (!startButton || !reactionBox) return;
    
    startButton.addEventListener('click', function() {
        console.log('⚡ Reaction Test started!');
        // Basic reaction test logic would go here
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================
function createFloatingNumber(x, y, value, color = '#00ff00') {
    const floatingDiv = document.createElement('div');
    floatingDiv.className = 'floating-number';
    floatingDiv.textContent = `+${value}`;
    floatingDiv.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: ${color};
        font-weight: bold;
        font-size: 1.2em;
        pointer-events: none;
        z-index: 9999;
        transition: all 1s ease-out;
    `;
    
    document.body.appendChild(floatingDiv);
    
    // Animate
    setTimeout(() => {
        floatingDiv.style.transform = 'translateY(-50px)';
        floatingDiv.style.opacity = '0';
    }, 50);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(floatingDiv);
    }, 1000);
}

// ================================
// SOCIAL SHARING
// ================================
function shareCPSResult(cps, level) {
    const text = `¡Obtuve ${cps} CPS en el nivel ${level} en CPS Test Pro! 🎯 ¿Puedes superarme?`;
    const url = 'https://testsparagamers.netlify.app';
    
    if (navigator.share) {
        navigator.share({
            title: 'CPS Test Pro - Mi Resultado',
            text: text,
            url: url
        });
    } else {
        // Fallback to Twitter
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    }
}

console.log('🚀 CPS Test Pro JavaScript loaded successfully!');