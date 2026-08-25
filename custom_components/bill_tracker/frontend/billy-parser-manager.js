const BILLY_PARSER_MANAGER_VERSION = '0.9.1'

const TEXT = {
  en: {
    title: 'Parser management',
    subtitle: 'Install, update and configure automatic bill parsers.',
    refresh: 'Refresh list',
    refreshing: 'Refreshing…',
    search: 'Search provider, parser or type…',
    country: 'Country',
    allCountries: 'All countries',
    billType: 'Bill type',
    allBillTypes: 'All bill types',
    state: 'Status',
    all: 'All',
    installed: 'Installed',
    notInstalled: 'Not installed',
    updates: 'Updates available',
    incompatible: 'Incompatible',
    deprecated: 'Deprecated',
    sort: 'Sort',
    sortCountry: 'Country → provider',
    sortProvider: 'Provider',
    sortType: 'Bill type',
    sortUpdates: 'Updates first',
    available: 'Available',
    outdated: 'Outdated',
    removed: 'Removed from catalog',
    error: 'Error',
    custom: 'Custom',
    requires: 'Requires Billy',
    version: 'Version',
    installedVersion: 'Installed',
    remoteVersion: 'Available',
    install: 'Install',
    update: 'Update',
    configure: 'Configure',
    remove: 'Remove',
    close: 'Close',
    save: 'Save',
    enabled: 'Parser enabled',
    autoImport: 'Automatic import',
    category: 'Billy bill type',
    noResults: 'No parsers match the selected filters.',
    catalogUpdated: 'Catalog updated',
    never: 'not yet',
    parsers: 'parsers',
    updateCount: 'updates available',
    confirmRemove: 'Remove this parser? Already imported bills will not be deleted.',
    installTitle: 'Install parser',
    updateTitle: 'Update parser',
    configureTitle: 'Configure parser',
    loadError: 'Unable to load parser data.',
    actionError: 'Operation failed',
    updateBlocked: 'Update requires a newer Billy version',
    deprecatedHint: 'This parser is deprecated.',
    removedHint: 'This installed parser is no longer present in the remote catalog.',
    customHint: 'Custom parser stored locally.',
    changelog: 'Changes'
  },
  it: {
    title: 'Gestione parser',
    subtitle: 'Installa, aggiorna e configura i parser automatici delle bollette.',
    refresh: 'Aggiorna lista',
    refreshing: 'Aggiornamento…',
    search: 'Cerca fornitore, parser o tipo…',
    country: 'Nazione',
    allCountries: 'Tutte le nazioni',
    billType: 'Tipologia',
    allBillTypes: 'Tutte le tipologie',
    state: 'Stato',
    all: 'Tutti',
    installed: 'Installati',
    notInstalled: 'Non installati',
    updates: 'Aggiornamenti disponibili',
    incompatible: 'Incompatibili',
    deprecated: 'Deprecati',
    sort: 'Ordina',
    sortCountry: 'Nazione → fornitore',
    sortProvider: 'Fornitore',
    sortType: 'Tipo bolletta',
    sortUpdates: 'Aggiornamenti prima',
    available: 'Disponibile',
    outdated: 'Outdated',
    removed: 'Rimosso dal catalogo',
    error: 'Errore',
    custom: 'Personalizzato',
    requires: 'Richiede Billy',
    version: 'Versione',
    installedVersion: 'Installata',
    remoteVersion: 'Disponibile',
    install: 'Installa',
    update: 'Aggiorna',
    configure: 'Configura',
    remove: 'Elimina',
    close: 'Chiudi',
    save: 'Salva',
    enabled: 'Parser abilitato',
    autoImport: 'Import automatico',
    category: 'Tipo di bolletta Billy',
    noResults: 'Nessun parser corrisponde ai filtri selezionati.',
    catalogUpdated: 'Catalogo aggiornato',
    never: 'mai',
    parsers: 'parser',
    updateCount: 'aggiornamenti disponibili',
    confirmRemove: 'Eliminare questo parser? Le bollette già importate non verranno cancellate.',
    installTitle: 'Installa parser',
    updateTitle: 'Aggiorna parser',
    configureTitle: 'Configura parser',
    loadError: 'Impossibile caricare i dati dei parser.',
    actionError: 'Operazione non riuscita',
    updateBlocked: 'L’aggiornamento richiede una versione più recente di Billy',
    deprecatedHint: 'Questo parser è deprecato.',
    removedHint: 'Questo parser installato non è più presente nel catalogo remoto.',
    customHint: 'Parser personalizzato salvato localmente.',
    changelog: 'Modifiche'
  }
}

function languageOf (hass) {
  const raw = hass?.language || hass?.locale?.language || navigator.language || 'en'
  return String(raw).toLowerCase().split(/[-_]/)[0] === 'it' ? 'it' : 'en'
}

function esc (value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function countryFlag (code) {
  const value = String(code || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(value)) return '🌐'
  return String.fromCodePoint(...[...value].map(char => 127397 + char.charCodeAt(0)))
}

class BillyParserManagerPanel extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._data = null
    this._billData = null
    this._loading = false
    this._refreshing = false
    this._busy = ''
    this._error = ''
    this._search = ''
    this._country = 'all'
    this._billType = 'all'
    this._status = 'all'
    this._sort = 'country'
    this._dialog = null
  }

  set hass (value) {
    this._hass = value
    if (!this._data && !this._loading) this._load()
    else this._render()
  }

  get hass () {
    return this._hass
  }

  connectedCallback () {
    this._render()
    if (this._hass && !this._data && !this._loading) this._load()
  }

  _t (key) {
    const language = languageOf(this._hass)
    return TEXT[language]?.[key] ?? TEXT.en[key] ?? key
  }

  async _load ({ refreshIfEmpty = true } = {}) {
    if (!this._hass || this._loading) return
    this._loading = true
    this._error = ''
    this._render()
    try {
      const [parserData, billData] = await Promise.all([
        this._hass.callWS({ type: 'bill_tracker/parser/list' }),
        this._hass.callWS({ type: 'bill_tracker/list', forecast_months: 1 })
      ])
      this._data = parserData
      this._billData = billData
      const rows = parserData?.catalog?.parsers || []
      if (refreshIfEmpty && rows.length === 0) {
        await this._refreshCatalog()
        return
      }
    } catch (error) {
      this._error = `${this._t('loadError')} ${error?.message || error}`
    } finally {
      this._loading = false
      this._render()
    }
  }

  async _refreshCatalog () {
    if (!this._hass || this._refreshing) return
    this._refreshing = true
    this._error = ''
    this._render()
    try {
      await this._hass.callWS({ type: 'bill_tracker/parser/refresh' })
      this._loading = false
      await this._load({ refreshIfEmpty: false })
    } catch (error) {
      this._error = `${this._t('actionError')}: ${error?.message || error}`
    } finally {
      this._refreshing = false
      this._render()
    }
  }

  _rows () {
    const catalogRows = [...(this._data?.catalog?.parsers || [])]
    const known = new Set(catalogRows.map(row => String(row.id)))
    for (const installed of this._data?.installed || []) {
      if (installed.source !== 'custom' || known.has(String(installed.id))) continue
      catalogRows.push({
        ...installed,
        status: 'custom',
        installed: true,
        installed_version: installed.version,
        compatible: true,
        country: installed.country || '',
        provider: installed.provider || '',
        bill_type: installed.bill_type || '',
        source: 'custom'
      })
    }
    return catalogRows
  }

  _filteredRows () {
    const search = this._search.trim().toLowerCase()
    const rows = this._rows().filter(row => {
      if (this._country !== 'all' && String(row.country || '') !== this._country) return false
      if (this._billType !== 'all' && String(row.bill_type || '') !== this._billType) return false
      if (this._status === 'installed' && !row.installed) return false
      if (this._status === 'not_installed' && row.installed) return false
      if (this._status === 'updates' && !row.update_available) return false
      if (this._status === 'incompatible' && row.compatible !== false) return false
      if (this._status === 'deprecated' && !row.deprecated) return false
      if (!search) return true
      return [row.name, row.provider, row.id, row.bill_type, row.country]
        .some(value => String(value || '').toLowerCase().includes(search))
    })

    const compareText = (a, b) => String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base' })
    rows.sort((a, b) => {
      if (this._sort === 'updates') {
        const updateDiff = Number(Boolean(b.update_available)) - Number(Boolean(a.update_available))
        if (updateDiff) return updateDiff
      }
      if (this._sort === 'provider') return compareText(a.provider || a.name, b.provider || b.name)
      if (this._sort === 'type') {
        return compareText(a.bill_type, b.bill_type) || compareText(a.provider || a.name, b.provider || b.name)
      }
      return compareText(a.country, b.country) || compareText(a.provider || a.name, b.provider || b.name)
    })
    return rows
  }

  _countries () {
    return [...new Set(this._rows().map(row => String(row.country || '')).filter(Boolean))].sort()
  }

  _billTypes () {
    return [...new Set(this._rows().map(row => String(row.bill_type || '')).filter(Boolean))].sort()
  }

  _billTypeLabel (value) {
    const labels = {
      en: { electricity: 'Electricity', gas: 'Gas', water: 'Water', internet: 'Internet', mobile: 'Mobile', phone: 'Phone', insurance: 'Insurance' },
      it: { electricity: 'Elettricità', gas: 'Gas', water: 'Acqua', internet: 'Internet', mobile: 'Telefonia mobile', phone: 'Telefono', insurance: 'Assicurazione' }
    }
    const language = languageOf(this._hass)
    const key = String(value || '')
    return labels[language]?.[key] || key.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
  }

  _statusLabel (row) {
    if (row.status === 'outdated') return this._t('outdated')
    if (row.status === 'installed') return this._t('installed')
    if (row.status === 'incompatible') return this._t('incompatible')
    if (row.status === 'deprecated') return this._t('deprecated')
    if (row.status === 'removed') return this._t('removed')
    if (row.status === 'error') return this._t('error')
    if (row.status === 'custom') return this._t('custom')
    return this._t('available')
  }

  _renderRow (row) {
    const installedVersion = row.installed_version ?? row.version
    const remoteVersion = row.version
    const busy = this._busy === String(row.id)
    const canUpdate = row.update_available && row.compatible !== false && !row.removed_from_catalog
    let versionLine = `${this._t('version')} v${esc(remoteVersion ?? '?')}`
    if (row.update_available) {
      versionLine = `${this._t('installedVersion')} v${esc(installedVersion)} → ${this._t('remoteVersion')} v${esc(remoteVersion)}`
    }

    let hint = ''
    if (row.compatible === false) hint = `${this._t('requires')} ${esc(row.min_billy_version || '?')}`
    if (row.deprecated) hint = this._t('deprecatedHint')
    if (row.status === 'removed') hint = this._t('removedHint')
    if (row.status === 'custom') hint = this._t('customHint')
    if (row.load_error) hint = esc(row.load_error)

    let actions = ''
    if (row.source === 'custom') {
      actions = `
        <button class="secondary" data-action="configure" data-id="${esc(row.id)}">${this._t('configure')}</button>
        <button class="danger" data-action="remove" data-id="${esc(row.id)}">${this._t('remove')}</button>`
    } else if (!row.installed) {
      actions = `<button class="primary" data-action="install" data-id="${esc(row.id)}" ${row.compatible === false || busy ? 'disabled' : ''}>${this._t('install')}</button>`
    } else {
      actions = `
        <button class="secondary" data-action="configure" data-id="${esc(row.id)}">${this._t('configure')}</button>
        ${row.update_available ? `<button class="primary" data-action="update" data-id="${esc(row.id)}" ${canUpdate && !busy ? '' : 'disabled'} title="${row.compatible === false ? esc(this._t('updateBlocked')) : ''}">${this._t('update')}</button>` : ''}
        <button class="danger" data-action="remove" data-id="${esc(row.id)}" ${busy ? 'disabled' : ''}>${this._t('remove')}</button>`
    }

    const badges = [
      `<span class="badge status-${esc(row.status || 'available')}">${esc(this._statusLabel(row))}</span>`,
      row.update_available ? `<span class="badge warning">v${esc(installedVersion)} → v${esc(remoteVersion)}</span>` : '',
      row.deprecated ? `<span class="badge warning">${this._t('deprecated')}</span>` : '',
      row.compatible === false ? `<span class="badge error">${this._t('incompatible')}</span>` : ''
    ].join('')

    return `
      <article class="parser-row">
        <div class="identity">
          <div class="flag">${countryFlag(row.country)}</div>
          <div class="details">
            <div class="name-line">
              <strong>${esc(row.provider || row.name || row.id)}</strong>
              ${badges}
            </div>
            <div class="parser-name">${esc(row.name || row.id)}</div>
            <div class="meta">${esc(row.id)} · ${esc(row.bill_type || '—')} · ${versionLine}</div>
            ${hint ? `<div class="hint">${hint}</div>` : ''}
            ${row.changelog ? `<div class="hint"><strong>${this._t('changelog')}:</strong> ${esc(row.changelog)}</div>` : ''}
          </div>
        </div>
        <div class="actions">${actions}</div>
      </article>`
  }

  _render () {
    if (!this.shadowRoot) return
    const rows = this._filteredRows()
    const counts = this._data?.catalog?.counts || {}
    const updatedAt = this._data?.catalog?.updated_at
    const countries = this._countries()
    const billTypes = this._billTypes()
    const countryOptions = [`<option value="all">${this._t('allCountries')}</option>`]
      .concat(countries.map(code => `<option value="${esc(code)}" ${this._country === code ? 'selected' : ''}>${countryFlag(code)} ${esc(code)}</option>`))
      .join('')
    const billTypeOptions = [`<option value="all">${this._t('allBillTypes')}</option>`]
      .concat(billTypes.map(type => `<option value="${esc(type)}" ${this._billType === type ? 'selected' : ''}>${esc(this._billTypeLabel(type))}</option>`))
      .join('')

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="page">
        <header>
          <div>
            <h1>${this._t('title')}</h1>
            <p>${this._t('subtitle')}</p>
          </div>
          <button id="refresh" class="primary" ${this._refreshing ? 'disabled' : ''}>
            ${this._refreshing ? this._t('refreshing') : `↻ ${this._t('refresh')}`}
          </button>
        </header>

        <section class="summary">
          <strong>${esc(counts.total ?? this._rows().length)} ${this._t('parsers')}</strong>
          <span class="${Number(counts.outdated || 0) > 0 ? 'summary-alert' : ''}">${esc(counts.outdated || 0)} ${this._t('updateCount')}</span>
          <span>${this._t('catalogUpdated')}: ${updatedAt ? esc(new Date(updatedAt).toLocaleString()) : this._t('never')}</span>
        </section>

        <section class="filters">
          <label class="search-field">
            <span>⌕</span>
            <input id="search" type="search" value="${esc(this._search)}" placeholder="${esc(this._t('search'))}">
          </label>
          <label><span>${this._t('country')}</span><select id="country">${countryOptions}</select></label>
          <label><span>${this._t('billType')}</span><select id="bill-type">${billTypeOptions}</select></label>
          <label><span>${this._t('state')}</span><select id="status">
            <option value="all" ${this._status === 'all' ? 'selected' : ''}>${this._t('all')}</option>
            <option value="installed" ${this._status === 'installed' ? 'selected' : ''}>${this._t('installed')}</option>
            <option value="not_installed" ${this._status === 'not_installed' ? 'selected' : ''}>${this._t('notInstalled')}</option>
            <option value="updates" ${this._status === 'updates' ? 'selected' : ''}>${this._t('updates')}</option>
            <option value="incompatible" ${this._status === 'incompatible' ? 'selected' : ''}>${this._t('incompatible')}</option>
            <option value="deprecated" ${this._status === 'deprecated' ? 'selected' : ''}>${this._t('deprecated')}</option>
          </select></label>
          <label><span>${this._t('sort')}</span><select id="sort">
            <option value="country" ${this._sort === 'country' ? 'selected' : ''}>${this._t('sortCountry')}</option>
            <option value="provider" ${this._sort === 'provider' ? 'selected' : ''}>${this._t('sortProvider')}</option>
            <option value="type" ${this._sort === 'type' ? 'selected' : ''}>${this._t('sortType')}</option>
            <option value="updates" ${this._sort === 'updates' ? 'selected' : ''}>${this._t('sortUpdates')}</option>
          </select></label>
        </section>

        ${this._error ? `<div class="error-box">${esc(this._error)}</div>` : ''}
        ${this._loading ? '<div class="loading">Loading…</div>' : ''}
        <section class="list">
          ${rows.length ? rows.map(row => this._renderRow(row)).join('') : `<div class="empty">${this._t('noResults')}</div>`}
        </section>
        ${this._dialog ? this._renderDialog() : ''}
      </div>`

    this._wireEvents()
  }

  _renderList () {
    const list = this.shadowRoot?.querySelector('.list')
    if (!list) return
    const rows = this._filteredRows()
    list.innerHTML = rows.length
      ? rows.map(row => this._renderRow(row)).join('')
      : `<div class="empty">${this._t('noResults')}</div>`
    this._wireActionEvents()
  }

  _wireActionEvents () {
    this.shadowRoot.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', event => {
        const action = event.currentTarget.dataset.action
        const id = event.currentTarget.dataset.id
        this._handleAction(action, id)
      })
    })
  }

  _wireEvents () {
    this.shadowRoot.getElementById('refresh')?.addEventListener('click', () => this._refreshCatalog())
    this.shadowRoot.getElementById('search')?.addEventListener('input', event => {
      // Do not rebuild the input itself while the user is typing: replacing it
      // resets the caret to position 0 and made text appear in reverse order.
      this._search = event.target.value
      this._renderList()
    })
    this.shadowRoot.getElementById('country')?.addEventListener('change', event => {
      this._country = event.target.value
      this._render()
    })
    this.shadowRoot.getElementById('bill-type')?.addEventListener('change', event => {
      this._billType = event.target.value
      this._render()
    })
    this.shadowRoot.getElementById('status')?.addEventListener('change', event => {
      this._status = event.target.value
      this._render()
    })
    this.shadowRoot.getElementById('sort')?.addEventListener('change', event => {
      this._sort = event.target.value
      this._render()
    })
    this._wireActionEvents()
    const closeDialog = () => {
      this._dialog = null
      this._render()
    }
    this.shadowRoot.getElementById('dialog-close')?.addEventListener('click', closeDialog)
    this.shadowRoot.getElementById('dialog-close-secondary')?.addEventListener('click', closeDialog)
    this.shadowRoot.getElementById('dialog-save')?.addEventListener('click', () => this._saveDialog())
  }

  _findRow (id) {
    return this._rows().find(row => String(row.id) === String(id))
  }

  async _handleAction (action, id) {
    const row = this._findRow(id)
    if (!row) return
    if (action === 'remove') {
      if (!window.confirm(this._t('confirmRemove'))) return
      this._busy = String(id)
      this._render()
      try {
        const type = row.source === 'custom'
          ? 'bill_tracker/parser/custom/delete'
          : 'bill_tracker/parser/uninstall'
        await this._hass.callWS({ type, parser_id: String(id) })
        await this._load({ refreshIfEmpty: false })
      } catch (error) {
        this._error = `${this._t('actionError')}: ${error?.message || error}`
      } finally {
        this._busy = ''
        this._render()
      }
      return
    }
    this._openDialog(row, action)
  }

  _openDialog (row, mode) {
    const categories = this._billData?.categories || []
    const suggested = row.category_id || row.bill_type
    const defaultCategory = categories.some(item => String(item.id) === String(suggested))
      ? String(suggested)
      : String(categories.find(item => item.enabled !== false)?.id || categories[0]?.id || '')
    this._dialog = {
      mode,
      row,
      categoryId: defaultCategory,
      enabled: row.installed ? row.enabled !== false : true,
      autoImport: row.installed ? Boolean(row.auto_import) : false
    }
    this._render()
  }

  _renderDialog () {
    const dialog = this._dialog
    const categories = this._billData?.categories || []
    const title = dialog.mode === 'install'
      ? this._t('installTitle')
      : dialog.mode === 'update'
          ? this._t('updateTitle')
          : this._t('configureTitle')
    const options = categories.map(category => `
      <option value="${esc(category.id)}" ${String(category.id) === String(dialog.categoryId) ? 'selected' : ''}>
        ${esc(category.name)}${category.enabled === false ? ' · disabled' : ''}
      </option>`).join('')
    return `
      <div class="modal-backdrop">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-head">
            <div><h2>${title}</h2><p>${esc(dialog.row.provider || dialog.row.name)} · ${esc(dialog.row.id)}</p></div>
            <button id="dialog-close" class="icon-button">×</button>
          </div>
          <label class="modal-field"><span>${this._t('category')}</span><select id="dialog-category">${options}</select></label>
          <label class="check"><input id="dialog-enabled" type="checkbox" ${dialog.enabled ? 'checked' : ''}><span>${this._t('enabled')}</span></label>
          <label class="check"><input id="dialog-auto" type="checkbox" ${dialog.autoImport ? 'checked' : ''}><span>${this._t('autoImport')}</span></label>
          <div class="modal-actions">
            <button id="dialog-close-secondary" class="secondary">${this._t('close')}</button>
            <button id="dialog-save" class="primary">${dialog.mode === 'install' ? this._t('install') : dialog.mode === 'update' ? this._t('update') : this._t('save')}</button>
          </div>
        </div>
      </div>`
  }

  async _saveDialog () {
    const dialog = this._dialog
    if (!dialog) return
    const categoryId = this.shadowRoot.getElementById('dialog-category')?.value || dialog.categoryId
    const enabled = Boolean(this.shadowRoot.getElementById('dialog-enabled')?.checked)
    const autoImport = Boolean(this.shadowRoot.getElementById('dialog-auto')?.checked)
    this._busy = String(dialog.row.id)
    this._dialog = null
    this._render()
    try {
      if (dialog.mode === 'configure') {
        await this._hass.callWS({
          type: 'bill_tracker/parser/configure',
          parser_id: String(dialog.row.id),
          category_id: categoryId,
          enabled,
          auto_import: autoImport
        })
      } else {
        await this._hass.callWS({
          type: 'bill_tracker/parser/install',
          parser_id: String(dialog.row.id),
          category_id: categoryId,
          enabled,
          auto_import: autoImport
        })
      }
      await this._load({ refreshIfEmpty: false })
    } catch (error) {
      this._error = `${this._t('actionError')}: ${error?.message || error}`
    } finally {
      this._busy = ''
      this._render()
    }
  }

  _styles () {
    return `
      :host { display:block; min-height:100%; color:var(--primary-text-color); background:var(--primary-background-color); }
      * { box-sizing:border-box; }
      .page { max-width:1100px; margin:0 auto; padding:24px 20px 48px; }
      header { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:18px; }
      h1 { margin:0 0 6px; font-size:28px; font-weight:600; }
      h2 { margin:0; font-size:20px; }
      p { margin:0; color:var(--secondary-text-color); }
      button, select, input { font:inherit; }
      button { border-radius:10px; border:1px solid var(--divider-color); padding:9px 14px; cursor:pointer; font-weight:600; }
      button:disabled { opacity:.5; cursor:not-allowed; }
      .primary { background:var(--primary-color); color:var(--text-primary-color, #fff); border-color:var(--primary-color); }
      .secondary { background:var(--card-background-color); color:var(--primary-text-color); }
      .danger { background:transparent; color:var(--error-color, #db4437); border-color:color-mix(in srgb, var(--error-color, #db4437) 45%, transparent); }
      .summary { display:flex; gap:18px; flex-wrap:wrap; align-items:center; padding:12px 14px; margin-bottom:14px; border:1px solid var(--divider-color); border-radius:12px; background:var(--card-background-color); color:var(--secondary-text-color); font-size:14px; }
      .summary strong { color:var(--primary-text-color); }
      .summary-alert { color:var(--warning-color, #f39c12); font-weight:700; }
      .filters { display:grid; grid-template-columns:minmax(230px, 1.6fr) repeat(4, minmax(135px, .7fr)); gap:10px; margin-bottom:16px; }
      .filters label, .modal-field { display:flex; flex-direction:column; gap:5px; color:var(--secondary-text-color); font-size:12px; }
      .filters select, .filters input, .modal-field select { width:100%; height:42px; border:1px solid var(--divider-color); border-radius:10px; padding:0 11px; background:var(--card-background-color); color:var(--primary-text-color); }
      .search-field { position:relative; justify-content:flex-end; }
      .search-field > span { position:absolute; left:12px; bottom:11px; font-size:18px; }
      .search-field input { padding-left:34px; }
      .list { overflow:hidden; border:1px solid var(--divider-color); border-radius:14px; background:var(--card-background-color); }
      .parser-row { display:flex; justify-content:space-between; gap:20px; padding:17px 18px; border-bottom:1px solid var(--divider-color); }
      .parser-row:last-child { border-bottom:0; }
      .identity { display:flex; gap:13px; min-width:0; }
      .flag { font-size:27px; line-height:1; padding-top:2px; }
      .details { min-width:0; }
      .name-line { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin-bottom:3px; }
      .name-line strong { font-size:17px; }
      .parser-name { color:var(--primary-text-color); margin-bottom:4px; }
      .meta, .hint { color:var(--secondary-text-color); font-size:13px; overflow-wrap:anywhere; }
      .hint { margin-top:5px; }
      .badge { display:inline-flex; padding:3px 7px; border-radius:999px; font-size:11px; font-weight:700; background:var(--secondary-background-color); color:var(--secondary-text-color); }
      .status-installed { color:var(--success-color, #2e7d32); background:color-mix(in srgb, var(--success-color, #2e7d32) 12%, transparent); }
      .status-available { color:var(--primary-color); background:color-mix(in srgb, var(--primary-color) 12%, transparent); }
      .status-outdated, .warning { color:var(--warning-color, #f39c12); background:color-mix(in srgb, var(--warning-color, #f39c12) 14%, transparent); }
      .status-incompatible, .status-error, .error { color:var(--error-color, #db4437); background:color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); }
      .status-deprecated, .status-removed, .status-custom { color:var(--secondary-text-color); }
      .actions { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; flex:0 0 auto; }
      .empty, .loading { padding:36px; text-align:center; color:var(--secondary-text-color); }
      .error-box { margin:0 0 14px; padding:12px 14px; border-radius:10px; color:var(--error-color, #db4437); background:color-mix(in srgb, var(--error-color, #db4437) 10%, transparent); }
      .modal-backdrop { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:20px; background:rgba(0,0,0,.48); }
      .modal { width:min(520px, 100%); padding:20px; border-radius:16px; background:var(--card-background-color); box-shadow:var(--ha-card-box-shadow, 0 8px 30px rgba(0,0,0,.3)); }
      .modal-head { display:flex; justify-content:space-between; gap:16px; margin-bottom:20px; }
      .modal-head p { margin-top:4px; font-size:13px; }
      .icon-button { border:0; background:transparent; color:var(--primary-text-color); font-size:25px; padding:0 6px; }
      .check { display:flex; align-items:center; gap:10px; margin-top:16px; }
      .check input { width:18px; height:18px; }
      .modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:24px; }
      @media (max-width: 800px) {
        .page { padding:16px 10px 32px; }
        header { align-items:stretch; flex-direction:column; }
        header button { align-self:flex-start; }
        .filters { grid-template-columns:1fr 1fr; }
        .search-field { grid-column:1 / -1; }
        .parser-row { flex-direction:column; }
        .actions { justify-content:flex-start; padding-left:40px; }
      }
      @media (max-width: 480px) {
        .filters { grid-template-columns:1fr; }
        .search-field { grid-column:auto; }
        .actions { padding-left:0; }
      }
    `
  }
}

if (!customElements.get('billy-parser-manager')) {
  customElements.define('billy-parser-manager', BillyParserManagerPanel)
}

console.info(`Billy parser manager v${BILLY_PARSER_MANAGER_VERSION} loaded`)
