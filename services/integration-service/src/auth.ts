import { timingSafeEqual } from "node:crypto";
import type { FastifyRequest } from "fastify";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminRequest(request: FastifyRequest, expectedToken: string): boolean {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return false;
  return safeEqual(authorization.slice(7), expectedToken);
}
