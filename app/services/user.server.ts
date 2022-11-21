import type {RegisterForm} from '../types';
import type {User} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {prisma} from '../utils/prisma.server';

const createUser = async (
  user: RegisterForm,
): Promise<Pick<User, 'id' | 'email'>> => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      displayName: user.displayName,
    },
  });

  return {id: newUser.id, email: user.email};
};

export const userService = {createUser};
