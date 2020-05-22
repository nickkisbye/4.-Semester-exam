$('document').ready(() => {

    const pathname = $(location).attr('pathname')

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
                                <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">shopping_cart</i></a>
                                </div>
                                <div class="card-content">
                                <span class="card-title">${product.name}</span>
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
              console.log(products);
                products.forEach((product) => {
                    $('#products').append(`
            <div class="col s12 m3">
            <div class="card">
              <div class="card-image">
                <img src="${product.image_url}">
                <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">shopping_cart</i></a>
              </div>
              <div class="card-content">
              <span class="card-title">${product.name}</span>
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