$('document').ready(() => {

    let storedProducts = [];

    if (localStorage.getItem('cardProducts')) {
        storedProducts = JSON.parse(localStorage.getItem('cardProducts'));
    }

    $("#cart-content").append(`
<a href="/card" class="btn-floating waves-effect waves-light green">
    <i class="material-icons">shopping_cart</i></a>
    <span style="margin-top: 20px; margin-left: -5px;" data-badge-caption="products in card" class="new badge green">${storedProducts.length}</span>
`);

});
