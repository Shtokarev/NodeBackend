import bcrypt from 'bcrypt';

const saltRounds = 11;

export const getHash = (password: string): Promise<string> => bcrypt.hash(password, saltRounds);

export const checkHash = (chekedPassword: string, hash: string): Promise<boolean> =>
  bcrypt.compare(chekedPassword, hash);
