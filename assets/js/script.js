
// $(function () {
//   var $window = $(window);
//   var $header = $('#header');
//   var $hero = $('#hero');
//   var $floatActions = $('.float-actions');
//   var $scrollTopBtn = $('#scrollTop');
//   var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

//   // 모바일 메뉴 열기/닫기
//   var $mobileMenuBtn = $('#mobileMenuBtn');
//   var $navMobile = $('.nav-mobile');

//   function closeMobileMenu() {
//     $navMobile.removeClass('active');
//     $mobileMenuBtn.removeClass('active');
//     $mobileMenuBtn.attr('aria-expanded', 'false');
//   }

//   function toggleMobileMenu() {
//     var isOpen = $navMobile.hasClass('active');
//     if (isOpen) {
//       closeMobileMenu();
//     } else {
//       $navMobile.addClass('active');
//       $mobileMenuBtn.addClass('active');
//       $mobileMenuBtn.attr('aria-expanded', 'true');
//     }
//   }

//   $mobileMenuBtn.on('click', function () {
//     toggleMobileMenu();
//   });

//   // 모바일 메뉴 링크를 누르면 메뉴 닫기
//   $navMobile.find('a').on('click', function () {
//     closeMobileMenu();
//   });

//   // 메뉴 바깥을 누르면 닫기
//   $(document).on('click', function (e) {
//     if (!$navMobile.hasClass('active')) return;
//     var clickedMenu = $(e.target).closest('.nav-mobile').length > 0;
//     var clickedBtn = $(e.target).closest('#mobileMenuBtn').length > 0;
//     if (!clickedMenu && !clickedBtn) closeMobileMenu();
//   });

//   // 화면이 커지면 모바일 메뉴 닫기
//   $window.on('resize', function () {
//     if (window.innerWidth > 1024) closeMobileMenu();
//   });

//   // -------------------------
//   // 1) 헤더 스크롤 상태
//   // -------------------------
//   function updateHeader() {
//     $header.toggleClass('scrolled', window.scrollY > 50);
//   }
//   updateHeader();
//   $window.on('scroll', updateHeader);

//   // -------------------------
//   // 2) 히어로 배경 자동 전환
//   // -------------------------
//   (function initHeroSlides() {
//     var $slides = $('.hero-slide');
//     if (!$slides.length || reduceMotion) return;

//     var current = 0;
//     setInterval(function () {
//       $slides.eq(current).removeClass('is-active');
//       current = (current + 1) % $slides.length;
//       $slides.eq(current).addClass('is-active');
//     }, 5500);
//   })();

//   // -------------------------
//   // 3) 히어로 텍스트 등장 애니메이션(GSAP)
//   // -------------------------
//   (function initHeroAnimation() {
//     if (!window.gsap || reduceMotion) return;

//     gsap.from(
//       ['.hero-badge', '.hero-title', '.hero-sub', '.hero-actions', '.quick-contact', '.hero-stats'],
//       {
//         y: 40,
//         opacity: 0,
//         duration: 0.9,
//         stagger: 0.14,
//         ease: 'power3.out',
//         delay: 0.2,
//         clearProps: 'transform,opacity'
//       }
//     );
//   })();

//   // -------------------------
//   // 4) 섹션 페이드업(.reveal)
//   // -------------------------
//   (function initReveal() {
//     var $sections = $('.reveal');
//     if (!$sections.length) return;

//     // 모션 최소화 설정이면 바로 표시
//     if (reduceMotion) {
//       $sections.addClass('visible');
//       return;
//     }

//     function revealOnScroll() {
//       var winBottom = $window.scrollTop() + $window.height() * 0.9;

//       $sections.each(function () {
//         var $section = $(this);
//         if ($section.hasClass('visible')) return;

//         var sectionTop = $section.offset().top;
//         if (sectionTop < winBottom) {
//           $section.addClass('visible');
//         }
//       });
//     }

//     revealOnScroll();
//     $window.on('scroll resize', revealOnScroll);
//   })();

//   // -------------------------
//   // 5) 숫자 카운터
//   // -------------------------
//   (function initCounter() {
//     var $counters = $('[data-count]');
//     if (!$counters.length) return;

//     function runCounter($el) {
//       var target = parseInt($el.attr('data-count'), 10) || 0;
//       $({ value: 0 }).animate(
//         { value: target },
//         {
//           duration: 2000,
//           easing: 'swing',
//           step: function (now) {
//             $el.text(Math.floor(now).toLocaleString());
//           },
//           complete: function () {
//             $el.text(target.toLocaleString());
//           }
//         }
//       );
//     }

//     function checkCounters() {
//       var winBottom = $window.scrollTop() + $window.height() * 0.85;

//       $counters.each(function () {
//         var $el = $(this);
//         if ($el.data('counted')) return;
//         if ($el.offset().top < winBottom) {
//           $el.data('counted', true);
//           runCounter($el);
//         }
//       });
//     }

//     checkCounters();
//     $window.on('scroll resize', checkCounters);
//   })();

//   // -------------------------
//   // 6) FAQ 아코디언
//   // -------------------------
//   function closeAllFaq() {
//     $('.faq-item').removeClass('active');
//     $('.faq-question').attr('aria-expanded', 'false');
//     $('.faq-answer').css('max-height', '0');
//   }

//   $('.faq-question').on('click', function () {
//     var $question = $(this);
//     var $item = $question.parent();
//     var $answer = $item.find('.faq-answer').first();
//     var isOpen = $item.hasClass('active');

//     closeAllFaq();

//     if (!isOpen) {
//       $item.addClass('active');
//       $question.attr('aria-expanded', 'true');
//       $answer.css('max-height', $answer[0].scrollHeight + 'px');
//     }
//   });

//   $('.faq-question').on('keydown', function (e) {
//     if (e.key === 'Enter' || e.key === ' ') {
//       e.preventDefault();
//       $(this).trigger('click');
//     }
//   });

//   // -------------------------
//   // 7) 플로팅 버튼 노출 + 맨 위로
//   // -------------------------
//   function updateFloatingButtons() {
//     var show;
//     if ($hero.length) {
//       var headerHeight = $header.outerHeight() || 72;
//       show = $hero[0].getBoundingClientRect().bottom <= headerHeight + 4;
//     } else {
//       show = window.scrollY > 600;
//     }
//     $floatActions.toggleClass('visible', show);
//   }

//   updateFloatingButtons();
//   $window.on('scroll resize', updateFloatingButtons);

//   $scrollTopBtn.on('click', function () {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   });

//   // -------------------------
//   // 8) 앵커 부드러운 스크롤
//   // -------------------------
//   $('a[href^="#"]').on('click', function (e) {
//     var href = $(this).attr('href');
//     if (!href || href === '#') return;

//     var $target = $(href);
//     if (!$target.length) return;

//     e.preventDefault();
//     var offsetTop = $target.offset().top - 72;
//     window.scrollTo({ top: offsetTop, behavior: 'smooth' });
//   });

//   // -------------------------
//   // 9) 연락처 자동 하이픈
//   // -------------------------
//   $('#phone, #quickPhone').on('input', function () {
//     var value = $(this).val().replace(/\D/g, '');

//     if (value.length > 3 && value.length <= 7) {
//       value = value.slice(0, 3) + '-' + value.slice(3);
//     } else if (value.length > 7) {
//       value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
//     }

//     $(this).val(value);
//   });

//   // -------------------------
//   // 10) 폼 제출 공통 처리 (데모)
//   // -------------------------
//   function submitFeedback(formSelector, buttonSelector, doneText, resetMs) {
//     var $form = $(formSelector);
//     var $btn = $form.find(buttonSelector).first();
//     var originalText = $btn.text();

//     $btn.text(doneText);
//     $btn.css('background', 'var(--accent)');
//     $btn.prop('disabled', true);

//     setTimeout(function () {
//       $btn.text(originalText);
//       $btn.css('background', '');
//       $btn.prop('disabled', false);
//       if ($form.length) $form[0].reset();
//     }, resetMs);
//   }

//   window.handleSubmit = function (e) {
//     e.preventDefault();
//     submitFeedback('#consultForm', '.form-submit', '신청이 완료되었습니다', 3000);
//     return false;
//   };

//   window.handleQuickSubmit = function (e) {
//     e.preventDefault();
//     submitFeedback('#mobileQuickForm', '.mobile-quick-submit', '접수 완료', 2500);
//     return false;
//   };

//   // -------------------------
//   // 11) review Swiper
//   // -------------------------
//   (function initReviewSwiper() {
//     var swiperEl = $('.review-swiper').get(0);
//     if (!swiperEl || !window.Swiper) return;

//     new window.Swiper(swiperEl, {
//       slidesPerView: 1,
//       slidesPerGroup: 1,
//       spaceBetween: 16,
//       centeredSlides: true,
//       loop: true,
//       speed: reduceMotion ? 0 : 600,
//       autoHeight: true,
//       grabCursor: true,
//       autoplay: {
//         delay: 2500,
//         disableOnInteraction: false
//       },
//       effect: 'coverflow',
//       coverflowEffect: {
//         rotate: 0,
//         stretch: 0,
//         depth: 180,
//         modifier: 1,
//         slideShadows: false
//       },
//       pagination: {
//         el: '.review-pagination',
//         clickable: true
//       },
//       breakpoints: {
//         768: {
//           slidesPerView: 3,
//           spaceBetween: 24
//         }
//       }
//     });
//   })();

//   // -------------------------
//   // 12) case Swiper
//   // -------------------------
//   (function initCaseSwiper() {
//     var swiperEl = $('.case-swiper').get(0);
//     if (!swiperEl || !window.Swiper) return;

//     new window.Swiper(swiperEl, {
//       slidesPerView: 1,
//       slidesPerGroup: 1,
//       spaceBetween: 24,
//       loop: true,
//       speed: reduceMotion ? 0 : 600,
//       grabCursor: true,
//       navigation: {
//         nextEl: '.case-swiper-next',
//         prevEl: '.case-swiper-prev'
//       },
//       breakpoints: {
//         1024: {
//           slidesPerView: 3,
//           spaceBetween: 24
//         },
//         768: {
//           slidesPerView: 1,
//           spaceBetween: 16
//         }
//       }
//     });
//   })();
// });

$(function () {
  const $window = $(window);
  const $header = $('#header');
  const $hero = $('#hero');
  const $mobileMenuBtn = $('#mobileMenuBtn');
  const $navMobile = $('.nav-mobile');
  const $floatActions = $('.float-actions');
  const $scrollTopBtn = $('#scrollTop');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------
  // 1. 모바일 메뉴
  // -------------------------
  $mobileMenuBtn.on('click', function () {
    $(this).toggleClass('active');
    $navMobile.toggleClass('active');

    if ($navMobile.hasClass('active')) {
      $(this).attr('aria-expanded', 'true');
    } else {
      $(this).attr('aria-expanded', 'false');
    }
  });

  // 모바일 메뉴 링크 클릭하면 닫기
  $navMobile.find('a').on('click', function () {
    $navMobile.removeClass('active');
    $mobileMenuBtn.removeClass('active');
    $mobileMenuBtn.attr('aria-expanded', 'false');
  });

  // 화면 커지면 모바일 메뉴 닫기
  $window.on('resize', function () {
    if (window.innerWidth > 1024) {
      $navMobile.removeClass('active');
      $mobileMenuBtn.removeClass('active');
      $mobileMenuBtn.attr('aria-expanded', 'false');
    }
  });

  // -------------------------
  // 2. 헤더 스크롤 스타일
  // -------------------------
  function changeHeader() {
    if ($header.length) {
      if (window.scrollY > 50) {
        $header.addClass('scrolled');
      } else {
        $header.removeClass('scrolled');
      }
    }
  }

  changeHeader();
  $window.on('scroll', changeHeader);

  // -------------------------
  // 3. 히어로 배경 자동 전환
  // -------------------------
  const $heroSlides = $('.hero-slide');
  let currentSlide = 0;

  if ($heroSlides.length && !reduceMotion) {
    setInterval(function () {
      $heroSlides.eq(currentSlide).removeClass('is-active');

      currentSlide++;
      if (currentSlide >= $heroSlides.length) {
        currentSlide = 0;
      }

      $heroSlides.eq(currentSlide).addClass('is-active');
    }, 5500);
  }

  // -------------------------
  // 4. 히어로 텍스트 애니메이션
  // -------------------------
  if (window.gsap && !reduceMotion) {
    gsap.from(
      ['.hero-badge', '.hero-title', '.hero-sub', '.hero-actions', '.quick-contact', '.hero-stats'],
      {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.2,
        clearProps: 'transform,opacity'
      }
    );
  }

  // -------------------------
  // 5. 스크롤 시 reveal 요소 보이기
  // -------------------------
  const $reveal = $('.reveal');

  function showReveal() {
    let winBottom = $window.scrollTop() + $window.height() * 0.9;

    $reveal.each(function () {
      const $this = $(this);

      if ($this.hasClass('visible')) {
        return;
      }

      if ($this.offset().top < winBottom) {
        $this.addClass('visible');
      }
    });
  }

  if ($reveal.length) {
    if (reduceMotion) {
      $reveal.addClass('visible');
    } else {
      showReveal();
      $window.on('scroll resize', showReveal);
    }
  }

  // -------------------------
  // 6. 숫자 카운터
  // -------------------------
  const $counters = $('[data-count]');

  function startCounter($target) {
    const targetNumber = parseInt($target.attr('data-count'), 10) || 0;

    $({ number: 0 }).animate(
      { number: targetNumber },
      {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $target.text(Math.floor(now).toLocaleString());
        },
        complete: function () {
          $target.text(targetNumber.toLocaleString());
        }
      }
    );
  }

  function checkCounter() {
    let winBottom = $window.scrollTop() + $window.height() * 0.85;

    $counters.each(function () {
      const $this = $(this);

      if ($this.data('counted')) {
        return;
      }

      if ($this.offset().top < winBottom) {
        $this.data('counted', true);
        startCounter($this);
      }
    });
  }

  if ($counters.length) {
    checkCounter();
    $window.on('scroll resize', checkCounter);
  }

  // -------------------------
  // 7. FAQ 아코디언
  // -------------------------
  $('.faq-question').on('click', function () {
    const $question = $(this);
    const $item = $question.parent();
    const $answer = $item.find('.faq-answer').first();

    // 이미 열려 있으면 닫기
    if ($item.hasClass('active')) {
      $item.removeClass('active');
      $question.attr('aria-expanded', 'false');
      $answer.css('max-height', '0');
      return;
    }

    // 다른 FAQ 닫기
    $('.faq-item').removeClass('active');
    $('.faq-question').attr('aria-expanded', 'false');
    $('.faq-answer').css('max-height', '0');

    // 현재 FAQ 열기
    $item.addClass('active');
    $question.attr('aria-expanded', 'true');
    $answer.css('max-height', $answer[0].scrollHeight + 'px');
  });

  // 엔터, 스페이스 키로도 열리게
  $('.faq-question').on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).trigger('click');
    }
  });

  // -------------------------
  // 8. 플로팅 버튼 보이기
  // -------------------------
  function showFloatButtons() {
    let show = false;

    if ($hero.length) {
      const headerHeight = $header.outerHeight() || 72;
      const heroBottom = $hero[0].getBoundingClientRect().bottom;

      if (heroBottom <= headerHeight + 4) {
        show = true;
      }
    } else {
      if (window.scrollY > 600) {
        show = true;
      }
    }

    if (show) {
      $floatActions.addClass('visible');
    } else {
      $floatActions.removeClass('visible');
    }
  }

  showFloatButtons();
  $window.on('scroll resize', showFloatButtons);

  // 맨 위로 버튼
  $scrollTopBtn.on('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // -------------------------
  // 9. 앵커 부드러운 스크롤
  // -------------------------
  $('a[href^="#"]').on('click', function (e) {
    const href = $(this).attr('href');

    if (!href || href === '#') {
      return;
    }

    const $target = $(href);

    if (!$target.length) {
      return;
    }

    e.preventDefault();

    const targetTop = $target.offset().top - 72;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });

  // -------------------------
  // 10. 전화번호 자동 하이픈
  // -------------------------
  $('#phone, #quickPhone').on('input', function () {
    const value = $(this).val().replace(/\D/g, '');

    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }

    $(this).val(value);
  });

  // -------------------------
  // 11. 폼 버튼 문구 변경
  // -------------------------
  function changeSubmitState(formSelector, buttonSelector, completeText, delayTime) {
    const $form = $(formSelector);
    const $button = $form.find(buttonSelector).first();
    const originalText = $button.text();

    $button.text(completeText);
    $button.css('background', 'var(--accent)');
    $button.prop('disabled', true);

    setTimeout(function () {
      $button.text(originalText);
      $button.css('background', '');
      $button.prop('disabled', false);

      if ($form.length) {
        $form[0].reset();
      }
    }, delayTime);
  }

  window.handleSubmit = function (e) {
    e.preventDefault();
    changeSubmitState('#consultForm', '.form-submit', '신청이 완료되었습니다', 3000);
    return false;
  };

  window.handleQuickSubmit = function (e) {
    e.preventDefault();
    changeSubmitState('#mobileQuickForm', '.mobile-quick-submit', '접수 완료', 2500);
    return false;
  };

  // -------------------------
  // 12. 리뷰 스와이퍼
  // -------------------------
  if ($('.review-swiper').length && window.Swiper) {
    new Swiper('.review-swiper', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      speed: reduceMotion ? 0 : 600,
      autoHeight: true,
      grabCursor: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 180,
        modifier: 1,
        slideShadows: false
      },
      pagination: {
        el: '.review-pagination',
        clickable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
  }

  // -------------------------
  // 13. 사례 스와이퍼
  // -------------------------
  if ($('.case-swiper').length && window.Swiper) {
    new Swiper('.case-swiper', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 24,
      loop: true,
      speed: reduceMotion ? 0 : 600,
      grabCursor: true,
      navigation: {
        nextEl: '.case-swiper-next',
        prevEl: '.case-swiper-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
  }
});

