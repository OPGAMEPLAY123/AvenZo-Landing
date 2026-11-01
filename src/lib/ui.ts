export type LegalId = 'terms' | 'privacy' | 'cashback';

export const showToast = (message: string) =>
  window.dispatchEvent(new CustomEvent<string>('avz:toast', { detail: message }));

export const openLegal = (id: LegalId) =>
  window.dispatchEvent(new CustomEvent<LegalId>('avz:legal', { detail: id }));
