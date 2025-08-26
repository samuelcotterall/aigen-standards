---
id: stripe-md
title: Stripe (JS/React) — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Stripe (JS/React) — Conventions & Examples

## Conventions
1. Create PaymentIntents server-side; client only confirms.
2. Encapsulate `<Elements>` with theme/locale; export `<CheckoutForm/>`.
3. Typed webhook handlers; use idempotency keys in DB.

## Examples
```ts
// api/payments/route.ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: Request) {
  const { amount, currency } = await req.json();
  const pi = await stripe.paymentIntents.create({ amount, currency });
  return new Response(JSON.stringify({ clientSecret: pi.client_secret }));
}
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [React docs](https://react.dev)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

