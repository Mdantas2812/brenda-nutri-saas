async function createPaymentLink({ amount, description }) {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      status: "simulado",
      paymentUrl: "https://www.mercadopago.com.br/"
    };
  }

  return {
    status: "pendente",
    paymentUrl: "https://www.mercadopago.com.br/"
  };
}

async function sendWhatsappMessage({ to, message }) {
  if (!process.env.WHATSAPP_CLOUD_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return { status: "simulado", reason: "WhatsApp Cloud API não configurada" };
  }

  return { status: "preparado", to, message };
}

module.exports = { createPaymentLink, sendWhatsappMessage };
