import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { phone, total_amount } = req.body;

    if (!phone || !total_amount) {
      return res.status(400).json({ error: 'Telefone e valor total são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([{ customer_phone: phone, total_amount, status: 'pending' }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      success: true,
      message: 'Pedido registado com sucesso!',
      orderId: data[0].id
    });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}