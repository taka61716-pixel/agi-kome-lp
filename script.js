const productSelect = document.querySelector("#productSelect");
const quantityInput = document.querySelector("#quantityInput");
const orderSummary = document.querySelector("#orderSummary");
const lineLink = document.querySelector("#lineLink");
const mailLink = document.querySelector("#mailLink");
const productCards = document.querySelectorAll(".product-card");

function selectedProduct() {
  const option = productSelect.options[productSelect.selectedIndex];
  return {
    name: option.value,
  };
}

function updateOrderLinks() {
  const product = selectedProduct();
  const quantity = Math.max(1, Number(quantityInput.value || 1));
  quantityInput.value = quantity;

  const summary = `${product.name} × ${quantity}`;
  orderSummary.textContent = summary;

  const message = `阿木川源流米を予約相談したいです。商品: ${product.name} / 数量: ${quantity} / 価格と送料を確認したいです。`;
  const subject = "阿木川源流米 予約相談";
  lineLink.href = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
  mailLink.href = `mailto:info@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  productCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.product === product.name);
  });
}

productCards.forEach((card) => {
  card.querySelector(".select-button").addEventListener("click", () => {
    const target = [...productSelect.options].find(
      (option) => option.value === card.dataset.product,
    );

    if (target) {
      productSelect.value = target.value;
      updateOrderLinks();
      document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    }
  });
});

productSelect.addEventListener("change", updateOrderLinks);
quantityInput.addEventListener("input", updateOrderLinks);
updateOrderLinks();
