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

const pricePerKg = 770;
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
    text = "予約締切：8月31日ご入金分まで";
  } else if (daysLeft === 0) {
    text = "本日が予約締切日です（8月31日入金分）";
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
