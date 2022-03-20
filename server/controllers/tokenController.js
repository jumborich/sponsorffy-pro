const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Hi5SdCCvEbT2MoaX7N5gqBS4H3pVq7wc53saCB53gKKUHF76THCed2anfJxFLiMYiaLRxZSNZVsIlMS85lK7hhb003ouItVB2');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const { default: Stripe } = require('stripe');


exports.buyToken = catchAsync (async(req, res, next) => {
  // **********Things to include in the body of requests**********
  // bundle name, description,
  // 1) Get the body of the request
  
  // 2) Create check out session 
  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    success_url: 'http://127.0.0.1:3000/profile?payment_successful=true', //`${req.protocol}://${req.get('host')}/profile`,
    cancel_url:'http://127.0.0.1:3000/buy-tokens', //`${req.protocol}://${req.get('host')}/buy-tokens`,
    customer_email: req.user.email,
    client_reference_id:uuidv4(),
    line_items:[
      {
        name:req.body.name,
        description:req.body.description,
        // image:req.body.image
        amount:req.body.amount * 100, //This is multiplied by 100 to convert the dollar amount to cents...
        currency:'cad',
        quantity:1
      }
    ]
  })

  // 3) Create session and send to client
  res.status(200).json({
    status: 'success',
    session
  })

})