document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.create-form button[type="submit"]');

  loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;

    if (firstName && lastName && phone) {
      if (firstName === 'admin' && lastName === 'admin' && phone === 'admin') {
        showAdminInterface();
      } else {
        const user = {
          firstName,
          lastName,
          phone
        };

        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'index.html';
      }
    } else {
      alert('Будь ласка, заповніть всі поля.');
    }
  });

  const showAdminInterface = () => {
    document.getElementById('login').style.display = 'none';
    const adminInterface = document.getElementById('admin-interface');
    adminInterface.style.display = 'block';

    fetch('items.json')
      .then(response => response.json())
      .then(data => {
        renderAdminItems(data);
      })
      .catch(error => console.error('Помилка завантаження JSON файлу:', error));
  };

  const renderAdminItems = (data) => {
    const adminItemsList = document.getElementById('admin-items-list');
    adminItemsList.innerHTML = '';


    const headers = document.createElement('div');
    headers.classList.add('item-headers');
    headers.innerHTML = `
      <span class="item-header">Назва    </span>
      <span class="item-header">Ціна</span>
      <span class="item-header">Знижка (%)</span>
      <span class="item-header">Тип</span>
      <span class="item-header">Дії</span>
    `;
    adminItemsList.appendChild(headers);

    data.forEach((item, index) => {
      const newItem = document.createElement("div");
      newItem.classList.add("item");

      const titleContainer = document.createElement("div");
      const title = document.createElement("input");
      title.type = "text";
      title.value = item.title;
      title.classList.add("item-title");
      titleContainer.appendChild(title);
      newItem.appendChild(titleContainer);

      const priceContainer = document.createElement("div");
      const price = document.createElement("input");
      price.type = "number";
      price.value = item.price;
      price.classList.add("item-price");
      priceContainer.appendChild(price);
      newItem.appendChild(priceContainer);

      const discountContainer = document.createElement("div");
      const discount = document.createElement("input");
      discount.type = "number";
      discount.value = item.discount * 100;
      discount.classList.add("item-discount");
      discountContainer.appendChild(discount);
      newItem.appendChild(discountContainer);

      const typeContainer = document.createElement("div");
      const type = document.createElement("select");
      ["sets", "rolls", "sushi", "drinks"].forEach(optionValue => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.text = optionValue;
        type.appendChild(option);
      });
      type.value = item.type;
      type.classList.add("item-type");
      typeContainer.appendChild(type);
      newItem.appendChild(typeContainer);

      const actionsContainer = document.createElement("div");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Видалити";
      deleteButton.addEventListener('click', () => {
        newItem.remove();
      });
      actionsContainer.appendChild(deleteButton);
      newItem.appendChild(actionsContainer);

      newItem.dataset.index = index;
      adminItemsList.appendChild(newItem);
    });
  };

  const saveButton = document.getElementById('save-changes');
  saveButton.addEventListener('click', () => {
    const adminItemsList = document.getElementById('admin-items-list');
    const items = Array.from(adminItemsList.getElementsByClassName('item')).map(item => {
      const title = item.querySelector('.item-title').value;
      const priceElement = item.querySelector('.item-price');
      const price = priceElement ? parseFloat(priceElement.value) : null;
      const discountElement = item.querySelector('.item-discount');
      const discount = discountElement ? discountElement.value / 100 : null;
      const typeElement = item.querySelector('.item-type');
      const type = typeElement ? typeElement.value : null;

      return {
        title,
        price,
        discount,
        type
      };
    });

    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "items_new.json");
    
    alert('Зверніться до власника сервера, щоб оновити дані');
  });

  const addButton = document.getElementById('add-item');
  addButton.addEventListener('click', () => {
    const newItem = {
      type: 'sets',
      title: '',
      price: 0,
      discount: 0
    };
    const currentItems = Array.from(document.querySelectorAll('.item')).map(item => ({
      title: item.querySelector('.item-title').value,
      price: parseFloat(item.querySelector('.item-price').value),
      discount: parseFloat(item.querySelector('.item-discount').value) / 100,
      type: item.querySelector('.item-type').value
    }));
    renderAdminItems([...currentItems, newItem]);
  });
});
