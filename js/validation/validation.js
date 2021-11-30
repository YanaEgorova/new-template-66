import { 
    isValid, 
    isExpirationDateValid, 
    isSecurityCodeValid, 
    getCreditCardNameByNumber 
} from './creditcard.js';

const form = document.querySelector('.js_form');
const formBtn = form.querySelector('.js_form-submit-btn');
const select = form.querySelector('.js_select');
const table = document.querySelector('.js_product-table');

const expDataInput = form.querySelector('input[name="card_data"]');
let prevExpDataInputValue = '';
let formData = new FormData(form);
formData = formData.entries();

let allFields = form.querySelectorAll('.js_input');
allFields = [...allFields];

allFields.forEach(field => {
    field.addEventListener('focus', removeError);
});

select.addEventListener('change', (e) => {
    removeError(e);
});

form.addEventListener('focusout', fieldValidation);

form.addEventListener('submit', checkFilledFields);

expDataInput.addEventListener('input', checkExpDataFields);
expDataInput.addEventListener('keydown', checkExpDataFieldsForDigits);

function checkExpDataFieldsForDigits(event) {
    prevExpDataInputValue = event.target.value;
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

    const fieldType = field.getAttribute('name');
    const value = field.value;

    const emailREGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneREGEX = /^[0-9\+]{9,11}$/;
    const zipcodeREGEX = /^\d+$/;

    let checkResult = '';
  
    switch (fieldType) {
  
      case 'name':
        if (value.length > 50) {
          checkResult = 'Name must not be longer than 50 characters';
        }
        break;
  
      case 'email':
        if (!emailREGEX.test(value)) {
          checkResult = 'Email is invalid';
        }
        if (value.length > 320) {
          checkResult = 'Email must not be longer than 320 characters';
        }
        break;
  
      case 'phone':
        if (!phoneREGEX.test(value)) {
          checkResult = 'Phone must be 9 to 11 digits.';
        }
        break;
    
      case 'address':
        if (value.length > 255) {
          checkResult = 'Address must not be longer than 255 characters';
        }
        break;
  
      case 'city':
        if (value.length > 50) {
          checkResult = 'City name must not be longer than 50 characters';
        }
        break;
  
      case 'zip_code':
        if (!zipcodeREGEX.test(value)) {
          checkResult = 'ZIP code should contain only numbers';
        }
        if (value.length < 5) {
          checkResult = 'ZIP code must not be shorter than 5 symbols';
        }
        if (value.length > 9) {
          checkResult = 'ZIP code must not be longer than 9 symbols';
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

    case 'card_data':

        if (value.length !== 7) {
            checkResult = 'Card expiration date should be 6 digits';
        }
        const month = value.substring(0, 2);
        const year = value.substring(3, 7);

        if(!isExpirationDateValid(month, year)) {
            checkResult = 'Card expiration date is invalid';
        }
        break;

    case 'card_cvv':
        const cardNumberInput = document.querySelector('input[name="card_number"]');
        if(!isSecurityCodeValid(cardNumberInput.value, value)) {
            checkResult = 'CVC is invalid';
        }
        break;
    }

    if(checkResult.trim().length !== 0 ) {
        setError(field, checkResult);
    }
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
