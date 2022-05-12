import {WEBSITE_DESCRIPTOR, WEBSITE_PHONE, WEBSITE_EMAIL} from '../website-data.js'

export const purchaseTemplate = (products) => {
 
    let result = [];

    products.forEach(product => {

    	if(product.type == "trial"){
    		result.push(`<p class="text"> <span class="bold">Trial Offer</span> - By placing an order, you agree to the full <a href="./purchase.html" class="link">Terms And Conditions</a> and <a href="./privacy.html" class="link">Privacy Policy</a> as well as enrollment into our trial program where you will immediately be billed the shipping and handling amount of $${(product.price).toFixed(2)} and we will immediately ship you a supply of 1x ${product.name}. You have a 15 day trial period. Your trial will begin upon receipt of ${product.name}. After your ${product.name} trial 15 day has ended, your credit card will then automatically be billed a one time charge of $${(product.full_price).toFixed(2)}. For all MasterCard transactions ONLY: Within 5 days, you will receive an email requiring your response to your onetime charge of $${(product.full_price).toFixed(2)}. If you are happy with ${product.name}, you are required to consent to the onetime charge of $${(product.full_price).toFixed(2)}. You will see a charge from ${WEBSITE_DESCRIPTOR} on your bank statement. If our product is not right for you, simply call ${WEBSITE_PHONE} or contact us via email at ${WEBSITE_EMAIL} or click on the <a href="./cancellation.html" class="link">Cancellation Link</a> to cancel your order. Shipment via USPS typically takes 3-5 business days.</p>`);
    	}else{
    		result.push(`<p class="text">${product.name} - <span class="bold"> $${(product.price).toFixed(2)}</span></p>`);
    	}

        
    })
    
    result = result.join('');
    return result;
}