import { 
  isValid, 
  isExpirationDateValid, 
  isSecurityCodeValid, 
  getCreditCardNameByNumber 
} from './creditcard.js';

const form = document.querySelector('.js_form');
const select = form.querySelector('.js_select');
const table = document.querySelector('.js_product-table');
const expDataInput = form.querySelector('input[name="expiration_dt"]');

let prevExpDataInputValue = '';


let formData = new FormData(form);
formData = formData.entries(); 
let allFields = form.querySelectorAll('.js_input');
let allLengthLimitedInputs = form.querySelectorAll('.js_input-limit');

allFields.forEach(field => {
  field.addEventListener('focus', removeError);
});
allLengthLimitedInputs.forEach(input => {
input.addEventListener('input', inhibitInput);
})
select.addEventListener('change', (e) => {
  removeError(e);
});
form.addEventListener('focusout', fieldValidation);
form.addEventListener('submit', checkFilledFields);
expDataInput.addEventListener('input', checkExpDataFields);
expDataInput.addEventListener('keydown', checkExpDataFieldsForDigits);

function inhibitInput(event) {
const input = event.target;
const maxLength = Number(input.dataset?.limit);

if(input.value.length >= maxLength) {
  event.target.value = input.value.slice(0, maxLength);
}
}

function checkExpDataFieldsForDigits(event) {
  prevExpDataInputValue = event.target.value;

   inhibitInput(event);

   if(Number.isNaN(Number(event.key)) && event.key !== 'Backspace') {
      event.preventDefault();
   }
}

function checkExpDataFields(event) {
  const input = event.target;

  if(input.value.length === 3 && input.value[2] === '/') {
      input.value = `${input.value[0]}${input.value[1]}`;
      return;
  }

  if(input.value.length === 2 && prevExpDataInputValue.length < input.value.length) {
      input.value += `/`;
  }
}

function fieldValidation(event) {

  const field = event.target;
  const fieldType = field.getAttribute('data-role');
  const value = field.value;

  const emailREGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneREGEX = /^[0-9\+]{10,10}$/;
  const zipcodeREGEX = /^[0-9]{5}/;
  const addressREGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[ ])([a-zA-Z0-9\/\-\. ]+)$/;
  const cityREGEX = /^[a-zA-Z. ]{3,}$/;

  let checkResult = '';

  switch (fieldType) {
    case 'email':
      if (!emailREGEX.test(value)) {
        checkResult = 'Invalid email';
      }
      break;

    case 'phone':
      if (!phoneREGEX.test(value)) {
        checkResult = 'Invalid phone';
      }
      break;
  
    case 'address':
      if(!addressREGEX.test(value)) {
        checkResult = 'Invalid address';
      }        
      break;

    case 'city':
      if (!cityREGEX.test(value)) {
        checkResult = 'Invalid city name';
      }
      break;

    case 'zip':
      if (!zipcodeREGEX.test(value)) {
        checkResult = 'Invalid ZIP code';
      }
      break;

  case 'card_number':
      const cardNumberValidationResult = isValid(value);
      if (!cardNumberValidationResult) {
        checkResult = 'Invalid card number';
        const cardInput = document.querySelector('.js_card-number-input');
        cardInput.classList.forEach(item => {
          if(item.includes('js-card')) {
           cardInput.classList.remove(item);
          }
      });
      } else {
          setCardIcon(getCreditCardNameByNumber(value));
      }
      break;

  case 'expiration_dt':
      const month = value.substring(0, 2);
      const year = value.substring(3, 7);

      if(!isExpirationDateValid(month, year)) {
          checkResult = 'Card expiration date is invalid';
      }
      break;

  case 'cvv':
      const cardNumberInput = document.querySelector('input[name="card_number"]');
      if(!isSecurityCodeValid(cardNumberInput.value, value)) {
          checkResult = 'CVC is invalid';
      }
      break;
  }

  console.log('checkResult', checkResult.trim().length);
  if(checkResult.trim().length !== 0 ) {
    console.log('1111')
    setError(field, checkResult);
  } 
  // else {
  //   setError(field);
  // }
}

function setCardIcon(card) {
 card = card.toLowerCase();
 const cardInput = document.querySelector('.js_card-number-input');
 let cardInputClass = '';

 switch (card) {

  case 'mastercard':
      cardInputClass = 'js-card_mastercard';
      break;
  case 'visa':
      cardInputClass = 'js-card_visa';
      break;
  case 'discover':
      cardInputClass = 'js-card_discover';
      break;
  default:
      cardInputClass = '';
      break;
 }

 cardInput.classList.forEach(item => {
     if(item.includes('js-card')) {
      cardInput.classList.remove(item);
     }
 });
 
 cardInput.classList.add(cardInputClass);
}

function removeError(event) {
  const field = event.target;
  const label = field.closest('label');
  const errorSpan = label.querySelector('.js_error-span');
  if(errorSpan) {
      errorSpan.remove();
  }
}

function checkFilledFields(event) {
  event.preventDefault();
  allFields.forEach(field => {

      if(field.nodeName === 'SELECT' && field.selectedIndex === 0) {
          setError(field);
          return;
      } else if (field.value.trim().length === 0) {
        console.log('set error');
          setError(field);
      }
     
  });

  const result = allFields.some(hasError);
  if(result) {
    return;
  }
  // DO BACKEND REQUEST !!!!!!
  const websiteURL = document.location.origin;
  window.location.href = `${websiteURL}/thank-you.html`;
  table.classList.add('hidden');
  localStorage.clear();
}

function hasError(element) {
  
  const label = element.closest('label');
  const error = label.querySelector('.js_error-span');
  if(error) {
      return true;
  } 
  return false;
}

function setError(field, error = 'Please fill out the field above') {
  const label = field.closest('label');
  const oldError = label.querySelector('.js_error-span');
  const errorSpan = document.createElement('span');

  errorSpan.setAttribute(
    'class',
    'error-span js_error-span',
  );
  errorSpan.textContent = error;

  if(label) {
      oldError && oldError.remove();
      label.append(errorSpan);
  }
}
