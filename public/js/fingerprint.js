window.DeviceFP = (function () {

    async function sha256Hex(message) {
        const enc = new TextEncoder();
        const data = enc.encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function sortAndNormalize(obj) {
        const keys = Object.keys(obj).sort();
        return keys.map(k => `${k}=${String(obj[k])};`).join("");
    }

    // -------------------------------------------------------
    // 1️⃣ SUPER‑STABLE CORE FINGERPRINT (Signature)
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    // 2️⃣ Deterministic Canvas (for anomaly detection ONLY)
    // -------------------------------------------------------
    function getCanvasData() {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 80;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 300, 80);

            ctx.font = "20px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("StableCanvasText", 10, 20);

            ctx.fillStyle = "#333333";
            ctx.fillRect(10, 40, 150, 10);

            return canvas.toDataURL();
        } catch (e) {
            return "";
        }
    }

    // -------------------------------------------------------
    // 3️⃣ WebGL Renderer (for anomaly detection ONLY)
    // -------------------------------------------------------
    function getWebGLInfo() {
        try {
            const canvas = document.createElement("canvas");
            const gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
            if (!gl) return { supported: false };

            const ext = gl.getExtension("WEBGL_debug_renderer_info");

            return {
                supported: true,
                vendor: ext
                    ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)
                    : gl.getParameter(gl.VENDOR),
                renderer: ext
                    ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
                    : gl.getParameter(gl.RENDERER)
            };
        } catch (e) {
            return { supported: false };
        }
    }

    // -------------------------------------------------------
    // 4️⃣ Fonts Detection (limited)
    // -------------------------------------------------------
    async function detectFonts() {
        const baseFonts = ["monospace", "serif", "sans-serif"];
        const testFonts = [
            "Arial",
            "Courier New",
            "Times New Roman",
            "Roboto",
            "Segoe UI"
        ];

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

    // -------------------------------------------------------
    // 5️⃣ Plugins Detection
    // -------------------------------------------------------
    function detectPlugins() {
        try {
            const p = navigator.plugins || [];
            const names = [];
            for (let i = 0; i < p.length; i++) names.push(p[i].name);
            return names.join(",");
        } catch (e) {
            return "";
        }
    }

    // -------------------------------------------------------
    // 6️⃣ Collect EVERYTHING → but signature uses ONLY core
    // -------------------------------------------------------
    async function collectAll() {
        const core = await collectCore();
        const canvas = getCanvasData();
        const webgl = getWebGLInfo();
        const fonts = await detectFonts();
        const plugins = detectPlugins();

        // 🚫 IMPORTANT: no timestamp inside signature!
        const payload = {
            core,
            canvas,
            webgl,
            fonts,
            plugins,
            collected_at: new Date().toISOString() // not used in signature
        };

        // ---- signature uses ONLY core ----
        const normalizedCore = sortAndNormalize(core);
        const signature = await sha256Hex(normalizedCore);

        return {
            signature,
            normalizedCore,
            payload
        };
    }

    return { collectAll };
})();
