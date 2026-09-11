import type { EmailTemplateSchema } from '../types/email';

const CURRENT_KEY = 'mailcraft-current-template-v1';
const SAVED_KEY = 'mailcraft-saved-templates-v1';

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable or full — persistence is best-effort in this POC.
  }
}

export function loadCurrentTemplate(): EmailTemplateSchema | null {
  return readJson<EmailTemplateSchema>(CURRENT_KEY);
}

export function persistCurrentTemplate(schema: EmailTemplateSchema): void {
  writeJson(CURRENT_KEY, schema);
}

export function loadSavedTemplates(): Record<string, EmailTemplateSchema> {
  return readJson<Record<string, EmailTemplateSchema>>(SAVED_KEY) ?? {};
}

export function saveTemplateToLibrary(schema: EmailTemplateSchema): void {
  const saved = loadSavedTemplates();
  saved[schema.template.id] = schema;
  writeJson(SAVED_KEY, saved);
  persistCurrentTemplate(schema);
}

export function deleteTemplateFromLibrary(id: string): void {
  const saved = loadSavedTemplates();
  delete saved[id];
  writeJson(SAVED_KEY, saved);
}
