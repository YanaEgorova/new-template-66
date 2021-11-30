import { localStorage } from './local-storage.js';
import { getLocalStorageItem } from './local-storage.js';
let allBtns = document.querySelectorAll('.js_add-to-cart');
export const cartSpan = document.querySelector('.js_cart__span');
export const successMessageSpan = document.querySelector('.js_success-product-name');
export const successMessage = document.querySelector('.js_success-message');
const errorButton = document.querySelector('.js_error__btn');
const errorOverlay = document.querySelector('.js_error__overlay');


allBtns = [...allBtns];

allBtns.forEach(btn => {
    btn.addEventListener('click', addToCart);
});
errorButton.addEventListener('click', removeError);
errorOverlay.addEventListener('click', (e) => {
    if(e.target !== e.currentTarget) {
        return;
    }
    removeError();
});

export function removeError() {
    document.body.classList.remove('error-active');
}


function addToCart(e) {
    const btn = e.currentTarget;
    const product = btn.closest('.js_product');
    const productId = product.getAttribute('id');
    
    const name = e.currentTarget.closest('.js_product').querySelector('.js_product-name').textContent;


    let total = parseFloat(e.currentTarget.closest('.js_product').querySelector('.product__price').textContent.substr(1));
    let okay = true;

    getLocalStorageItem().forEach(product => {
       const productTotal = Number((product.quantity * product.price).toFixed(2));
       total = total + productTotal;
       if (total > 500) {
        document.body.classList.add('error-active');
        window.addEventListener('keydown', (e) => {
           if(e.code !== 'Escape') {
               return;
           }
           removeError();
        })
        okay = false;
       }
    })

    // ADD TO LOCAL STORAGE
    if (okay){
        cartSpan.textContent = Number(cartSpan.textContent) + 1;
        showSuccessMessage(successMessage, successMessageSpan, name);
        localStorage(productId);
    }
    

}


export function showSuccessMessage(message, span, name) {

    span.textContent = name;
    message.classList.add('success-message--active');
    const tm = setTimeout(() => {
        hideSuccessMessage();
        clearTimeout(tm);
    }, 1200);
}
function hideSuccessMessage() {
    const successMessage = document.querySelector('.js_success-message');
    successMessage.classList.remove('success-message--active');
}

