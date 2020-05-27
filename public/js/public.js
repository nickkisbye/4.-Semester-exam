$('document').ready(() => {

  const pathname = $(location).attr('pathname')

  let productRoute = "";

  //Check if the pathname targets product/{number} or not.
  if (pathname.split("/").length === 3) {
    productRoute = pathname;
  }

  switch (pathname) {
    case "/":
      $.get('/api/stats', ({ stats }) => {
        $('#stats').append(`
          <div class="col s12 m3 statsMargin">
            <div class="card light-blue darken-3">
              <div class="card-content white-text">
                <span class="card-title">Products</span>
                <p>${stats.products}</p>
              </div>
            </div>
          </div>
          <div class="col s12 m3 statsMargin">
            <div class="card light-blue darken-3">
              <div class="card-content white-text">
                <span class="card-title">Categories</span>
                <p>${stats.categories}</p>
              </div>
            </div>
          </div>
          <div class="col s12 m3 statsMargin">
            <div class="card light-blue darken-3">
              <div class="card-content white-text">
                <span class="card-title">Happy Customers</span>
                <p>${stats.customers}</p>
              </div>
            </div>
          </div>
          <div class="col s12 m3 statsMargin">
            <div class="card light-blue darken-3">
              <div class="card-content white-text">
                <span class="card-title">Orders completed</span>
                <p>${stats.orders}</p>
              </div>
            </div>
          </div>
          `);
      }
      )

      $.get('/api/featured', ({ products }) => {
        products.forEach((product) => {
          $('#products').append(`
            <div class="col s12 m3">
              <div class="card">
                <div class="card-image">
                  <img src="${product.image_url}">
                  </div>
                  <div class="card-content">
                  <span class="card-title"><a href="/product/${product.id}">${product.name}</a></span>
                  <p><strong>In stock:</strong> ${product.stock} </p>
                  <p>${product.description}</p>
                  <br>
                  <p>${product.price},-</p>
                </div>
              </div>
            </div>
              `);
        })
      })
      break;
    case "/products":
      $.get('/api/products', ({ products }) => {
        products.forEach((product) => {
          $('#products').append(`
            <div class="col s12 m3">
            <div class="card">
              <div class="card-image">
                <img src="${product.image_url}">
              </div>
              <div class="card-content">
              <span class="card-title"><a href="/product/${product.id}">${product.name}</a></span>
                <p><strong>Category:</strong> ${product.category.name}</p>
                <p><strong>In stock:</strong> ${product.stock} </p>
                <p>${product.price},-</p>
              </div>
            </div>
          </div>
            `);
        })
      })
      break;
    case "/card":

      const storedProducts = JSON.parse(localStorage.getItem('cardProducts'));
      let totalPrice = 0;

      storedProducts.forEach((product) => {
        totalPrice += Number(product.price);
        $('#card-body').append(`
          <tr>
          <td><img src="${product.image_url}" width="25" height="25" /></td>
          <td>${product.name}</td>
          <td>${product.price},-</td>
          <td>1</td>
        </tr>
        `);
      })

      $("#total").append(`<p>${totalPrice},-</p>`)
      break;
    case productRoute:
      $.get('/api/product/' + productRoute.split("/")[2], ({ product, role }) => {

        let storedProducts;

        addToCart = () => {
          if (localStorage.getItem('cardProducts')) {
            storedProducts = JSON.parse(localStorage.getItem('cardProducts'));
          } else {
            storedProducts = [];
          }

          storedProducts.push({
            name: product.name,
            price: product.price,
            id: product.id,
            image_url: product.image_url
          })
          localStorage.setItem('cardProducts', JSON.stringify(storedProducts));
          window.location.href = "/product/" + productRoute.split("/")[2]
        }

        $("#product-content").append(`
            <img src="${product.image_url}" alt="" class="circle">
            <span class="title">${product.name}</span>
            <p>${product.price + ',-'}<br><br>
                ${product.description}
            </p>
            ${role === 'USER' ? `<a style="cursor: pointer;" onclick="addToCart()" class="secondary-content"><i class="material-icons waves-light red-text">shopping_cart</i></a>` :
            ``}  
            `);
      });
      break;
    case "/categories":
      $.get('/api/categories', ({ categories }) => {
        categories.forEach(category => {
          $('#categories').append(`
            <div class="col s12 m3 catMargin">
              <div class="card light-blue darken-3">
                <div class="card-content white-text">
                  <span class="card-title">${category.name}</span>
                </div>
              </div>
            </div>
            `);
        })
      }
      )
      break;
  }

});