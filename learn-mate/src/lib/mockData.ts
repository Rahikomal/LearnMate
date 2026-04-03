export interface User {
  id: string;
  name: string;
  skill: string;
  avatar?: string;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
}

export const currentUser = {
  name: "Komal",
  email: "komal@example.com",
  teaching: ["React JS", "Azure Functions"],
  learning: ["C#", "AI"],
};

export const users: User[] = [
  { id: "1", name: "Hitesh", skill: "React JS" },
  { id: "2", name: "Komal", skill: "Azure Functions" },
  { id: "3", name: "Nandani", skill: "Tailwind CSS" },
  { id: "4", name: "Diya", skill: "Tailwind CSS" },
  { id: "5", name: "Raj", skill: "TypeScript" },
  { id: "6", name: "Nandani", skill: "Python" },
  { id: "7", name: "Dhvani", skill: "AI" },
];

export const connections: User[] = [
  { id: "1", name: "Hitesh", skill: "React JS" },
  { id: "3", name: "Sneha", skill: "Tailwind CSS" },
];

export const recentChats = [
  { user: "Hitesh", message: "Sure, let's schedule a session!" },
  { user: "Sneha", message: "Thanks for the CSS tips 😊" },
];

export const chatUsers: User[] = [
  { id: "1", name: "Hitesh", skill: "React JS" },
  { id: "3", name: "Nandani", skill: "Tailwind CSS" },
  { id: "4", name: "Diya", skill: "Tailwind CSS" },
  { id: "5", name: "Raj", skill: "TypeScript" },
  { id: "6", name: "Nandani", skill: "Python" },
  { id: "7", name: "Dhvani", skill: "AI" },
];
