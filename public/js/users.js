$('document').ready(() => {

    const pathname = $(location).attr('pathname')
    let orderRoute = "";

    //Check if the pathname targets order/{number} or not.
    if (pathname.split("/").length === 3) {
        orderRoute = pathname;
    }

    switch (pathname) {
        case "/orders":
            $.get('/api/orders', ({ orders }) => {
                orders.forEach((order) => {
                    $('#order-body').append(`
                        <tr>
                        <td>${order.order_id}</td>
                        <td>${order.created_at}</td>
                        <td>${order.users.email}</td>
                        <td>${order.state}</td>
                        <td><a href="/order/${order.id}">Details</td>
                      </tr>
                    `);
                })
            })
            break;

        case orderRoute:
            $.get('/api/order/' + orderRoute.split("/")[2], ({ order, totalOrderPrice }) => {
                order.forEach(item => {
                    $('#order-body').append(`
                    <tr>
                    <td>${item.product.id}</td>
                    <td>${item.product.price}</td>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                  </tr>
            `);
                });

                $('#total').append(`
                <span>${totalOrderPrice}</span>
              </tr>
        `);
            })
            break;
        case "/settings":
            $.get('/api/settings', ({ settings }) => {
                $('#username-field').val(settings.username);
                $('#email-field').val(settings.email);
                $('#first_name-field').val(settings.first_name);
                $('#last_name-field').val(settings.last_name);
                $('#city-field').val(settings.address.city);
                $('#postal_code-field').val(settings.address.postal_code);
                $('#address-field').val(settings.address.address);
                $('#age-field').val(settings.age);
                $('#phone_number-field').val(settings.phone_number);
                $('#address_id-field').val(settings.address.id);
            })
            break;
    }

});


