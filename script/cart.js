document.addEventListener('DOMContentLoaded', () => {
  const orderBtn = document.getElementById('orderBtn');
  const orderSection = document.querySelector('.order');
  const cartSection = document.querySelector('.cart');
  const cartItemsList = document.querySelector('.cart-items-list');
  const cartTotalElements = document.querySelectorAll('.cart-total');
  const deliveryMethodSelect = document.getElementById('deliveryMethod');
  const addressField = document.getElementById('address').parentElement;
  const addressInput = document.getElementById('address');

  const authLink = document.querySelector('.menu-elements[href="login.html"]');
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    authLink.innerHTML = '<a class="menu-elements" href="#">Вийти</a>';
    authLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'cart.html';
    });
  } else {
    authLink.innerHTML = '<a class="menu-elements" href="login.html">Авторизація</a>';
  }

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueCart = {};
    let total = 0;

    if (cart.length === 0) {
      cartItemsList.textContent = 'У кошику ще немає товарів';
    } else {
      cartItemsList.innerHTML = '';

      cart.forEach(item => {
        if (uniqueCart[item.title]) {
          uniqueCart[item.title].quantity += 1;
        } else {
          uniqueCart[item.title] = { ...item, quantity: 1 };
        }
      });

      Object.values(uniqueCart).forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">${item.price} грн.</span>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-title="${item.title}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase" data-title="${item.title}">+</button>
          </div>
        `;
        cartItemsList.appendChild(itemDiv);
        total += item.price * item.quantity;
      });
    }

    cartTotalElements.forEach(totalElement => {
      totalElement.textContent = total;
    });

    attachQuantityButtons();
  };

  const attachQuantityButtons = () => {
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');

    increaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemTitle = button.getAttribute('data-title');
        updateItemQuantity(itemTitle, 1);
      });
    });

    decreaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemTitle = button.getAttribute('data-title');
        updateItemQuantity(itemTitle, -1);
      });
    });
  };

  const updateItemQuantity = (itemTitle, change) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (change === 1) {
      const itemIndex = cart.findIndex(item => item.title === itemTitle);
      if (itemIndex > -1) {
        cart.push(cart[itemIndex]);
      }
    } else if (change === -1) {
      const itemIndex = cart.findIndex(item => item.title === itemTitle);
      if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  };

  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      document.querySelectorAll('.user-info').forEach(element => {
        element.remove();
      });
    }
  };

  const toggleAddressField = () => {
    if (deliveryMethodSelect.value === 'express') {
      addressField.style.display = 'block';
      addressInput.required = true;
    } else {
      addressField.style.display = 'none';
      addressInput.required = false;
    }
  };

  orderBtn.addEventListener('click', () => {
    const total = parseFloat(cartTotalElements[0].textContent);

    if (total === 0) {
      alert('У кошику ще немає товарів');
    } else {
      cartSection.classList.add('hide');
      setTimeout(() => {
        cartSection.style.display = 'none';
        orderSection.style.display = 'block';
        setTimeout(() => {
          orderSection.classList.add('show');
        }, 10);
      }, 500);
    }
  });

  deliveryMethodSelect.addEventListener('change', toggleAddressField);

  const orderForm = document.querySelector('.order-form');
  const submitButton = orderForm.querySelector('button[type="submit"]');

  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (orderForm.reportValidity()) {
      const orderConfirmation = `
        Дякуємо за ваше замовлення!

        Бажаємо смачного і гарного дня!
      `;

      alert(orderConfirmation);

      localStorage.removeItem('cart');
      loadCart();
      window.location.href = 'index.html';
    } else {
      alert('Будь ласка, заповніть всі обов\'язкові поля');
    }
  });

  loadCart();
  loadUser();
  toggleAddressField();
});
