import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, price, description, image_url } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, description, image_url }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Produto adicionado!', data });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}