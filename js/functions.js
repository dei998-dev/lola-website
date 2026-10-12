/* =========================================================
   Lola Guevara — comportamiento de la landing
   Cuatro piezas independientes. Si falta el HTML de alguna,
   esa pieza no hace nada y las demás siguen funcionando.
   ========================================================= */
(function () {
  'use strict';

  var MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)';
  var MOVIL = '(max-width: 759px)';

  /* ---------------------------------------------------------
     1. Barra fija de móvil
     Aparece al salir del hero y se esconde al llegar al cierre,
     donde los mismos botones ya están en pantalla.
     --------------------------------------------------------- */
  function barraMovil() {
    var barra  = document.getElementById('barra');
    var hero   = document.getElementById('inicio');
    var cierre = document.getElementById('cierre');

    if (!barra || !hero || !cierre || !('IntersectionObserver' in window)) { return; }

    var heroVisible = true;
    var cierreVisible = false;

    function actualizar() {
      var mostrar = !heroVisible && !cierreVisible &&
                    window.matchMedia(MOVIL).matches;
      barra.classList.toggle('visible', mostrar);
      document.body.classList.toggle('con-barra', mostrar);
    }

    new IntersectionObserver(function (entradas) {
      heroVisible = entradas[0].isIntersecting;
      actualizar();
    }, { rootMargin: '-40px 0px 0px 0px' }).observe(hero);

    new IntersectionObserver(function (entradas) {
      cierreVisible = entradas[0].isIntersecting;
      actualizar();
    }).observe(cierre);

    window.addEventListener('resize', actualizar);
  }

  /* ---------------------------------------------------------
     2. Cifras que cuentan
     Arrancan una sola vez, cuando entran en pantalla.
     El valor final está escrito en el HTML: si esto no corre,
     las cifras se ven igual, solo que sin animación.
     --------------------------------------------------------- */
  function cifrasAnimadas() {
    var cifras = document.querySelectorAll('[data-cifra]');

    if (!cifras.length ||
        !('IntersectionObserver' in window) ||
        window.matchMedia(MOVIMIENTO_REDUCIDO).matches) { return; }

    function pintar(el, n) {
      el.textContent = (el.dataset.antes || '') +
                       n.toLocaleString('es-ES') +
                       (el.dataset.despues || '');
    }

    function contar(el) {
      var fin = parseInt(el.dataset.valor, 10);
      var duracion = 1100;
      var inicio = null;

      pintar(el, 0);

      function paso(t) {
        if (inicio === null) { inicio = t; }
        var avance = Math.min((t - inicio) / duracion, 1);
        var suave = 1 - Math.pow(1 - avance, 3);   // desaceleración
        pintar(el, Math.round(fin * suave));
        if (avance < 1) { requestAnimationFrame(paso); }
      }

      requestAnimationFrame(paso);
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          contar(e.target);
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(cifras, function (el) { observador.observe(el); });
  }

  /* ---------------------------------------------------------
     3. Carrusel de testimonios
     Los testimonios son de largos muy distintos, así que el
     marco mide el alto del activo y lo anima en el cambio.
     Sin este script se ve el primero, completo.
     --------------------------------------------------------- */
  function carruselTestimonios() {
    var carrusel = document.getElementById('carrusel');
    var marco    = document.getElementById('marco');
    var puntos   = document.getElementById('puntos');
    var siguiente = document.getElementById('siguiente');

    if (!carrusel || !marco || !puntos) { return; }

    var slides = Array.prototype.slice.call(marco.querySelectorAll('.t-slide'));
    if (!slides.length) { return; }

    var activo = 0;

    // ya hay JS: todas las láminas se superponen
    slides.forEach(function (s) { s.style.position = 'absolute'; });

    function ajustarAlto(conTransicion) {
      if (!conTransicion) { marco.classList.add('sin-transicion'); }
      marco.style.height = slides[activo].offsetHeight + 'px';
      if (!conTransicion) {
        void marco.offsetHeight;          // fuerza el repintado
        marco.classList.remove('sin-transicion');
      }
    }

    function mostrar(i) {
      activo = (i + slides.length) % slides.length;

      slides.forEach(function (s, n) {
        s.classList.toggle('activa', n === activo);
        s.setAttribute('aria-hidden', n === activo ? 'false' : 'true');
      });

      Array.prototype.forEach.call(puntos.children, function (b, n) {
        b.setAttribute('aria-current', n === activo ? 'true' : 'false');
      });

      ajustarAlto(true);
    }

    // los puntos se crean aquí: sin JS no sirven de nada
    slides.forEach(function (s, n) {
      s.setAttribute('aria-hidden', n === 0 ? 'false' : 'true');

      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'punto';
      boton.setAttribute('aria-label', 'Testimonio ' + (n + 1) + ' de ' + slides.length);
      boton.setAttribute('aria-current', n === 0 ? 'true' : 'false');
      boton.addEventListener('click', function () { mostrar(n); });
      puntos.appendChild(boton);
    });

    if (siguiente) {
      siguiente.addEventListener('click', function () { mostrar(activo + 1); });
    }

    marco.addEventListener('click', function (e) {
      if (!e.target.closest('a, button')) { mostrar(activo + 1); }
    });

    carrusel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(activo + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); mostrar(activo - 1); }
    });

    // el alto se recalcula cada vez que el texto puede haber cambiado de tamaño
    ajustarAlto(false);
    window.addEventListener('resize', function () { ajustarAlto(false); });
    window.addEventListener('load',   function () { ajustarAlto(false); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ajustarAlto(false); });
    }
  }

  /* ---------------------------------------------------------
     4. Vídeo del hero
     Se detiene si la persona pide menos movimiento y mientras
     la pestaña no está a la vista.
     --------------------------------------------------------- */
  function videoHero() {
    var video = document.querySelector('video.hero-video');
    if (!video) { return; }

    var quieto = window.matchMedia(MOVIMIENTO_REDUCIDO);

    function ajustar() {
      if (quieto.matches) {
        video.pause();
      } else {
        var p = video.play();
        if (p && p.catch) { p.catch(function () {}); }
      }
    }

    ajustar();

    if (quieto.addEventListener) {
      quieto.addEventListener('change', ajustar);
    } else if (quieto.addListener) {
      quieto.addListener(ajustar);        // Safari antiguo
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { video.pause(); } else { ajustar(); }
    });
  }

  /* ---------------------------------------------------------
     5. Cabecera fija
     Siempre visible. Transparente sobre el hero; sólida en
     cuanto el hero sale de debajo de ella.
     --------------------------------------------------------- */
  function cabeceraFija() {
    var cab  = document.querySelector('.cabecera');
    var hero = document.getElementById('inicio');
    if (!cab || !hero) { return; }

    cab.classList.add('fija');
    var pendiente = false;

    function actualizar() {
      pendiente = false;
      // un poco antes del final del hero, para que nunca quede
      // transparente sobre el borde del vídeo
      var limite = hero.offsetHeight - cab.offsetHeight * 2;
      cab.classList.toggle('solida', window.scrollY > limite);
    }

    window.addEventListener('scroll', function () {
      if (!pendiente) { pendiente = true; window.requestAnimationFrame(actualizar); }
    }, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
  }

  /* --------------------------------------------------------- */
  cabeceraFija();
  barraMovil();
  cifrasAnimadas();
  carruselTestimonios();
  videoHero();
})();
