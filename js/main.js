// ===================== CPS TEST LOGIC =====================
(function cpsTestLogic() {
    // ...lógica profesional del test de CPS...
    const clickButton = document.getElementById('clickButton');
    const clickArea = document.getElementById('clickArea');
    const timeLeft = document.getElementById('timeLeft');
    const clickCount = document.getElementById('clickCount');
    const cpsValue = document.getElementById('cpsValue');
    const testDurationSelect = document.getElementById('testDuration');
    const resetTest = document.getElementById('resetTest');
    const testResults = document.getElementById('testResults');
    const finalCPS = document.getElementById('finalCPS');
    const levelIcon = document.getElementById('levelIcon');
    const levelName = document.getElementById('levelName');
    const levelDescription = document.getElementById('levelDescription');
    const totalClicks = document.getElementById('totalClicks');
    const testDurationResult = document.getElementById('testDurationResult');
    const averageCPS = document.getElementById('averageCPS');
    const historyList = document.getElementById('historyList');
    let timer = null, started = false, clicks = 0, duration = 5, time = 5, cps = 0, startTime = 0;
    let history = [];

    const levels = [
        { min: 0, max: 4, icon: '🐨', name: 'Koala', desc: '¡Sigue practicando!' },
        { min: 5, max: 7, icon: '🐕', name: 'Perro', desc: '¡Buen ritmo!' },
        { min: 8, max: 10, icon: '🐻', name: 'Oso', desc: '¡Muy bien!' },
        { min: 11, max: 14, icon: '🦁', name: 'León', desc: '¡Eres rápido!' },
        { min: 15, max: 18, icon: '🐅', name: 'Tigre', desc: '¡Nivel Pro!' },
        { min: 19, max: 999, icon: '🐆', name: 'Guepardo', desc: '¡Increíble, eres élite!' }
    ];

    function getLevel(cps) {
        return levels.find(l => cps >= l.min && cps <= l.max) || levels[0];
    }

    // El cálculo de CPS es clicks totales dividido por el tiempo real transcurrido (en segundos)
    function updateStats() {
        timeLeft.textContent = time + 's';
        clickCount.textContent = clicks;
        let elapsed = started ? ((Date.now() - startTime) / 1000) : 0;
        if (elapsed > 0) {
            cps = clicks / elapsed;
        } else {
            cps = 0;
        }
        cpsValue.textContent = cps.toFixed(2);
    }

    function resetAll() {
        clearInterval(timer);
        started = false;
        clicks = 0;
        time = parseInt(testDurationSelect.value);
        duration = time;
        startTime = 0;
        updateStats();
        testResults.style.display = 'none';
        clickButton.disabled = false;
        clickButton.querySelector('.click-text').textContent = '¡HAZ CLIC!';
        clickButton.querySelector('.click-subtitle').textContent = 'Presiona para comenzar';
    }

    function showResults() {
        let elapsed = ((Date.now() - startTime) / 1000) || duration;
        // Corrige si el tiempo es mayor al seleccionado (por retraso de setInterval)
        if (elapsed > duration) elapsed = duration;
        const final = (clicks / elapsed) || 0;
        finalCPS.textContent = final.toFixed(2);
        totalClicks.textContent = clicks;
        testDurationResult.textContent = elapsed.toFixed(2) + 's';
        averageCPS.textContent = final.toFixed(2) + ' CPS';
        const lvl = getLevel(final);
        levelIcon.textContent = lvl.icon;
        levelName.textContent = lvl.name;
        levelDescription.textContent = lvl.desc;
        // Análisis de resultados visual (más grande)
        let analysis = `<div style='font-size:1.35em;margin-bottom:0.7em;color:#7ec7ff;'><b>ANÁLISIS DE RESULTADOS</b></div>`;
        analysis += `<div style='margin-bottom:0.7em;font-size:1.18em;'>Clicks totales: <b style="color:#fff;">${clicks}</b></div>`;
        analysis += `<div style='margin-bottom:0.7em;font-size:1.18em;'>Tiempo real: <b style="color:#fff;">${elapsed.toFixed(2)}s</b></div>`;
        analysis += `<div style='margin-bottom:0.7em;text-align:center;'><span style='background:#232b4d;padding:0.35em 1.2em;border-radius:10px;font-family:monospace;font-size:1.25em;color:#7ec7ff;box-shadow:0 1px 6px #0a0e1a40;'><b>CPS = ${clicks} ÷ ${elapsed.toFixed(2)} = ${final.toFixed(2)}</b></span></div>`;
        analysis += `<div style='margin-bottom:0.7em;font-size:1.18em;'>Nivel alcanzado: <span style='font-weight:bold;color:#fff;font-size:1.25em;'>${lvl.icon} ${lvl.name}</span></div>`;
        analysis += `<div style='font-size:1.08em;color:#b3c6ff;'>${lvl.desc}</div>`;
        // Muestra el análisis en el div de resultados si existe
        const resultCard = testResults.querySelector('.result-card');
        if(resultCard) {
            let analysisDiv = resultCard.querySelector('.cps-analysis');
            if(!analysisDiv) {
                analysisDiv = document.createElement('div');
                analysisDiv.className = 'cps-analysis';
                analysisDiv.style.marginTop = '1.5em';
                resultCard.appendChild(analysisDiv);
            }
            analysisDiv.innerHTML = analysis;
        }
        testResults.style.display = 'block';
        // Historial
        history.unshift({ cps: final, clicks, duration: elapsed, date: new Date() });
        renderHistory();
    }

    function renderHistory() {
        if (!history.length) return;
        historyList.innerHTML = history.map(h => `
            <div class="history-item">
                <span>${h.cps.toFixed(1)} CPS</span>
                <span>${h.clicks} clicks</span>
                <span>${h.duration}s</span>
                <span>${h.date.toLocaleTimeString()}</span>
            </div>
        `).join('');
    }

    function tick() {
        if (time <= 0) {
            clearInterval(timer);
            showResults();
            clickButton.disabled = true;
            clickButton.querySelector('.click-text').textContent = '¡TERMINADO!';
            clickButton.querySelector('.click-subtitle').textContent = 'Reinicia para intentar de nuevo';
            return;
        }
        time--;
        updateStats();
    }

    clickButton && clickButton.addEventListener('click', function () {
        if (!started) {
            started = true;
            clicks = 0;
            time = parseInt(testDurationSelect.value);
            duration = time;
            updateStats();
            timer = setInterval(tick, 1000);
            startTime = Date.now();
        }
        if (time > 0) {
            clicks++;
            updateStats();
        }
    });

    resetTest && resetTest.addEventListener('click', resetAll);
    testDurationSelect && testDurationSelect.addEventListener('change', resetAll);
    // Compartir y reintentar
    testResults && testResults.querySelector('.try-again-btn')?.addEventListener('click', resetAll);
    // Inicializar
    resetAll();
})();

// ===================== AIM TRAINER LOGIC =====================
(function aimTrainerLogic() {
    // ...lógica profesional del aim trainer con lag/ping...
    const aimCanvas = document.getElementById('aimCanvas');
    const ctx = aimCanvas?.getContext('2d');
    const aimDuration = document.getElementById('aimDuration');
    const targetSizeSel = document.getElementById('targetSize');
    const targetSpeedSel = document.getElementById('targetSpeed');
    const aimAccuracy = document.getElementById('aimAccuracy');
    const aimTargets = document.getElementById('aimTargets');
    const aimTimeLeft = document.getElementById('aimTimeLeft');
    const aimScore = document.getElementById('aimScore');
    const aimInstructions = document.getElementById('aimInstructions');
    const startAimNormal = document.getElementById('startAimNormal');
    const pauseAimTraining = document.getElementById('pauseAimTraining');
    const resetAimTraining = document.getElementById('resetAimTraining');
    const aimResults = document.getElementById('aimResults');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const finalScore = document.getElementById('finalScore');
    const avgReactionTime = document.getElementById('avgReactionTime');
    const finalTargets = document.getElementById('finalTargets');
    const finalRankIcon = document.getElementById('finalRankIcon');
    const finalRankTitle = document.getElementById('finalRankTitle');
    const finalRankSubtitle = document.getElementById('finalRankSubtitle');
    const aimRecommendations = document.getElementById('aimRecommendations');
    let mode = 'tracking';
    let running = false, paused = false, timer = null, time = 60, duration = 60;
    let targets = [], hits = 0, total = 0, score = 0, reactionTimes = [], lastTargetTime = 0;
    let lagMs = 0, pingMs = 0;
    let crosshairColor = '#fff';
    let crosshairSize = 28;    // Modos de entrenamiento
    let currentMode = 'tracking';
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.getAttribute('data-mode');
            const modeName = this.querySelector('.mode-name').textContent;
            document.getElementById('currentMode').textContent = modeName;
            document.getElementById('currentModeDisplay').textContent = modeName;
            
            // Actualizar información del modo
            updateModeInfo();
        });
    });
    
    function updateModeInfo() {
        const aimInstructions = document.getElementById('aimInstructions');
        if (aimInstructions) {
            const modeDisplay = document.getElementById('currentModeDisplay');
            const duration = document.getElementById('aimDuration').value;
            document.getElementById('currentDuration').textContent = duration;
            
            // Resetear al cambiar modo
            resetAim();
        }
    }

    // Configuración
    function getTargetSize() {
        const val = targetSizeSel.value;
        if (val === 'small') return 32;
        if (val === 'medium') return 44;
        if (val === 'large') return 60;
        if (val === 'random') return 32 + Math.random() * 28;
        return 44;
    }
    function getTargetSpeed() {
        const val = targetSpeedSel.value;
        if (val === 'slow') return 1.5;
        if (val === 'medium') return 2.5;
        if (val === 'fast') return 4;
        if (val === 'insane') return 7;
        return 2.5;
    }
    function getLagAndPing() {
        // Simula lag/ping realista: 10-60ms de lag, 20-80ms de ping
        lagMs = 10 + Math.random() * 50;
        pingMs = 20 + Math.random() * 60;
    }    function resetAim() {
        running = false;
        paused = false;
        clearInterval(timer);
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        time = parseInt(aimDuration.value);
        duration = time;
        targets = [];
        hits = 0;
        total = 0;
        score = 0;
        reactionTimes = [];
        aimResults.style.display = 'none';
        aimInstructions.style.display = 'block';
        aimCanvas.style.pointerEvents = 'none';
        updateStats();
        ctx && (ctx.clearRect(0, 0, aimCanvas.width, aimCanvas.height));
        pauseAimTraining.disabled = true;
        resetAimTraining.disabled = true;
        // Resetear botón de pausa
        pauseAimTraining.innerHTML = '<i class="fas fa-pause"></i><span>Pausar</span>';
    }

    function updateStats() {
        aimAccuracy.textContent = total ? Math.round((hits / total) * 100) + '%' : '0%';
        aimTargets.textContent = hits + '/' + total;
        aimTimeLeft.textContent = time + 's';
        aimScore.textContent = score;
    }    function showAimResults() {
        console.log('Mostrando resultados del aim trainer...');
        const accuracy = total ? Math.round((hits / total) * 100) : 0;
        const avgReaction = reactionTimes.length ? Math.round(reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length) : 0;
        const baseScore = hits * 100;
        
        // Calcular score ajustado por dificultad
        const { adjustedScore, difficultyMultiplier } = getAdjustedScore(baseScore, accuracy);
        const rankInfo = getAdjustedRank(accuracy, adjustedScore, difficultyMultiplier);
        
        console.log(`Accuracy: ${accuracy}%, Base Score: ${baseScore}, Adjusted Score: ${adjustedScore}, Multiplier: ${difficultyMultiplier}x`);
        
        // Asegurar que los elementos existen antes de actualizar
        if (finalAccuracy) finalAccuracy.textContent = accuracy + '%';
        if (finalScore) finalScore.textContent = adjustedScore;
        if (avgReactionTime) avgReactionTime.textContent = avgReaction + 'ms';
        if (finalTargets) finalTargets.textContent = hits;
        
        if (finalRankIcon) finalRankIcon.textContent = rankInfo.rank;
        if (finalRankTitle) finalRankTitle.textContent = rankInfo.title;
        if (finalRankSubtitle) finalRankSubtitle.textContent = rankInfo.subtitle;
        
        // Análisis detallado de resultados con información de dificultad
        let analysis = `
            <div style='margin-bottom:1rem;'>
                <div style='font-size:1.2em;color:#7ec7ff;margin-bottom:0.5rem;'><b>📊 Análisis Profesional del Entrenamiento</b></div>
                <div style='background:rgba(74,158,255,0.1);padding:1rem;border-radius:8px;border-left:4px solid #7ec7ff;'>
                    <div style='margin-bottom:0.5rem;'><b>Modo:</b> ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}</div>
                    <div style='margin-bottom:0.5rem;'><b>Configuración:</b> ${targetSizeSel.options[targetSizeSel.selectedIndex].text} - ${targetSpeedSel.options[targetSpeedSel.selectedIndex].text}</div>
                    <div style='margin-bottom:0.5rem;'><b>Targets eliminados:</b> ${hits} de ${total} intentos</div>
                    <div style='margin-bottom:0.5rem;'><b>Precisión alcanzada:</b> ${accuracy}%</div>
                    <div style='margin-bottom:0.5rem;'><b>Tiempo de reacción promedio:</b> ${avgReaction}ms</div>
                    <div style='margin-bottom:0.8rem;'><b>Multiplicador de dificultad:</b> <span style='color:#7ec7ff;font-weight:bold;'>${difficultyMultiplier}x</span> (${rankInfo.difficulty})</div>
                    <div style='text-align:center;margin-top:1rem;'>
                        <span style='background:#232b4d;padding:0.5em 1.2em;border-radius:8px;font-family:monospace;font-size:1.1em;color:#7ec7ff;box-shadow:0 2px 10px rgba(0,0,0,0.3);'>
                            <b>Score Ajustado = ${baseScore} × ${difficultyMultiplier} = ${adjustedScore} puntos</b>
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar análisis al contenedor específico
        const analysisContainer = document.getElementById('analysisContent');
        if (analysisContainer) {
            analysisContainer.innerHTML = analysis;
        }
        
        // Recomendaciones mejoradas basadas en dificultad
        if (aimRecommendations) {
            aimRecommendations.innerHTML = '';
            if (difficultyMultiplier < 0.8) {
                aimRecommendations.innerHTML += '<div class="recommendation-item"><i class="fas fa-arrow-up"></i> Aumenta la dificultad: prueba targets más pequeños o velocidad mayor</div>';
            } else if (difficultyMultiplier > 1.4) {
                aimRecommendations.innerHTML += '<div class="recommendation-item"><i class="fas fa-trophy"></i> ¡Configuración extrema! Eres un verdadero profesional</div>';
            } else if (accuracy < 50) {
                aimRecommendations.innerHTML += '<div class="recommendation-item"><i class="fas fa-target"></i> Reduce la velocidad de targets y practica precisión</div>';
            } else if (accuracy < 75) {
                aimRecommendations.innerHTML += '<div class="recommendation-item"><i class="fas fa-crosshairs"></i> Buen progreso, mantén esta configuración para mejorar</div>';
            } else {
                aimRecommendations.innerHTML += '<div class="recommendation-item"><i class="fas fa-star"></i> ¡Excelente! Aumenta la dificultad para mayor desafío</div>';
            }
        }
        
        // Mostrar resultados y hacer scroll
        if (aimResults) {
            aimResults.style.display = 'block';
            console.log('Div de resultados mostrado');
            // Scroll suave hacia los resultados
            setTimeout(() => {
                aimResults.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 200);
        } else {
            console.error('No se encontró el div de resultados');
        }
          // Guardar en historial con datos ajustados
        const historyData = {
            mode: currentMode.charAt(0).toUpperCase() + currentMode.slice(1),
            accuracy: accuracy,
            score: adjustedScore, // Usar score ajustado
            baseScore: baseScore,
            difficultyMultiplier: difficultyMultiplier,
            hits: hits,
            total: total,
            avgReaction: avgReaction,
            duration: duration,
            settings: {
                targetSize: targetSizeSel.options[targetSizeSel.selectedIndex].text,
                speed: targetSpeedSel.options[targetSpeedSel.selectedIndex].text
            }
        };
        
        console.log('Datos a guardar en historial:', historyData);
        saveToHistory(historyData);
    }    // Variables para historial
    let aimHistory = [];
    
    // Cargar historial del localStorage al iniciar
    try {
        const savedHistory = localStorage.getItem('aimHistory');
        if (savedHistory) {
            aimHistory = JSON.parse(savedHistory);
            console.log('Historial cargado:', aimHistory.length, 'items');
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
        aimHistory = [];
    }function saveToHistory(result) {
        console.log('Guardando en historial:', result);
        
        aimHistory.unshift({
            ...result,
            date: new Date(),
            id: Date.now()
        });
        
        // Mantener solo los últimos 10 resultados
        if (aimHistory.length > 10) {
            aimHistory = aimHistory.slice(0, 10);
        }
        
        try {
            localStorage.setItem('aimHistory', JSON.stringify(aimHistory));
            console.log('Historial guardado correctamente. Total items:', aimHistory.length);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
        
        renderAimHistory();
    }function renderAimHistory() {
        const historyContainer = document.getElementById('aimHistoryList');
        if (!historyContainer) return;

        if (aimHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-target"></i>
                    <p>Completa tu primer entrenamiento para ver el historial</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = aimHistory.map(item => `
            <div class="aim-history-item">
                <div class="history-rank">${getRankIcon(item.accuracy, item.score)}</div>
                <div class="history-details">
                    <div class="history-mode">${item.mode}</div>
                    <div class="history-stats">
                        <span>Precisión: <strong>${item.accuracy}%</strong></span>
                        <span>Score: <strong>${item.score}</strong></span>
                        <span>Targets: <strong>${item.hits}</strong></span>
                        ${item.difficultyMultiplier ? `<span>Dificultad: <strong>${item.difficultyMultiplier}x</strong></span>` : ''}
                    </div>
                    ${item.settings ? `<div class="history-settings">${item.settings.targetSize} - ${item.settings.speed}</div>` : ''}
                    <div class="history-date">${new Date(item.date).toLocaleDateString()} ${new Date(item.date).toLocaleTimeString().slice(0,5)}</div>
                </div>
            </div>
        `).join('');
    }// Sistema de multiplicadores de dificultad profesional
    function getDifficultyMultiplier() {
        let multiplier = 1.0;
        
        // Multiplicador por tamaño de target
        const targetSize = targetSizeSel.value;
        switch(targetSize) {
            case 'small': multiplier *= 1.5; break;    // +50% por targets pequeños
            case 'medium': multiplier *= 1.0; break;   // Base
            case 'large': multiplier *= 0.7; break;    // -30% por targets grandes
            case 'random': multiplier *= 1.2; break;   // +20% por variabilidad
        }
        
        // Multiplicador por velocidad
        const speed = targetSpeedSel.value;
        switch(speed) {
            case 'slow': multiplier *= 0.6; break;     // -40% por velocidad lenta
            case 'medium': multiplier *= 1.0; break;   // Base
            case 'fast': multiplier *= 1.3; break;     // +30% por velocidad alta
            case 'insane': multiplier *= 1.7; break;   // +70% por velocidad insana
        }
          // Multiplicador por modo de entrenamiento
        switch(currentMode) {
            case 'tracking': multiplier *= 1.2; break; // +20% por seguimiento
            case 'flicking': multiplier *= 1.0; break; // Base
            case 'gridshot': multiplier *= 0.9; break; // -10% por targets estáticos
            case 'strafe': multiplier *= 1.4; break;   // +40% por movimiento
            case 'shooting-range': multiplier *= 1.3; break; // +30% por precisión anatómica
        }
        
        // Multiplicador por duración (entrenamientos más largos son más difíciles)
        const durationMins = duration / 60;
        if (durationMins >= 2) multiplier *= 1.2;      // +20% por 2+ minutos
        else if (durationMins >= 1.5) multiplier *= 1.1; // +10% por 1.5+ minutos
        else if (durationMins < 0.5) multiplier *= 0.8;  // -20% por menos de 30s
        
        return Math.round(multiplier * 100) / 100; // Redondear a 2 decimales
    }
    
    function getAdjustedScore(baseScore, accuracy) {
        const difficultyMultiplier = getDifficultyMultiplier();
        const adjustedScore = Math.round(baseScore * difficultyMultiplier);
        return { adjustedScore, difficultyMultiplier };
    }
    
    function getAdjustedRank(accuracy, adjustedScore, difficultyMultiplier) {
        // Umbrales base ajustados por dificultad
        const baseThresholds = {
            expert: { accuracy: 85, score: 2000 },
            professional: { accuracy: 75, score: 1500 },
            good: { accuracy: 65, score: 1000 },
            intermediate: { accuracy: 50, score: 500 },
            novice: { accuracy: 0, score: 0 }
        };
        
        // Ajustar umbrales según dificultad
        const adjustedThresholds = {};
        Object.keys(baseThresholds).forEach(level => {
            adjustedThresholds[level] = {
                accuracy: Math.max(baseThresholds[level].accuracy - (difficultyMultiplier - 1) * 20, 30),
                score: Math.round(baseThresholds[level].score / difficultyMultiplier)
            };
        });
        
        // Determinar rango
        if (accuracy >= adjustedThresholds.expert.accuracy && adjustedScore >= adjustedThresholds.expert.score) {
            return { rank: '👑', title: 'Experto', subtitle: '¡Rendimiento excepcional! Nivel profesional', difficulty: 'EXTREMA' };
        } else if (accuracy >= adjustedThresholds.professional.accuracy && adjustedScore >= adjustedThresholds.professional.score) {
            return { rank: '🥇', title: 'Profesional', subtitle: '¡Excelente nivel! Listo para competir', difficulty: 'ALTA' };
        } else if (accuracy >= adjustedThresholds.good.accuracy && adjustedScore >= adjustedThresholds.good.score) {
            return { rank: '🥈', title: 'Bueno', subtitle: '¡Buen rendimiento! Vas por buen camino', difficulty: 'MEDIA' };
        } else if (accuracy >= adjustedThresholds.intermediate.accuracy && adjustedScore >= adjustedThresholds.intermediate.score) {
            return { rank: '🥉', title: 'Intermedio', subtitle: '¡Progreso notable! Continúa entrenando', difficulty: 'BAJA' };
        } else {
            return { rank: '🔰', title: 'Novato', subtitle: 'Sigue practicando para mejorar', difficulty: 'PRINCIPIANTE' };
        }
    }    function spawnTarget() {
        const size = getTargetSize();
        
        if (currentMode === 'shooting-range') {
            // Maniquí para shooting range
            return spawnMannequin();
        }
        
        let x = Math.random() * (aimCanvas.width - size);
        let y = Math.random() * (aimCanvas.height - size);
        let dx = 0, dy = 0;
        if (currentMode === 'tracking' || currentMode === 'strafe') {
            const angle = Math.random() * 2 * Math.PI;
            const speed = getTargetSpeed();
            dx = Math.cos(angle) * speed;
            dy = Math.sin(angle) * speed;
        }
        return { x, y, size, dx, dy, created: Date.now() };
    }
      function spawnMannequin() {
        // 3 líneas de profundidad: adelante, medio, atrás
        const lines = [
            { y: 420, scale: 1.2, points: 1.0 },    // Línea adelante (más grande, puntos normales)
            { y: 320, scale: 1.0, points: 1.2 },    // Línea medio (tamaño normal, +20% puntos)
            { y: 220, scale: 0.8, points: 1.5 }     // Línea atrás (más pequeño, +50% puntos)
        ];
        
        const selectedLine = lines[Math.floor(Math.random() * lines.length)];
        const baseWidth = 60;
        const baseHeight = 140;
        const mannequinWidth = baseWidth * selectedLine.scale;
        const mannequinHeight = baseHeight * selectedLine.scale;
        
        const x = Math.random() * (aimCanvas.width - mannequinWidth);
        const y = selectedLine.y - mannequinHeight;
        const speed = getTargetSpeed() * 0.8;
        const dx = Math.random() > 0.5 ? speed : -speed;
        
        return {
            type: 'mannequin',
            x: x,
            y: y,
            width: mannequinWidth,
            height: mannequinHeight,
            dx: dx,
            dy: 0,
            scale: selectedLine.scale,
            pointsMultiplier: selectedLine.points,
            line: selectedLine,
            created: Date.now(),
            hitPoints: {
                head: { 
                    x: mannequinWidth * 0.5, 
                    y: mannequinHeight * 0.15, 
                    radius: 15 * selectedLine.scale, 
                    basePoints: 100 
                },
                chest: { 
                    x: mannequinWidth * 0.5, 
                    y: mannequinHeight * 0.5, 
                    radius: 20 * selectedLine.scale, 
                    basePoints: 60 
                },
                legs: { 
                    x: mannequinWidth * 0.5, 
                    y: mannequinHeight * 0.85, 
                    radius: 18 * selectedLine.scale, 
                    basePoints: 30 
                }
            }
        };
    }function drawTargets() {
        ctx.clearRect(0, 0, aimCanvas.width, aimCanvas.height);
        
        // Dibujar fondo del campo de tiro para shooting range
        if (currentMode === 'shooting-range') {
            drawShootingRangeBackground();
        }
        
        // Dibuja targets según el modo
        targets.forEach(t => {
            if (t.type === 'mannequin') {
                drawMannequin(t);
            } else {
                // Targets normales tipo shooter (blanco con borde rojo)
                ctx.beginPath();
                ctx.arc(t.x + t.size/2, t.y + t.size/2, t.size/2, 0, 2 * Math.PI);
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#ff3c3c';
                ctx.shadowBlur = 0;
                ctx.fill();
                // Borde rojo
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#ff3c3c';
                ctx.stroke();
                // Centro rojo
                ctx.beginPath();
                ctx.arc(t.x + t.size/2, t.y + t.size/2, t.size/6, 0, 2 * Math.PI);
                ctx.fillStyle = '#ff3c3c';
                ctx.fill();
            }
        });
        
        // Dibuja crosshair solo si no es shooting range
        if (currentMode !== 'shooting-range') {
            drawCrosshair();
        }
    }
      function drawShootingRangeBackground() {
        // Fondo degradado del campo de tiro
        const gradient = ctx.createLinearGradient(0, 0, 0, aimCanvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Cielo azul claro
        gradient.addColorStop(0.4, '#98FB98'); // Verde claro
        gradient.addColorStop(1, '#228B22'); // Verde oscuro
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, aimCanvas.width, aimCanvas.height);
        
        // Dibujar las 3 líneas de tiro con perspectiva
        const lines = [
            { y: 420, color: '#8B4513', width: 8, label: 'LÍNEA ADELANTE' },
            { y: 320, color: '#A0522D', width: 6, label: 'LÍNEA MEDIO' },
            { y: 220, color: '#CD853F', width: 4, label: 'LÍNEA ATRÁS' }
        ];
        
        lines.forEach((line, index) => {
            // Línea base
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.width;
            ctx.beginPath();
            ctx.moveTo(0, line.y);
            ctx.lineTo(aimCanvas.width, line.y);
            ctx.stroke();
            
            // Marcadores de distancia cada 100px
            ctx.fillStyle = line.color;
            for (let i = 100; i < aimCanvas.width; i += 100) {
                ctx.fillRect(i - 2, line.y - 5, 4, 10);
            }
            
            // Etiquetas de línea
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${12 - index}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillText(line.label, 10, line.y - 10);
            
            // Indicador de puntos bonus
            const bonusText = index === 0 ? '1x' : index === 1 ? '1.2x' : '1.5x';
            ctx.fillStyle = '#ffff00';
            ctx.font = `bold ${10 - index}px Arial`;
            ctx.textAlign = 'right';
            ctx.fillText(bonusText + ' PUNTOS', aimCanvas.width - 10, line.y - 10);
        });
        
        // Bareras laterales del campo
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, 200, 20, aimCanvas.height - 200);
        ctx.fillRect(aimCanvas.width - 20, 200, 20, aimCanvas.height - 200);
    }
      function drawMannequin(mannequin) {
        const { x, y, width, height, hitPoints, scale, pointsMultiplier } = mannequin;
        
        // Sombra del maniquí (más pequeña para líneas lejanas)
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * scale})`;
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height + 5, width/3, 8 * scale, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Cuerpo principal del maniquí
        ctx.fillStyle = '#D2B48C'; // Color carne
        ctx.fillRect(x + width * 0.3, y + height * 0.25, width * 0.4, height * 0.6); // Torso
        
        // Cabeza
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.arc(x + hitPoints.head.x, y + hitPoints.head.y, hitPoints.head.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Brazos (proporcionados al tamaño)
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(x + width * 0.1, y + height * 0.3, width * 0.15, height * 0.4); // Brazo izquierdo
        ctx.fillRect(x + width * 0.75, y + height * 0.3, width * 0.15, height * 0.4); // Brazo derecho
        
        // Piernas
        ctx.fillRect(x + width * 0.35, y + height * 0.7, width * 0.12, height * 0.3); // Pierna izquierda
        ctx.fillRect(x + width * 0.53, y + height * 0.7, width * 0.12, height * 0.3); // Pierna derecha
        
        // Zonas de impacto con colores diferenciados
        Object.entries(hitPoints).forEach(([zone, point]) => {
            const finalPoints = Math.round(point.basePoints * pointsMultiplier);
            
            // Color según la zona
            let zoneColor = zone === 'head' ? '#ff0000' : 
                           zone === 'chest' ? '#ff8800' : '#ffff00';
            
            // Círculo de zona de impacto
            ctx.strokeStyle = zoneColor;
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.arc(x + point.x, y + point.y, point.radius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Punto central
            ctx.fillStyle = zoneColor;
            ctx.beginPath();
            ctx.arc(x + point.x, y + point.y, 2 * scale, 0, 2 * Math.PI);
            ctx.fill();
            
            // Texto de puntos (más pequeño para líneas lejanas)
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${8 + 4 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeText(`${finalPoints}pts`, x + point.x, y + point.y + point.radius + 12 * scale);
            ctx.fillText(`${finalPoints}pts`, x + point.x, y + point.y + point.radius + 12 * scale);
        });
        
        // Contorno del maniquí
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(x, y, width, height);
        
        // Indicador de línea/distancia
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${8 + 2 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        const distanceText = scale >= 1.1 ? 'CERCA' : scale >= 0.9 ? 'MEDIO' : 'LEJOS';
        ctx.strokeText(distanceText, x + width/2, y - 5);
        ctx.fillText(distanceText, x + width/2, y - 5);
    }
    function drawCrosshair() {
        const cx = aimCanvas.width / 2;
        const cy = aimCanvas.height / 2;
        ctx.save();
        ctx.strokeStyle = crosshairColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#7ec7ff';
        ctx.shadowBlur = 6;
        // Línea horizontal
        ctx.beginPath();
        ctx.moveTo(cx - crosshairSize, cy);
        ctx.lineTo(cx + crosshairSize, cy);
        ctx.stroke();
        // Línea vertical
        ctx.beginPath();
        ctx.moveTo(cx, cy - crosshairSize);
        ctx.lineTo(cx, cy + crosshairSize);
        ctx.stroke();
        ctx.restore();
    }    function updateTargets() {
        // Movimiento suave y preciso
        targets.forEach(t => {
            if (t.type === 'mannequin') {
                // Movimiento del maniquí
                t.x += t.dx;
                // Rebote en los bordes
                if (t.x <= 0 || t.x + t.width >= aimCanvas.width) {
                    t.dx *= -1;
                    t.x = Math.max(0, Math.min(t.x, aimCanvas.width - t.width));
                }
            } else if (t.dx !== undefined && t.dy !== undefined) {
                t.x += t.dx;
                t.y += t.dy;
                // Rebote preciso en bordes
                if (t.x <= 0 || t.x + t.size >= aimCanvas.width) {
                    t.dx *= -1;
                    t.x = Math.max(0, Math.min(t.x, aimCanvas.width - t.size));
                }
                if (t.y <= 0 || t.y + t.size >= aimCanvas.height) {
                    t.dy *= -1;
                    t.y = Math.max(0, Math.min(t.y, aimCanvas.height - t.size));
                }
            }
        });
    }function gameTick() {
        if (paused) return;
        if (time <= 0) {
            running = false;
            clearInterval(timer);
            aimCanvas.style.pointerEvents = 'none';
            aimInstructions.style.display = 'none';
            // Forzar parada del loop de animación
            cancelAnimationFrame(aimLoop);
            // Mostrar resultados después de un pequeño delay
            setTimeout(() => {
                showAimResults();
            }, 100);
            return;
        }
        time--;
        updateStats();
    }    let animationId = null;

    function aimLoop() {
        if (!running || paused) {
            cancelAnimationFrame(animationId);
            return;
        }
        updateTargets();
        drawTargets();
        animationId = requestAnimationFrame(aimLoop);
    }

    function startAim() {
        running = true;
        paused = false;
        time = parseInt(aimDuration.value);
        duration = time;
        hits = 0;
        total = 0;
        score = 0;
        reactionTimes = [];
        targets = [];
        aimResults.style.display = 'none';
        aimInstructions.style.display = 'none';
        aimCanvas.style.pointerEvents = 'auto';
        pauseAimTraining.disabled = false;
        resetAimTraining.disabled = false;
        getLagAndPing();        // Inicializa targets según modo
        if (currentMode === 'gridshot') {
            for (let i = 0; i < 6; i++) targets.push(spawnTarget());        } else if (currentMode === 'shooting-range') {
            // 2-4 maniquíes distribuidos en las 3 líneas
            const numMannequins = 2 + Math.floor(Math.random() * 3); // 2-4 maniquíes
            for (let i = 0; i < numMannequins; i++) {
                targets.push(spawnTarget());
            }
        } else {
            targets.push(spawnTarget());
        }updateStats();
        drawTargets();
        timer = setInterval(gameTick, 1000);
        animationId = requestAnimationFrame(aimLoop);
    }    // Click en canvas (exacto e inmediato)
    aimCanvas && aimCanvas.addEventListener('mousedown', function (e) {
        if (!running || paused) return;
        const rect = aimCanvas.getBoundingClientRect();
        // Coordenadas exactas del click
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // Escala para el tamaño real del canvas
        const scaleX = aimCanvas.width / rect.width;
        const scaleY = aimCanvas.height / rect.height;
        const actualX = mx * scaleX;
        const actualY = my * scaleY;
        
        // Detección inmediata y exacta
        let hit = false;
        let hitScore = 0;
        
        for (let i = 0; i < targets.length; i++) {
            const t = targets[i];
              if (t.type === 'mannequin') {
                // Verificar hit en cualquier zona del maniquí (elimina con un disparo)
                let mannequinHit = false;
                let bestHit = { zone: '', points: 0 };
                
                Object.entries(t.hitPoints).forEach(([zoneName, point]) => {
                    const pointX = t.x + point.x;
                    const pointY = t.y + point.y;
                    const dx = actualX - pointX;
                    const dy = actualY - pointY;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance <= point.radius) {
                        const finalPoints = Math.round(point.basePoints * t.pointsMultiplier);
                        if (finalPoints > bestHit.points) {
                            bestHit = { zone: zoneName, points: finalPoints };
                        }
                        mannequinHit = true;
                    }
                });
                
                if (mannequinHit) {
                    hit = true;
                    hitScore = bestHit.points;
                    hits++;
                    score += hitScore;
                    reactionTimes.push(Date.now() - t.created);
                    
                    // Crear efecto visual de eliminación
                    createMannequinKillEffect(t.x + t.width/2, t.y + t.height/2, bestHit.zone, hitScore);
                    
                    // Eliminar maniquí y generar uno nuevo
                    targets[i] = spawnTarget();
                    break;
                }
            } else {
                // Targets normales
                const centerX = t.x + t.size/2;
                const centerY = t.y + t.size/2;
                const dx = actualX - centerX;
                const dy = actualY - centerY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance <= t.size/2) {
                    hit = true;
                    hits++;
                    score += 100;
                    reactionTimes.push(Date.now() - t.created);
                    // Generar nuevo target
                    targets[i] = spawnTarget();
                    break;
                }
            }
        }
        total++;
        updateStats();
    });
      function createHitEffect(x, y, points) {
        // Efecto visual temporal de impacto
        setTimeout(() => {
            ctx.save();
            ctx.fillStyle = points >= 100 ? '#ff0000' : points >= 50 ? '#ff8800' : '#ffff00';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`+${points}`, x, y - 30);
            ctx.restore();
        }, 50);
    }
    
    function createMannequinKillEffect(x, y, zone, points) {
        // Efecto visual mejorado para eliminación de maniquí
        setTimeout(() => {
            ctx.save();
            
            // Efecto de eliminación
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            
            // Texto principal
            ctx.strokeText('ELIMINADO', x, y - 40);
            ctx.fillText('ELIMINADO', x, y - 40);
            
            // Puntos y zona
            ctx.fillStyle = zone === 'head' ? '#ffff00' : zone === 'chest' ? '#ff8800' : '#ffffff';
            ctx.font = 'bold 18px Arial';
            const zoneText = zone === 'head' ? 'HEADSHOT' : zone === 'chest' ? 'BODYSHOT' : 'LEGSHOT';
            ctx.strokeText(`${zoneText} +${points}`, x, y - 15);
            ctx.fillText(`${zoneText} +${points}`, x, y - 15);
            
            ctx.restore();
        }, 50);
    }// Evita duplicación de botones y corrige pantalla completa
    function setupAimButtons() {
        if (!aimInstructions) return;
        
        // Eliminar botones existentes
        const existingBtns = aimInstructions.querySelector('.start-btns-flex');
        if (existingBtns) existingBtns.remove();
        
        // Crear botones una sola vez
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'start-btns-flex';
        btnsDiv.style.cssText = 'display:flex;gap:1.5rem;justify-content:center;margin-top:2rem;';
        btnsDiv.innerHTML = `
            <button id="startAimNormal" class="start-training-btn" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                <i class="fas fa-play"></i> MODO NORMAL
            </button>
            <button id="startAimFullscreen" class="start-training-btn">
                <i class="fas fa-expand"></i> PANTALLA COMPLETA
            </button>
        `;
        aimInstructions.appendChild(btnsDiv);
        
        // Event listeners
        document.getElementById('startAimNormal')?.addEventListener('click', startAim);
        document.getElementById('startAimFullscreen')?.addEventListener('click', function() {
            // Activar overlay de pantalla completa
            const overlay = document.getElementById('fullscreenOverlay');
            const canvasArea = document.getElementById('fullscreenCanvasArea');
            if (overlay && canvasArea) {
                overlay.classList.add('active');
                overlay.style.display = 'flex';
                canvasArea.appendChild(aimCanvas);
                startAim();
            }
        });
    }
    
    // Configurar botones de salida de pantalla completa
    document.getElementById('exitFullscreen')?.addEventListener('click', function() {
        const overlay = document.getElementById('fullscreenOverlay');
        const canvasContainer = document.querySelector('.training-canvas-container');
        if (overlay && canvasContainer) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
            canvasContainer.appendChild(aimCanvas);
            resetAim();
        }
    });
      // Botones de control
    document.getElementById('startAimTraining')?.addEventListener('click', startAim);
    resetAimTraining && resetAimTraining.addEventListener('click', resetAim);
    pauseAimTraining && pauseAimTraining.addEventListener('click', function () {
        if (running && !paused) {
            paused = true;
            this.innerHTML = '<i class="fas fa-play"></i><span>Continuar</span>';
        } else if (running && paused) {
            paused = false;
            this.innerHTML = '<i class="fas fa-pause"></i><span>Pausar</span>';
        }
    });
    
    // Event listeners para botones de resultados
    document.addEventListener('click', function(e) {
        // Botón "Entrenar de Nuevo"
        if (e.target.closest('#improveAim')) {
            resetAim();
        }
          // Botón "Compartir Resultado" 
        if (e.target.closest('#shareAimResults')) {
            const accuracy = total ? Math.round((hits / total) * 100) : 0;
            const { adjustedScore } = getAdjustedScore(hits * 100, accuracy);
            const rankInfo = getAdjustedRank(accuracy, adjustedScore, getDifficultyMultiplier());
            
            const shareText = `� ¡Acabo de completar mi entrenamiento de Aim en CPS Test Pro!

�🎮 Modo: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
🎯 Precisión: ${accuracy}%
⭐ Score: ${adjustedScore} puntos
🔥 Targets eliminados: ${hits}
🏆 Nivel alcanzado: ${rankInfo.title}

¿Puedes superarme? ¡Entrena tu aim ahora! �💪

#AimTraining #Gaming #FPS #CpsTestPro`;
            
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        }
        
        // Botón "Guardar en Historial" (ya se guarda automáticamente, pero mostramos confirmación)
        if (e.target.closest('#saveResults')) {
            // Mostrar confirmación visual
            const btn = e.target.closest('#saveResults');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i><span>¡Guardado!</span>';
            btn.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }
    });
    
    // Event listeners para botones dentro de los resultados (usando delegación de eventos)
    aimResults && aimResults.addEventListener('click', function(e) {
        if (e.target.closest('.retry-btn') || e.target.closest('.action-btn[id*="improve"]')) {
            resetAim();
        }
    });
    
    // Configuración: actualiza al cambiar
    [aimDuration, targetSizeSel, targetSpeedSel].forEach(sel => {
        sel && sel.addEventListener('change', () => {
            updateModeInfo();
        });
    });// Inicializar
    resetAim();
    renderAimHistory();
})();

// ===================== TEST DE TIEMPO DE REACCIÓN =====================
(function reactionTimeLogic() {
    // Elements
    const reactionBox = document.getElementById('reactionBox');
    const reactionText = document.getElementById('reactionText');
    const reactionSubtext = document.getElementById('reactionSubtext');
    const reactionIcon = document.querySelector('.reaction-icon');
    const startReactionTest = document.getElementById('startReactionTest');
    const resetReactionTest = document.getElementById('resetReactionTest');
    const reactionResults = document.getElementById('reactionResults');
    const currentAttempt = document.getElementById('currentAttempt');
    const bestTime = document.getElementById('bestTime');
    const avgTime = document.getElementById('avgTime');
    const reactionAttempts = document.getElementById('reactionAttempts');
    const reactionMode = document.getElementById('reactionMode');

    // Variables
    let testState = 'waiting'; // waiting, ready, go, finished
    let currentTest = 0;
    let totalTests = 5;
    let reactionTimes = [];
    let startTime = 0;
    let timeoutId = null;
    let reactionHistory = [];

    // Cargar historial
    try {
        const savedHistory = localStorage.getItem('reactionHistory');
        if (savedHistory) {
            reactionHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        reactionHistory = [];
    }

    // Función para obtener tiempo de espera según modo
    function getWaitTime() {
        const mode = reactionMode.value;
        switch (mode) {
            case 'fast': return 1000 + Math.random() * 2000; // 1-3s
            case 'random': return 1000 + Math.random() * 7000; // 1-8s
            default: return 2000 + Math.random() * 3000; // 2-5s (normal)
        }
    }

    // Función para clasificar el tiempo de reacción
    function getReactionLevel(avgReactionTime) {
        if (avgReactionTime >= 500) {
            return { icon: '🐢', name: 'Tortuga', desc: 'Necesitas practicar más', color: '#6c757d' };
        } else if (avgReactionTime >= 400) {
            return { icon: '🙂', name: 'Casual', desc: 'Tiempo promedio', color: '#17a2b8' };
        } else if (avgReactionTime >= 300) {
            return { icon: '👍', name: 'Bueno', desc: '¡Buen tiempo de reacción!', color: '#28a745' };
        } else if (avgReactionTime >= 200) {
            return { icon: '⚡', name: 'Rápido', desc: '¡Muy rápido!', color: '#ffc107' };
        } else if (avgReactionTime >= 150) {
            return { icon: '🎯', name: 'Profesional', desc: '¡Tiempo de profesional!', color: '#fd7e14' };
        } else {
            return { icon: '👑', name: 'Elite', desc: '¡Tiempo de élite!', color: '#dc3545' };
        }
    }

    // Iniciar test
    function startTest() {
        if (testState !== 'waiting') return;
        
        totalTests = parseInt(reactionAttempts.value);
        currentTest = 0;
        reactionTimes = [];
        testState = 'ready';
        
        startReactionTest.disabled = true;
        resetReactionTest.disabled = false;
        reactionResults.style.display = 'none';
        
        nextAttempt();
    }

    // Siguiente intento
    function nextAttempt() {
        if (currentTest >= totalTests) {
            finishTest();
            return;
        }

        currentTest++;
        updateStats();
        
        // Estado inicial: esperando
        reactionBox.className = 'reaction-box ready';
        reactionIcon.textContent = '🔴';
        reactionText.textContent = '¡Espera...!';
        reactionSubtext.textContent = 'El círculo se pondrá verde pronto';
        testState = 'ready';

        // Esperar tiempo aleatorio antes de cambiar a verde
        const waitTime = getWaitTime();
        timeoutId = setTimeout(() => {
            if (testState === 'ready') {
                reactionBox.className = 'reaction-box go';
                reactionIcon.textContent = '🟢';
                reactionText.textContent = '¡AHORA!';
                reactionSubtext.textContent = '¡Haz clic rápido!';
                testState = 'go';
                startTime = performance.now();
            }
        }, waitTime);
    }

    // Click en el área de reacción
    reactionBox.addEventListener('click', function() {
        if (testState === 'ready') {
            // Click muy temprano
            clearTimeout(timeoutId);
            reactionBox.className = 'reaction-box too-early';
            reactionIcon.textContent = '⚠️';
            reactionText.textContent = '¡Muy temprano!';
            reactionSubtext.textContent = 'Espera hasta que se ponga verde';
            testState = 'waiting';
            
            setTimeout(() => {
                nextAttempt();
            }, 1500);
            
        } else if (testState === 'go') {
            // Click correcto
            const reactionTime = Math.round(performance.now() - startTime);
            reactionTimes.push(reactionTime);
            
            reactionBox.className = 'reaction-box waiting';
            reactionIcon.textContent = '✅';
            reactionText.textContent = `${reactionTime}ms`;
            reactionSubtext.textContent = '¡Buen trabajo!';
            testState = 'waiting';
            
            setTimeout(() => {
                nextAttempt();
            }, 1000);
            
        } else if (testState === 'waiting' && currentTest === 0) {
            // Comenzar test
            startTest();
        }
    });

    // Actualizar estadísticas
    function updateStats() {
        currentAttempt.textContent = `${currentTest}/${totalTests}`;
        
        if (reactionTimes.length > 0) {
            const best = Math.min(...reactionTimes);
            const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
            
            bestTime.textContent = `${best}ms`;
            avgTime.textContent = `${avg}ms`;
        } else {
            bestTime.textContent = '-';
            avgTime.textContent = '-';
        }
    }

    // Finalizar test
    function finishTest() {
        testState = 'finished';
        startReactionTest.disabled = false;
        resetReactionTest.disabled = true;
        
        if (reactionTimes.length === 0) {
            resetTest();
            return;
        }
        
        showResults();
    }

    // Mostrar resultados
    function showResults() {
        const avgReactionTime = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
        const bestReactionTime = Math.min(...reactionTimes);
        const worstReactionTime = Math.max(...reactionTimes);
        const consistency = Math.round((1 - (worstReactionTime - bestReactionTime) / avgReactionTime) * 100);
        const level = getReactionLevel(avgReactionTime);
        
        // Actualizar elementos de resultado
        document.getElementById('finalReactionTime').textContent = avgReactionTime;
        document.getElementById('reactionLevelIcon').textContent = level.icon;
        document.getElementById('reactionLevelName').textContent = level.name;
        document.getElementById('reactionLevelDesc').textContent = level.desc;
        document.getElementById('finalBestTime').textContent = `${bestReactionTime}ms`;
        document.getElementById('finalAvgTime').textContent = `${avgReactionTime}ms`;
        document.getElementById('validAttempts').textContent = reactionTimes.length;
        document.getElementById('consistency').textContent = `${Math.max(0, consistency)}%`;
        
        // Mostrar tiempos individuales
        const individualTimes = document.getElementById('individualTimes');
        individualTimes.innerHTML = reactionTimes.map((time, index) => {
            let className = 'time-item';
            if (time === bestReactionTime) className += ' best';
            if (time === worstReactionTime && reactionTimes.length > 1) className += ' worst';
            
            return `<div class="${className}">${time}ms</div>`;
        }).join('');
        
        // Mostrar resultados
        reactionResults.style.display = 'block';
        reactionResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Guardar en historial
        saveToReactionHistory({
            avgTime: avgReactionTime,
            bestTime: bestReactionTime,
            attempts: reactionTimes.length,
            times: [...reactionTimes],
            level: level.name,
            consistency: Math.max(0, consistency)
        });
    }

    // Guardar en historial
    function saveToReactionHistory(result) {
        reactionHistory.unshift({
            ...result,
            date: new Date(),
            id: Date.now()
        });
        
        // Mantener últimos 10 resultados
        if (reactionHistory.length > 10) {
            reactionHistory = reactionHistory.slice(0, 10);
        }
        
        localStorage.setItem('reactionHistory', JSON.stringify(reactionHistory));
        renderReactionHistory();
    }

    // Renderizar historial
    function renderReactionHistory() {
        const historyContainer = document.getElementById('reactionHistoryList');
        if (!historyContainer) return;

        if (reactionHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-stopwatch"></i>
                    <p>Completa tu primer test para ver el historial</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = reactionHistory.map(item => `
            <div class="reaction-history-item">
                <div class="history-reaction-icon">${getReactionLevel(item.avgTime).icon}</div>
                <div class="history-reaction-details">
                    <div class="history-reaction-time">${item.avgTime}ms promedio</div>
                    <div class="history-reaction-level">${item.level}</div>
                    <div class="history-reaction-stats">
                        Mejor: ${item.bestTime}ms | Intentos: ${item.attempts} | Consistencia: ${item.consistency}%
                    </div>
                    <div class="history-reaction-date">
                        ${new Date(item.date).toLocaleDateString()} ${new Date(item.date).toLocaleTimeString().slice(0,5)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Reset test
    function resetTest() {
        clearTimeout(timeoutId);
        testState = 'waiting';
        currentTest = 0;
        reactionTimes = [];
        
        reactionBox.className = 'reaction-box waiting';
        reactionIcon.textContent = '🔴';
        reactionText.textContent = '¡Haz clic para comenzar!';
        reactionSubtext.textContent = 'Presiona cuando el círculo se ponga verde';
        
        startReactionTest.disabled = false;
        resetReactionTest.disabled = true;
        reactionResults.style.display = 'none';
        
        updateStats();
    }

    // Event listeners
    startReactionTest.addEventListener('click', startTest);
    resetReactionTest.addEventListener('click', resetTest);
    
    // Compartir en Facebook
    document.addEventListener('click', function(e) {
        if (e.target.closest('#shareReactionResults')) {
            if (reactionTimes.length === 0) return;
            
            const avgTime = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
            const level = getReactionLevel(avgTime);
            const bestTime = Math.min(...reactionTimes);
            
            const shareText = `⚡ ¡Acabo de probar mi tiempo de reacción en CPS Test Pro!

⏱️ Tiempo promedio: ${avgTime}ms
🏆 Mejor tiempo: ${bestTime}ms
🎯 Nivel: ${level.name}
📊 Intentos: ${reactionTimes.length}

¡Los profesionales tienen menos de 200ms! ¿Puedes superarme? 💪

#ReactionTime #Gaming #Reflexes #CpsTestPro`;
            
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        }
        
        if (e.target.closest('#retryReactionTest')) {
            resetTest();
        }
    });

    // Configuración: actualizar al cambiar
    [reactionAttempts, reactionMode].forEach(sel => {
        sel && sel.addEventListener('change', () => {
            if (testState === 'waiting') {
                totalTests = parseInt(reactionAttempts.value);
                updateStats();
            }
        });
    });

    // Inicializar
    resetTest();
    renderReactionHistory();
})();

// ===================== END =====================
function getRankIcon(accuracy, score) {
        if (accuracy >= 85 && score >= 2000) return '👑';
        if (accuracy >= 75 && score >= 1500) return '🥇';
        if (accuracy >= 65 && score >= 1000) return '🥈';
        if (accuracy >= 50 && score >= 500) return '🥉';
        return '🔰';
    }
