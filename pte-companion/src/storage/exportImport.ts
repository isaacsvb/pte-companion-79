// Exportar/importar o progresso como JSON.

import { ProgressState, isValidState, migrate } from './schema';

export function exportToJson(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Dispara o download de um arquivo JSON com o progresso.
 * Depende de APIs de DOM (usar apenas no navegador).
 */
export function downloadProgress(state: ProgressState): void {
  const json = exportToJson(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `pte-companion-progresso-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importa e valida um JSON de progresso. Lança Error em caso de arquivo inválido.
 */
export function importFromJson(json: string): ProgressState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('JSON inválido.');
  }
  if (!isValidState(parsed)) {
    throw new Error('Estrutura de progresso inválida.');
  }
  return migrate(parsed);
}
