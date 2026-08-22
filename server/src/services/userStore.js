const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf8');
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function getAllUsers() {
  return readUsers();
}

function getUserById(id) {
  return readUsers().find((u) => u.id === id) || null;
}

function getUserByEmail(email) {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

function createUser(data) {
  const users = readUsers();
  const user = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    age: null,
    gender: null,
    state: null,
    income: null,
    occupation: null,
    caste_category: null,
    savedSchemes: [],
  };
  users.push(user);
  writeUsers(users);
  return user;
}

function updateUser(id, updates) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser, updateUser };
