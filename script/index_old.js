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
    authLink.innerHTML = '<a class="menu-elements" href="login.html">Авторизація</а>';
  }


  const updateCartCounter = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCounter.textContent = cart.length;
  };

  
  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
  };

  
  fetch('../items.json')
    .then(response => response.json())
    .then(data => {
      const discountsMap = {}; 
      const itemsMap = {}; 

      
      data.forEach(item => {
        if (item.type === "discounts") {
          discountsMap[item.title] = item.discount;
        } else {
          itemsMap[item.title] = item;
        }
      });

      data.forEach(item => {
        const newItem = document.createElement("div");
        newItem.classList.add("discount-item");

        const img = document.createElement("img");
        img.alt = "хтось скушов";

        

        const btnPriceContainer = document.createElement("div");
        btnPriceContainer.classList.add("btn-price");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("cart-btn");
        btn.textContent = "Купити";
        btnPriceContainer.appendChild(btn);

        let price = item.price; 
        if (discountsMap[item.title]) {
          if (item.type === "discounts") {
            const discountedItem = itemsMap[item.title];
            if (discountedItem) {
              price = discountedItem.price * (1 - discountsMap[item.title]);
              img.src = "img/" + discountedItem.image; 
            }
          } else {
            price = item.price * (1 - discountsMap[item.title]);
            img.src = "img/" + item.image; 
          }
        } else {
          img.src = "img/" + item.image; 
        }
        
        const priceElement = document.createElement("p");
        priceElement.textContent = `${price} грн.`;
        btnPriceContainer.appendChild(priceElement);

        newItem.appendChild(img);
        const title = document.createElement("h3");
        title.textContent = item.title;
        newItem.appendChild(title);
        newItem.appendChild(btnPriceContainer);

        switch (item.type) {
          case "discounts":
            discountsList.appendChild(newItem);
            break;
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

        btn.addEventListener('click', () => {
          addToCart(item);
        });
      });
    })
    .catch(error => console.error('Помилка завантаження JSON файлу:', error));

  updateCartCounter();
});