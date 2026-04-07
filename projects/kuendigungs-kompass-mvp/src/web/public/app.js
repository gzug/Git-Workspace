const state = {
  app: null,
  tier: 'base',
  tierOptions: [],
  examples: [],
  answers: {},
  view: null,
  displayScreenId: null,
  loading: false,
};

const elements = {
  tierSelect: document.querySelector('#tier-select'),
  resetButton: document.querySelector('#reset-button'),
  exampleButtons: document.querySelector('#example-buttons'),
  progressSteps: document.querySelector('#progress-steps'),
  statusChips: document.querySelector('#status-chips'),
  warningList: document.querySelector('#warning-list'),
  screenCard: document.querySelector('#screen-card'),
  resultCard: document.querySelector('#result-card'),
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getVisibleScreens() {
  return state.view?.flowState?.screens || [];
}

function getCurrentScreen() {
  const screens = getVisibleScreens();
  return screens.find((screen) => screen.id === state.displayScreenId) || state.view?.flowState?.nextScreen || null;
}

function isResultState() {
  return state.view?.status === 'ready' || state.view?.status === 'render-fallback';
}

function syncDisplayScreen() {
  const screens = getVisibleScreens();
  const visibleIds = new Set(screens.map((screen) => screen.id));

  if (!state.displayScreenId || !visibleIds.has(state.displayScreenId)) {
    state.displayScreenId = state.view?.flowState?.nextScreen?.id || screens[screens.length - 1]?.id || null;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Unbekannter Fehler.');
  }
  return data;
}

async function refreshView() {
  state.loading = true;
  render();

  try {
    state.view = await fetchJson('/api/view', {
      method: 'POST',
      body: JSON.stringify({
        answers: state.answers,
        tier: state.tier,
      }),
    });
    syncDisplayScreen();
  } catch (error) {
    state.view = {
      status: 'error',
      error: {
        code: 'client_fetch_failed',
        message: error.message,
      },
      warnings: [],
    };
  } finally {
    state.loading = false;
    render();
  }
}

function prettifyTier(value) {
  if (value === 'preview') return 'Preview';
  if (value === 'base') return 'Base';
  if (value === 'upgrade') return 'Upgrade';
  return value;
}

function prettifyStatus(value) {
  if (value === 'ready') return 'Auswertung bereit';
  if (value === 'incomplete') return 'Angaben fehlen';
  if (value === 'render-fallback') return 'Struktur ok · Render-Fallback';
  if (value === 'error') return 'Technischer Fehler';
  return value;
}

function buildStatusChips() {
  const chips = [];
  const status = state.view?.status || 'unbekannt';
  chips.push({ label: prettifyStatus(status), tone: status === 'ready' ? 'success' : status === 'error' ? 'danger' : status === 'render-fallback' ? 'warning' : 'neutral' });
  chips.push({ label: `Tier ${prettifyTier(state.view?.tier || state.tier)}`, tone: 'neutral' });

  const track = state.view?.result?.synthesisDecision?.primaryTrack;
  if (track) chips.push({ label: `Track ${track}`, tone: 'neutral' });

  const riskLevel = state.view?.result?.caseSnapshot?.riskLevel;
  if (riskLevel) {
    const tone = riskLevel === 'high' ? 'danger' : riskLevel === 'medium' ? 'warning' : 'success';
    chips.push({ label: `Risiko ${riskLevel}`, tone });
  }

  return chips;
}

function renderStatus() {
  elements.statusChips.innerHTML = buildStatusChips()
    .map((chip) => `<span class="chip chip-${chip.tone}">${escapeHtml(chip.label)}</span>`)
    .join('');
}

function renderWarnings() {
  const items = [];

  if (state.view?.status === 'render-fallback') {
    items.push({
      tone: 'warning',
      text: 'Die Textansicht konnte gerade nicht gebaut werden. Die strukturierte Auswertung bleibt sichtbar und ist weiter nutzbar.',
    });
  }

  if (Array.isArray(state.view?.warnings)) {
    for (const warning of state.view.warnings) {
      items.push({ tone: 'warning', text: warning });
    }
  }

  if (state.view?.status === 'error' && state.view.error?.message) {
    items.push({ tone: 'error', text: `${state.view.error.code}: ${state.view.error.message}` });
  }

  if (items.length === 0) {
    elements.warningList.innerHTML = '<div class="warning-item">Keine zusätzlichen Warnhinweise.</div>';
    return;
  }

  elements.warningList.innerHTML = items
    .map((item) => `<div class="warning-item ${item.tone}">${escapeHtml(item.text)}</div>`)
    .join('');
}

function renderProgress() {
  const screens = getVisibleScreens();

  if (screens.length === 0) {
    elements.progressSteps.innerHTML = '<div class="empty-note">Noch kein sichtbarer Fragebogenpfad.</div>';
    return;
  }

  elements.progressSteps.innerHTML = screens.map((screen) => {
    const active = screen.id === state.displayScreenId;
    const classes = [
      'progress-step',
      active ? 'active' : '',
      screen.isCompleted ? 'complete' : '',
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}">
        <button type="button" data-jump-screen="${escapeHtml(screen.id)}">
          <div class="step-title">${escapeHtml(screen.title)}</div>
          <div class="step-meta">${screen.isCompleted ? 'erledigt' : 'offen'} · ${screen.questions.length} Fragen</div>
        </button>
      </div>
    `;
  }).join('');
}

function buildOptionHelp(option) {
  return option.helpText ? `<span>${escapeHtml(option.helpText)}</span>` : '';
}

function renderSingleSelect(question, value) {
  const options = question.options || [];
  return `
    <div class="option-list">
      ${options.map((option) => `
        <label class="option-input">
          <input
            type="radio"
            name="${escapeHtml(question.id)}"
            value="${escapeHtml(option.value)}"
            ${value === option.value ? 'checked' : ''}
          />
          <span class="option-copy">
            <strong>${escapeHtml(option.label)}</strong>
            ${buildOptionHelp(option)}
          </span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderBoolean(question, value) {
  return renderSingleSelect({
    ...question,
    options: [
      { value: 'true', label: 'Ja' },
      { value: 'false', label: 'Nein' },
    ],
  }, value === true ? 'true' : value === false ? 'false' : null);
}

function renderMultiSelect(question, value) {
  const selected = new Set(Array.isArray(value) ? value : []);
  return `
    <div class="option-list">
      ${(question.options || []).map((option) => `
        <label class="option-input">
          <input
            type="checkbox"
            name="${escapeHtml(question.id)}"
            value="${escapeHtml(option.value)}"
            ${selected.has(option.value) ? 'checked' : ''}
          />
          <span class="option-copy">
            <strong>${escapeHtml(option.label)}</strong>
            ${buildOptionHelp(option)}
          </span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderTextInput(question, value, inputType = 'text') {
  return `
    <input
      class="field-input"
      type="${escapeHtml(inputType)}"
      name="${escapeHtml(question.id)}"
      value="${escapeHtml(value ?? '')}"
    />
  `;
}

function renderQuestionField(question, value) {
  if (question.type === 'singleSelect') return renderSingleSelect(question, value);
  if (question.type === 'multiSelect') return renderMultiSelect(question, value);
  if (question.type === 'boolean') return renderBoolean(question, value);
  if (question.type === 'date') return renderTextInput(question, value, 'date');
  if (question.type === 'number') return renderTextInput(question, value, 'number');
  return renderTextInput(question, value, 'text');
}

function renderScreenCard() {
  const screen = getCurrentScreen();

  if (!screen) {
    elements.screenCard.innerHTML = `
      <div class="screen-header">
        <div>
          <p class="eyebrow">Fragebogen</p>
          <h2 class="screen-title">Keine offene Screen-Auswahl</h2>
        </div>
      </div>
      <p class="empty-note">Sobald ein Flow sichtbar ist, erscheint hier der passende Fragenblock.</p>
    `;
    return;
  }

  const screenIndex = getVisibleScreens().findIndex((item) => item.id === screen.id);
  const isEditingCompleted = isResultState() && screen.isCompleted;
  const actionLabel = isResultState() ? 'Ergebnis neu berechnen' : 'Weiter';

  elements.screenCard.innerHTML = `
    <div class="screen-header">
      <div>
        <p class="eyebrow">Fragebogen · Schritt ${screenIndex + 1}</p>
        <h2 class="screen-title">${escapeHtml(screen.title)}</h2>
        <p class="hero-copy">${isEditingCompleted ? 'Du kannst abgeschlossene Angaben direkt ändern und die Auswertung neu rechnen.' : 'Nur die sichtbaren Fragen des aktuellen Screens werden hier gezeigt.'}</p>
      </div>
      <div class="screen-actions">
        <button type="button" class="secondary-button" data-back-button ${screenIndex <= 0 ? 'disabled' : ''}>Zurück</button>
      </div>
    </div>

    <form id="screen-form">
      <div class="question-list">
        ${screen.questions.map((question) => `
          <section class="question-card">
            <label class="question-label" for="field-${escapeHtml(question.id)}">${escapeHtml(question.label)}</label>
            ${question.helpText ? `<p class="question-help">${escapeHtml(question.helpText)}</p>` : ''}
            ${renderQuestionField(question, state.answers[question.id])}
          </section>
        `).join('')}
      </div>

      <div class="form-footer">
        <div class="muted">${screen.questions.length} sichtbare Fragen · Antworten bleiben lokal im Browser, bis du neu startest.</div>
        <button type="submit" class="primary-button">${escapeHtml(actionLabel)}</button>
      </div>
    </form>
  `;
}

function renderMetaCards() {
  const cards = [];
  const telemetry = state.view?.telemetry;
  const track = state.view?.result?.synthesisDecision?.primaryTrack;
  const riskLevel = state.view?.result?.caseSnapshot?.riskLevel;

  if (track) cards.push({ label: 'Primärer Track', value: track });
  if (riskLevel) cards.push({ label: 'Risikolevel', value: riskLevel });
  if (telemetry?.deadlinesCount != null) cards.push({ label: 'Fristen', value: String(telemetry.deadlinesCount) });
  if (telemetry?.redFlagsCount != null) cards.push({ label: 'Red Flags', value: String(telemetry.redFlagsCount) });
  if (telemetry?.topActionsCount != null) cards.push({ label: 'Top Actions', value: String(telemetry.topActionsCount) });

  if (cards.length === 0) return '';

  return `
    <div class="result-meta">
      ${cards.map((card) => `
        <div class="meta-card">
          <span class="meta-label">${escapeHtml(card.label)}</span>
          <span class="meta-value">${escapeHtml(card.value)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderListSection(title, items) {
  if (!items || items.length === 0) return '';
  return `
    <section class="result-section">
      <h3>${escapeHtml(title)}</h3>
      <ul class="result-list">
        ${items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `;
}

function formatAction(action) {
  return `<strong>${escapeHtml(action.label)}</strong> — ${escapeHtml(action.why)}`;
}

function formatDeadline(deadline) {
  const note = deadline.note ? ` — Hinweis: ${escapeHtml(deadline.note)}` : '';
  return `<strong>${escapeHtml(deadline.label)}</strong>: ${escapeHtml(deadline.timing)}${note}`;
}

function formatRedFlag(redFlag) {
  const escalation = redFlag.recommendedEscalation ? ` Nächster sinnvoller Schritt: ${escapeHtml(redFlag.recommendedEscalation)}.` : '';
  return `<strong>${escapeHtml(redFlag.label)}</strong> — ${escapeHtml(redFlag.whyEscalated)}${escalation}`;
}

function formatRiskFlag(riskFlag) {
  return `<strong>${escapeHtml(riskFlag.label)}</strong> — ${escapeHtml(riskFlag.description)}`;
}

function formatDocument(documentItem) {
  return `<strong>${escapeHtml(documentItem.label)}</strong> (${escapeHtml(documentItem.status)}) — ${escapeHtml(documentItem.reason)}`;
}

function renderResultSections() {
  const projected = state.view?.projected;
  if (!projected) return '';

  return `
    <div class="result-sections">
      ${renderListSection('Als Erstes', projected.topAction ? [formatAction(projected.topAction)] : [])}
      ${renderListSection('Danach', (projected.topActions || []).slice(1).map(formatAction))}
      ${renderListSection('Fristen', (projected.deadlines || []).map(formatDeadline))}
      ${renderListSection('Besonders wichtig', (projected.redFlags || []).map(formatRedFlag))}
      ${renderListSection('Risiken', (projected.riskFlags || []).map(formatRiskFlag))}
      ${renderListSection('Unterlagen', (projected.documentChecklist || []).map(formatDocument))}
      ${renderListSection('Fragen für Beratung', (projected.advisorQuestions || []).map((item) => escapeHtml(item)))}
      ${renderListSection('Chancen', (projected.opportunities || []).map((item) => `<strong>${escapeHtml(item.label)}</strong> — ${escapeHtml(item.description)}`))}
      ${renderListSection('Hinweise', (projected.disclaimers || []).map((item) => escapeHtml(item)))}
    </div>
  `;
}

function renderReadyResult() {
  const projected = state.view?.projected;
  const headline = projected?.caseSnapshot?.headline || 'Auswertung bereit';
  const situation = projected?.caseSnapshot?.situation || state.view?.message || 'Die Runtime hat eine belastbare Ergebnisansicht gebaut.';
  const fallbackNotice = state.view?.status === 'render-fallback'
    ? `
      <section class="result-section fallback-callout">
        <h3>Render-Fallback aktiv</h3>
        <p class="detail-copy">Die Textansicht fehlt gerade. Für Demo, Review und Gegencheck bleibt die strukturierte Auswertung unten bewusst sichtbar.</p>
      </section>
    `
    : '';

  elements.resultCard.innerHTML = `
    <div class="result-header">
      <div>
        <p class="eyebrow">Ergebnis</p>
        <h2 class="result-title">${escapeHtml(headline)}</h2>
        <p class="result-lead">${escapeHtml(situation)}</p>
      </div>
      <div class="result-actions">
        <button type="button" class="secondary-button" data-jump-next>${isResultState() ? 'Zur letzten Frage springen' : 'Offene Frage zeigen'}</button>
      </div>
    </div>
    ${fallbackNotice}
    ${renderMetaCards()}
    ${renderResultSections()}
    ${state.view?.rendered ? `<section class="result-section"><h3>Textansicht</h3><pre class="rendered-block">${escapeHtml(state.view.rendered)}</pre></section>` : ''}
  `;
}

function renderIncompleteResult() {
  const firstMissing = state.view?.missingAnswers?.[0];
  const flowAbandonment = state.view?.telemetry?.flowAbandonment;
  const details = [];
  const missingAnswers = state.view?.missingAnswers || [];

  if (firstMissing) details.push(`Nächste Pflichtangabe: ${firstMissing.label}`);
  if (flowAbandonment?.trackContext) details.push(`Kontext: ${flowAbandonment.trackContext}`);
  if (flowAbandonment?.hadKnownDeadlineDate) details.push('Es ist bereits ein relevantes Datumsfeld gesetzt.');
  if (flowAbandonment?.hadRedFlag) details.push('Achtung: Im bisherigen Stand ist mindestens ein Red-Flag-Signal sichtbar.');

  elements.resultCard.innerHTML = `
    <div class="result-header">
      <div>
        <p class="eyebrow">Ergebnis</p>
        <h2 class="result-title">Noch nicht rechenbar</h2>
        <p class="result-lead">${escapeHtml(state.view?.message || 'Es fehlen noch Angaben, bevor die Runtime eine fertige Auswertung bauen kann.')}</p>
      </div>
      <div class="result-actions">
        <button type="button" class="secondary-button" data-jump-next ${firstMissing ? '' : 'disabled'}>Zur nächsten Pflichtangabe</button>
      </div>
    </div>
    <div class="summary-sections">
      <section class="summary-card incomplete-summary-card">
        <h3>Was jetzt fehlt</h3>
        <ul class="result-list">
          ${missingAnswers.map((item) => `<li><strong>${escapeHtml(item.label)}</strong><span class="inline-note"> · ${escapeHtml(item.screenTitle)}</span></li>`).join('') || '<li>Die Runtime wartet auf Pflichtangaben im aktuellen Flow-Schritt.</li>'}
        </ul>
      </section>
      <section class="summary-card">
        <h3>Warum gestoppt wurde</h3>
        <ul class="result-list">
          ${details.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Die Runtime wartet auf Pflichtangaben im aktuellen Flow-Schritt.</li>'}
        </ul>
      </section>
    </div>
  `;
}

function renderErrorResult() {
  elements.resultCard.innerHTML = `
    <div class="result-header">
      <div>
        <p class="eyebrow">Ergebnis</p>
        <h2 class="result-title">Runtime-Fehler</h2>
        <p class="result-lead">${escapeHtml(state.view?.error?.message || 'Die Weboberfläche konnte gerade keinen gültigen View-State holen.')}</p>
      </div>
      <div class="result-actions">
        <button type="button" class="secondary-button" data-retry>Neu laden</button>
      </div>
    </div>
  `;
}

function renderResultCard() {
  if (state.loading) {
    elements.resultCard.innerHTML = `
      <div class="result-header">
        <div>
          <p class="eyebrow">Ergebnis</p>
          <h2 class="result-title">Lädt …</h2>
          <p class="result-lead">Die Runtime rechnet den aktuellen Stand neu.</p>
        </div>
      </div>
    `;
    return;
  }

  if (state.view?.status === 'error') {
    renderErrorResult();
    return;
  }

  if (isResultState()) {
    renderReadyResult();
    return;
  }

  renderIncompleteResult();
}

function collectAnswerValue(formData, question) {
  if (question.type === 'multiSelect') {
    return formData.getAll(question.id).filter(Boolean);
  }

  const raw = formData.get(question.id);

  if (raw == null || raw === '') {
    return null;
  }

  if (question.type === 'boolean') {
    return raw === 'true';
  }

  if (question.type === 'number') {
    return Number(raw);
  }

  return raw;
}

function applyScreenAnswers(form) {
  const formData = new FormData(form);
  const screen = getCurrentScreen();
  if (!screen) return;

  for (const question of screen.questions) {
    const value = collectAnswerValue(formData, question);
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      delete state.answers[question.id];
      continue;
    }
    state.answers[question.id] = value;
  }
}

function renderExamples() {
  elements.exampleButtons.innerHTML = state.examples.map((example) => `
    <button type="button" class="example-button" data-load-example="${escapeHtml(example.id)}">${escapeHtml(example.label)}</button>
  `).join('');
}

function renderTierSelect() {
  elements.tierSelect.innerHTML = state.tierOptions.map((tier) => `
    <option value="${escapeHtml(tier)}" ${tier === state.tier ? 'selected' : ''}>${escapeHtml(prettifyTier(tier))}</option>
  `).join('');
}

function render() {
  renderTierSelect();
  renderExamples();
  renderProgress();
  renderStatus();
  renderWarnings();
  renderScreenCard();
  renderResultCard();
}

async function init() {
  const bootstrap = await fetchJson('/api/bootstrap');
  state.app = bootstrap.app;
  state.examples = bootstrap.examples || [];
  state.tier = bootstrap.defaultTier || 'base';
  state.tierOptions = bootstrap.tierOptions || ['preview', 'base', 'upgrade'];
  state.view = bootstrap.initialView;
  state.answers = {};
  syncDisplayScreen();
  render();
}

function jumpToPreviousScreen() {
  const screens = getVisibleScreens();
  const currentIndex = screens.findIndex((screen) => screen.id === state.displayScreenId);
  if (currentIndex > 0) {
    state.displayScreenId = screens[currentIndex - 1].id;
    render();
  }
}

function jumpToNextInterestingScreen() {
  const nextId = state.view?.flowState?.nextScreen?.id || getVisibleScreens()[getVisibleScreens().length - 1]?.id || null;
  if (!nextId) return;
  state.displayScreenId = nextId;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-load-example], [data-jump-screen], [data-back-button], [data-jump-next], [data-retry]');
  if (!button) return;

  if (button.hasAttribute('data-load-example')) {
    const exampleId = button.getAttribute('data-load-example');
    const example = state.examples.find((item) => item.id === exampleId);
    if (!example) return;
    state.answers = clone(example.answers);
    await refreshView();
    return;
  }

  if (button.hasAttribute('data-jump-screen')) {
    state.displayScreenId = button.getAttribute('data-jump-screen');
    render();
    return;
  }

  if (button.hasAttribute('data-back-button')) {
    jumpToPreviousScreen();
    return;
  }

  if (button.hasAttribute('data-jump-next')) {
    jumpToNextInterestingScreen();
    return;
  }

  if (button.hasAttribute('data-retry')) {
    await refreshView();
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('#screen-form');
  if (!form) return;

  event.preventDefault();
  applyScreenAnswers(form);
  await refreshView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

elements.tierSelect.addEventListener('change', async (event) => {
  state.tier = event.target.value;
  await refreshView();
});

elements.resetButton.addEventListener('click', async () => {
  state.answers = {};
  state.displayScreenId = null;
  await refreshView();
});

init().catch((error) => {
  state.view = {
    status: 'error',
    error: {
      code: 'bootstrap_failed',
      message: error.message,
    },
    warnings: [],
  };
  render();
});
