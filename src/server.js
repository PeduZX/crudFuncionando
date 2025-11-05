const express = require('express');
const bcrypt = require('bcrypt');
const db = require("./db_config");
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // para servir arquivos da pasta public]

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // CB = call back
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middlewares
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// ========================
// Rota de cadastro
// ========================
app.post('/register',(req, res) => {
  const { nome, email, senha } = req.body;

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Erro ao criptografar senha' });

    const sql = 'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, hash], (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
  });
});

// ========================
// Rota de login
// ========================
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no login' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = results[0];

    bcrypt.compare(senha, user.senha, (err, match) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar senha' });
      if (!match) return res.status(401).json({ error: 'Senha incorreta' });

      res.json({ message: 'Login realizado com sucesso!' });
    });
  });
});

// ========================
// Rota de Cadastrar Carros
// ========================
app.post("/registerCarros", upload.single('arquivo'), (req, res) => {
  const arquivo = req.file;

  if (!arquivo) {
    return res.status(400).json({ success: false, message: "Nenhum arquivo enviado" });
  }

  const params = [
    req.body.modelo,
    req.body.marca,
    req.body.origem_fabricante,
    req.body.tipo_carroceria,
    arquivo.originalname, // nome original
    arquivo.filename      // nome salvo no servidor
  ];

  const query = `
    INSERT INTO carros (modelo, marca, origem_fabricante, tipo_carroceria, nome_original, nome_arquivo)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: "Erro ao salvar no banco", data: err });
    }

    res.status(201).json({ success: true, message: "Carro cadastrado com sucesso!", data: results });
  });
});


// ========================
// Rota de Deletar Carros
// ========================
app.delete("/delete/:id", (request, response) => {
  const params = [request.params.id];
  const query = "DELETE FROM carros WHERE id = ?;";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao deletar carro:", err);
      return response.status(400).json({ success: false, message: "Erro ao deletar carro", data: err });
    }

    response.status(200).json({ success: true, message: "Carro deletado com sucesso!", data: results });
  });
});

// ========================
// Rota de Listar Carros
// ========================
app.get("/listarCarros", (request, response) => {
  const query = "SELECT * FROM carros;";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao listar carros:", err);
      return response.status(400).json({ success: false, message: "Erro ao listar carros", data: err });
    }

    response.status(200).json({ success: true, message: "Sucesso!", data: results });
  });
});

// ========================
// Rota de Editar Carros
// ========================
app.put("/editarCarro/:id", upload.single('arquivo'), (req, res) => {
  const { modelo, marca, origem_fabricante, tipo_carroceria } = req.body;
  const arquivo = req.file; // imagem obrigatória
  const id = req.params.id;

  if (!arquivo) {
    return res.status(400).json({ success: false, message: "Nenhum arquivo enviado." });
  }

  const query = `
    UPDATE carros SET
      modelo = ?,
      marca = ?,
      origem_fabricante = ?,
      tipo_carroceria = ?,
      nome_original = ?,
      nome_arquivo = ?
      WHERE id = ?;
  `;

  const params = [
    req.body.modelo,
    req.body.marca,
    req.body.origem_fabricante,
    req.body.tipo_carroceria,
    arquivo.originalname, // nome original
    arquivo.filename,      // nome salvo no servidor
    id
  ];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar carro:", err);
      return res.status(400).json({ success: false, message: "Erro ao atualizar", data: err });
    }

    res.status(200).json({ success: true, message: "Carro atualizado com sucesso!", data: results });
  });
});




app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});