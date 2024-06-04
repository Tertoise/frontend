document.addEventListener('DOMContentLoaded', () => {
  const discountsList = document.getElementById("discounts-list");
  const setsList = document.getElementById("sets-list");
  const rollsList = document.getElementById("rolls-list");
  const sushiList = document.getElementById("sushi-list");
  const drinksList = document.getElementById("drinks-list");
  const cartCounter = document.querySelector('.cart-counter');

  const authLink = document.getElementById('auth-link');
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    authLink.innerHTML = '<a class="menu-elements" href="#">Вийти</a>';
    authLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  } else {
    authLink.innerHTML = '<a class="menu-elements" href="login.html">Авторизація</a>';
  }

  const updateCartCounter = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCounter.textContent = cart.length;
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const discountedPrice = item.discount > 0 ? (item.price * (1 - item.discount)).toFixed(2) : item.price;

    cart.push({
      ...item,
      price: discountedPrice
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
  };

  fetch('items.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const newItem = document.createElement("div");
        newItem.classList.add("discount-item");
        newItem.style.backgroundImage = `url('img/${item.image}')`;

        const title = document.createElement("h3");
        title.textContent = item.title;
        newItem.appendChild(title);

        const btnPriceContainer = document.createElement("div");
        btnPriceContainer.classList.add("btn-price");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("cart-btn");
        btn.textContent = "Купити";
        btnPriceContainer.appendChild(btn);

        let price = item.price;
        if (item.discount > 0) {
          const discountedPrice = (item.price * (1 - item.discount)).toFixed(2);
          const priceElement = document.createElement("p");
          priceElement.innerHTML = `<span class="original-price">${item.price} грн.</span> <span class="discounted-price">${discountedPrice} грн.</span>`;
          btnPriceContainer.appendChild(priceElement);
        } else {
          const priceElement = document.createElement("p");
          priceElement.textContent = `${item.price} грн.`;
          btnPriceContainer.appendChild(priceElement);
        }

        newItem.appendChild(btnPriceContainer);

        switch (item.type) {
          case "sets":
            setsList.appendChild(newItem);
            break;
          case "rolls":
            rollsList.appendChild(newItem);
            break;
          case "sushi":
            sushiList.appendChild(newItem);
            break;
          case "drinks":
            drinksList.appendChild(newItem);
            break;
          default:
            console.error(`Невідомий тип елементу: ${item.type}`);
        }

        if (item.discount > 0) {
          const discountItem = newItem.cloneNode(true);
          discountsList.appendChild(discountItem);
          discountItem.querySelector('.cart-btn').addEventListener('click', () => {
            addToCart(item);
          });
        }

        btn.addEventListener('click', () => {
          addToCart(item);
        });
      });
    })
    .catch(error => console.error('Помилка завантаження JSON файлу:', error));

  updateCartCounter();
});
