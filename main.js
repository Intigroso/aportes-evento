(function () {
  'use strict';

  var FEEDBACK_MS = 2000;

  var btn = document.getElementById('btnCopy');
  var label = btn.querySelector('.copy__label');
  var aliasEl = document.getElementById('aliasValue');
  var status = document.getElementById('copyStatus');
  var cta = document.getElementById('ctaMp');
  var timer = null;

  /* ---------- Copiar alias ---------- */

  // Respaldo para navegadores viejos o contextos sin HTTPS
  function copyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function feedback(ok) {
    clearTimeout(timer);
    btn.classList.remove('is-ok', 'is-err');
    void btn.offsetWidth; // reinicia la animación si se toca varias veces
    btn.classList.add(ok ? 'is-ok' : 'is-err');
    label.textContent = ok ? '¡Copiado!' : 'Error';
    status.textContent = ok ? 'Alias copiado al portapapeles' : 'No se pudo copiar el alias';
    if (ok && navigator.vibrate) navigator.vibrate(30);

    timer = setTimeout(function () {
      btn.classList.remove('is-ok', 'is-err');
      label.textContent = 'Copiar';
      status.textContent = '';
    }, FEEDBACK_MS);
  }

  btn.addEventListener('click', function () {
    var alias = aliasEl.textContent.trim();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(alias)
        .then(function () { feedback(true); })
        .catch(function () { feedback(copyFallback(alias)); });
    } else {
      feedback(copyFallback(alias));
    }
  });

  /* ---------- CTA Mercado Pago ---------- */

  // Mientras el href esté vacío, evita recargar la página
  cta.addEventListener('click', function (e) {
    var href = (cta.getAttribute('href') || '').trim();
    if (!href || href === '#') {
      e.preventDefault();
      console.warn('[Landing] Falta configurar el link de Mercado Pago en el href de #ctaMp');
    }
  });
})();
