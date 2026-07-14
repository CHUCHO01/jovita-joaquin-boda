document.addEventListener("DOMContentLoaded", () => {
  inicializarNavbar();
  inicializarScrollProgress();
  iniciarContador();
  agregarEfectosHover();
  agregarAnimacionesCSSEntrada();
});

/* NAVBAR */
function inicializarNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navbar = document.getElementById("navbar");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navMenu?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );
}

/* SCROLL PROGRESS */
function inicializarScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  window.addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + "%";
    },
    { passive: true },
  );
}

/* COUNTDOWN */
function iniciarContador() {
  const target = new Date("2026-11-14T14:00:00").getTime();

  const update = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach((id, i) => {
        document.getElementById(id).textContent = ["¡Hoy!", "🎉", "🎊", "💒"][
          i
        ];
      });
      return;
    }
    document.getElementById("days").textContent = Math.floor(diff / 86400000);
    document.getElementById("hours").textContent = Math.floor(
      (diff % 86400000) / 3600000,
    );
    document.getElementById("minutes").textContent = Math.floor(
      (diff % 3600000) / 60000,
    );
    document.getElementById("seconds").textContent = Math.floor(
      (diff % 60000) / 1000,
    );
  };

  update();
  setInterval(update, 1000);
}

/* HOVER EFFECTS */
function agregarEfectosHover() {
  document.querySelectorAll(".detail-card, .info-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition =
        "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)";
    });
  });
}

/* INTERSECTION OBSERVER ANIMATIONS */
function agregarAnimacionesCSSEntrada() {
  const style = document.createElement("style");
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  // Mark elements for reveal
  document
    .querySelectorAll(
      ".detail-card, .info-card, .location-card, .countdown-item",
    )
    .forEach((el, i) => {
      el.classList.add("reveal", `reveal-delay-${(i % 3) + 1}`);
    });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* NOTIFICACIÓN TOAST */
function mostrarNotificacion(msg) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed; top:80px; right:20px; max-width:320px;
    background:#3B4A2F; color:#fff; padding:1rem 1.4rem;
    font-family:'Jost',sans-serif; font-size:0.9rem; line-height:1.5;
    box-shadow:0 8px 32px rgba(0,0,0,.2); z-index:9999;
    animation: toastIn .4s cubic-bezier(0.4,0,0.2,1) both;
    border-left: 3px solid #C9A96E;
  `;
  toast.textContent = msg;

  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes toastIn  { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
    @keyframes toastOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(40px); } }
  `;
  document.head.appendChild(styleEl);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut .4s cubic-bezier(0.4,0,0.2,1) forwards";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* COMPARTIR */
function compartirEnRedes(red) {
  const url = window.location.href;
  const text = "¡Estoy invitado a la boda de Jovita & Joaquin! 🌿";
  const urls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=¡Boda de Jovita %26 Joaquin!&body=${encodeURIComponent(text + "\n" + url)}`,
  };
  if (urls[red]) window.open(urls[red], "_blank");
}

console.log("✦ Invitación Jovita & Joaquin · 2026 ✦");

/* SUBIDA DE FOTOS — Solo guarda en Google Drive, sin galería */

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzf3DUUVt3BFkriDOPJBHiY_J9CzV5Oz2cTFLmEYlRHZ2oi2MKTmM3H7OT4bqTAQSnR/exec";

let subiendoFotos = false;

function inicializarGaleria() {
  const zone = document.getElementById("uploadZone");
  const input = document.getElementById("fileInput");
  if (!zone || !input) return;

  zone.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") input.click();
  });
  input.addEventListener("change", () => procesarArchivos(input.files));

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    procesarArchivos(e.dataTransfer.files);
  });
}

function procesarArchivos(files) {
  if (subiendoFotos) {
    mostrarNotificacion("Espera a que terminen de subirse las fotos anteriores.");
    return;
  }
  const maxSize = 10 * 1024 * 1024;
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const validos = Array.from(files).filter((f) => {
    if (!permitidos.includes(f.type)) {
      mostrarNotificacion(`❌ "${f.name}" no es un formato válido.`);
      return false;
    }
    if (f.size > maxSize) {
      mostrarNotificacion(`❌ "${f.name}" supera los 10 MB.`);
      return false;
    }
    return true;
  });
  if (validos.length === 0) return;
  subirFotosDrive(validos);
}

async function subirFotosDrive(archivos) {
  subiendoFotos = true;
  mostrarBarraProgreso(0, archivos.length);

  for (let i = 0; i < archivos.length; i++) {
    const archivo = archivos[i];
    actualizarBarraProgreso(i, archivos.length, archivo.name);
    try {
      const base64 = await leerComoBase64(archivo);
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ nombre: archivo.name, tipo: archivo.type, datos: base64 }),
      });
      const data = await res.json();
      if (!data.ok) mostrarNotificacion(`❌ Error al subir "${archivo.name}": ${data.error}`);
    } catch (err) {
      mostrarNotificacion(`❌ No se pudo subir "${archivo.name}". Intenta de nuevo.`);
    }
  }

  ocultarBarraProgreso();
  subiendoFotos = false;
  const n = archivos.length;
  mostrarNotificacion(`✓ ${n} foto${n !== 1 ? "s" : ""} guardada${n !== 1 ? "s" : ""} en Drive 🎉`);
}

function leerComoBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function mostrarBarraProgreso(actual, total) {
  let barra = document.getElementById("uploadProgress");
  if (!barra) {
    barra = document.createElement("div");
    barra.id = "uploadProgress";
    barra.style.cssText = `
      position:fixed; bottom:0; left:0; right:0; z-index:3000;
      background:rgba(35,45,22,0.97); padding:1rem 2rem;
      display:flex; align-items:center; gap:1.2rem;
      font-family:'Jost',sans-serif; color:#fff; font-size:0.85rem;
      border-top: 1px solid rgba(201,169,110,0.3);
    `;
    barra.innerHTML = `
      <span id="uploadProgressText" style="flex:0 0 auto; min-width:180px; color:rgba(255,255,255,0.7)"></span>
      <div style="flex:1; background:rgba(255,255,255,0.1); height:4px; border-radius:2px;">
        <div id="uploadProgressBar" style="height:100%; background:#C9A96E; border-radius:2px; transition:width 0.3s ease; width:0%"></div>
      </div>
      <span id="uploadProgressCount" style="flex:0 0 auto; color:#C9A96E; font-weight:500"></span>
    `;
    document.body.appendChild(barra);
  }
  actualizarBarraProgreso(actual, total, "");
}

function actualizarBarraProgreso(actual, total, nombre) {
  const bar = document.getElementById("uploadProgressBar");
  const text = document.getElementById("uploadProgressText");
  const count = document.getElementById("uploadProgressCount");
  if (!bar) return;
  bar.style.width = Math.round((actual / total) * 100) + "%";
  text.textContent = nombre ? `Subiendo: ${nombre.substring(0, 30)}…` : "Preparando…";
  count.textContent = `${actual + 1} / ${total}`;
}

function ocultarBarraProgreso() {
  const barra = document.getElementById("uploadProgress");
  if (barra) {
    barra.style.opacity = "0";
    barra.style.transition = "opacity 0.4s";
    setTimeout(() => barra.remove(), 400);
  }
}

document.addEventListener("DOMContentLoaded", inicializarGaleria);
