const stripe = require('stripe')('sk_test_51IX5zeLynG5ZgU5JTQmfgRCj0q57WqrCWOpgoxo5V5JZkFuQhEFMdWiAvVadhUeym8Fbjg9FUn4kPskdAaWf2coy00VHXQjBe3');

const YOUR_DOMAIN = 'http://localhost:3001';

exports.stripeSession = async(price,id)=>{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/user/updatePaymentStatus/success?${id}`,
        cancel_url: `${YOUR_DOMAIN}/login`,
      });
return session
}
