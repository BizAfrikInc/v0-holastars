import { userRepository } from "@/lib/db/repositories/users-repository";

export async function generateUsername(firstName: string, lastName: string) {
  const base = (firstName.slice(0, 3) + lastName.slice(0, 2)).toUpperCase();
  let suffix = 1;

  while (true) {
    const username = `${base}${suffix.toString().padStart(3, '0')}`;
    const existing = await userRepository.findByUsername(username);
    if (!existing) return username;
    suffix++;
  }
}
