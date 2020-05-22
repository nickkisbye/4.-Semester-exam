const pathname = $(location).attr('pathname')

let productRoute = "";

//Check if the pathname targets admin/product/{id} or not.
if (pathname.split("/").length === 4) {
    productRoute = pathname;
}

switch (pathname) {
    case "/admin/users":

        deleteUser = (id) => {
            $.ajax({
                url: '/api/user/' + id,
                type: 'DELETE',
                success: ({ message }) => {
                    if (message === 'deleted!') {
                        window.location.href = '/admin/users';
                    }
                }
            })
        }

        $.get('/api/users', ({ users }) => {
            users.forEach((user) => {
                $('#users-body').append(`
                            <tr>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.first_name + ' ' + user.last_name}</td>
                            <td>${user.age}</td>
                            <td>${user.phone_number}</td>
                            <td>${user.address.address}</td>
                            <td>${user.address.city}</td>
                            <td>${user.address.postal_code}</td>
                            <td><a style="cursor: pointer" onclick="deleteUser(${user.id})">Delete</a></td>
                          </tr>
                        `);
            })
        })
        break;
    case "/admin/products":
        $.get('/api/products', ({ products }) => {

            deleteProduct = (id) => {
                $.ajax({
                    url: '/api/product/' + id,
                    type: 'DELETE',
                    success: ({ message }) => {
                        if (message === 'deleted!') {
                            window.location.href = '/admin/products';
                        }
                    }
                })
            }

            uncheckFeatured = (id) => {
                $.post('/api/product/uncheck/' + id, ({ message }) => {
                    if (message === 'unchecked!') {
                        window.location.href = '/admin/products';
                    }
                })
            }

            checkFeatured = (id) => {
                $.post('/api/product/check/' + id, ({ message }) => {
                    if (message === 'checked!') {
                        window.location.href = '/admin/products';
                    }
                })
            }

            products.forEach((product) => {
                $('#products-body').append(`
                        <tr>
                        <td><img src="${product.image_url}" width="50" height="50" /></td>
                        <td>${product.name}</td>
                        <td>${product.category.name}</td>
                        <td>${product.price + ',-'}</td>
                        <td>${product.description}</td>
                        <td>${product.stock}</td>
                        <td>${product.is_featured === 1 ? 
                            `<i onclick="uncheckFeatured(${product.id})" style="cursor: pointer" class="material-icons">star</i>` 
                            : `<i onclick="checkFeatured(${product.id})" style="cursor: pointer" class="material-icons">star_border</i>`}
                            </td>
                        <td><a href="/admin/product/${product.id}">Edit</a> / <a style="cursor: pointer" onclick="deleteProduct(${product.id})">delete</a></td>
                      </tr>
                    `);
            })
        })
        break;
    case "/admin/product":
        $.get('/api/categories', ({ categories }) => {
            categories.forEach(category => {
                $('#category-select').append(`
                    <option value="${category.id}">${category.name}</option>
                `);
            })
        })

        break;
    case "/admin/categories":

        deleteCategory = (id) => {
            $.ajax({
                url: '/api/category/' + id,
                type: 'DELETE',
                success: ({ message }) => {
                    if (message === 'deleted!') {
                        window.location.href = '/admin/categories';
                    }
                }
            })
        }

        $.get('/api/categories', ({ categories }) => {
            categories.forEach((category) => {
                $('#categories-body').append(`
                            <tr>
                            <td><img src="${category.img_url}" width="50" height="50" /></td>
                            <td>${category.name}</td>
                            <td>
                                <a class="btn waves-effect waves-light light-blue darken-3" style="cursor: pointer" onclick="deleteCategory(${category.id})">delete</a>
                            </td>
                          </tr>
                        `);
            })

        })
        break;
    case productRoute:
        $.get('/api/product/' + pathname.split("/")[3], ({ product }) => {
            $('#name-field').val(product.name);
            $('#price-field').val(product.price);
            $('#description-field').val(product.description);
            $('#stock-field').val(product.stock);
            $('#category-select').val(product.category_id);
            $('#product_id-field').val(product.id);
        });

        $.get('/api/categories', ({ categories }) => {
            categories.forEach(category => {
                $('#category-select').append(`
                    <option value="${category.id}">${category.name}</option>
                `);
            })
        })

    break;
}
