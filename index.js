const loading = () => {
  const load = document.createElement("p");
  load.id = "loading";
  const loadContent = document.createTextNode("Loading...");
  load.appendChild(loadContent);
  return load;
};

const createCategNav = async () => {
  const categList = document.getElementById("categ-list");

  const response = await fetch(
    "https://bsale-back-falvarez.herokuapp.com/category"
  );
  const data = await response.json();

  await data.forEach((item) => {
    const button = document.createElement("button");

    button.classList.add("categ-button");
    contentLink = document.createTextNode(`${item.name}`);

    button.addEventListener("click", () => {
      const allCards = document.querySelectorAll(".card");
      allCards.forEach((item) => {
        item.remove();
      });
      createCards(
        `https://bsale-back-falvarez.herokuapp.com/category/${item.id}`
      );
    });

    button.appendChild(contentLink);
    categList.appendChild(button);
  });
};

createCategNav();

const calculateDiscount = (price, discount) => {
  if (discount > 0) {
    return price - (price * discount) / 100;
  }
};

const createCards = async (url) => {
  const cardsContainer = document.getElementById("cards-container");

  const load = document.createElement("p");
  load.id = "loading";
  const loadContent = document.createTextNode("Loading...");
  load.appendChild(loadContent);
  cardsContainer.appendChild(load);

  const response = await fetch(`${url}`);

  const data = await response.json();

  document.getElementById("loading").remove();
  await data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("container-fluid");

    /*     Get the image to the card, if it hasn't any image, it use a google foto */
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

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    /* Title of the card */
    const title = document.createElement("p");
    title.classList.add('card-title"');
    const titleContent = document.createTextNode(`${item.name}`);
    title.appendChild(titleContent);
    cardBody.appendChild(title);

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("price-div");

    const price = document.createElement("p");
    price.classList.add("item-price");
    const priceContent = document.createTextNode(`${item.price}`);
    price.appendChild(priceContent);
    priceDiv.appendChild(price);

    /*     If the product has a discount, we can see it */
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

createCards("https://bsale-back-falvarez.herokuapp.com/products");

const allProducts = document.getElementById("all-product");
allProducts.addEventListener("click", () => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((item) => {
    item.remove();
  });
  createCards(`https://bsale-back-falvarez.herokuapp.com/products`);
});

const allDiscount = document.getElementById("all-discount");
allDiscount.addEventListener("click", () => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((item) => {
    item.remove();
  });
  createCards(`https://bsale-back-falvarez.herokuapp.com/discount`);
});

const searchInput = document.getElementById("input-search");
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const allCards = document.querySelectorAll(".card");
  allCards.forEach((item) => {
    item.remove();
  });
  createCards(
    `https://bsale-back-falvarez.herokuapp.com/search/${searchInput.value}`
  );
});
