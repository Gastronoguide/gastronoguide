npm run dev

stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe listen --forward-to 192.168.1.16:3000/api/webhooks/stripe
stripe listen --forward-to https://gastronoguide.vercel.app/api/webhooks/stripe