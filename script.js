const quantityInput = document.querySelector("#quantityInput");
const orderSummary = document.querySelector("#orderSummary");
const orderField = document.querySelector("#orderField");
const lineLink = document.querySelector("#lineLink");
const mailLink = document.querySelector("#mailLink");
const reserveForm = document.querySelector("#reserveForm");
const productCards = document.querySelectorAll(".product-card");
const quickAmountButtons = document.querySelectorAll(".quick-amounts button");
const stickyCta = document.querySelector(".mobile-sticky-cta");
const orderSection = document.querySelector("#order");
const heroSection = document.querySelector(".hero");

const pricePerKg = 756;
const shippingPer10Kg = 1000;

// GA4等にイベントを送る共通関数です
// gtagが未設定でもエラーにならないようガードしています
function trackEvent(name, params) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params || {});
  }
}

function normalizeKg(value) {
  const kg = Math.max(10, Number(value || 10));
  return Math.ceil(kg / 10) * 10;
}

function updateOrderLinks() {
  const kg = normalizeKg(quantityInput.value);
  quantityInput.value = kg;

  const price = kg * pricePerKg;
  const shipping = Math.ceil(kg / 10) * shippingPer10Kg;
  const total = price + shipping;
  const displaySummary = `玄米 ${kg}kg\n商品 ${price.toLocaleString()}円 税込\n送料目安 ${shipping.toLocaleString()}円\n合計目安 ${total.toLocaleString()}円`;
  const submitSummary = `玄米 ${kg}kg / 商品 ${price.toLocaleString()}円（税込） / 送料目安 ${shipping.toLocaleString()}円 / 合計目安 ${total.toLocaleString()}円`;
  orderSummary.textContent = displaySummary;
  if (orderField) {
    orderField.value = submitSummary;
  }

  const message = `阿木ファームのあぎひかり玄米を早期予約相談したいです / 希望数量: ${kg}kg / 商品: ${price.toLocaleString()}円（税込） / 送料目安: ${shipping.toLocaleString()}円 / 合計目安: ${total.toLocaleString()}円 / 受け取り時期を確認したいです`;
  if (lineLink) {
    lineLink.href = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
  }

  productCards.forEach((card) => {
    card.classList.toggle("is-selected", Number(card.dataset.kg) === kg);
  });

  quickAmountButtons.forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.kg) === kg);
  });
}

// 予約締切の表示文をページ本文の締切に合わせます
function updateDeadlineBanners() {
  const banners = [document.querySelector("#deadlineBannerHero"), document.querySelector("#deadlineBannerOrder")];
  const deadline = new Date(new Date().getFullYear(), 7, 31, 23, 59, 59); // 8月31日（月は0始まりのため7）
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / msPerDay);

  let text;
  if (daysLeft > 0) {
    text = "先行予約受付：8月31日まで";
  } else if (daysLeft === 0) {
    text = "本日が先行予約の締切日です（8月31日）";
  } else {
    text = "本年の早期予約受付は締め切りました　次回のご案内までお待ちください";
  }

  banners.forEach((banner) => {
    if (banner) {
      banner.textContent = text;
    }
  });
}

productCards.forEach((card) => {
  card.querySelector(".select-button").addEventListener("click", () => {
    quantityInput.value = card.dataset.kg;
    updateOrderLinks();
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  });
});

quickAmountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    quantityInput.value = button.dataset.kg;
    updateOrderLinks();
  });
});

quantityInput.addEventListener("input", updateOrderLinks);
quantityInput.addEventListener("blur", updateOrderLinks);
updateOrderLinks();
updateDeadlineBanners();

if (stickyCta) {
  function updateStickyCtaVisibility() {
    const heroVisible = heroSection
      ? heroSection.getBoundingClientRect().bottom > window.innerHeight * 0.18
      : false;
    const orderRect = orderSection?.getBoundingClientRect();
    const orderVisible = orderRect
      ? orderRect.top < window.innerHeight * 0.86 && orderRect.bottom > window.innerHeight * 0.16
      : false;

    stickyCta.classList.toggle("is-hidden", heroVisible || orderVisible);
  }

  window.addEventListener("scroll", updateStickyCtaVisibility, { passive: true });
  window.addEventListener("resize", updateStickyCtaVisibility);
  updateStickyCtaVisibility();
}

// どの導線から反応があったかをGA4で確認できるようにするクリック計測（計測ID未設定の間は何も起きません）
if (lineLink) {
  lineLink.addEventListener("click", () => {
    trackEvent("contact_click", { method: "line", value: quantityInput.value });
  });
}

if (mailLink) {
  mailLink.addEventListener("click", () => {
    trackEvent("contact_click", { method: "mail", value: quantityInput.value });
  });
}

if (reserveForm) {
  reserveForm.addEventListener("submit", () => {
    trackEvent("reserve_form_submit", { value: quantityInput.value });
  });
}

// 高級感を出すための控えめなスクロール演出
// 背景写真は奥でゆっくり、文字やカードは手前で少しだけ浮くように動かします
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  document.documentElement.classList.add("motion-ready");

  const heroImage = document.querySelector(".hero-image");
  const heroContent = document.querySelector(".hero-content");
  const heroStats = document.querySelector(".hero-stats");
  const parallaxCards = document.querySelectorAll(
    ".photo-card, .product-card, .quality-item, .family-item, .support-grid article, .taste-card-grid article"
  );
  const revealTargets = document.querySelectorAll(
    ".section-heading, .decision-grid > div, .proof-list > div, .support-grid article, .family-item, .story-copy, .photo-card, .quality-item, .process-strip article, .taste-card-grid article, .cook-grid article, .product-card, .delivery-grid article, .reserve-flow article, .terms-card, .order-panel"
  );

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight || 1;

    if (heroSection && heroImage) {
      const heroRect = heroSection.getBoundingClientRect();
      const heroProgress = clamp((0 - heroRect.top) / Math.max(heroRect.height, 1), 0, 1);
      heroImage.style.transform = `scale(${1.045 + heroProgress * 0.018}) translate3d(0, ${scrollY * 0.08}px, 0)`;
      heroSection.style.setProperty("--shine-y", `${heroProgress * 34}px`);
    }

    if (heroContent) {
      const lift = clamp(scrollY * -0.035, -26, 0);
      heroContent.style.transform = `translate3d(0, ${lift}px, 0)`;
    }

    if (heroStats) {
      const lift = clamp(scrollY * -0.022, -18, 0);
      heroStats.style.transform = `translate3d(0, ${lift}px, 0)`;
    }

    parallaxCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }
      const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const depth = index % 2 === 0 ? 10 : 16;
      const featuredLift = card.classList.contains("featured") ? -10 : 0;
      const y = clamp(centerOffset * -depth, -18, 18) + featuredLift;
      card.style.setProperty("--parallax-y", `${y}px`);
    });

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  requestParallaxUpdate();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      }
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal-item");
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  }
}
