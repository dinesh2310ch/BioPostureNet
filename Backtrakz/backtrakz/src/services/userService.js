// src/services/userService.js
import { db } from "./firebase";
import { ref, get, set } from "firebase/database";

function generateUniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export async function signupUser(name, username, password) {
  // Check if username already exists
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);

  if (snapshot.exists()) {
    const users = snapshot.val();
    const usernameExists = Object.values(users).some(
      (user) => user.username === username
    );
    if (usernameExists) {
      throw new Error("Username already taken");
    }
  }

  const uniqueId = generateUniqueId();
  const userRef = ref(db, `users/${uniqueId}`);

  await set(userRef, {
    id: uniqueId,
    name: name,
    username: username,
    password: password, // ⚠️ plain text for demo only
  });

  return true;
};


export async function loginUser(username, password) {
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
    throw new Error("User does not exist");
  }

  const users = snapshot.val();
  const matchedUser = Object.values(users).find(
    (user) => user.username === username
  );

  if (!matchedUser) {
    throw new Error("User does not exist");
  }

  if (matchedUser.password !== password) {
    throw new Error("Invalid password");
  }

  return true;
};