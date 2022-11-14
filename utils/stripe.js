const stripe = require('stripe')('sk_test_51IX5zeLynG5ZgU5JTQmfgRCj0q57WqrCWOpgoxo5V5JZkFuQhEFMdWiAvVadhUeym8Fbjg9FUn4kPskdAaWf2coy00VHXQjBe3');

const YOUR_DOMAIN = 'http://localhost:3000';

exports.stripeSession = async(price)=>{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/login`,
        cancel_url: `${YOUR_DOMAIN}/login`,
      });
return session
}
