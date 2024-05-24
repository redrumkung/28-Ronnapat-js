document.addEventListener("DOMContentLoaded", () => {
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productImageInput = document.getElementById("productImage");
  const createProductBtn = document.getElementById("createProduct");
  const productList = document.getElementById("productDashboard");
  const addToCartBtn = document.getElementById("addToCart");
  const cartList = document.getElementById("productCart");
  const totalPriceElement = document.getElementById("totalPrice");
  const totalPriceBtn = document.getElementById("sumPrice");
  const showTotal = document.getElementById("showTotal");

  let products = [];

  createProductBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission

    const productName = productNameInput.value.trim();
    const productPrice = productPriceInput.value.trim();
    const productImage = productImageInput.value.trim();
    if (productName && productPrice && productImage) {
      if (productPrice > 0) {
        if (isValidImageUrl(productImage)) {
          const product = {
            id: Date.now(),
            productName: productName,
            price: productPrice,
            image: productImage,
            amount: 1,
          };
          products.push(product);
          renderProducts(products);
          productNameInput.value = "";
          productPriceInput.value = "";
          productImageInput.value = "";
        } else {
          alert("Please enter a valid image URL (.jpg, .jpeg, .png, .gif).");
        }
      } else {
        alert("Please enter valid price.");
      }
    }
  });

  function isValidImageUrl(url) {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  function renderProducts(productsToRender) {
    productList.innerHTML = "";
    productsToRender.forEach((product) => {
      const productItem = document.createElement("li");
      productItem.className = "flex px-10 pb-5 gap-10";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "w-8";
      checkbox.dataset.id = product.id;
      productItem.appendChild(checkbox);

      const productImage = document.createElement("img");
      productImage.className = "w-16 h-16 object-cover rounded-lg";
      productImage.src = `${product.image}`;
      productItem.appendChild(productImage);

      const detailContainer = document.createElement("div");
      detailContainer.className = "flex flex-col gap-5";

      const productNameDisplay = document.createElement("h1");
      productNameDisplay.textContent = `${product.productName}`;
      detailContainer.appendChild(productNameDisplay);

      const productPriceDisplay = document.createElement("h1");
      productPriceDisplay.textContent = `$${parseFloat(product.price).toFixed(
        2
      )}`;
      detailContainer.appendChild(productPriceDisplay);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "bg-yellow-500 text-white px-4 py-2 rounded";
      editButton.addEventListener("click", () => editProduct(product.id));

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "bg-red-500 text-white px-4 py-2 rounded";
      removeButton.addEventListener("click", () => deleteProduct(product.id));

      productItem.appendChild(detailContainer);
      productItem.appendChild(editButton);
      productItem.appendChild(removeButton);

      productList.appendChild(productItem);
    });
  }

  function editProduct(id) {
    const product = products.find((product) => product.id === id);
    if (product) {
      const newProductName = prompt(
        "Enter new product name:",
        product.productName
      );
      const newProductPrice = prompt("Enter new product price:", product.price);
      const newProductImage = prompt(
        "Enter new product image URL:",
        product.image
      );
      if (newProductName && newProductPrice && newProductImage) {
        const priceNumber = parseFloat(newProductPrice);
        if (priceNumber > 0 && isValidImageUrl(newProductImage)) {
          product.productName = newProductName;
          product.price = priceNumber;
          product.image = newProductImage;
          renderProducts(products);
        } else {
          alert("Please enter valid input for product details.");
        }
      }
    }
  }

  function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    renderProducts(products);
  }

  let cart = [];

  addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    checkboxes.forEach((checkbox) => {
      const productId = parseInt(checkbox.dataset.id);
      const product = products.find((product) => product.id === productId);

      if (product) {
        const existProduct = cart.find((el) => el.id === productId);
        if (existProduct) {
          product.amount += 1;
        } else {
          cart.push(product);
        }
        renderCart(cart);
      }
    });

    if (cart.length > 0) {
      totalPriceBtn.classList.remove("hidden");
    }
  });

  function renderCart(cartToRender) {
    cartList.innerHTML = "";
    cartToRender.forEach((product) => {
      const productItem = document.createElement("li");
      productItem.className = "flex px-10 pb-5 gap-10";

      const productImage = document.createElement("img");
      productImage.className = "w-16 h-16 object-cover rounded-lg";
      productImage.src = `${product.image}`;
      productItem.appendChild(productImage);

      const detailContainer = document.createElement("div");
      detailContainer.className = "flex flex-col gap-5";

      const productNameDisplay = document.createElement("h1");
      productNameDisplay.textContent = `${product.productName}`;
      detailContainer.appendChild(productNameDisplay);

      const productPriceDisplay = document.createElement("h1");
      productPriceDisplay.textContent = `$${parseFloat(product.price).toFixed(
        2
      )}`;
      detailContainer.appendChild(productPriceDisplay);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "bg-red-500 text-white px-4 py-2 rounded";
      removeButton.addEventListener("click", () => removeProduct(product.id));

      const amount = document.createElement("input");
      amount.type = "number";
      amount.value = product.amount;
      amount.min = "1";
      amount.className = "border border-black rounded w-10 h-5";
      amount.addEventListener("change", (e) =>
        updateAmount(product.id, e.target.value)
      );

      productItem.appendChild(detailContainer);
      productItem.appendChild(amount);
      productItem.appendChild(removeButton);

      cartList.appendChild(productItem);
    });
  }
  function removeProduct(id) {
    const product = cart.find((product) => product.id === id);
    if (product) {
      product.amount = 1;
    }
    cart = cart.filter((product) => product.id !== id);
    renderCart(cart);
  }

  function updateAmount(id, newAmount) {
    const product = cart.find((product) => product.id === id);
    if (product) {
      product.amount = parseInt(newAmount);
      renderCart(cart);
    }
  }

  totalPriceBtn.addEventListener("click", () => {
    calculatePrice(), showTotal.classList.remove("hidden");
  });

  function calculatePrice() {
    const totalPrice = cart.reduce(
      (total, product) => total + product.price * product.amount,
      0
    );
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  }
});
