exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { to, subject, text, attachments } = JSON.parse(event.body);

    const payload = {
      from: 'NHNN Stock Control <noreply@nhnnstock.co.uk>',
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
    };

    if (attachments && attachments.length) {
      payload.attachments = attachments;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_KGvUZPZ7_6bwv8iBceJYF82cLMNqnq1YS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
