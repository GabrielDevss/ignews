import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/managerSubcripition";

async function buffer(readable: Readable) {
  const chucks = [];

  for await (const chuck of readable) {
    chucks.push(
      typeof chuck === 'string' ? Buffer.from(chuck) : chuck);
  }
  return Buffer.concat(chucks);
}

export const config = {
  api: {
    bodypart: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-segnature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return res.status(400).send(`WebHook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      console.log('evento recebido', event);
      //     try {
      //       switch(type) {
      //         case 'checkout.session.completed':

      //           const checkoutSession = event.data.object as Stripe.Checkout.Session;

      //           await saveSubscription(
      //             checkoutSession.subscription.toString(),
      //             checkoutSession.customer.toString()
      //           )

      //           break;
      //         default: 
      //           throw new Error('Unhandled event.')
      //       }
      //     } catch (err) {
      //       return res.json({ error: 'WebHook handle failed'});
      //     }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allow')
  }

}