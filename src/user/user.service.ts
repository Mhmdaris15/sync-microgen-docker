/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: User): User | null {
    if (
      this.users.some((existingUser) => existingUser.username === user.username)
    ) {
      console.error('Username already exists');
      return null;
    }
    user.id = this.users.length + 1;
    this.users.push(user);
    console.log(this.users);
    return user;
  }

  updateUser(id: number, updatedUser: User): User {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }

  findByUsername(username: string): User {
    return this.users.find((user) => user.username === username);
  }
}
