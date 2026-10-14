import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordCounter } from './WordCounter';

describe('WordCounter', () => {
  it('mostra contagem sem limite', () => {
    render(<WordCounter text="one two three" />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it('sinaliza dentro da faixa', () => {
    const { container } = render(
      <WordCounter text="a b c d e" limit={{ min: 3, max: 10 }} />,
    );
    expect(container.querySelector('.count-ok')).not.toBeNull();
  });

  it('sinaliza fora da faixa', () => {
    const { container } = render(<WordCounter text="a b" limit={{ min: 5, max: 10 }} />);
    expect(container.querySelector('.count-bad')).not.toBeNull();
  });
});
