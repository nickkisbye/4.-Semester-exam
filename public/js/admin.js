const pathname = $(location).attr('pathname')

switch (pathname) {
    case "/admin/users":
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
                            <td><a href="/user/${user.id}">Edit</a> / <a href="/user/${user.id}">delete</a></td>
                          </tr>
                        `);
            })
        })
        break;
    case "/admin/products":
        $.get('/api/products', ({ products }) => {
            products.forEach((product) => {
                $('#products-body').append(`
                        <tr>
                        <td><img src="${product.image_url}" width="50" height="50" /></td>
                        <td>${product.name}</td>
                        <td>${product.category.name}</td>
                        <td>${product.price + ',-'}</td>
                        <td>${product.description}</td>
                        <td>${product.stock}</td>
                        <td>${product.is_featured === 1 ? 'Yes' : 'No'}</td>
                        <td><a href="/product/${product.id}">Edit</a> / <a href="/product/${product.id}">delete</a></td>
                      </tr>
                    `);
            })
        })
        break;
    case "/admin/categories":
        $.get('/api/categories', ({ categories }) => {
            categories.forEach((category) => {
                $('#categories-body').append(`
                            <tr>
                            <td><img src="${category.img_url}" width="50" height="50" /></td>
                            <td>${category.name}</td>
                            <td>
                                <form action="/category/${category.id}" method="POST">  
                                    <button class="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Delete
                                    <i class="material-icons right">delete</i>
                                    </button>
                                </form>
                            </td>
                          </tr>
                        `);
            })
        })
        break;
}
