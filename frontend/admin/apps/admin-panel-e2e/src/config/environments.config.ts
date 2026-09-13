export const isInCompose: boolean = !!process.env['IS_IN_COMPOSE'] || false;

export const mailUrl = isInCompose
  ? `${process.env['EMAIL_HOST'] ?? 'mailpit'}:${process.env['EMAIL_PORT'] ?? 1025}`
  : `localhost:${process.env['EMAIL_PORT'] ?? 1025}`;

export const firstAdminCredentials: { email: string; password: string } = {
  email: process.env['SEED_ADMIN_EMAIL'] ?? 'admin@example.com',
  password: process.env['SEED_ADMIN_PASSWORD'] || 'password',
};
