import { createClient } from '@supabase/supabase-js';

// Sanitiza a URL e a Chave removendo espaços ou barras / no final
const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.trim().replace(/\/+$/, '');
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configuração de cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisições prévias do navegador (Preflight)
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ROTA GET: Listar produtos (mais recentes primeiro)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ROTA POST: Adicionar novo produto
  if (req.method === 'POST') {
    const { name, price, description, image_url } = req.body || {};
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, description, image_url }])
      .select(); // Retorna os dados inseridos

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Produto adicionado com sucesso!', data });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}