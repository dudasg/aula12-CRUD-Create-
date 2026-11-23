require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// 1. Configuração obrigatória para o Express entender JSON
app.use(express.json());

// 2. Conexão com o Supabase usando as chaves do arquivo .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 3. Sua rota exclusiva (Aluno 17 - Farmácia & Drogaria)
app.post('/api/medicamentos', async (req, res) => {
  try {
    const { nome, laboratorio, preco, receita_obrigatoria } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !laboratorio || preco === undefined || preco === null) {
      return res.status(400).json({
        erro: 'Os campos nome, laboratorio e preco são obrigatórios.'
      });
    }

    // Inserção na tabela 'medicamentos' do Supabase
    const { data, error } = await supabase
      .from('medicamentos')
      .insert([
        {
          nome,
          laboratorio,
          preco,
          receita_obrigatoria: receita_obrigatoria ?? false
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ erro: error.message });
    }

    // Retorna status 201 com o registro criado (id e created_at)
    return res.status(201).json(data[0]);

  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// 4. Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});