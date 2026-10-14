import { describe, it, expect } from 'vitest';
import { initTimer, start, tick, skipPrep, finish, formatSeconds } from './timers';

describe('timers — máquina de estados', () => {
  it('inicia em idle', () => {
    const t = initTimer({ prepSeconds: 25, responseSeconds: 30 });
    expect(t.phase).toBe('idle');
  });

  it('start vai para prep quando há preparação', () => {
    const t = start(initTimer({ prepSeconds: 25, responseSeconds: 30 }));
    expect(t.phase).toBe('prep');
    expect(t.remaining).toBe(25);
  });

  it('start vai direto para response quando não há preparação', () => {
    const t = start(initTimer({ prepSeconds: null, responseSeconds: 9 }));
    expect(t.phase).toBe('response');
    expect(t.remaining).toBe(9);
  });

  it('transita automaticamente de prep para response ao zerar', () => {
    let t = start(initTimer({ prepSeconds: 2, responseSeconds: 30 }));
    t = tick(t, 1);
    expect(t.phase).toBe('prep');
    expect(t.remaining).toBe(1);
    t = tick(t, 1);
    expect(t.phase).toBe('response');
    expect(t.remaining).toBe(30);
  });

  it('carrega o excedente de tempo na transição prep→response', () => {
    let t = start(initTimer({ prepSeconds: 1, responseSeconds: 30 }));
    t = tick(t, 3); // excedente de 2s
    expect(t.phase).toBe('response');
    expect(t.remaining).toBe(28);
  });

  it('response chega a done ao zerar', () => {
    let t = start(initTimer({ prepSeconds: null, responseSeconds: 2 }));
    t = tick(t, 1);
    expect(t.phase).toBe('response');
    t = tick(t, 1);
    expect(t.phase).toBe('done');
    expect(t.remaining).toBe(0);
  });

  it('skipPrep pula direto para a resposta', () => {
    let t = start(initTimer({ prepSeconds: 25, responseSeconds: 30 }));
    t = skipPrep(t);
    expect(t.phase).toBe('response');
    expect(t.remaining).toBe(30);
  });

  it('finish encerra manualmente', () => {
    let t = start(initTimer({ prepSeconds: null, responseSeconds: 30 }));
    t = finish(t);
    expect(t.phase).toBe('done');
  });

  it('formatSeconds formata mm:ss', () => {
    expect(formatSeconds(0)).toBe('00:00');
    expect(formatSeconds(65)).toBe('01:05');
    expect(formatSeconds(600)).toBe('10:00');
  });
});
