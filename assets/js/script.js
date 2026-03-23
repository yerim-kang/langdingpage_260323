    // Hero background auto slide
    (function initHeroSlides() {
      const $slides = $('.hero-slide');
      if (!$slides.length) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let index = 0;
      let timerId = null;
      const INTERVAL_MS = 5500;

      function showSlide(next) {
        $slides.eq(index).removeClass('is-active');
        index = next;
        $slides.eq(index).addClass('is-active');
      }

      function tick() {
        showSlide((index + 1) % $slides.length);
      }

      function start() {
        if (timerId || reduceMotion.matches) return;
        timerId = window.setInterval(tick, INTERVAL_MS);
      }

      function stop() {
        if (timerId) {
          window.clearInterval(timerId);
          timerId = null;
        }
      }

      reduceMotion.addEventListener('change', () => {
        stop();
        if (!reduceMotion.matches) start();
      });

      if (!reduceMotion.matches) start();
    })();

    // Hero intro animation (GSAP stagger fade-up)
    (function initHeroGsapAnimation() {
      if (!window.gsap) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const heroTargets = [
        '.hero-badge',
        '.hero-title',
        '.hero-sub',
        '.hero-actions',
        '.quick-contact',
        '.hero-stats'
      ];

      window.gsap.from(heroTargets, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.14,
        delay: 0.2,
        clearProps: 'transform,opacity'
      });
    })();

    // Header scroll effect
    const $header = $('#header');

    $(window).on('scroll', function() {
      $header.toggleClass('scrolled', window.scrollY > 50);
    });

    // Global fade-up (GSAP) - animate content, not section backgrounds
    (function initTextFadeUp() {
      if (!window.gsap) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const $sections = $('.reveal');

      if (!$sections.length) return;

      const targetsBySection = new Map();

      $sections.each(function() {
        const sectionEl = this;

        const $targets = $(sectionEl).find(
          '.trust-card, .service-card, .adv-card, .lawyer-card, .case-card, .review-card, ' +
          '.faq-item, .consult-form-card, ' +
          '.cases-more-btn, .reviews-more-btn, ' +
          '.section-label, .section-title, .section-desc, ' +
          'h1, h2, h3, p, li, a, strong, em, span'
        ).filter(function() {
          // Avoid animating empty/decorative nodes.
          const text = ($(this).text() || '').trim();
          return text.length > 0 || $(this).find('*').length > 0;
        });

        const targets = $targets.toArray();
        targetsBySection.set(sectionEl, targets);

        // Keep the section (background) visible; only animate inner content.
        if (!reduceMotion) {
          gsap.set(sectionEl, { opacity: 1, y: 0 });
          if (targets.length) gsap.set(targets, { opacity: 0, y: 40 });
        }
      });

      if (reduceMotion) {
        $sections.each(function() {
          gsap.set(this, { opacity: 1, y: 0 });
          const targets = targetsBySection.get(this) || [];
          if (targets.length) gsap.set(targets, { opacity: 1, y: 0 });
        });
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const sectionEl = entry.target;
          const targets = targetsBySection.get(sectionEl) || [];

          if (targets.length) {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.03,
              delay: 0.05
            });
          }

          observer.unobserve(sectionEl);
        });
      }, { threshold: 0.15 });

      $sections.each(function() {
        observer.observe(this);
      });
    })();

    // Number counter animation
    const counterElements = $('[data-count]').toArray();
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // FAQ accordion
    $('.faq-question').on('click', function() {
      const $item = $(this).parent();
      const $answer = $item.find('.faq-answer').first();
      const isActive = $item.hasClass('active');

      $('.faq-item').each(function() {
        const $faqItem = $(this);
        $faqItem.removeClass('active');
        $faqItem.find('.faq-question').attr('aria-expanded', 'false');
        $faqItem.find('.faq-answer').css('max-height', '0');
      });

      if (!isActive) {
        $item.addClass('active');
        $(this).attr('aria-expanded', 'true');
        const answerEl = $answer[0];
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      }
    });

    $('.faq-question').on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Floating actions + scroll top: 히어로 영역을 벗난 뒤에만 표시
    const $floatActions = $('.float-actions');
    const $scrollTopBtn = $('#scrollTop');
    const $heroEl = $('#hero');

    function updateFloatActionsVisibility() {
      let show = false;
      if ($heroEl.length) {
        const headerHeight = $('#header').outerHeight() || 72;
        // Show when hero content has moved out of view under the fixed header.
        show = $heroEl[0].getBoundingClientRect().bottom <= headerHeight + 4;
      } else {
        show = window.scrollY > 600;
      }
      if ($floatActions.length) {
        $floatActions.toggleClass('visible', show);
      }
    }

    $(window).on('scroll', updateFloatActionsVisibility);
    $(window).on('resize', updateFloatActionsVisibility);
    updateFloatActionsVisibility();

    if ($scrollTopBtn.length) {
      $scrollTopBtn.on('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Form submission
    function handleSubmit(e) {
      e.preventDefault();
      const $form = $('#consultForm');
      const $submitBtn = $form.find('.form-submit').first();
      const originalText = $submitBtn.text();

      $submitBtn.text('신청이 완료되었습니다');
      $submitBtn.css('background', 'var(--accent)');
      $submitBtn.prop('disabled', true);

      setTimeout(() => {
        $submitBtn.text(originalText);
        $submitBtn.css('background', '');
        $submitBtn.prop('disabled', false);
        $form[0].reset();
      }, 3000);

      return false;
    }

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
      const href = $(this).attr('href');
      if (!href || href === '#') return;

      let target;
      try {
        target = $(href).get(0);
      } catch {
        return;
      }

      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });

    // Phone number formatting
    const $phoneInput = $('#phone');
    if ($phoneInput.length) {
      $phoneInput.on('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 3 && value.length <= 7) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
          value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        this.value = value;
      });
    }

    // Reviews swiper (의뢰인 후기)
    (function initReviewsSwiper() {
      const swiperEl = $('.reviews-swiper').get(0);
      if (!swiperEl) return;
      if (!window.Swiper) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      new window.Swiper(swiperEl, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 16,
        loop: true,
        speed: reduceMotion ? 0 : 600,
        autoHeight: true,
        grabCursor: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 100,
          depth: 180,
          modifier: 0.8,
          slideShadows: false,
        },
        pagination: {
          el: '.reviews-pagination',
          clickable: true
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 24
          }
        }
      });
    })();

    // Cases swiper (실제 사건)
    (function initCasesSwiper() {
      const swiperEl = $('.cases-swiper').get(0);
      if (!swiperEl) return;
      if (!window.Swiper) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      new window.Swiper(swiperEl, {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 24,
        loop: true,
        speed: reduceMotion ? 0 : 600,
        grabCursor: true,
        navigation: {
          nextEl: '.cases-swiper-next',
          prevEl: '.cases-swiper-prev'
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 24
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 16
          }
        }
      });
    })();

