export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}