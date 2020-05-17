/**
 * Header and footer for all pages
 * Frontpage
 * Page for each category
 * Login, Signup, Forgot password page
 * Search field at the top for products
 * About page
 * Contact page
 * Basket - basket can redirect to payment page -> Stripe integration
 * 
 * USER LOGIN PAGES:
 * Settings page
 * Order page
 * 
 * ADMIN:
 * 
 * CRUD on products -> Id, Name, fk_category, price, description, stock
 * CRUD on categories -> Id, Name
 * CRUD on users -> Id, username, first_name, last_name, email, password, repeatPassword, phone_number
*          ADRESS_TABLE -> fk_customer, postal_code, city, adresss

 * Read orders -> Id, Date, fk_customer, fk_address
 *                product_order_junc -> id, fk_order, fk_product, quantity
 *                TRANSACTION_TABLE -> Id, fk_order, status, total    
 * 
 * 
 */