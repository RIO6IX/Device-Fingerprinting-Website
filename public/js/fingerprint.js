window.DeviceFP = (function () {

    /* -----------------------------------------------------------
       0️⃣ SAFE SHA‑256 WITH FALLBACK
       ----------------------------------------------------------- */
    async function sha256Hex(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);

        // Browser supports crypto.subtle → use it
        if (window.crypto && crypto.subtle) {
            try {
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            } catch (e) {
                console.warn("crypto.subtle.digest failed, using fallback SHA-256");
            }
        }

        // Fallback (works on HTTP & offline)
        const fallbackHash = await sha256Fallback(message);
        return fallbackHash;
    }

    // Basic JS SHA‑256 implementation (no dependencies)
    async function sha256Fallback(str) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        let ascii = "";
        for (let i = 0; i < str.length; i++) {
            ascii += String.fromCharCode(str.charCodeAt(i));
        }

        const words = [];
        const asciiBitLength = ascii.length * 8;

        const hash = [];
        const k = [];

        let primeCounter = 0;

        function isPrime(n) {
            const root = Math.sqrt(n);
            for (let i = 2; i <= root; i++) {
                if (n % i === 0) return false;
            }
            return true;
        }

        function getPrime(n) {
            let num = 2;
            while (n > 0) {
                if (isPrime(num)) n--;
                if (n === 0) return num;
                num++;
            }
            return num;
        }

        while (primeCounter < 64) {
            const p = getPrime(primeCounter + 1);
            if (primeCounter < 8) hash.push((p ** (1 / 2) % 1) * 2 ** 32 | 0);
            k.push((p ** (1 / 3) % 1) * 2 ** 32 | 0);
            primeCounter++;
        }

        ascii += "\x80";
        while (ascii.length % 64 - 56) ascii += "\x00";

        for (let i = 0; i < ascii.length; i++) {
            const j = ascii.charCodeAt(i);
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words.push((asciiBitLength / 2 ** 32) | 0);
        words.push(asciiBitLength | 0);

        for (let i = 0; i < words.length;) {
            let w = words.slice(i, i += 16);
            const oldHash = hash.slice(0);

            for (let j = 16; j < 64; j++) {
                w[j] = (w[j - 16] +
                    (rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3)) +
                    w[j - 2] +
                    (rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10))) | 0;
            }

            for (let j = 0; j < 64; j++) {
                const a = hash[0];
                const b = hash[1];
                const c = hash[2];
                const d = hash[3];
                const e = hash[4];
                const f = hash[5];
                const g = hash[6];
                const h = hash[7];

                const t1 = (h + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & f) ^ (~e & g)) + k[j] + w[j]) | 0;
                const t2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22) +
                    ((a & b) ^ (a & c) ^ (b & c))) | 0;

                hash[7] = g;
                hash[6] = f;
                hash[5] = e;
                hash[4] = (d + t1) | 0;
                hash[3] = c;
                hash[2] = b;
                hash[1] = a;
                hash[0] = (t1 + t2) | 0;
            }

            for (let j = 0; j < 8; j++) hash[j] = (hash[j] + oldHash[j]) | 0;
        }

        return hash.map(h => ("00000000" + (h >>> 0).toString(16)).slice(-8)).join("");
    }


    /* -----------------------------------------------------------
       1️⃣ COLLECT STABLE CORE ATTRIBUTES
       ----------------------------------------------------------- */
    async function collectCore() {
        const nav = navigator || {};

        return {
            userAgent: nav.userAgent || "",
            platform: nav.platform || "",
            languages: (nav.languages || []).join(","),
            hardwareConcurrency: nav.hardwareConcurrency || "",
            deviceMemory: nav.deviceMemory || "",
            maxTouchPoints: nav.maxTouchPoints || 0,
            cookieEnabled: !!nav.cookieEnabled,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
            timezoneOffset: new Date().getTimezoneOffset(),
            screenWidth: screen.width || 0,
            screenHeight: screen.height || 0,
            colorDepth: screen.colorDepth || 0,
            pixelRatio: window.devicePixelRatio || 1
        };
    }


    function sortAndNormalize(obj) {
        const keys = Object.keys(obj).sort();
        return keys.map(k => `${k}=${String(obj[k])};`).join("");
    }


    /* -----------------------------------------------------------
       2️⃣ EXTRA SIGNALS (NOT USED IN SIGNATURE)
       ----------------------------------------------------------- */
    function getCanvasData() {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 80;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, 300, 80);

            ctx.font = "20px Arial";
            ctx.fillStyle = "#000";
            ctx.fillText("StableCanvasText", 10, 20);

            ctx.fillStyle = "#333";
            ctx.fillRect(10, 40, 150, 10);

            return canvas.toDataURL();
        } catch {
            return "";
        }
    }

    function getWebGLInfo() {
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) return { supported: false };

            const ext = gl.getExtension("WEBGL_debug_renderer_info");

            return {
                supported: true,
                vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
                renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
            };
        } catch {
            return { supported: false };
        }
    }

    async function detectFonts() {
        const baseFonts = ["monospace", "serif", "sans-serif"];
        const testFonts = ["Arial", "Courier New", "Times New Roman", "Roboto", "Segoe UI"];
        const detected = [];

        const span = document.createElement("span");
        span.style.fontSize = "72px";
        span.textContent = "mmmmmmmmmmlli";
        document.body.appendChild(span);

        const defaultWidth = {};

        for (const base of baseFonts) {
            span.style.fontFamily = base;
            defaultWidth[base] = span.offsetWidth;
        }

        for (const font of testFonts) {
            let found = false;
            for (const base of baseFonts) {
                span.style.fontFamily = `${font},${base}`;
                if (span.offsetWidth !== defaultWidth[base]) {
                    found = true;
                    break;
                }
            }
            if (found) detected.push(font);
        }

        document.body.removeChild(span);
        return detected.join(",");
    }

    function detectPlugins() {
        try {
            const p = navigator.plugins || [];
            const names = [];
            for (let i = 0; i < p.length; i++) names.push(p[i].name);
            return names.join(",");
        } catch {
            return "";
        }
    }


    /* -----------------------------------------------------------
       3️⃣ FULL COLLECTION + SIGNATURE
       ----------------------------------------------------------- */
    async function collectAll() {
        const core = await collectCore();
        const canvas = getCanvasData();
        const webgl = getWebGLInfo();
        const fonts = await detectFonts();
        const plugins = detectPlugins();

        const payload = {
            core,
            canvas,
            webgl,
            fonts,
            plugins,
            collected_at: new Date().toISOString()
        };

        const normalizedCore = sortAndNormalize(core);

        // Stable fingerprint always generated, even without crypto.subtle
        const signature = await sha256Hex(normalizedCore);

        return {
            signature,
            normalizedCore,
            payload
        };
    }

    return { collectAll };
})();
