const urlHost = "https://bsale-back-falvarez.herokuapp.com";

/* Crea la lista de categorias, permitiendo que la aplicacion sea expansible */
const createCategNav = async () => {
  const categList = document.getElementById("categ-list");

  const response = await fetch(`${urlHost}/category`);
  const data = await response.json();

  /* Mapeo las categrias para darles formato y agregarle un eventListener para filtrar los productos segun corresponda */
  await data.forEach((item) => {
    const button = document.createElement("button");

    button.classList.add("categ-button");
    contentLink = document.createTextNode(`${item.name}`);

    button.addEventListener("click", () => {
      const allCards = document.querySelectorAll(".card");
      allCards.forEach((item) => {
        item.remove();
      });
      createCards(`${urlHost}/category/${item.id}`);
    });

    button.appendChild(contentLink);
    categList.appendChild(button);
  });
};

/* Ejecuto la creacion de categorias */
createCategNav();

/* Funcion general que aplica el descuento */
const calculateDiscount = (price, discount) => {
  if (discount > 0) {
    return price - (price * discount) / 100;
  }
};

/* Funcion que se encarga de crear las tarjetas de los items */
/* La usaremos con distintos consumos de API, por eso es mejor pasarle directamente la URL que tiene que construir */
const createCards = async (url) => {
  const cardsContainer = document.getElementById("cards-container");

  /* Bloque de codigo que se encarga de entregar un indicador de carga hasta recibir info de la BD */
  const load = document.createElement("p");
  load.id = "loading";
  const loadContent = document.createTextNode("Loading...");
  load.appendChild(loadContent);
  cardsContainer.appendChild(load);

  const response = await fetch(`${url}`);
  const data = await response.json();

  /* Una ves obtenida la data de la BD, elimina el loading del viewport  */
  document.getElementById("loading").remove();

  /* Mapeamos la data recibida por fetch */
  await data.forEach((item) => {
    /* Creamos la card de cada producto y le agregamos clases de Bootstrap */
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("container-fluid");

    /* Recibe la imagen del producto, si esta existe la agrega a la card, 
    sino aplica una generica. Tambien adquiere clases de Bootstrap*/

    const divImg = document.createElement("div");
    divImg.id = "div-img";
    const img = document.createElement("img");
    img.classList.add("card-img-top");

    img.alt = `${item.name}`;
    item.url_image !== null && item.url_image !== ""
      ? (img.src = `${item.url_image}`)
      : (img.src = `https://i0.wp.com/elfutbolito.mx/wp-content/uploads/2019/04/image-not-found.png`);

    divImg.appendChild(img);
    card.appendChild(divImg);

    /* Para facilitar el uso de bootstrap, creamos un div para el content */
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    /* Titulo de la carta */
    const title = document.createElement("p");
    title.classList.add('card-title"');
    const titleContent = document.createTextNode(`${item.name}`);
    title.appendChild(titleContent);
    cardBody.appendChild(title);

    /* 
    Formato del precio del producto */
    const priceDiv = document.createElement("div");
    priceDiv.classList.add("price-div");

    const price = document.createElement("p");
    price.classList.add("item-price");
    const priceContent = document.createTextNode(`${item.price}`);
    price.appendChild(priceContent);
    priceDiv.appendChild(price);

    /*    Si el producto contiene descuento, formateamos ambos nuevamente, precio y precio con descuento */
    if (item.discount > 0) {
      price.classList.add("price-dashed");
      const discount = document.createElement("p");
      discount.classList.add("item-discount");
      const discountContent = document.createTextNode(
        `${calculateDiscount(item.price, item.discount)}`
      );

      discount.appendChild(discountContent);
      priceDiv.appendChild(discount);
    }
    cardBody.appendChild(priceDiv);

    /* Boton de compra */

    const buyButton = document.createElement("button");
    const buyButtonContent = document.createTextNode("Comprar");
    buyButton.classList.add("btn");
    buyButton.classList.add("btn-success");
    buyButton.appendChild(buyButtonContent);

    cardBody.appendChild(buyButton);
    card.appendChild(cardBody);
    cardsContainer.appendChild(card);
  });
};

/* Por default, recibe todos los productos y crea las cards correspondiente */
createCards(`${urlHost}/products`);

/* Funcion para crear las tarjetas segun el parametro pasado */
const getAllProd = (url) => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((item) => {
    item.remove();
  });
  createCards(`${urlHost}/${url}`);
};

/* Agrega eventListener para la categoria de todos los productos */
const allProducts = document.getElementById("all-product");
allProducts.addEventListener("click", () => {
  getAllProd("products");
});

/* Agrega eventListener para la categoria de todos los productos con descuento */
const allDiscount = document.getElementById("all-discount");
allDiscount.addEventListener("click", () => {
  getAllProd("discount");
});

/* Recibe el valor que tiene el input y busca el producto deseado
Tambien evita que se llene al maximo de caracteres, optimizando la busqueda y evita que se 
hagan busquedas vacias */
const searchInput = document.getElementById("input-search");
searchInput.maxLength = 125;
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.trim().length > 0) {
    getAllProd(`search/${searchInput.value}`);
  }
});

/* Agrega una funcion al logo para volver al home, recibiendo todos los productos */
const logoImage = document.querySelector(".navbar-brand");

logoImage.addEventListener("click", () => {
  searchInput.value = "";
  getAllProd("products");
});
