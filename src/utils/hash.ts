import bcrypt from 'bcrypt';

const saltRounds = 11;

export const getHash = (password: string) => bcrypt.hash(password, saltRounds);

export const checkHash = (chekedPassword: string, hash: string) =>
  bcrypt.compare(chekedPassword, hash);
