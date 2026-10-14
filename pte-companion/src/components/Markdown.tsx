// Renderizador de markdown mínimo (títulos, listas, tabelas, código inline, blockquote).
// Suficiente para os capítulos de estratégia; evita dependência externa.

interface Props {
  source: string;
}

function renderInline(text: string): (string | JSX.Element)[] {
  // Negrito **x** e código `x`.
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++}>{token.slice(1, -1)}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function Markdown({ source }: Props) {
  const lines = source.split('\n');
  const blocks: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Tabela
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1])) {
      const header = line.split('|').map((c) => c.trim()).filter((c) => c.length > 0);
      i += 2; // pula header e separador
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map((c) => c.trim()).filter((c) => c.length > 0));
        i++;
      }
      blocks.push(
        <table key={key++}>
          <thead>
            <tr>{header.map((h, hi) => <th key={hi}>{renderInline(h)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c)}</td>)}</tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    // Títulos
    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = renderInline(headingMatch[2]);
      const Tag = (`h${Math.min(level + 1, 6)}`) as keyof JSX.IntrinsicElements;
      blocks.push(<Tag key={key++}>{content}</Tag>);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={key++} className="notice">
          {quoteLines.map((q, qi) => <p key={qi}>{renderInline(q)}</p>)}
        </blockquote>,
      );
      continue;
    }

    // Lista ordenada
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push(<ol key={key++}>{items.map((it, ii) => <li key={ii}>{renderInline(it)}</li>)}</ol>);
      continue;
    }

    // Lista não ordenada
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ''));
        i++;
      }
      blocks.push(<ul key={key++}>{items.map((it, ii) => <li key={ii}>{renderInline(it)}</li>)}</ul>);
      continue;
    }

    // Parágrafo
    blocks.push(<p key={key++}>{renderInline(line)}</p>);
    i++;
  }

  return <div className="markdown">{blocks}</div>;
}
