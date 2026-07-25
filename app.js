/* ============================================================
   PetLovers — app.js
   Interatividade Modernizada: nav mobile, scroll progress, reveal, contadores,
   patinhas flutuantes, cards de produtos (afiliados), carrossel de avaliações,
   slideshow do hero e animações refinadas.
   ============================================================ */

(function () {
  "use strict";

  function buildMapUrl(locationConfig) {
    var query = encodeURIComponent(locationConfig.mapEmbedQuery || locationConfig.address || "");
    return "https://www.google.com/maps?q=" + query + "&output=embed";
  }

  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initScroll() {
    var header = document.getElementById("siteHeader");
    var bar = document.getElementById("scrollProgress");
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("scrolled", y > 10);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 }); // Limiar um pouco maior para animação mais visível
    els.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = target % 1 !== 0 ? 1 : 0;
        var start = 0, dur = 1800, t0 = performance.now(); // Mais lento
        function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 4); // EaseOutQuart para suavidade
          var val = start + (target - start) * eased;
          el.textContent = decimals ? val.toFixed(1).replace(".", ",") : Math.round(val).toLocaleString("pt-BR");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function initPaws() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var field = document.getElementById("pawField");
    if (!field) return;
    var paws = ["🐾"]; // Apenas um tipo para ser mais sutil
    setInterval(function () {
      if (document.hidden) return;
      var el = document.createElement("span");
      el.className = "paw";
      el.textContent = paws[0];
      el.style.left = Math.random() * 100 + "vw";
      el.style.bottom = "-50px";
      var dur = 10 + Math.random() * 10; // Mais lento
      el.style.animationDuration = dur + "s";
      el.style.fontSize = 0.8 + Math.random() * 1.2 + "rem"; // Menor
      el.style.opacity = 0.1 + Math.random() * 0.3; // Bem transparente
      field.appendChild(el);
      setTimeout(function () { el.remove(); }, dur * 1000);
    }, 2000); // Mais espaçado
  }

  function initHeroSlideshow() {
    var wrap = document.getElementById("heroImageWrap");
    if (!wrap) return;

    var slides = wrap.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    var current = 0;
    // Adiciona a classe active à primeira imagem
    slides[current].classList.add('active');

    setInterval(function () {
      if (document.hidden || slides.length < 2) return;
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000); // Troca a cada 5 segundos
  }

  function initReviewsCarousel() {
    var track = document.getElementById("reviewsTrack");
    if (!track) return;

    var cards = track.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    // Clona todos os cards para criar o loop infinito
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }

  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var status = document.getElementById("formStatus");
    var successCard = document.getElementById("formSuccessCard");
    var successCardName = document.getElementById("successCardName");
    var letterContent = document.getElementById("letter-content");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var email = form.email.value.trim();
      var mensagem = form.mensagem.value.trim();
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        status.className = "form-status error";
        status.textContent = "Preencha um nome válido, por favor. 🐾";
        return;
      }
      if (!nome || nome.length < 3) {
        status.className = "form-status error";
        status.textContent = "Preencha um e-mail válido, por favor. 🐾";
        return;
      }
      if (!mensagem || mensagem.length < 10) {
        status.className = "form-status error";
        status.textContent = "Preencha uma mensagem válida, por favor. 🐾";
        return;
      }

      // Esconder formulário e mostrar card de sucesso
      form.classList.add("form-hidden");
      successCardName.textContent = nome.split(" ")[0] + ", logo entraremos em contato! 🧡";
      letterContent.innerHTML = mensagem.split('\n')
        .filter(linha => linha.trim() !== '') // Opcional: remove linhas totalmente em branco
        .map(linha => `<p>${linha}</p>`)
        .join('\n');
      successCard.classList.add("form-success-card-show");
      // Garante que a div possa receber foco via script sem entrar na navegação por TAB do usuário
      successCard.setAttribute('tabindex', '-1');

      // Rola a tela até o card suavemente (opcional, mas recomendado)
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Aplica o foco no card
      successCard.focus();

      // Resetar formulário após a animação
      setTimeout(function () {
        form.reset();
      }, 500);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    initNav();
    initScroll();
    initHeroSlideshow();
    initReveal();
    initCounters();
    initPaws();
    initReviewsCarousel();
    initForm();
  });
})();