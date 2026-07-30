export default {
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(renderEntry(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    url.hostname = "workout-app.ms04626730.workers.dev";
    return fetch(new Request(url, request));
  },
};

function renderEntry() {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Workout</title>
  <style>
    :root { color-scheme: light; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fff; color: #111; }
    main { width: min(430px, calc(100vw - 40px)); display: grid; gap: 20px; justify-items: center; text-align: center; }
    img { width: 160px; height: 160px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,.12)); }
    h1 { margin: 0; font-size: 28px; line-height: 1.1; letter-spacing: 0; }
    p { margin: 0; color: #666; line-height: 1.6; }
    .actions { display: grid; gap: 12px; width: 100%; }
    button, a { appearance: none; border: 0; border-radius: 16px; padding: 15px 18px; font: inherit; font-weight: 750; text-decoration: none; cursor: pointer; }
    button.primary, a.primary { background: #111; color: #fff; }
    a.secondary { background: #f2f2f7; color: #111; }
    .status { min-height: 22px; font-size: 14px; color: #777; }
  </style>
</head>
<body>
  <main>
    <img src="/images/duck-mascot.png" alt="Workout mascot" />
    <h1>Workout</h1>
    <p>進入訓練記錄、模板與進度追蹤。</p>
    <div class="actions">
      <button id="signin" class="primary">使用 Google 登入</button>
      <a class="secondary" href="/log">進入訓練</a>
      <a class="secondary" href="/templates">查看模板</a>
    </div>
    <div id="status" class="status">檢查登入狀態中...</div>
  </main>
  <script>
    const statusEl = document.getElementById("status");
    const signin = document.getElementById("signin");

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/get-session", { credentials: "include" });
        const session = await res.json();
        if (session && session.user) {
          signin.textContent = "已登入，進入訓練";
          signin.onclick = () => { location.href = "/log"; };
          statusEl.textContent = session.user.email || "已登入";
          return;
        }
        statusEl.textContent = "尚未登入";
      } catch {
        statusEl.textContent = "暫時無法確認登入狀態";
      }
    }

    signin.onclick = async () => {
      signin.disabled = true;
      statusEl.textContent = "正在前往 Google...";
      try {
        const res = await fetch("/api/auth/sign-in/social", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ provider: "google", callbackURL: "/log" })
        });
        const data = await res.json();
        if (data && data.url) location.href = data.url;
        else throw new Error("Missing redirect URL");
      } catch {
        signin.disabled = false;
        statusEl.textContent = "登入啟動失敗，請稍後再試";
      }
    };

    checkSession();
  </script>
</body>
</html>`;
}
