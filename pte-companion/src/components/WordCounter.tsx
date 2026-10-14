import { checkWordLimit } from '../domain/templates';
import { UI } from '../ui/strings';

interface Props {
  text: string;
  limit?: { min?: number; max?: number };
}

export function WordCounter({ text, limit }: Props) {
  const status = checkWordLimit(text, limit);
  const rangeLabel =
    limit && (limit.min != null || limit.max != null)
      ? ` / ${limit.min ?? 0}–${limit.max ?? '∞'} ${UI.common.words}`
      : ` ${UI.common.words}`;
  return (
    <span className={limit ? (status.withinRange ? 'count-ok' : 'count-bad') : 'badge'}>
      {status.count}
      {rangeLabel}
      {limit ? (status.withinRange ? ` · ${UI.templates.withinRange}` : ` · ${UI.templates.outOfRange}`) : ''}
    </span>
  );
}
