export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // ONLY send the notification to YOU
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: 'broschhaden@outlook.com', // Your verified address
        subject: `New Lead: ${data.first_name}`,
        html: `<p>New message from ${data.first_name} (${data.email})</p>
               <p>Message: ${data.message}</p>`,
      }),
    });

    if (response.ok) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/contact.html?success=true' },
      });
    } else {
      const errorText = await response.text();
      return new Response("Resend Error: " + errorText, { status: 500 });
    }
  } catch (err) {
    return new Response("Server Error: " + err.message, { status: 500 });
  }
}
