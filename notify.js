/*!
 * PlaywithMe Toast Notification System
 * Usage: notify(message, type, duration)
 * Types: 'success' | 'error' | 'warning' | 'info'
 * Duration: milliseconds (0 = persistent until closed)
 */
(function () {

    const CSS = `
        #_pwm_wrap {
            position: fixed;
            z-index: 99999;
            bottom: 24px;
            right: 24px;
            display: flex;
            flex-direction: column-reverse;
            gap: 10px;
            pointer-events: none;
            width: 360px;
            max-width: calc(100vw - 48px);
        }

        .pwm-toast {
            background: #fffffe;
            border: 3px solid #272343;
            border-left-width: 7px;
            border-radius: 18px;
            padding: 14px 14px 18px 16px;
            box-shadow: 5px 5px 0 #272343;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            pointer-events: all;
            position: relative;
            overflow: hidden;
            animation: _pwm_in 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) both;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .pwm-toast.pwm-out {
            animation: _pwm_out 0.25s ease-in both !important;
        }

        @keyframes _pwm_in {
            from { opacity: 0; transform: translateX(48px) scale(0.9); }
            to   { opacity: 1; transform: translateX(0)    scale(1);   }
        }
        @keyframes _pwm_out {
            from { opacity: 1; transform: translateX(0)    scale(1); max-height: 200px; margin-bottom: 0; }
            to   { opacity: 0; transform: translateX(48px) scale(0.9); max-height: 0; margin-bottom: -10px; }
        }

        .pwm-icon {
            font-size: 26px;
            line-height: 1;
            flex-shrink: 0;
            padding-top: 1px;
        }
        .pwm-body { flex: 1; min-width: 0; }
        .pwm-title {
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
        }
        .pwm-msg {
            font-size: 14px;
            color: #2d334a;
            line-height: 1.5;
            word-break: break-word;
        }
        .pwm-close {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 900;
            color: rgba(39,35,67,0.28);
            padding: 0 2px;
            flex-shrink: 0;
            line-height: 1;
            transition: color 0.1s, transform 0.1s;
        }
        .pwm-close:hover { color: #272343; transform: scale(1.2); }

        .pwm-prog {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 4px;
            background: rgba(39,35,67,0.06);
            border-radius: 0 0 14px 14px;
        }
        .pwm-bar {
            height: 100%;
            width: 100%;
            border-radius: 0 0 0 14px;
            transition: width linear;
        }

        /* ── Type colors ── */
        .pwm-success { border-left-color: #16a34a; }
        .pwm-success .pwm-title { color: #16a34a; }
        .pwm-success .pwm-bar   { background: #16a34a; }

        .pwm-error   { border-left-color: #dc2626; }
        .pwm-error   .pwm-title { color: #dc2626; }
        .pwm-error   .pwm-bar   { background: #dc2626; }

        .pwm-warning { border-left-color: #d97706; }
        .pwm-warning .pwm-title { color: #d97706; }
        .pwm-warning .pwm-bar   { background: #d97706; }

        .pwm-info    { border-left-color: #0ea5e9; }
        .pwm-info    .pwm-title { color: #0284c7; }
        .pwm-info    .pwm-bar   { background: #0ea5e9; }

        /* ── Mobile ── */
        @media (max-width: 480px) {
            #_pwm_wrap {
                bottom: 16px;
                right: 12px;
                left: 12px;
                width: auto;
                max-width: none;
            }
            .pwm-toast {
                border-radius: 16px;
                box-shadow: 4px 4px 0 #272343;
                padding: 13px 13px 17px 15px;
            }
            @keyframes _pwm_in {
                from { opacity: 0; transform: translateY(28px) scale(0.94); }
                to   { opacity: 1; transform: translateY(0)    scale(1);    }
            }
            @keyframes _pwm_out {
                from { opacity: 1; transform: translateY(0);    max-height: 200px; }
                to   { opacity: 0; transform: translateY(24px); max-height: 0;     }
            }
        }
    `;

    const TYPE = {
        success: { icon: '🎉', title: 'Berhasil!',       ms: 4000 },
        error:   { icon: '🚨', title: 'Ups!',             ms: 5000 },
        warning: { icon: '⚡', title: 'Perhatian',        ms: 4500 },
        info:    { icon: '💡', title: 'Info',             ms: 3500 },
    };

    let ready = false;
    let queue = [];

    function init() {
        if (ready) return;
        ready = true;

        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const wrap = document.createElement('div');
        wrap.id = '_pwm_wrap';
        document.body.appendChild(wrap);

        // Flush queue
        queue.forEach(args => _show(...args));
        queue = [];
    }

    function _show(msg, type, ms) {
        const cfg = TYPE[type] || TYPE.info;
        const duration = (ms !== undefined) ? ms : cfg.ms;
        const id = '_pwm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        const wrap = document.getElementById('_pwm_wrap');

        const el = document.createElement('div');
        el.id = id;
        el.className = `pwm-toast pwm-${type}`;
        el.innerHTML = `
            <div class="pwm-icon">${cfg.icon}</div>
            <div class="pwm-body">
                <div class="pwm-title">${cfg.title}</div>
                <div class="pwm-msg">${msg}</div>
            </div>
            <button class="pwm-close" onclick="pwmClose('${id}')">✕</button>
            ${duration > 0 ? `<div class="pwm-prog"><div class="pwm-bar" id="${id}_b"></div></div>` : ''}
        `;
        wrap.appendChild(el);

        if (duration > 0) {
            const bar = document.getElementById(id + '_b');
            // Double rAF to let the browser render first
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (bar) {
                    bar.style.transition = `width ${duration}ms linear`;
                    bar.style.width = '0%';
                }
            }));

            let timer = setTimeout(() => window.pwmClose(id), duration);
            let remaining = duration;
            let startTime;

            el.addEventListener('mouseenter', () => {
                clearTimeout(timer);
                if (bar) bar.style.transition = 'none';
                startTime && (remaining -= Date.now() - startTime);
            });
            el.addEventListener('mouseleave', () => {
                startTime = Date.now();
                if (bar && remaining > 0) {
                    bar.style.transition = `width ${remaining}ms linear`;
                    bar.style.width = '0%';
                }
                timer = setTimeout(() => window.pwmClose(id), remaining);
            });
            startTime = Date.now();
        }

        return id;
    }

    window.notify = function (msg, type, ms) {
        type = type || 'info';
        if (!document.body) {
            queue.push([msg, type, ms]);
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        init();
        return _show(msg, type, ms);
    };

    window.pwmClose = function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('pwm-out');
        setTimeout(() => el && el.remove(), 280);
    };

})();
