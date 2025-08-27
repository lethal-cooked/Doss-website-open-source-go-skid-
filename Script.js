let config = {
    defaultTarget: "https://example.com",
    defaultRequests: 1000,
    defaultThreads: 5,
    defaultMethod: "GET",
    defaultProxies: [],
    attackInterval: 100,  // Faster for more power
    maxLogEntries: 50     // More logs for epic feel
};

// Load config from localStorage if available (simulating file load)
if (localStorage.getItem('fsocietyConfig')) {
    config = JSON.parse(localStorage.getItem('fsocietyConfig'));
}

// Apply defaults to inputs
document.getElementById('targetUrl').value = config.defaultTarget;
document.getElementById('requestCount').value = config.defaultRequests;
document.getElementById('threads').value = config.defaultThreads;
document.getElementById('method').value = config.defaultMethod;
document.getElementById('proxies').value = config.defaultProxies.join(', ');

function toggleConfigEditor() {
    const editor = document.getElementById('configEditor');
    const jsonArea = document.getElementById('configJson');
    editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
    jsonArea.value = JSON.stringify(config, null, 2);
}

function saveConfig() {
    const jsonArea = document.getElementById('configJson');
    try {
        config = JSON.parse(jsonArea.value);
        localStorage.setItem('fsocietyConfig', JSON.stringify(config));
        // Reapply to inputs
        document.getElementById('targetUrl').value = config.defaultTarget;
        document.getElementById('requestCount').value = config.defaultRequests;
        document.getElementById('threads').value = config.defaultThreads;
        document.getElementById('method').value = config.defaultMethod;
        document.getElementById('proxies').value = config.defaultProxies.join(', ');
        alert("Config saved, Boss. Ready to dominate.");
    } catch (e) {
        alert("Bad JSON, Boss—fix that shit.");
    }
    toggleConfigEditor();
}

function startAttack() {
    const targetUrl = document.getElementById('targetUrl').value;
    const requestCount = parseInt(document.getElementById('requestCount').value);
    const threads = parseInt(document.getElementById('threads').value);
    const method = document.getElementById('method').value;
    const proxies = document.getElementById('proxies').value.split(',').map(p => p.trim()).filter(p => p);
    const targetDisplay = document.getElementById('targetDisplay');
    const requestDisplay = document.getElementById('requestDisplay');
    const requestLog = document.getElementById('requestLog');

    if (!targetUrl) {
        alert("Need a target to crush, Boss!");
        return;
    }

    targetDisplay.textContent = targetUrl;
    requestDisplay.textContent = requestCount;

    requestLog.innerHTML = '';
    let logCount = 0;

    // Simulate multi-threaded attack with setInterval for each "thread"
    for (let t = 0; t < threads; t++) {
        const interval = setInterval(() => {
            if (logCount >= requestCount) {
                clearInterval(interval);
                return;
            }

            const requestNum = logCount + 1;
            const proxy = proxies.length ? proxies[Math.floor(Math.random() * proxies.length)] : 'Direct';
            const logEntry = document.createElement('li');
            logEntry.textContent = `[${requestNum}] Request berhasil via ${method} (${proxy})`;
            requestLog.appendChild(logEntry);
            requestLog.scrollTop = requestLog.scrollHeight; // Auto-scroll
            logCount++;

            if (logCount >= config.maxLogEntries) {
                requestLog.removeChild(requestLog.firstChild); // Keep logs manageable
            }
        }, config.attackInterval);
    }

    // Fake console output for that hacker vibe
    console.log(`Unleashing ${threads} threads on ${targetUrl} with ${requestCount} ${method} requests. Proxies: ${proxies.length ? 'Engaged' : 'None'}. World domination in progress, Boss.`);
}
