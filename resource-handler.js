// Resource Error Handler for CPS Test Pro
// This script handles missing resources gracefully

(function() {
    'use strict';
    
    // Track resource loading errors
    const resourceErrors = [];
    
    // Handle Font Awesome fallback
    function ensureFontAwesome() {
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-heart';
        testElement.style.display = 'none';
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.fontFamily;
        
        document.body.removeChild(testElement);
        
        // If Font Awesome didn't load, use emoji fallbacks
        if (!fontFamily.includes('Font Awesome')) {
            console.warn('Font Awesome failed to load, using emoji fallbacks');
            addEmojiCSS();
        }
    }
    
    // CSS para emojis como fallback
    function addEmojiCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .fa-tachometer-alt::before { content: "⚡"; }
            .fa-crosshairs::before { content: "🎯"; }
            .fa-stopwatch::before { content: "⏱️"; }
            .fa-play::before { content: "▶️"; }
            .fa-pause::before { content: "⏸️"; }
            .fa-redo::before { content: "🔄"; }
            .fa-save::before { content: "💾"; }
            .fa-facebook::before { content: "📘"; }
            .fa-twitter::before { content: "🐦"; }
            .fa-target::before { content: "🎯"; }
            .fas, .fab { font-family: initial !important; }
        `;
        document.head.appendChild(style);
    }
    
    // Handle Google Analytics errors
    function handleAnalyticsError() {
        // Create a dummy gtag function if Analytics fails
        if (typeof gtag === 'undefined') {
            window.gtag = function() {
                console.log('Analytics not available, event tracked locally:', arguments);
            };
        }
    }
    
    // Handle AdSense errors gracefully
    function handleAdSenseError() {
        // Hide ad containers if AdSense fails
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach(container => {
            if (!container.innerHTML.trim()) {
                container.style.display = 'none';
                container.style.height = '0px';
                container.style.margin = '0px';
            }
        });
    }
    
    // Global error handler for resources
    window.addEventListener('error', function(e) {
        if (e.target !== window) {
            resourceErrors.push({
                type: e.target.tagName,
                src: e.target.src || e.target.href,
                timestamp: Date.now()
            });
            
            // Handle specific resource types
            if (e.target.tagName === 'LINK' && e.target.href.includes('font-awesome')) {
                ensureFontAwesome();
            }
            
            if (e.target.tagName === 'SCRIPT' && e.target.src.includes('gtag')) {
                handleAnalyticsError();
            }
            
            if (e.target.tagName === 'SCRIPT' && e.target.src.includes('adsbygoogle')) {
                handleAdSenseError();
            }
        }
    }, true);
    
    // Check resources after page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            ensureFontAwesome();
            handleAnalyticsError();
            handleAdSenseError();
            
            // Log resource errors for debugging
            if (resourceErrors.length > 0) {
                console.group('Resource Loading Errors:');
                resourceErrors.forEach(error => {
                    console.warn(`${error.type}: ${error.src}`);
                });
                console.groupEnd();
            }
        }, 1000);
    });
    
    // Export for global access
    window.CpsTestResourceHandler = {
        errors: resourceErrors,
        ensureFontAwesome: ensureFontAwesome,
        handleAnalyticsError: handleAnalyticsError,
        handleAdSenseError: handleAdSenseError
    };
    
})();
