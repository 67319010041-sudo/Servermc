import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ==========================================
// DEBUGGER
// ==========================================
function logDebug(msg) {
    console.log(msg);
}

try {
    const firebaseConfig = {
        apiKey: "AIzaSyABlPDJhV63WB6xKJlQJYSvLPQYM4IcuGs",
        authDomain: "servermc-eba6c.firebaseapp.com",
        databaseURL: "https://servermc-eba6c-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "servermc-eba6c",
        storageBucket: "servermc-eba6c.firebasestorage.app",
        messagingSenderId: "532748697920",
        appId: "1:532748697920:web:295b265cc1bd9405783aa5",
        measurementId: "G-YKR9Z0KKC6"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // DOM Elements
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.querySelector('#status-indicator span');
    const playerCount = document.getElementById('player-count');
    const pingDisplay = document.getElementById('ping');
    const versionDisplay = document.getElementById('version');
    const playerList = document.getElementById('player-list');
    const serverIcon = document.getElementById('server-icon');
    const ipDisplay = document.getElementById('server-ip-display');

    if (ipDisplay) ipDisplay.textContent = 'just-restaurant.gl.joinmc.link';

    // Listener
    const statusRef = ref(db, 'status');

    onValue(statusRef, (snapshot) => {
        const data = snapshot.val();

        const isStale = !data || (Date.now() - data.lastUpdated > 30000);

        if (data && data.online && !isStale) {
            updateUI(true, data);
        } else {
            updateUI(false, null);
        }
    });

    function updateUI(isOnline, data) {
        if (isOnline && data) {
            // Online
            if (statusIndicator) statusIndicator.className = 'status-badge online';
            if (statusText) statusText.innerHTML = '</i> ออนไลน์';

            if (playerCount) playerCount.textContent = `${data.players.online} / ${data.players.max}`;

            if (versionDisplay) versionDisplay.textContent = data.version || "1.20.1";

            // Ping Logic with Colors
            const latency = data.ping || 1;
            let pingClass = 'ping-green';
            if (latency > 100) pingClass = 'ping-orange';
            if (latency > 200) pingClass = 'ping-red';

            if (pingDisplay) {
                pingDisplay.textContent = latency + " ms";
                pingDisplay.className = pingClass; // Apply Color
            }

            if (data.icon && serverIcon) serverIcon.src = data.icon;

            // --- MODPACK BADGE LOGIC ---
            const modpackBadge = document.querySelector('.modpack-badge');
            if (data.modpack && data.modpack.isModpack) {
                // If badge doesn't exist, create it inside character-section (if exists) or document body
                let badgeContainer = document.querySelector('.character-section');
                if (!badgeContainer) badgeContainer = document.querySelector('.poster-container'); // Fallback

                if (!modpackBadge && badgeContainer) {
                    const badgeHtml = `
                    <div class="modpack-badge">
                        <img id="modpack-image" src="${data.modpack.icon || 'https://assets.sticky.gg/icons/minecraft.png'}" alt="Modpack"> 
                        <div class="badge-content">
                            <span class="badge-label">PLAYING ON</span>
                            <span id="modpack-version-text">${data.modpack.name}</span>
                        </div>
                    </div>`;
                    // Insert at top of container or specific place
                    // Attempt to insert before image wrapper if possible, or append
                    const imgWrapper = badgeContainer.querySelector('.character-img-wrapper');
                    if (imgWrapper) {
                        imgWrapper.insertAdjacentHTML('beforebegin', badgeHtml);
                    } else {
                        badgeContainer.insertAdjacentHTML('beforeend', badgeHtml);
                    }
                } else if (modpackBadge) {
                    // Update existing
                    modpackBadge.style.display = 'flex';
                    const vText = document.getElementById('modpack-version-text');
                    if (vText) vText.textContent = data.modpack.name;
                }
            } else {
                // Hide if Vanilla or offline
                if (modpackBadge) modpackBadge.style.display = 'none';
            }
            // ---------------------------

            // Player List
            if (playerList) {
                playerList.innerHTML = '';

                let players = [];
                if (Array.isArray(data.players.list)) {
                    players = data.players.list;
                } else if (data.players.list && typeof data.players.list === 'object') {
                    players = Object.values(data.players.list);
                }

                if (players.length > 0) {
                    players.forEach(p => {
                        const name = (typeof p === 'object') ? p.name : p;
                        const time = (typeof p === 'object') ? p.time : 0;

                        if (!name) return;

                        const chip = document.createElement('div');
                        chip.className = 'player-chip'; // Styled in CSS
                        const headUrl = `https://minotar.net/avatar/${name}/64.png`; // Bigger Quality

                        chip.innerHTML = `
                            <img src="${headUrl}" alt="${name}">
                            <div class="player-info">
                                <span class="player-name">${name}</span>
                                <span class="player-time">เล่นมาแล้ว ${time} นาที</span>
                            </div>
                        `;
                        playerList.appendChild(chip);
                    });
                } else {
                    playerList.innerHTML = '<div class="empty-message">ไม่มีคนเล่นโว้ย...</div>';
                }
            }

        } else {
            // Offline
            if (statusIndicator) statusIndicator.className = 'status-badge offline';
            if (statusText) statusText.innerHTML = '</i> ออฟไลน์';
            if (playerCount) playerCount.textContent = "- / -";
            if (pingDisplay) {
                pingDisplay.textContent = "--";
                pingDisplay.className = '';
            }
            if (playerList) playerList.innerHTML = '<div class="empty-message">Server ปิดอยู่จ้า</div>';
        }
    }

} catch (error) {
    logDebug("Config Error: " + error.message);
}

window.copyIp = function () {
    const ipDisplay = document.getElementById('server-ip-display');
    navigator.clipboard.writeText('just-restaurant.gl.joinmc.link').then(() => {
        const originalText = ipDisplay.textContent;
        ipDisplay.textContent = "ก๊อปปี้เเล้วไอ้หัวดอ";
        setTimeout(() => { ipDisplay.textContent = originalText; }, 1500);
    });
}



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ==========================================
// DEBUGGER
// ==========================================
function logDebug(msg) {
    console.log(msg);
}

try {
    const firebaseConfig = {
        apiKey: "AIzaSyABlPDJhV63WB6xKJlQJYSvLPQYM4IcuGs",
        authDomain: "servermc-eba6c.firebaseapp.com",
        databaseURL: "https://servermc-eba6c-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "servermc-eba6c",
        storageBucket: "servermc-eba6c.firebasestorage.app",
        messagingSenderId: "532748697920",
        appId: "1:532748697920:web:295b265cc1bd9405783aa5",
        measurementId: "G-YKR9Z0KKC6"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // DOM Elements
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.querySelector('#status-indicator span');
    const playerCount = document.getElementById('player-count');
    const pingDisplay = document.getElementById('ping');
    const versionDisplay = document.getElementById('version');
    const playerList = document.getElementById('player-list');
    const serverIcon = document.getElementById('server-icon');
    const ipDisplay = document.getElementById('server-ip-display');

    if (ipDisplay) ipDisplay.textContent = 'models-kirk.gl.joinmc.link';

    // Listener
    const statusRef = ref(db, 'status');

    onValue(statusRef, (snapshot) => {
        const data = snapshot.val();

        const isStale = !data || (Date.now() - data.lastUpdated > 30000);

        if (data && data.online && !isStale) {
            updateUI(true, data);
        } else {
            updateUI(false, null);
        }
    });

    function updateUI(isOnline, data) {
        if (isOnline && data) {
            // Online
            if (statusIndicator) statusIndicator.className = 'status-badge online';
            if (statusText) statusText.innerHTML = '</i> ออนไลน์';

            if (playerCount) playerCount.textContent = `${data.players.online} / ${data.players.max}`;

            if (versionDisplay) versionDisplay.textContent = data.version || "1.20.1";

            // Ping Logic with Colors
            const latency = data.ping || 1;
            let pingClass = 'ping-green';
            if (latency > 100) pingClass = 'ping-orange';
            if (latency > 200) pingClass = 'ping-red';

            if (pingDisplay) {
                pingDisplay.textContent = latency + " ms";
                pingDisplay.className = pingClass; // Apply Color
            }

            if (data.icon && serverIcon) serverIcon.src = data.icon;

            // Player List
            if (playerList) {
                playerList.innerHTML = '';

                let players = [];
                if (Array.isArray(data.players.list)) {
                    players = data.players.list;
                } else if (data.players.list && typeof data.players.list === 'object') {
                    players = Object.values(data.players.list);
                }

                if (players.length > 0) {
                    players.forEach(p => {
                        const name = (typeof p === 'object') ? p.name : p;
                        const time = (typeof p === 'object') ? p.time : 0;

                        if (!name) return;

                        const chip = document.createElement('div');
                        chip.className = 'player-chip'; // Styled in CSS
                        const headUrl = `https://minotar.net/avatar/${name}/64.png`; // Bigger Quality

                        chip.innerHTML = `
                            <img src="${headUrl}" alt="${name}">
                            <div class="player-info">
                                <span class="player-name">${name}</span>
                                <span class="player-time">เล่นมาแล้ว ${time} นาที</span>
                            </div>
                        `;
                        playerList.appendChild(chip);
                    });
                } else {
                    playerList.innerHTML = '<div class="empty-message">ไม่มีคนเล่นโว้ย...</div>';
                }
            }

        } else {
            // Offline
            if (statusIndicator) statusIndicator.className = 'status-badge offline';
            if (statusText) statusText.innerHTML = '</i> ออฟไลน์';
            if (playerCount) playerCount.textContent = "- / -";
            if (pingDisplay) {
                pingDisplay.textContent = "--";
                pingDisplay.className = '';
            }
            if (playerList) playerList.innerHTML = '<div class="empty-message">Server ปิดอยู่จ้า</div>';
        }
    }

} catch (error) {
    logDebug("Config Error: " + error.message);
}

window.copyIp = function () {
    const ipDisplay = document.getElementById('server-ip-display');
    navigator.clipboard.writeText('models-kirk.gl.joinmc.link').then(() => {
        const originalText = ipDisplay.textContent;
        ipDisplay.textContent = "ก๊อปปี้เเล้วไอ้หัวดอ";
        setTimeout(() => { ipDisplay.textContent = originalText; }, 1500);
    });
}



