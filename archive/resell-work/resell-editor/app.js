const elements = {
  fileInput: document.getElementById('fileInput'), imageGrid: document.getElementById('imageGrid'), statusText: document.getElementById('statusText'), downloadAllBtn: document.getElementById('downloadAllBtn'), resetBtn: document.getElementById('resetBtn'),
  brightness: document.getElementById('brightness'), contrast: document.getElementById('contrast'), shadows: document.getElementById('shadows'), saturation: document.getElementById('saturation'), warmth: document.getElementById('warmth'), sharpness: document.getElementById('sharpness'), blackPoint: document.getElementById('blackPoint'),
  brightnessValue: document.getElementById('brightnessValue'), contrastValue: document.getElementById('contrastValue'), shadowsValue: document.getElementById('shadowsValue'), saturationValue: document.getElementById('saturationValue'), warmthValue: document.getElementById('warmthValue'), sharpnessValue: document.getElementById('sharpnessValue'), blackPointValue: document.getElementById('blackPointValue'),
  selectAllBtn: document.getElementById('selectAllBtn'), clearSelectionBtn: document.getElementById('clearSelectionBtn'), filter34: document.getElementById('filter34'), filter43: document.getElementById('filter43'), metaSummary: document.getElementById('metaSummary'), previewModeCompare: document.getElementById('previewModeCompare'), previewModeAfterOnly: document.getElementById('previewModeAfterOnly'),
  resellForm: document.getElementById('resellForm'), generateBriefBtn: document.getElementById('generateBriefBtn'), vintedTitleOutput: document.getElementById('vintedTitleOutput'), vintedTextOutput: document.getElementById('vintedTextOutput'), kaTitleOutput: document.getElementById('kaTitleOutput'), kaTextOutput: document.getElementById('kaTextOutput'), copyVintedBtn: document.getElementById('copyVintedBtn'), copyKaBtn: document.getElementById('copyKaBtn'), nextProductBtn: document.getElementById('nextProductBtn'),
  lightbox: document.getElementById('lightbox'), lightboxCanvas: document.getElementById('lightboxCanvas'), lightboxTitle: document.getElementById('lightboxTitle'), lightboxMeta: document.getElementById('lightboxMeta'), closeLightboxBtn: document.getElementById('closeLightboxBtn'), toggleCropBtn: document.getElementById('toggleCropBtn'), applyCropBtn: document.getElementById('applyCropBtn'), resetCropBtn: document.getElementById('resetCropBtn'), cropOverlay: document.getElementById('cropOverlay'), cropRect: document.getElementById('cropRect'), cropRatioSelect: document.getElementById('cropRatioSelect'), duplicateBtn: document.getElementById('duplicateBtn'), removeBtn: document.getElementById('removeBtn'), reverseSearchBtn: document.getElementById('reverseSearchBtn'),
};
const defaultSettings = { brightness: 100, contrast: 100, shadows: 0, saturation: 100, warmth: 0, sharpness: 0, blackPoint: 0 };
const presets = { natural: { brightness: 102, contrast: 103, shadows: 4, saturation: 102, warmth: 0, sharpness: 4, blackPoint: 2 }, bright: { brightness: 108, contrast: 102, shadows: 8, saturation: 100, warmth: 2, sharpness: 3, blackPoint: 0 }, depth: { brightness: 100, contrast: 108, shadows: 2, saturation: 102, warmth: 0, sharpness: 6, blackPoint: 10 }, jewelry: { brightness: 103, contrast: 110, shadows: 4, saturation: 106, warmth: -2, sharpness: 10, blackPoint: 12 } };
const state = { images: [], settings: { ...defaultSettings }, selectedIds: new Set(), filters: { '3:4': true, '4:3': true }, lightboxImageId: null, cropMode: false, cropRect: { x: 0.15, y: 0.1, w: 0.7, h: 0.8 }, cropDrag: null, cropRatio: 'free', previewMode: 'compare' };
const clamp = (v, min = 0, max = 255) => Math.max(min, Math.min(max, v));
const ratioLabel = (w, h) => Math.abs(w / h - 3 / 4) < 0.03 ? '3:4' : Math.abs(w / h - 4 / 3) < 0.03 ? '4:3' : 'sonst';
const getCheckedValues = (selector) => [...document.querySelectorAll(selector)].filter((el) => el.checked).map((el) => el.value);
const getRadioValue = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';
const normalizeField = (value) => {
  const v = (value || '').trim();
  return !v || v === '-' || v === '–' ? '' : v;
};
const joinClean = (...parts) => parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
const sentence = (text) => {
  const t = (text || '').trim();
  if (!t) return '';
  return /[.!?]$/.test(t) ? t : `${t}.`;
};
const titleCase = (text) => (text || '').replace(/\s+/g, ' ').trim();
const formatEuro = (text) => text ? text.replace(/\s+/g, ' ').trim() : '';
function updateControlLabels() { elements.brightnessValue.textContent = `${state.settings.brightness}%`; elements.contrastValue.textContent = `${state.settings.contrast}%`; elements.shadowsValue.textContent = `${state.settings.shadows}`; elements.saturationValue.textContent = `${state.settings.saturation}%`; elements.warmthValue.textContent = `${state.settings.warmth}`; elements.sharpnessValue.textContent = `${state.settings.sharpness}`; elements.blackPointValue.textContent = `${state.settings.blackPoint}`; }
function syncControlsFromState() { Object.entries(state.settings).forEach(([k, v]) => elements[k] && (elements[k].value = v)); updateControlLabels(); elements.filter34.checked = state.filters['3:4']; elements.filter43.checked = state.filters['4:3']; elements.cropRatioSelect.value = state.cropRatio; elements.previewModeCompare.classList.toggle('active', state.previewMode === 'compare'); elements.previewModeAfterOnly.classList.toggle('active', state.previewMode === 'after'); }
function cloneCanvas(source) { const c = document.createElement('canvas'); c.width = source.width; c.height = source.height; c.getContext('2d').drawImage(source, 0, 0); return c; }
function applySharpen(sourceCanvas, amount) { const width = sourceCanvas.width, height = sourceCanvas.height; const srcCtx = sourceCanvas.getContext('2d', { willReadFrequently: true }); const srcData = srcCtx.getImageData(0, 0, width, height); const dstCanvas = document.createElement('canvas'); dstCanvas.width = width; dstCanvas.height = height; const dstCtx = dstCanvas.getContext('2d', { willReadFrequently: true }); const dstData = dstCtx.createImageData(width, height); const s = srcData.data, d = dstData.data, kernel = [0,-1,0,-1,5,-1,0,-1,0]; for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) { const idx = (y * width + x) * 4; for (let c = 0; c < 3; c++) { let sum = 0, k = 0; for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++) sum += s[((y + ky) * width + (x + kx)) * 4 + c] * kernel[k++]; d[idx + c] = clamp(s[idx + c] * (1 - amount) + sum * amount); } d[idx + 3] = s[idx + 3]; } dstCtx.putImageData(dstData, 0, 0); return dstCanvas; }
function applyImageAdjustments(sourceCanvas, settings) { const canvas = cloneCanvas(sourceCanvas); const ctx = canvas.getContext('2d', { willReadFrequently: true }); const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); const data = imageData.data; const brightnessOffset = (settings.brightness - 100) * 2.55, contrastFactor = settings.contrast / 100, saturationFactor = settings.saturation / 100, warmth = settings.warmth, shadowLift = settings.shadows * 1.4, blackPoint = settings.blackPoint; for (let i = 0; i < data.length; i += 4) { let r = data[i], g = data[i + 1], b = data[i + 2]; const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b, shadowWeight = Math.max(0, 1 - luminance / 140), darkWeight = Math.max(0, 1 - luminance / 90); r += brightnessOffset; g += brightnessOffset; b += brightnessOffset; r += shadowLift * shadowWeight; g += shadowLift * shadowWeight; b += shadowLift * shadowWeight; r = ((r - 128) * contrastFactor) + 128; g = ((g - 128) * contrastFactor) + 128; b = ((b - 128) * contrastFactor) + 128; const gray = 0.299 * r + 0.587 * g + 0.114 * b; const boostedSaturation = saturationFactor + (blackPoint / 180) * darkWeight; r = gray + (r - gray) * boostedSaturation; g = gray + (g - gray) * boostedSaturation; b = gray + (b - gray) * boostedSaturation; const blackCompression = blackPoint * 0.7 * darkWeight; r -= blackCompression; g -= blackCompression; b -= blackCompression; r += warmth * 0.9; g += warmth * 0.15; b -= warmth * 0.9; data[i] = clamp(r); data[i + 1] = clamp(g); data[i + 2] = clamp(b); } ctx.putImageData(imageData, 0, 0); return settings.sharpness > 0 ? applySharpen(canvas, settings.sharpness / 100) : canvas; }
const getTargetIds = () => state.selectedIds.size ? new Set([...state.selectedIds].filter((id) => getImageById(id) && isVisible(getImageById(id)))) : new Set(state.images.filter(isVisible).map((img) => img.id));
const getImageById = (id) => state.images.find((img) => img.id === id);
const isVisible = (img) => state.filters[img.format];
function updateMetaSummary() { const visible = state.images.filter(isVisible), total = state.images.length, selectedVisible = [...state.selectedIds].filter((id) => { const img = getImageById(id); return img && isVisible(img); }).length; elements.metaSummary.innerHTML = `<div><span>Bilder gesamt</span><strong>${total}</strong></div><div><span>Sichtbar</span><strong>${visible.length}</strong></div><div><span>Ausgewählt</span><strong>${selectedVisible}</strong></div><div><span>Vorschau</span><strong>${state.previewMode === 'compare' ? 'Vorher/Nachher' : 'Nur Nachher'}</strong></div>`; }
function updateSelectionButtons() { const visible = state.images.filter(isVisible); elements.selectAllBtn.disabled = !visible.length; elements.clearSelectionBtn.disabled = !state.selectedIds.size; }
function renderGrid() { const visibleImages = state.images.filter(isVisible); if (!visibleImages.length) { elements.imageGrid.classList.add('empty'); elements.imageGrid.innerHTML = `<div class="empty-state glass"><div class="empty-logo">✦</div><h3>Keine sichtbaren Bilder</h3><p>Passe die Formatfilter an oder lade Bilder hoch.</p></div>`; } else { elements.imageGrid.classList.remove('empty'); elements.imageGrid.innerHTML = ''; visibleImages.forEach((entry) => { const card = document.createElement('article'); card.className = 'image-card'; if (state.selectedIds.has(entry.id)) card.classList.add('selected'); const frame = document.createElement('div'); frame.className = 'image-frame'; const beforeCanvas = document.createElement('canvas'), afterCanvas = document.createElement('canvas'); beforeCanvas.className = 'preview-canvas'; afterCanvas.className = 'preview-canvas'; const r = Math.min(320 / entry.processed.width, 320 / entry.processed.height, 1), w = Math.round(entry.processed.width * r), h = Math.round(entry.processed.height * r); beforeCanvas.width = w; beforeCanvas.height = h; beforeCanvas.getContext('2d').drawImage(entry.original, 0, 0, w, h); afterCanvas.width = w; afterCanvas.height = h; afterCanvas.getContext('2d').drawImage(entry.processed, 0, 0, w, h); const compare = document.createElement('div'); compare.className = `compare-wrap ${state.previewMode === 'after' ? 'after-only' : ''}`; const pb = document.createElement('div'); pb.className = 'compare-panel before-panel'; pb.innerHTML = '<span class="compare-label">Vorher</span>'; pb.appendChild(beforeCanvas); const pa = document.createElement('div'); pa.className = 'compare-panel'; pa.innerHTML = '<span class="compare-label">Nachher</span>'; pa.appendChild(afterCanvas); compare.append(pb, pa); frame.appendChild(compare); const meta = document.createElement('div'); meta.className = 'image-meta'; meta.innerHTML = `<div class="image-name">${entry.file.name}</div><div class="image-info">${entry.original.width} × ${entry.original.height}</div><div class="image-info">Format: ${entry.format}</div><div class="image-info">${state.selectedIds.has(entry.id) ? 'Ausgewählt' : 'Nicht ausgewählt'}</div>`; card.addEventListener('click', () => toggleSelection(entry.id)); card.addEventListener('dblclick', (ev) => { ev.stopPropagation(); openLightbox(entry.id); }); card.append(frame, meta); elements.imageGrid.appendChild(card); }); } const selectionText = state.selectedIds.size ? `${state.selectedIds.size} ausgewählt · Regler wirken nur auf die sichtbare Auswahl.` : 'Keine Auswahl aktiv · Regler wirken auf alle sichtbaren Bilder.'; elements.statusText.textContent = `${visibleImages.length}/${state.images.length} Bilder sichtbar. ${selectionText}`; elements.downloadAllBtn.disabled = !visibleImages.length; elements.resetBtn.disabled = !state.images.length; updateSelectionButtons(); updateMetaSummary(); }
function processTargetImages() { const targetIds = getTargetIds(); state.images = state.images.map((entry) => targetIds.has(entry.id) ? { ...entry, processed: applyImageAdjustments(entry.original, state.settings) } : entry); renderGrid(); if (state.lightboxImageId) renderLightbox(); }
async function fileToCanvas(file) { const bitmap = await createImageBitmap(file); const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height; canvas.getContext('2d', { willReadFrequently: true }).drawImage(bitmap, 0, 0); bitmap.close(); return canvas; }
async function handleFiles(fileList) { const files = [...fileList].filter((file) => file.type.startsWith('image/')); if (!files.length) return; elements.statusText.textContent = 'Bilder werden geladen …'; const loaded = []; for (const [index, file] of files.entries()) { const original = await fileToCanvas(file); loaded.push({ id: `${file.name}-${index}-${Date.now()}`, file, original, processed: applyImageAdjustments(original, state.settings), format: ratioLabel(original.width, original.height) }); } state.images = loaded; state.selectedIds.clear(); closeLightbox(); renderGrid(); }
async function chooseDirectoryAndSave() { const visibleImages = state.images.filter(isVisible); if ('showDirectoryPicker' in window) { try { const dirHandle = await window.showDirectoryPicker(); for (const entry of visibleImages) { const fh = await dirHandle.getFileHandle(entry.file.name.replace(/\.[^.]+$/, '') + '_bearbeitet.jpg', { create: true }); const wr = await fh.createWritable(); const blob = await new Promise((resolve) => entry.processed.toBlob(resolve, 'image/jpeg', 0.95)); await wr.write(blob); await wr.close(); } elements.statusText.textContent = 'Sichtbare Bilder im gewählten Ordner gespeichert.'; return true; } catch { return false; } } return false; }
function downloadCanvas(canvas, filename) { canvas.toBlob((blob) => { if (!blob) return; const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }, 'image/jpeg', 0.95); }
async function downloadAll() { const visibleImages = state.images.filter(isVisible); const saved = await chooseDirectoryAndSave(); if (saved) return; visibleImages.forEach((entry) => downloadCanvas(entry.processed, entry.file.name.replace(/\.[^.]+$/, '') + '_bearbeitet.jpg')); elements.statusText.textContent = 'Browser ohne Zielordner-Picker – sichtbare Bilder wurden heruntergeladen.'; }
function resetAll() { state.settings = { ...defaultSettings }; syncControlsFromState(); processTargetImages(); }
function applyPreset(name) { const preset = presets[name]; if (!preset) return; state.settings = { ...state.settings, ...preset }; syncControlsFromState(); processTargetImages(); }
function collectFormData() {
  return {
    platforms: getCheckedValues('input[name="platforms"]'),
    listingCategory: normalizeField(document.getElementById('listingCategory').value) || 'auto',
    productType: normalizeField(document.getElementById('productTypeCustom').value),
    brand: normalizeField(document.getElementById('brand').value),
    model: normalizeField(document.getElementById('model').value),
    color: normalizeField(document.getElementById('color').value),
    material: normalizeField(document.getElementById('material').value),
    size: normalizeField(document.getElementById('size').value),
    specs: normalizeField(document.getElementById('specs').value),
    completeness: normalizeField(document.getElementById('completeness').value),
    targetGroup: normalizeField(getRadioValue('targetGroup')),
    condition: normalizeField(getRadioValue('condition')),
    defects: normalizeField(document.getElementById('defects').value),
    delivery: normalizeField(document.getElementById('delivery').value),
    shipping: normalizeField(getRadioValue('shipping')),
    priceFeeling: normalizeField(document.getElementById('priceFeeling').value),
    keywords: normalizeField(document.getElementById('keywords').value),
    extraInfo: normalizeField(document.getElementById('extraInfo').value),
  };
}

function buildKeywordPool(d) {
  const parts = [d.brand, d.model, d.productType, d.color, d.material, d.keywords]
    .filter(Boolean)
    .flatMap((x) => x.split(/[,/]|\s-\s|\s·\s/))
    .map((x) => x.trim())
    .filter(Boolean);
  return [...new Set(parts)];
}

function pickPrimaryNouns(d) {
  return [d.model, d.productType, d.keywords?.split(',')[0]?.trim(), d.material].filter(Boolean);
}

function splitTerms(value) {
  return (value || '')
    .split(/[,/]|\s-\s|\s·\s/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function sanitizeWhitespace(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function stripSpammyTokens(text) {
  return sanitizeWhitespace(text)
    .replace(/[!]{2,}/g, '!')
    .replace(/[#]{2,}/g, '#')
    .replace(/\b(wow|viral|must ?have|fyp|luxury)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function dedupeTokens(parts) {
  const seen = new Set();
  return parts.filter((part) => {
    const key = sanitizeWhitespace(part).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeTokenSignature(text) {
  return sanitizeWhitespace(text)
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasMeaningfulContent(text) {
  const value = sanitizeWhitespace(text);
  if (!value) return false;
  return normalizeTokenSignature(value).length >= 3;
}

function dedupeSmart(parts) {
  const seen = [];
  return parts.filter((part) => {
    const value = sanitizeWhitespace(part);
    const signature = normalizeTokenSignature(value);
    if (!signature) return false;
    const duplicate = seen.some((known) => known === signature || known.includes(signature) || signature.includes(known));
    if (duplicate) return false;
    seen.push(signature);
    return true;
  });
}

function fallbackProductType(d) {
  const category = inferListingCategory(d);
  const signalText = [d.specs, d.keywords, d.extraInfo, d.completeness, d.color, d.material]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (category === 'fashion') {
    if (/(jacke|hose|kleid|shirt|t-shirt|pullover|hoodie|mantel|bluse|rock|jeans|sneaker|schuh|tasche)/.test(signalText)) return 'Kleidungsstück';
    return 'Kleidungsstück';
  }
  if (category === 'tech') {
    if (/(kabel|ladegerät|usb|akku|batterie|bluetooth|display|case|hülle|adapter|kopfhörer|speaker)/.test(signalText)) return 'Technikartikel';
    return 'Technikartikel';
  }
  if (category === 'media') {
    if (/(buch|roman|comic|manga|isbn|autor)/.test(signalText)) return 'Buch';
    if (/(dvd|blu-ray|bluray|film)/.test(signalText)) return 'Film';
    if (/(spiel|game|konsole)/.test(signalText)) return 'Spiel';
    return 'Medium';
  }
  if (category === 'sport') return 'Sportartikel';
  if (category === 'kids') return 'Kinderartikel';
  if (category === 'home') return 'Wohnartikel';
  return 'Artikel';
}

function describeProduct(d) {
  return sanitizeWhitespace(d.productType || d.model || fallbackProductType(d));
}

function cleanBrand(brand) {
  const value = sanitizeWhitespace(brand);
  return value && !/^keine marke$/i.test(value) ? value : '';
}

function maybeConditionSignal(condition) {
  const map = {
    'Neu': 'neu',
    'Wie neu': 'neuwertig',
    'Sehr gut': 'sehr gut',
    'Gut': 'guter Zustand',
    'Gebraucht': 'gebraucht',
  };
  return map[condition] || '';
}

function buildFeatureList(d) {
  return dedupeTokens([
    ...splitTerms(d.material),
    ...splitTerms(d.specs),
    ...splitTerms(d.keywords),
    d.color,
    d.completeness,
  ]).filter(Boolean);
}

function inferListingCategory(d) {
  if (d.listingCategory && d.listingCategory !== 'auto') return d.listingCategory;

  const text = [
    d.productType,
    d.model,
    d.specs,
    d.keywords,
    d.extraInfo,
    d.brand,
  ].filter(Boolean).join(' ').toLowerCase();

  if (/(schuh|sneaker|jacke|hose|kleid|shirt|pullover|tasche|rucksack|ring|kette|armband|gürtel|hoodie|mantel)/.test(text)) {
    return 'fashion';
  }
  if (/(powerbank|handy|smartphone|iphone|android|laptop|macbook|tablet|kamera|kopfhörer|speaker|akku|ladegerät|usb|bluetooth|router)/.test(text)) {
    return 'tech';
  }
  if (/(buch|roman|comic|manga|dvd|blu-ray|spiel|brettspiel|konsole|autor|isbn)/.test(text)) {
    return 'media';
  }
  if (/(kind|kinder|schule|malfarbe|malen|spielzeug|bastel|kreativ|stifte|schulranzen)/.test(text)) {
    return 'kids';
  }
  if (/(kletter|gurt|hantel|gewichtsweste|fahrrad|outdoor|zelt|rucksack|helm|sport)/.test(text)) {
    return 'sport';
  }
  if (/(stuhl|tisch|lampe|regal|sofa|kissen|deko|küche|haushalt|home|möbel)/.test(text)) {
    return 'home';
  }
  return 'other';
}

function getTitlePriority(platform, category) {
  const priorities = {
    vinted: {
      fashion: ['brand', 'productType', 'model', 'size', 'color', 'condition'],
      tech: ['brand', 'model', 'productType', 'specs', 'condition', 'color'],
      home: ['brand', 'productType', 'model', 'size', 'material', 'condition'],
      sport: ['brand', 'productType', 'model', 'size', 'specs', 'condition'],
      media: ['productType', 'model', 'specs', 'condition'],
      kids: ['brand', 'productType', 'model', 'specs', 'condition'],
      other: ['brand', 'productType', 'model', 'condition'],
    },
    kleinanzeigen: {
      fashion: ['productType', 'brand', 'model', 'size', 'color', 'condition'],
      tech: ['productType', 'brand', 'model', 'specs', 'condition', 'color'],
      home: ['productType', 'brand', 'model', 'size', 'material', 'condition'],
      sport: ['productType', 'brand', 'model', 'size', 'specs', 'condition'],
      media: ['productType', 'model', 'specs', 'condition'],
      kids: ['productType', 'brand', 'model', 'specs', 'condition'],
      other: ['productType', 'brand', 'model', 'condition'],
    },
  };
  return priorities[platform]?.[category] || ['productType', 'brand', 'model', 'condition'];
}

function getFieldValue(d, key) {
  const map = {
    brand: cleanBrand(d.brand),
    productType: d.productType,
    model: d.model && d.model !== d.productType ? d.model : '',
    size: d.size,
    color: d.color,
    material: d.material,
    specs: d.specs,
    completeness: d.completeness,
    condition: maybeConditionSignal(d.condition),
  };
  return map[key] || '';
}

function composeTitle(parts, maxLen) {
  const cleaned = dedupeSmart(parts.map(stripSpammyTokens).filter(hasMeaningfulContent));
  let out = '';
  for (const part of cleaned) {
    const candidate = sanitizeWhitespace(`${out} ${part}`);
    if (!candidate) continue;
    if (candidate.length <= maxLen) {
      out = candidate;
      continue;
    }
    if (!out) out = candidate.slice(0, maxLen).trim();
    break;
  }
  return titleCase(out || 'Artikel');
}

function buildTitleParts(baseParts, detailParts = []) {
  const base = dedupeSmart(baseParts.filter(hasMeaningfulContent));
  const details = dedupeSmart(detailParts.filter(hasMeaningfulContent)).filter((part) => {
    const sig = normalizeTokenSignature(part);
    return !base.some((basePart) => {
      const baseSig = normalizeTokenSignature(basePart);
      return baseSig === sig || baseSig.includes(sig) || sig.includes(baseSig);
    });
  });

  const anchor = base.length ? base : ['Artikel'];
  return [...anchor, ...details];
}

function compactCondition(condition) {
  const map = {
    'Neu': 'neu',
    'Wie neu': 'wie neu',
    'Sehr gut': 'sehr guter Zustand',
    'Gut': 'guter Zustand',
    'Gebraucht': 'gebraucht',
  };
  return map[condition] || '';
}

function conditionDative(condition) {
  const map = {
    'Neu': 'neuem',
    'Wie neu': 'sehr gutem',
    'Sehr gut': 'sehr gutem',
    'Gut': 'gutem',
    'Gebraucht': 'gebrauchtem',
  };
  return map[condition] || '';
}

function normalizeCompareToken(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, ' ').replace(/\s+/g, ' ').trim();
}

function pickKeywordBits(d, limit = 3) {
  const raw = dedupeTokens(splitTerms(d.keywords)).filter(Boolean);
  if (!raw.length) return [];

  const excluded = new Set([
    cleanBrand(d.brand),
    d.productType || '',
    d.model || '',
    d.color || '',
    d.material || '',
    d.specs || '',
  ].filter(Boolean).map(normalizeCompareToken));

  const blockedKeywordPatterns = [
    /\bisbn\b/i,
    /\bbasic\b/i,
    /\bminimal(istisch)?\b/i,
    /\bkreativ\b/i,
    /\bschule\b/i,
    /\blook\b/i,
    /\bstyle\b/i,
  ];

  return raw
    .filter((term) => {
      const normalized = normalizeCompareToken(term);
      if (!normalized || excluded.has(normalized)) return false;
      if (normalized.length < 4) return false;
      if (normalized.split(' ').length > 2) return false;
      if (blockedKeywordPatterns.some((pattern) => pattern.test(term))) return false;
      return true;
    })
    .slice(0, limit);
}

function titleSafeSpecs(d, category, platform) {
  const specs = sanitizeWhitespace(d.specs);
  if (!specs) return '';
  if (/\bisbn\b/i.test(specs)) return '';
  if (platform === 'vinted' && category === 'tech') {
    const compact = splitTerms(specs).filter((part) => /\b(\d+\s?(gb|tb|mb)|usb-?c|usb c|wifi|bluetooth|4g|5g)\b/i.test(part));
    return compact[0] || '';
  }
  return specs;
}

function buildVintedFashionCore(d, brand, product, model) {
  if (brand) return [brand, product, model];
  if (d.targetGroup && !/artikel|stück/i.test(product)) return [d.targetGroup, product, model];
  return [product, model];
}

function buildTitleForPlatform(d, platform) {
  const category = inferListingCategory(d);
  const brand = cleanBrand(d.brand);
  const product = describeProduct(d);
  const model = d.model && normalizeTokenSignature(d.model) !== normalizeTokenSignature(product) ? d.model : '';
  const condition = compactCondition(d.condition);
  const size = d.size ? `Größe ${d.size}` : '';
  const color = d.color || '';
  const keywords = pickKeywordBits(d, 2);
  const titleSpecs = titleSafeSpecs(d, category, platform);

  const vintedMap = {
    fashion: buildTitleParts(buildVintedFashionCore(d, brand, product, model), [color, size, condition]),
    tech: buildTitleParts([brand, product, model], [titleSpecs, condition]),
    media: buildTitleParts([product, model], [titleSpecs, condition]),
    sport: buildTitleParts([brand, product, model], [size, titleSpecs, condition]),
    home: buildTitleParts([brand, product, model], [d.material, size, condition]),
    kids: buildTitleParts([brand, product, model], [titleSpecs, condition]),
    other: buildTitleParts([brand, product, model], [color, condition]),
  };

  const kaMap = {
    fashion: buildTitleParts([product, brand, model], [size, color, ...keywords]),
    tech: buildTitleParts([product, brand, model], [titleSpecs, ...keywords]),
    media: buildTitleParts([product, model], [titleSpecs, ...keywords]),
    sport: buildTitleParts([product, brand, model], [size, titleSpecs, ...keywords]),
    home: buildTitleParts([product, brand, model], [d.material, size, ...keywords]),
    kids: buildTitleParts([product, brand, model], [titleSpecs, ...keywords]),
    other: buildTitleParts([product, brand, model], [color, ...keywords]),
  };

  const fallbackTitle = category === 'fashion' && d.targetGroup ? `${d.targetGroup} ${product}` : product;
  const parts = platform === 'vinted' ? vintedMap[category] || vintedMap.other : kaMap[category] || kaMap.other;
  return composeTitle(parts.filter(Boolean), platform === 'vinted' ? 72 : 68) || titleCase(fallbackTitle);
}

function buildVintedTitle(d) {
  const title = buildTitleForPlatform(d, 'vinted');
  return title
    .replace(/\b(Damenartikel|Herrenartikel|Kleidungsstück)\b\s+(Größe\s+\S+)/i, '$1 $2')
    .replace(/\b(Damen|Herren)\s+(Damenartikel|Herrenartikel)\b/gi, '$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildKATitle(d) {
  return buildTitleForPlatform(d, 'kleinanzeigen');
}

function buildVintedIntro(d) {
  const brand = cleanBrand(d.brand);
  const product = describeProduct(d);
  const model = d.model && normalizeTokenSignature(d.model) !== normalizeTokenSignature(product) ? d.model : '';
  const size = d.size ? `Größe ${d.size}` : '';
  const color = d.color ? `in ${d.color}` : '';
  const category = inferListingCategory(d);

  if (category === 'fashion') {
    return sentence(joinClean(brand, model, product, color, size));
  }

  const condition = compactCondition(d.condition);
  return sentence(joinClean(brand, product, model, color, condition));
}

function buildKAIntro(d) {
  const brand = cleanBrand(d.brand);
  const product = describeProduct(d);
  const model = d.model && normalizeTokenSignature(d.model) !== normalizeTokenSignature(product) ? d.model : '';
  const size = d.size ? `Größe ${d.size}` : '';
  const color = d.color ? `in ${d.color}` : '';
  const category = inferListingCategory(d);

  if (category === 'fashion') {
    return sentence(joinClean('Verkaufe', brand, model, product, color, size));
  }

  return sentence(joinClean('Verkaufe', brand, product, model, color));
}

function normalizeKeywordPhrase(term) {
  const t = (term || '').trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  const map = {
    'klassik': 'Klassischer Look, vielseitig kombinierbar.',
    'klassisch': 'Klassischer Look, vielseitig kombinierbar.',
    'vintage': 'Schöner Vintage-Look mit viel Charakter.',
    'streetwear': 'Lässt sich gut in Streetwear-Outfits integrieren.',
    'oversized': 'Wirkt lässig und modern im Fit.',
    'minimalistisch': 'Schlicht und unkompliziert kombinierbar.',
    'schnellladen': 'Praktisch für schnelles Laden im Alltag.',
    'akku': 'Ideal als zuverlässiger Zusatzakku für unterwegs.',
    'externe batterie': 'Ideal als zuverlässige externe Batterie für unterwegs.',
  };
  return map[lower] || '';
}

function sizeOrColorHint(d) {
  const parts = [];
  if (d.color) parts.push(`in ${d.color}`);
  if (d.size) parts.push(`Größe ${d.size}`);
  return parts.join(', ');
}

function buildSecondarySentence(d, platform) {
  const category = inferListingCategory(d);
  const keywords = pickKeywordBits(d, 2);
  const mappedKeywordSentence = keywords.map(normalizeKeywordPhrase).find(Boolean);
  if (mappedKeywordSentence) return mappedKeywordSentence;

  if (d.defects && /selten getragen/i.test(d.defects)) return 'Wurde nur selten getragen und ist insgesamt sehr gepflegt.';
  if (d.completeness) return sentence(`Lieferumfang: ${d.completeness}`);
  if (d.specs && category !== 'tech') return sentence(`Details: ${d.specs}`);
  if (category === 'tech' && d.specs) return sentence(`Wichtige Daten: ${d.specs}`);
  if (category === 'fashion' && (d.material || d.size || d.color)) return sentence(joinClean('Angenehm tragbar', d.material ? `aus ${d.material}` : '', sizeOrColorHint(d)));

  return '';
}

function buildVintedDetailLines(d) {
  const lines = [];
  const category = inferListingCategory(d);

  if (category === 'fashion') {
    if (d.condition && d.defects) {
      lines.push(sentence(`Der Artikel ist in ${conditionDative(d.condition)} Zustand und wurde ${d.defects}.`));
    } else if (d.condition) {
      lines.push(sentence(`Der Artikel ist in ${conditionDative(d.condition)} Zustand.`));
    } else if (d.defects) {
      lines.push(sentence(`Hinweis zum Zustand: ${d.defects}`));
    }
    if (d.size || d.material) lines.push(buildBulletishLine('Details', [d.size ? `Größe ${d.size}` : '', d.material]));
    if (d.delivery || d.completeness) lines.push(buildBulletishLine('Lieferumfang', [d.delivery, d.completeness]));
    return lines.filter(Boolean);
  }

  if (d.size || d.material || (d.targetGroup && d.targetGroup !== 'Unisex')) {
    lines.push(buildBulletishLine('Details', [d.size, d.material, d.targetGroup !== 'Unisex' ? d.targetGroup : '']));
  }
  if (d.specs) lines.push(buildBulletishLine('Technische Daten', [d.specs]));
  if (d.delivery || d.completeness) lines.push(buildBulletishLine('Lieferumfang', [d.delivery, d.completeness]));
  if (d.condition || d.defects) lines.push(buildBulletishLine('Zustand', [d.condition, d.defects]));
  return lines.filter(Boolean);
}

function buildKABulletLines(d) {
  const lines = [];
  const details = dedupeTokens([d.specs, d.size, d.material, d.color].filter(Boolean));
  if (details.length) lines.push(`• ${details.join(' · ')}`);
  if (d.delivery || d.completeness) lines.push(`• Lieferumfang: ${dedupeTokens([d.delivery, d.completeness].filter(Boolean)).join(' · ')}`);
  if (d.condition || d.defects) lines.push(`• Zustand: ${dedupeTokens([d.condition, d.defects].filter(Boolean)).join(' · ')}`);
  if (d.shipping) lines.push(`• Versand: ${d.shipping === 'ja' ? 'möglich' : 'nein'}`);
  if (d.priceFeeling) lines.push(`• Preisvorstellung: ${formatEuro(d.priceFeeling)}`);
  return lines;
}

function buildBulletishLine(label, values) {
  const cleaned = dedupeTokens(values.filter(Boolean));
  return cleaned.length ? `${label}: ${cleaned.join(' · ')}` : '';
}

function buildTrustLines(d, platform) {
  const lines = [];
  if (d.extraInfo) lines.push(sentence(d.extraInfo));
  if (platform === 'vinted' && d.shipping === 'ja') lines.push('Versand ist möglich.');
  if (platform === 'kleinanzeigen') lines.push('Privatverkauf. Angaben nach bestem Wissen und Gewissen.');
  return lines;
}

function buildVintedText(d) {
  const parts = [buildVintedIntro(d)];
  const second = buildSecondarySentence(d, 'vinted');
  if (second) parts.push(second);
  const details = buildVintedDetailLines(d);
  if (details.length) parts.push(details.join('\n'));
  const trust = buildTrustLines(d, 'vinted');
  if (trust.length) parts.push(trust.join('\n'));
  return parts.filter(Boolean).join('\n\n');
}

function buildKAText(d) {
  const parts = [buildKAIntro(d)];
  const second = buildSecondarySentence(d, 'kleinanzeigen');
  if (second) parts.push(second);
  const bullets = buildKABulletLines(d);
  if (bullets.length) parts.push(bullets.join('\n'));
  const trust = buildTrustLines(d, 'kleinanzeigen');
  if (trust.length) parts.push(trust.join('\n'));
  return parts.filter(Boolean).join('\n\n');
}

function generateTexts() {
  const d = collectFormData();
  const keywordPool = buildKeywordPool(d);
  const enriched = {
    ...d,
    keywords: d.keywords || keywordPool.slice(0, 4).join(', '),
    productType: d.productType || d.model || keywordPool[0] || fallbackProductType(d),
  };

  elements.vintedTitleOutput.value = d.platforms.includes('vinted') ? buildVintedTitle(enriched) : '';
  elements.vintedTextOutput.value = d.platforms.includes('vinted') ? buildVintedText(enriched) : '';
  elements.kaTitleOutput.value = d.platforms.includes('kleinanzeigen') ? buildKATitle(enriched) : '';
  elements.kaTextOutput.value = d.platforms.includes('kleinanzeigen') ? buildKAText(enriched) : '';
}
async function copyText(text) { if (!text) return; await navigator.clipboard.writeText(text); }
function resetForNextProduct() { elements.resellForm.reset(); document.querySelector('input[name="targetGroup"][value="Unisex"]')?.click(); document.querySelector('input[name="condition"][value="Wie neu"]')?.click(); document.querySelector('input[name="shipping"][value="ja"]')?.click(); document.querySelector('input[name="platforms"][value="vinted"]')?.click(); document.querySelector('input[name="platforms"][value="kleinanzeigen"]')?.click(); elements.vintedTitleOutput.value = ''; elements.vintedTextOutput.value = ''; elements.kaTitleOutput.value = ''; elements.kaTextOutput.value = ''; }
async function prepareReverseSearch() { const image = getImageById(state.lightboxImageId); if (!image) return; const filename = image.file.name.replace(/\.[^.]+$/, '') + '_reverse-search.jpg'; downloadCanvas(image.processed, filename); window.open('https://lens.google.com/', '_blank', 'noopener'); elements.statusText.textContent = 'Bild für Reverse Search exportiert und Google Lens geöffnet.'; }
function toggleSelection(id) { state.selectedIds.has(id) ? state.selectedIds.delete(id) : state.selectedIds.add(id); renderGrid(); }
function selectAll() { state.selectedIds = new Set(state.images.filter(isVisible).map((img) => img.id)); renderGrid(); }
function clearSelection() { state.selectedIds.clear(); renderGrid(); }
function openLightbox(id) { state.lightboxImageId = id; elements.lightbox.classList.remove('hidden'); state.cropMode = false; syncCropUi(); renderLightbox(); }
function closeLightbox() { state.lightboxImageId = null; elements.lightbox.classList.add('hidden'); }
function renderLightbox() { const image = getImageById(state.lightboxImageId); if (!image) return; elements.lightboxTitle.textContent = image.file.name; elements.lightboxMeta.textContent = `${image.processed.width} × ${image.processed.height} · ${image.format}`; const wrap = elements.lightboxCanvas.parentElement; const maxW = wrap.clientWidth - 32, maxH = wrap.clientHeight - 32, r = Math.min(maxW / image.processed.width, maxH / image.processed.height, 1), w = Math.round(image.processed.width * r), h = Math.round(image.processed.height * r); elements.lightboxCanvas.width = w; elements.lightboxCanvas.height = h; const ctx = elements.lightboxCanvas.getContext('2d'); ctx.clearRect(0, 0, w, h); ctx.drawImage(image.processed, 0, 0, w, h); positionCropRect(); }
function syncCropUi() { elements.cropOverlay.classList.toggle('hidden', !state.cropMode); elements.applyCropBtn.disabled = !state.cropMode; elements.resetCropBtn.disabled = !state.cropMode; elements.toggleCropBtn.textContent = state.cropMode ? 'Crop-Modus beenden' : 'Crop-Modus'; }
function positionCropRect() { if (!state.cropMode) return; const canvas = elements.lightboxCanvas, overlay = elements.cropOverlay, rect = elements.cropRect, canvasRect = canvas.getBoundingClientRect(), overlayRect = overlay.getBoundingClientRect(); const left = canvasRect.left - overlayRect.left + state.cropRect.x * canvas.width, top = canvasRect.top - overlayRect.top + state.cropRect.y * canvas.height; rect.style.left = `${left}px`; rect.style.top = `${top}px`; rect.style.width = `${state.cropRect.w * canvas.width}px`; rect.style.height = `${state.cropRect.h * canvas.height}px`; }
function resetCropRect() { state.cropRect = { x: 0.15, y: 0.1, w: 0.7, h: 0.8 }; enforceCropRatio(); positionCropRect(); }
function applyCrop() { const image = getImageById(state.lightboxImageId); if (!image) return; const { x, y, w, h } = state.cropRect, sx = Math.round(x * image.processed.width), sy = Math.round(y * image.processed.height), sw = Math.round(w * image.processed.width), sh = Math.round(h * image.processed.height); const out = document.createElement('canvas'); out.width = sw; out.height = sh; out.getContext('2d').drawImage(image.processed, sx, sy, sw, sh, 0, 0, sw, sh); image.processed = out; image.format = ratioLabel(out.width, out.height); renderGrid(); renderLightbox(); }
function getCropRatioValue() { if (state.cropRatio === '3:4') return 3 / 4; if (state.cropRatio === '4:3') return 4 / 3; return null; }
function enforceCropRatio(anchor = 'center') { const ratio = getCropRatioValue(); if (!ratio) return; let { x, y, w, h } = state.cropRect; const current = w / h; if (current > ratio) w = h * ratio; else h = w / ratio; if (anchor !== 'center') { if (anchor.includes('l')) x = state.cropRect.x + state.cropRect.w - w; if (anchor.includes('t')) y = state.cropRect.y + state.cropRect.h - h; } state.cropRect = { x: clamp(x, 0, 1 - w), y: clamp(y, 0, 1 - h), w: clamp(w, 0.05, 1), h: clamp(h, 0.05, 1) }; }
function pointerToCrop(event) { const canvasRect = elements.lightboxCanvas.getBoundingClientRect(); const x = clamp(event.clientX - canvasRect.left, 0, canvasRect.width); const y = clamp(event.clientY - canvasRect.top, 0, canvasRect.height); return { x: x / canvasRect.width, y: y / canvasRect.height }; }
function startCropDrag(event) { if (!state.cropMode) return; state.cropDrag = { handle: event.target.dataset.handle || 'move', start: pointerToCrop(event), origin: { ...state.cropRect } }; event.preventDefault(); }
function onCropDrag(event) { if (!state.cropDrag || !state.cropMode) return; const p = pointerToCrop(event), dx = p.x - state.cropDrag.start.x, dy = p.y - state.cropDrag.start.y, o = state.cropDrag.origin; let r = { ...o }; if (state.cropDrag.handle === 'move') { r.x = clamp(o.x + dx, 0, 1 - o.w); r.y = clamp(o.y + dy, 0, 1 - o.h); } else { if (state.cropDrag.handle.includes('l')) { r.x = clamp(o.x + dx, 0, o.x + o.w - 0.05); r.w = clamp(o.w - dx, 0.05, 1 - r.x); } if (state.cropDrag.handle.includes('r')) r.w = clamp(o.w + dx, 0.05, 1 - o.x); if (state.cropDrag.handle.includes('t')) { r.y = clamp(o.y + dy, 0, o.y + o.h - 0.05); r.h = clamp(o.h - dy, 0.05, 1 - r.y); } if (state.cropDrag.handle.includes('b')) r.h = clamp(o.h + dy, 0.05, 1 - o.y); state.cropRect = r; enforceCropRatio(state.cropDrag.handle); positionCropRect(); return; } state.cropRect = r; positionCropRect(); }
function endCropDrag() { state.cropDrag = null; }
function duplicateCurrent() { const image = getImageById(state.lightboxImageId); if (!image) return; const copy = { ...image, id: `${image.id}-copy-${Date.now()}`, file: new File([], image.file.name.replace(/(\.[^.]+)?$/, '_copy$1'), { type: image.file.type || 'image/jpeg' }), original: cloneCanvas(image.original), processed: cloneCanvas(image.processed), format: image.format }; state.images.splice(state.images.findIndex((i) => i.id === image.id) + 1, 0, copy); renderGrid(); }
function removeCurrent() { const id = state.lightboxImageId; state.images = state.images.filter((img) => img.id !== id); state.selectedIds.delete(id); closeLightbox(); renderGrid(); }
['brightness','contrast','shadows','saturation','warmth','sharpness','blackPoint'].forEach((key) => elements[key].addEventListener('input', (event) => { state.settings[key] = Number(event.target.value); updateControlLabels(); processTargetImages(); }));
elements.fileInput.addEventListener('change', (event) => handleFiles(event.target.files)); elements.downloadAllBtn.addEventListener('click', downloadAll); elements.resetBtn.addEventListener('click', resetAll); elements.selectAllBtn.addEventListener('click', selectAll); elements.clearSelectionBtn.addEventListener('click', clearSelection); elements.filter34.addEventListener('change', () => { state.filters['3:4'] = elements.filter34.checked; renderGrid(); }); elements.filter43.addEventListener('change', () => { state.filters['4:3'] = elements.filter43.checked; renderGrid(); }); elements.previewModeCompare.addEventListener('click', () => { state.previewMode = 'compare'; syncControlsFromState(); renderGrid(); }); elements.previewModeAfterOnly.addEventListener('click', () => { state.previewMode = 'after'; syncControlsFromState(); renderGrid(); }); document.querySelectorAll('.preset-btn').forEach((btn) => btn.addEventListener('click', () => applyPreset(btn.dataset.preset))); elements.generateBriefBtn.addEventListener('click', generateTexts); elements.copyVintedBtn.addEventListener('click', () => copyText(`${elements.vintedTitleOutput.value}\n\n${elements.vintedTextOutput.value}`)); elements.copyKaBtn.addEventListener('click', () => copyText(`${elements.kaTitleOutput.value}\n\n${elements.kaTextOutput.value}`)); elements.nextProductBtn.addEventListener('click', resetForNextProduct);
elements.closeLightboxBtn.addEventListener('click', closeLightbox); elements.toggleCropBtn.addEventListener('click', () => { state.cropMode = !state.cropMode; syncCropUi(); if (state.cropMode) resetCropRect(); }); elements.applyCropBtn.addEventListener('click', applyCrop); elements.resetCropBtn.addEventListener('click', resetCropRect); elements.cropRatioSelect.addEventListener('change', () => { state.cropRatio = elements.cropRatioSelect.value; enforceCropRatio(); positionCropRect(); }); elements.duplicateBtn.addEventListener('click', duplicateCurrent); elements.removeBtn.addEventListener('click', removeCurrent); elements.reverseSearchBtn.addEventListener('click', prepareReverseSearch); elements.cropRect.addEventListener('pointerdown', startCropDrag); window.addEventListener('pointermove', onCropDrag); window.addEventListener('pointerup', endCropDrag); elements.lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox); window.addEventListener('keydown', (event) => { const active = document.activeElement; const inTextInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA'); if (event.code === 'Space' && state.images.length && !inTextInput) { const activeId = state.selectedIds.size ? [...state.selectedIds][0] : state.images.filter(isVisible)[0]?.id; event.preventDefault(); if (state.lightboxImageId) closeLightbox(); else if (activeId) openLightbox(activeId); } if (event.key === 'Escape' && state.lightboxImageId) closeLightbox(); }); window.addEventListener('resize', () => { if (state.lightboxImageId) renderLightbox(); });
syncControlsFromState(); renderGrid();
