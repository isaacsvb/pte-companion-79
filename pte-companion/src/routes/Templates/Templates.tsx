import { useMemo, useState } from 'react';
import { TEMPLATES } from '../../content/templates';
import { assembleTemplate } from '../../domain/templates';
import { WordCounter } from '../../components/WordCounter';
import { useProgress } from '../../state/ProgressContext';
import { UI } from '../../ui/strings';

export function Templates() {
  const { state, saveTemplateFill } = useProgress();
  const [selectedId, setSelectedId] = useState(TEMPLATES[0]?.id ?? '');
  const template = TEMPLATES.find((t) => t.id === selectedId)!;

  const [values, setValues] = useState<Record<string, string>>(
    () => state.templateFills[selectedId] ?? {},
  );
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  function selectTemplate(id: string) {
    setSelectedId(id);
    setValues(state.templateFills[id] ?? {});
    setCopied(false);
    setSaved(false);
  }

  const assembled = useMemo(
    () => assembleTemplate(template.body, values),
    [template.body, values],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(assembled);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function save() {
    saveTemplateFill(selectedId, values);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <h2>{UI.nav.templates}</h2>
      <div className="row" style={{ marginBottom: '1rem' }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            className={t.id === selectedId ? 'primary' : ''}
            onClick={() => selectTemplate(t.id)}
          >
            {t.taskName}
          </button>
        ))}
      </div>

      <p className="badge">{template.description}</p>

      <div className="two-pane">
        <div className="card">
          <h3>{UI.templates.fillPlaceholders}</h3>
          {template.placeholders.map((p) => (
            <div key={p.key} style={{ marginBottom: '0.6rem' }}>
              <label>
                <strong>{p.label}</strong> <span className="badge">[{p.key}]</span>
              </label>
              {p.hint && <p className="badge" style={{ margin: '0.1rem 0' }}>{p.hint}</p>}
              <input
                type="text"
                value={values[p.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="row">
            <button className="primary" onClick={save}>
              {UI.common.save}
            </button>
            {saved && <span className="count-ok">{UI.templates.saved}</span>}
          </div>
        </div>

        <div className="card">
          <div className="spread">
            <h3 style={{ margin: 0 }}>{UI.templates.preview}</h3>
            <WordCounter text={assembled} limit={template.wordLimit} />
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{assembled}</pre>
          <div className="row">
            <button onClick={copy}>{UI.common.copy}</button>
            {copied && <span className="count-ok">{UI.common.copied}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
