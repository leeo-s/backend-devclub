import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

//criando o Middleware
//o next é a continuídade do processo de acesso
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default auth;
