import {  addMinutes, isBefore } from "date-fns";
import { randomBytes } from "crypto";
import { verificationTokensRepository } from "@/lib/db/repositories/verification-tokens-repository";

export async function generateVerificationToken(userId: string, expireAfter: number = 30): Promise<{ token: string, expiresAt: Date }> {
  const token = randomBytes(32).toString("hex")
  const expiresAt = addMinutes(new Date(), expireAfter)

  await verificationTokensRepository.create({
    userId,
    token,
    expiresAt,
  })

  return { token, expiresAt }
}

export async function verifyVerificationToken(token: string): Promise<string | null> {
  const record = await verificationTokensRepository.findByToken(token);

  if (!record || isBefore(record.expiresAt, new Date())) {
    return null;
  }

  return record.userId;
}

export async function invalidateVerificationToken(token: string): Promise<boolean> {
  return verificationTokensRepository.deleteByToken(token)
}
