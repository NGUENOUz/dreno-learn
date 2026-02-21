// app/api/webhooks/chariow/route.ts
export async function POST(req: Request) {
  const payload = await req.json();
  
  if (payload.data.status === 'completed') {
    const { customer, product } = payload.data;

    // Appel à Evolution API
    await fetch(`${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.WA_INSTANCE}`, {
      method: 'POST',
      headers: { 
        apikey: process.env.EVOLUTION_API_KEY || '',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        number: customer.phone.number,
        options: { delay: 1200, presence: "composing" },
        textMessage: {
          text: `Félicitations ${customer.first_name} ! 🎉\n\nBienvenue dans la formation *${product.name}*.\n\nVoici votre lien d'accès au groupe VIP : https://chat.whatsapp.com/xyz\n\nRetrouvez vos ressources ici : ${process.env.NEXT_PUBLIC_APP_URL}/courses/success`
        }
      })
    });
  }
  return new Response('OK');
}