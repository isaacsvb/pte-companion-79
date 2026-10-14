import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ProgressProvider } from './state/ProgressContext';
import { UI } from './ui/strings';

function renderApp() {
  return render(
    <ProgressProvider>
      <App />
    </ProgressProvider>,
  );
}

describe('App — navegação e rotas (smoke)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('renderiza o cabeçalho e a navegação em PT-BR', () => {
    renderApp();
    expect(screen.getByText(UI.appName)).toBeInTheDocument();
    // Todos os pilares aparecem na navegação.
    Object.values(UI.nav).forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it('exibe o Dashboard por padrão', () => {
    renderApp();
    expect(screen.getByText(UI.dashboard.title)).toBeInTheDocument();
  });

  it('navega para o Guia de Estratégias ao clicar no menu', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('link', { name: UI.nav.strategy }));
    expect(screen.getByText('Matriz 80/20')).toBeInTheDocument();
  });

  it('navega para o Treino de Tarefas e lista as partes', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('link', { name: UI.nav.taskTrainer }));
    expect(screen.getByText(/Total: 22 tarefas/)).toBeInTheDocument();
  });

  it('restaura a rota a partir do hash ao carregar', () => {
    window.location.hash = '#/templates';
    renderApp();
    expect(screen.getByText(UI.templates.fillPlaceholders)).toBeInTheDocument();
  });
});
