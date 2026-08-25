import { AdminPreferencesLanguage } from '@ombro/shared/data-access/api-client';

export type Language = { code: AdminPreferencesLanguage; label: string };

export type AvailableLanguages = Language[];
