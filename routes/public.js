import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

//Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const user = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });
    res.status(201).json(userDB);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Erro no servidor, tente novamente mais tarde.' });
  }
});

//login com token JWT de autenticação
router.post('/login', async (req, res) => {
  try {
    const userInfo = req.body;

    //busca o usuário no banco de dados pelo email que é único
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    //verifica se o usuário existe no banco
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    //comparando a senha digitada com a criptografada no banco
    const isMatch = await bcrypt.compare(userInfo.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta!' });
    }

    //gerando o token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15d' });

    res.status(200).json(token);
  } catch (err) {
    console.error('Erro no login:', err);
    res
      .status(500)
      .json({ message: 'Erro no servidor, tente novamente mais tarde.' });
  }
});

export default router;
