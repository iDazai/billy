import './billy-parser-manager.js?v=0.11.0'

const BILLY_PANEL_VERSION = '0.11.0'

const TEXT = {
  en: {
    dashboard: 'Overview',
    bills: 'Bills',
    recurring: 'Recurring',
    parsers: 'Parsers',
    settings: 'Settings',
    subtitle: 'Bills, forecasts and automatic parsing in one place.',
    currentMonth: 'This month',
    outstanding: 'Provider bills to pay',
    yearTotal: 'Paid this year',
    nextMonth: 'Next month estimate',
    pendingImports: 'To review',
    activeParsers: 'Installed parsers',
    parserUpdates: 'Parser updates',
    spendingTrend: 'Spending trend',
    last12Months: 'Last 12 months + forecast',
    categoryBreakdown: 'This month by bill type',
    upcomingBills: 'Upcoming bills',
    recentBills: 'Recent bills',
    viewBills: 'Manage bills',
    viewParsers: 'Open parsers',
    noData: 'No data available yet.',
    noUpcoming: 'No upcoming bills.',
    actual: 'Actual',
    forecast: 'Forecast',
    paid: 'Provider paid',
    unpaid: 'Provider unpaid',
    due: 'Due',
    reimbursements: 'User reimbursements',
    reimbursementsHelp: 'Provider payment and user reimbursements are separate: a paid bill means the payer paid the provider; a reimbursement means another user paid back their share.',
    reimbursementDue: 'Reimbursement due',
    reimbursementHistory: 'Recent reimbursements',
    confirmReimbursement: 'Confirm reimbursement',
    undoReimbursement: 'Undo',
    reimbursementsEven: 'No reimbursements are currently due.',
    payPaypal: 'Pay with PayPal',
    paypalNotConfigured: 'PayPal.Me not configured',
    billsTitle: 'All bills',
    billsSubtitle: 'Complete history with provider-payment status, editing and manual entry.',
    addBill: 'Add bill',
    searchBills: 'Search bills…',
    allTypes: 'All bill types',
    allStatuses: 'All statuses',
    allReimbursementStatuses: 'All reimbursements',
    allYears: 'All years',
    providerPaid: 'Provider paid',
    providerUnpaid: 'Provider unpaid',
    reimbursementPending: 'To reimburse',
    reimbursementDone: 'Reimbursed',
    reimbursementPartial: 'Partially reimbursed',
    reimbursementNone: 'No reimbursement',
    reimbursementStatus: 'User reimbursement',
    reimbursementToggleHelp: 'Quickly mark all reimbursements for this bill as completed. Recorded reimbursements must be undone from reimbursement history.',
    billType: 'Bill type',
    billingMonth: 'Billing month',
    amount: 'Amount',
    provider: 'Provider',
    contract: 'Contract',
    payer: 'Payer',
    paymentStatus: 'Provider payment',
    paymentDate: 'Payment date',
    dueDate: 'Due date',
    periodStart: 'Period start',
    periodEnd: 'Period end',
    consumption: 'Consumption',
    note: 'Notes',
    split: 'Split between users',
    splitHelp: 'Percentages define reimbursements between users and must total 100%.',
    noBills: 'No bills match these filters.',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    editBill: 'Edit bill',
    deleteBillConfirm: 'Delete this bill?',
    saveBill: 'Save bill',
    recurringTitle: 'Recurring expenses',
    recurringSubtitle: 'Subscriptions, mortgages, installments and other predictable charges that make forecasts more accurate.',
    addRecurring: 'Add recurring expense',
    searchRecurring: 'Search recurring expenses…',
    allRecurringKinds: 'All types',
    allRecurringStatuses: 'All statuses',
    recurringActive: 'Active',
    recurringInactive: 'Paused',
    recurringEnded: 'Ended',
    subscription: 'Subscription',
    mortgage: 'Mortgage',
    installment: 'Installment plan',
    recurringGeneric: 'Other recurring',
    activationDate: 'Activation / first charge',
    expirationDate: 'Expiration / renewal date',
    automaticRenewal: 'Automatic renewal',
    renewalEvery: 'Renewal every',
    installmentCount: 'Total installments',
    installmentCountHint: 'For installment plans, the last due date is calculated from the number of installments.',
    nextCharge: 'Next charge',
    nextRenewal: 'Next renewal',
    monthlyEquivalent: 'Monthly equivalent',
    remainingInstallments: 'installments remaining',
    remainingCommitment: 'Remaining installments',
    pause: 'Pause',
    resume: 'Resume',
    deleteRecurringConfirm: 'Delete this recurring expense?',
    noRecurring: 'No recurring expenses match these filters.',
    recurringForecastHelp: 'Recurring expenses are forecast rules. They do not mark a provider bill as paid and are not imported from email.',
    recurringOverview: 'Recurring commitments',
    recurringOverviewHelp: 'Subscriptions, mortgages and installments are included in Billy forecasts even when no monthly email exists.',
    recurringMonthly: 'Monthly equivalent',
    recurringNextMonth: 'Due next month',
    recurringActiveCount: 'Active recurring',
    installmentsRemainingValue: 'Installments remaining',
    manageRecurring: 'Manage recurring',
    settingsTitle: 'Billy settings',
    settingsSubtitle: 'Manage bill types, payers and automatic parsing without leaving Billy.',
    billTypes: 'Bill types',
    payers: 'Payers',
    sources: 'Email sources',
    system: 'System',
    developer: 'Developer & support',
    addBillType: 'Add bill type',
    addPayer: 'Add payer',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    enabled: 'Enabled',
    disabled: 'Disabled',
    name: 'Name',
    interval: 'Billing interval',
    months: 'months',
    color: 'Color',
    consumptionUnit: 'Consumption unit',
    defaultProvider: 'Default provider',
    defaultContract: 'Default contract',
    defaultPayer: 'Default payer',
    none: 'None',
    share: 'Default share',
    paypal: 'PayPal.Me username',
    noPayers: 'No payers configured.',
    noCategories: 'No bill types configured.',
    imapHelp: 'Select the Home Assistant IMAP integrations Billy may use for automatic parsing.',
    saveSources: 'Save sources',
    noSources: 'No Home Assistant IMAP source is available.',
    sourcesSaved: 'Email sources saved.',
    catalogRefresh: 'Parser catalog refresh',
    catalogRefreshBody: 'Billy automatically refreshes the parser catalog every day at 00:00 using the Home Assistant local timezone. Installed parsers are never updated silently.',
    currency: 'Currency',
    version: 'Billy version',
    categoriesCount: 'Bill types',
    payersCount: 'Payers',
    parsersCount: 'Installed parsers',
    confirmDeleteCategory: 'Delete this bill type?',
    confirmDeletePayer: 'Delete this payer?',
    settingsSaved: 'Changes saved.',
    error: 'Error',
    loading: 'Loading Billy…',
    retry: 'Retry',
    parserStatus: 'Parser status',
    updatesAvailable: 'updates available',
    upToDate: 'All installed parsers are up to date',
    categoryInUse: 'This bill type cannot be deleted while it is in use.',
    payerInUse: 'This payer cannot be deleted while it is in use.',
    developerName: 'Roberto Tortora',
    developerRole: 'Creator and maintainer of Billy',
    developerCredits: 'Billy is developed and maintained as an open-source project for the Home Assistant community.',
    githubProfile: 'GitHub profile',
    linkedinProfile: 'LinkedIn',
    billyRepository: 'Billy repository',
    parserRepository: 'Parser repository',
    starProject: '⭐ Open and star',
    supportDevelopment: 'Support development',
    supportDevelopmentBody: 'If Billy is useful to you, you can support its development with a donation. Donations are optional and do not unlock features.',
    donate: '☕ Make a donation',
    openRepository: 'Open repository'
  },
  it: {
    dashboard: 'Panoramica',
    bills: 'Bollette',
    recurring: 'Ricorrenti',
    parsers: 'Parser',
    settings: 'Impostazioni',
    subtitle: 'Bollette, previsioni e parsing automatico in un unico posto.',
    currentMonth: 'Questo mese',
    outstanding: 'Bollette da pagare',
    yearTotal: 'Pagato quest’anno',
    nextMonth: 'Stima prossimo mese',
    pendingImports: 'Da verificare',
    activeParsers: 'Parser installati',
    parserUpdates: 'Aggiornamenti parser',
    spendingTrend: 'Andamento spese',
    last12Months: 'Ultimi 12 mesi + previsione',
    categoryBreakdown: 'Questo mese per tipologia',
    upcomingBills: 'Prossime bollette',
    recentBills: 'Bollette recenti',
    viewBills: 'Gestisci bollette',
    viewParsers: 'Apri parser',
    noData: 'Non ci sono ancora dati disponibili.',
    noUpcoming: 'Nessuna bolletta prevista.',
    actual: 'Reale',
    forecast: 'Previsione',
    paid: 'Bolletta pagata',
    unpaid: 'Bolletta da pagare',
    due: 'Scadenza',
    reimbursements: 'Rimborsi tra utenti',
    reimbursementsHelp: 'Pagamento bolletta e rimborsi sono indipendenti: “bolletta pagata” significa che il pagante ha saldato il fornitore; un “rimborso” indica invece il trasferimento della propria quota tra utenti.',
    reimbursementDue: 'Rimborso da effettuare',
    reimbursementHistory: 'Rimborsi recenti',
    confirmReimbursement: 'Conferma rimborso',
    undoReimbursement: 'Annulla',
    reimbursementsEven: 'Non ci sono rimborsi da regolare.',
    payPaypal: 'Paga con PayPal',
    paypalNotConfigured: 'PayPal.Me non configurato',
    billsTitle: 'Tutte le bollette',
    billsSubtitle: 'Storico completo con stato del pagamento al fornitore, modifica e inserimento manuale.',
    addBill: 'Aggiungi bolletta',
    searchBills: 'Cerca bollette…',
    allTypes: 'Tutte le tipologie',
    allStatuses: 'Tutti gli stati',
    allReimbursementStatuses: 'Tutti i rimborsi',
    allYears: 'Tutti gli anni',
    providerPaid: 'Bolletta pagata',
    providerUnpaid: 'Bolletta da pagare',
    reimbursementPending: 'Da rimborsare',
    reimbursementDone: 'Rimborsato',
    reimbursementPartial: 'Parzialmente rimborsato',
    reimbursementNone: 'Nessun rimborso',
    reimbursementStatus: 'Rimborso tra utenti',
    reimbursementToggleHelp: 'Segna rapidamente come completati tutti i rimborsi di questa bolletta. I rimborsi registrati nello storico vanno annullati dalla Panoramica.',
    billType: 'Tipologia',
    billingMonth: 'Mese bolletta',
    amount: 'Importo',
    provider: 'Fornitore',
    contract: 'Contratto',
    payer: 'Pagante',
    paymentStatus: 'Pagamento bolletta',
    paymentDate: 'Data pagamento',
    dueDate: 'Scadenza',
    periodStart: 'Inizio competenza',
    periodEnd: 'Fine competenza',
    consumption: 'Consumo',
    note: 'Note',
    split: 'Divisione tra utenti',
    splitHelp: 'Le percentuali definiscono i rimborsi tra utenti e devono totalizzare il 100%.',
    noBills: 'Nessuna bolletta corrisponde ai filtri.',
    page: 'Pagina',
    previous: 'Precedente',
    next: 'Successiva',
    editBill: 'Modifica bolletta',
    deleteBillConfirm: 'Eliminare questa bolletta?',
    saveBill: 'Salva bolletta',
    recurringTitle: 'Spese ricorrenti',
    recurringSubtitle: 'Abbonamenti, mutui, rate e altre spese prevedibili che rendono il previsionale più preciso.',
    addRecurring: 'Aggiungi spesa ricorrente',
    searchRecurring: 'Cerca spese ricorrenti…',
    allRecurringKinds: 'Tutte le tipologie',
    allRecurringStatuses: 'Tutti gli stati',
    recurringActive: 'Attiva',
    recurringInactive: 'In pausa',
    recurringEnded: 'Terminata',
    subscription: 'Abbonamento',
    mortgage: 'Mutuo',
    installment: 'Rateizzazione',
    recurringGeneric: 'Altra ricorrente',
    activationDate: 'Attivazione / prima scadenza',
    expirationDate: 'Scadenza / data rinnovo',
    automaticRenewal: 'Rinnovo automatico',
    renewalEvery: 'Rinnovo ogni',
    installmentCount: 'Numero totale rate',
    installmentCountHint: 'Per le rateizzazioni Billy calcola l’ultima scadenza dal numero totale di rate.',
    nextCharge: 'Prossimo addebito',
    nextRenewal: 'Prossimo rinnovo',
    monthlyEquivalent: 'Equivalente mensile',
    remainingInstallments: 'rate rimanenti',
    remainingCommitment: 'Rate residue',
    pause: 'Metti in pausa',
    resume: 'Riattiva',
    deleteRecurringConfirm: 'Eliminare questa spesa ricorrente?',
    noRecurring: 'Nessuna spesa ricorrente corrisponde ai filtri.',
    recurringForecastHelp: 'Le spese ricorrenti sono regole previsionali: non indicano che una bolletta al fornitore sia stata pagata e non dipendono dalle email.',
    recurringOverview: 'Impegni ricorrenti',
    recurringOverviewHelp: 'Abbonamenti, mutui e rate entrano nelle previsioni Billy anche quando non esiste una mail mensile.',
    recurringMonthly: 'Equivalente mensile',
    recurringNextMonth: 'In scadenza il prossimo mese',
    recurringActiveCount: 'Ricorrenti attive',
    installmentsRemainingValue: 'Rate residue',
    manageRecurring: 'Gestisci ricorrenti',
    settingsTitle: 'Impostazioni Billy',
    settingsSubtitle: 'Gestisci tipologie, pagatori e parsing automatico senza uscire da Billy.',
    billTypes: 'Tipologie bolletta',
    payers: 'Pagatori',
    sources: 'Sorgenti email',
    system: 'Sistema',
    developer: 'Sviluppatore e supporto',
    addBillType: 'Aggiungi tipologia',
    addPayer: 'Aggiungi pagatore',
    edit: 'Modifica',
    delete: 'Elimina',
    save: 'Salva',
    cancel: 'Annulla',
    enabled: 'Attiva',
    disabled: 'Disattivata',
    name: 'Nome',
    interval: 'Intervallo fatturazione',
    months: 'mesi',
    color: 'Colore',
    consumptionUnit: 'Unità di consumo',
    defaultProvider: 'Fornitore predefinito',
    defaultContract: 'Contratto predefinito',
    defaultPayer: 'Pagante predefinito',
    none: 'Nessuno',
    share: 'Quota predefinita',
    paypal: 'Username PayPal.Me',
    noPayers: 'Nessun pagatore configurato.',
    noCategories: 'Nessuna tipologia configurata.',
    imapHelp: 'Seleziona le integrazioni IMAP di Home Assistant che Billy può usare per il parsing automatico.',
    saveSources: 'Salva sorgenti',
    noSources: 'Non è disponibile nessuna sorgente IMAP di Home Assistant.',
    sourcesSaved: 'Sorgenti email salvate.',
    catalogRefresh: 'Aggiornamento catalogo parser',
    catalogRefreshBody: 'Billy aggiorna automaticamente il catalogo parser ogni giorno alle 00:00 usando il fuso orario di Home Assistant. I parser installati non vengono mai aggiornati automaticamente.',
    currency: 'Valuta',
    version: 'Versione Billy',
    categoriesCount: 'Tipologie',
    payersCount: 'Pagatori',
    parsersCount: 'Parser installati',
    confirmDeleteCategory: 'Eliminare questa tipologia di bolletta?',
    confirmDeletePayer: 'Eliminare questo pagatore?',
    settingsSaved: 'Modifiche salvate.',
    error: 'Errore',
    loading: 'Caricamento Billy…',
    retry: 'Riprova',
    parserStatus: 'Stato parser',
    updatesAvailable: 'aggiornamenti disponibili',
    upToDate: 'Tutti i parser installati sono aggiornati',
    categoryInUse: 'Questa tipologia non può essere eliminata mentre è in uso.',
    payerInUse: 'Questo pagatore non può essere eliminato mentre è in uso.',
    developerName: 'Roberto Tortora',
    developerRole: 'Creatore e maintainer di Billy',
    developerCredits: 'Billy è sviluppato e mantenuto come progetto open source per la community di Home Assistant.',
    githubProfile: 'Profilo GitHub',
    linkedinProfile: 'LinkedIn',
    billyRepository: 'Repository Billy',
    parserRepository: 'Repository parser',
    starProject: '⭐ Apri e lascia una stella',
    supportDevelopment: 'Supporta lo sviluppo',
    supportDevelopmentBody: 'Se Billy ti è utile, puoi supportarne lo sviluppo con una donazione. Le donazioni sono facoltative e non sbloccano funzionalità.',
    donate: '☕ Fai una donazione',
    openRepository: 'Apri repository'
  }
}
function languageOf (hass) {
  const raw = hass?.language || hass?.locale?.language || navigator.language || 'en'
  return String(raw).toLowerCase().split(/[-_]/)[0] === 'it' ? 'it' : 'en'
}

function localeOf (hass) {
  const raw = hass?.locale?.language || hass?.language || navigator.language || 'en-US'
  return String(raw).replace('_', '-')
}

function tFor (hass, key) {
  const lang = languageOf(hass)
  return TEXT[lang]?.[key] ?? TEXT.en[key] ?? key
}

function escapeHtml (value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function safeColor (value) {
  const text = String(value || '').trim()
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : '#7b8794'
}

class BillyDashboard extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._data = null
    this._parserData = null
    this._loading = false
    this._error = null
    this._unsubscribeBills = null
    this._unsubscribeImports = null
  }

  set hass (value) {
    const changed = value !== this._hass
    this._hass = value
    if (changed && this.isConnected) {
      this._subscribe()
      this._load()
    }
  }

  get hass () {
    return this._hass
  }

  connectedCallback () {
    this._subscribe()
    this._load()
  }

  disconnectedCallback () {
    this._unsubscribeBills?.()
    this._unsubscribeImports?.()
    this._unsubscribeBills = null
    this._unsubscribeImports = null
  }

  async _subscribe () {
    if (!this._hass) return
    if (!this._unsubscribeBills) {
      try {
        this._unsubscribeBills = await this._hass.connection.subscribeEvents(
          () => this._load(),
          'bill_tracker_updated'
        )
      } catch (_error) {}
    }
    if (!this._unsubscribeImports) {
      try {
        this._unsubscribeImports = await this._hass.connection.subscribeEvents(
          () => this._load(),
          'bill_tracker_import_updated'
        )
      } catch (_error) {}
    }
  }

  async _load () {
    if (!this._hass || this._loading) return
    this._loading = true
    this._render()
    try {
      const [data, parserData] = await Promise.all([
        this._hass.callWS({ type: 'bill_tracker/list', forecast_months: 12 }),
        this._hass.callWS({ type: 'bill_tracker/parser/list' }).catch(() => null)
      ])
      this._data = data
      this._parserData = parserData
      this._error = null
    } catch (error) {
      this._error = String(error?.message || error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _t (key) {
    return tFor(this._hass, key)
  }

  _money (value) {
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'
    try {
      return new Intl.NumberFormat(localeOf(this._hass), {
        style: 'currency',
        currency
      }).format(Number(value || 0))
    } catch (_error) {
      return `${Number(value || 0).toFixed(2)} ${currency}`
    }
  }

  _compactMoney (value) {
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'
    try {
      return new Intl.NumberFormat(localeOf(this._hass), {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(Number(value || 0))
    } catch (_error) {
      return `${Math.round(Number(value || 0))} ${currency}`
    }
  }

  _monthLabel (row, short = true) {
    if (!row) return ''
    return new Intl.DateTimeFormat(localeOf(this._hass), {
      month: short ? 'short' : 'long',
      year: '2-digit'
    }).format(new Date(Number(row.year), Number(row.month) - 1, 1))
  }

  _date (value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
    if (!match) return ''
    return new Intl.DateTimeFormat(localeOf(this._hass), {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  }

  _categoryByName (name) {
    return (this._data?.categories || []).find(item => item.name === name) || null
  }

  _currentRow () {
    const now = new Date()
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return (this._data?.monthly || []).find(row => row.key === key) || null
  }

  _parserStats () {
    const catalogRows = this._parserData?.catalog?.parsers || []
    const installedRows = this._parserData?.installed || []
    const officialInstalled = installedRows.filter(row => row.source !== 'custom')
    const byId = new Map(catalogRows.map(row => [String(row.id), row]))
    let updates = 0
    for (const installed of officialInstalled) {
      const remote = byId.get(String(installed.id))
      if (remote && Number(remote.version || 0) > Number(installed.version || 0)) updates += 1
    }
    return {
      installed: installedRows.length,
      updates,
      pending: (this._parserData?.imports || []).filter(row => row.status === 'pending').length
    }
  }

  _chart () {
    const actual = (this._data?.monthly || []).slice(-12)
    const forecast = (this._data?.forecast || []).slice(0, 6)
    if (!actual.length && !forecast.length) {
      return `<div class="empty">${escapeHtml(this._t('noData'))}</div>`
    }

    const rows = [
      ...actual.map(row => ({ ...row, kind: 'actual' })),
      ...forecast.map(row => ({ ...row, kind: 'forecast' }))
    ]
    const maxValue = Math.max(1, ...rows.map(row => Number(row.total || 0))) * 1.12
    const width = 1180
    const height = 330
    const left = 58
    const right = 24
    const top = 22
    const bottom = 54
    const plotWidth = width - left - right
    const plotHeight = height - top - bottom
    const step = plotWidth / Math.max(1, rows.length)
    const barWidth = Math.max(14, Math.min(42, step * 0.62))
    const x = index => left + step * index + step / 2
    const y = value => top + plotHeight - (Number(value || 0) / maxValue) * plotHeight

    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map(ratio => {
        const gy = top + plotHeight * (1 - ratio)
        return `<line x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}" class="grid" />
          <text x="${left - 8}" y="${gy + 4}" text-anchor="end" class="axis">${escapeHtml(this._compactMoney(maxValue * ratio))}</text>`
      })
      .join('')

    const bars = rows
      .map((row, index) => {
        const total = Math.max(0, Number(row.total || 0))
        const bx = x(index) - barWidth / 2
        if (row.kind === 'forecast') {
          const by = y(total)
          const bh = top + plotHeight - by
          return `<rect x="${bx}" y="${by}" width="${barWidth}" height="${bh}" rx="5" class="forecast-bar">
            <title>${escapeHtml(`${this._monthLabel(row, false)} · ${this._money(total)} · ${this._t('forecast')}`)}</title>
          </rect>`
        }

        let cursor = top + plotHeight
        const parts = []
        const entries = Object.entries(row.categories || {}).filter(([, value]) => Number(value) > 0)
        if (!entries.length) {
          const by = y(total)
          const bh = top + plotHeight - by
          parts.push(`<rect x="${bx}" y="${by}" width="${barWidth}" height="${bh}" rx="5" class="actual-bar" />`)
        } else {
          for (const [name, raw] of entries) {
            const value = Number(raw || 0)
            const segmentHeight = (value / maxValue) * plotHeight
            cursor -= segmentHeight
            const color = safeColor(this._categoryByName(name)?.color)
            parts.push(`<rect x="${bx}" y="${cursor}" width="${barWidth}" height="${segmentHeight}" fill="${color}">
              <title>${escapeHtml(`${name} · ${this._money(value)}`)}</title>
            </rect>`)
          }
        }
        return `<g>${parts.join('')}<title>${escapeHtml(`${this._monthLabel(row, false)} · ${this._money(total)}`)}</title></g>`
      })
      .join('')

    const labels = rows
      .map((row, index) => `<text x="${x(index)}" y="${height - 21}" text-anchor="middle" class="month ${row.kind === 'forecast' ? 'forecast-label' : ''}">${escapeHtml(this._monthLabel(row))}</text>`)
      .join('')

    return `<div class="chart-scroll"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(this._t('spendingTrend'))}">${grid}${bars}${labels}</svg></div>`
  }

  _breakdown () {
    const row = this._currentRow()
    const entries = Object.entries(row?.categories || {})
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
    if (!entries.length) return `<div class="empty">${escapeHtml(this._t('noData'))}</div>`
    const total = Math.max(1, entries.reduce((sum, [, value]) => sum + Number(value || 0), 0))
    return `<div class="breakdown-list">${entries
      .map(([name, value]) => {
        const category = this._categoryByName(name)
        const percent = Math.max(0, Math.min(100, (Number(value) / total) * 100))
        return `<div class="breakdown-row">
          <div class="breakdown-head"><span><i style="background:${safeColor(category?.color)}"></i>${escapeHtml(name)}</span><strong>${escapeHtml(this._money(value))}</strong></div>
          <div class="meter"><span style="width:${percent}%;background:${safeColor(category?.color)}"></span></div>
        </div>`
      })
      .join('')}</div>`
  }

  _upcoming () {
    const rows = (this._data?.upcoming || []).slice(0, 7)
    if (!rows.length) return `<div class="empty">${escapeHtml(this._t('noUpcoming'))}</div>`
    return `<div class="compact-list">${rows
      .map(row => `<div class="compact-row">
        <div><strong>${escapeHtml(row.category || '')}</strong><small>${escapeHtml(row.source === 'recurring' && row.due_date ? `${row.recurring_kind === 'subscription' ? this._t('subscription') : row.recurring_kind === 'mortgage' ? this._t('mortgage') : row.recurring_kind === 'installment' ? this._t('installment') : this._t('recurringGeneric')} · ${this._date(row.due_date)}` : this._monthLabel(row, false))}</small></div>
        <b>${escapeHtml(this._money(row.amount))}</b>
      </div>`)
      .join('')}</div>`
  }

  _recent () {
    const rows = (this._data?.expenses || [])
      .slice()
      .sort((a, b) => {
        const keyA = `${String(a.year).padStart(4, '0')}${String(a.month).padStart(2, '0')}${a.created_at || ''}`
        const keyB = `${String(b.year).padStart(4, '0')}${String(b.month).padStart(2, '0')}${b.created_at || ''}`
        return keyB.localeCompare(keyA)
      })
      .slice(0, 7)
    if (!rows.length) return `<div class="empty">${escapeHtml(this._t('noData'))}</div>`
    return `<div class="recent-list">${rows
      .map(row => {
        const category = (this._data?.categories || []).find(item => item.id === row.category_id)
        const subtitle = [row.provider, this._monthLabel(row, false)].filter(Boolean).join(' · ')
        return `<div class="recent-row">
          <i style="background:${safeColor(category?.color || row.category_color)}"></i>
          <div class="recent-main"><strong>${escapeHtml(row.category || '')}</strong><small>${escapeHtml(subtitle)}</small></div>
          <div class="recent-value"><b>${escapeHtml(this._money(row.amount))}</b><span class="pill ${row.paid ? 'ok' : 'warn'}">${escapeHtml(row.paid ? this._t('paid') : this._t('unpaid'))}</span></div>
        </div>`
      })
      .join('')}</div>`
  }

  _recurringOverview () {
    const summary = this._data?.summary || {}
    const rows = (this._data?.recurring_expenses || [])
      .filter(row => row.status === 'active')
      .slice()
      .sort((a, b) => String(a.next_due_date || '9999').localeCompare(String(b.next_due_date || '9999')))
      .slice(0, 5)
    const list = rows.length
      ? `<div class="recurring-overview-list">${rows.map(row => `<div class="recurring-overview-row"><div><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(`${row.kind === 'subscription' ? this._t('subscription') : row.kind === 'mortgage' ? this._t('mortgage') : row.kind === 'installment' ? this._t('installment') : this._t('recurringGeneric')} · ${this._t('nextCharge')}: ${this._date(row.next_due_date)}`)}</small></div><b>${escapeHtml(this._money(row.amount))}</b></div>`).join('')}</div>`
      : `<div class="empty">${escapeHtml(this._t('noRecurring'))}</div>`
    return `<article class="panel recurring-overview-panel">
      <div class="panel-head"><div><h2>${escapeHtml(this._t('recurringOverview'))}</h2><p>${escapeHtml(this._t('recurringOverviewHelp'))}</p></div><button class="secondary small" data-nav="recurring">${escapeHtml(this._t('manageRecurring'))}</button></div>
      <div class="recurring-stats">
        <div><span>${escapeHtml(this._t('recurringMonthly'))}</span><strong>${escapeHtml(this._money(summary.recurring_monthly_equivalent))}</strong></div>
        <div><span>${escapeHtml(this._t('recurringNextMonth'))}</span><strong>${escapeHtml(this._money(summary.recurring_next_month))}</strong></div>
        <div><span>${escapeHtml(this._t('recurringActiveCount'))}</span><strong>${Number(summary.active_recurring || 0)}</strong></div>
        <div><span>${escapeHtml(this._t('installmentsRemainingValue'))}</span><strong>${escapeHtml(this._money(summary.installment_remaining_total))}</strong></div>
      </div>
      ${list}
    </article>`
  }

  _reimbursements () {
    const debts = this._data?.debts || []
    const settlements = (this._data?.settlements || []).slice(0, 5)
    const debtHtml = debts.length
      ? `<div class="reimbursement-list">${debts.map(debt => `<div class="reimbursement-row">
          <div class="reimbursement-main"><strong>${escapeHtml(debt.from_name)} → ${escapeHtml(debt.to_name)}</strong><small>${escapeHtml(`${Number(debt.expense_count || 0)} ${this._t('bills').toLowerCase()}`)}</small></div>
          <b>${escapeHtml(this._money(debt.amount))}</b>
          <div class="reimbursement-actions">
            ${debt.paypal_url ? `<a class="paypal" href="${escapeHtml(debt.paypal_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('payPaypal'))}</a>` : `<button class="secondary small" disabled>${escapeHtml(this._t('paypalNotConfigured'))}</button>`}
            <button class="primary small" data-reimburse="1" data-from="${escapeHtml(debt.from_payer_id)}" data-to="${escapeHtml(debt.to_payer_id)}" data-amount="${Number(debt.amount || 0)}">${escapeHtml(this._t('confirmReimbursement'))}</button>
          </div>
        </div>`).join('')}</div>`
      : `<div class="reimbursement-empty">✓ ${escapeHtml(this._t('reimbursementsEven'))}</div>`

    const historyHtml = settlements.length
      ? `<div class="reimbursement-history"><h3>${escapeHtml(this._t('reimbursementHistory'))}</h3>${settlements.map(row => `<div class="history-row">
          <div><strong>${escapeHtml(`${row.from_name} → ${row.to_name}`)}</strong><small>${escapeHtml(new Date(row.created_at).toLocaleString(localeOf(this._hass)))}</small></div>
          <b>${escapeHtml(this._money(row.amount))}</b>
          <button class="secondary small" data-undo-reimbursement="${escapeHtml(row.id)}">${escapeHtml(this._t('undoReimbursement'))}</button>
        </div>`).join('')}</div>`
      : ''

    return `<article class="panel reimbursements-panel">
      <div class="panel-head"><div><h2>${escapeHtml(this._t('reimbursements'))}</h2><p>${escapeHtml(this._t('reimbursementsHelp'))}</p></div></div>
      ${debtHtml}${historyHtml}
    </article>`
  }

  async _confirmReimbursement (button) {
    if (!this._hass || !button) return
    const amount = Number(button.dataset.amount || 0)
    const from = button.dataset.from
    const to = button.dataset.to
    const fromName = (this._data?.payers || []).find(row => row.id === from)?.name || ''
    const toName = (this._data?.payers || []).find(row => row.id === to)?.name || ''
    if (!confirm(`${this._t('confirmReimbursement')}: ${this._money(amount)} · ${fromName} → ${toName}?`)) return
    try {
      await this._hass.callWS({
        type: 'bill_tracker/settlement/add',
        from_payer_id: from,
        to_payer_id: to,
        amount,
        note: this._t('reimbursements')
      })
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _undoReimbursement (id) {
    if (!this._hass || !id || !confirm(`${this._t('undoReimbursement')}?`)) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/settlement/delete', settlement_id: id })
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  _render () {
    if (this._loading && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="loading">${escapeHtml(this._t('loading'))}</div>`
      return
    }
    if (this._error) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="error-card"><strong>${escapeHtml(this._t('error'))}</strong><p>${escapeHtml(this._error)}</p><button id="retry">${escapeHtml(this._t('retry'))}</button></div>`
      this.shadowRoot.getElementById('retry')?.addEventListener('click', () => this._load())
      return
    }
    if (!this._data) return

    const summary = this._data.summary || {}
    const parserStats = this._parserStats()
    const cards = [
      [this._t('currentMonth'), this._money(summary.current_month), 'mdi:calendar-month'],
      [this._t('outstanding'), this._money(summary.outstanding_total), 'mdi:clock-alert-outline'],
      [this._t('yearTotal'), this._money(summary.year_total), 'mdi:chart-line'],
      [this._t('nextMonth'), this._money(summary.next_month_estimate), 'mdi:crystal-ball'],
      [this._t('pendingImports'), String(parserStats.pending), 'mdi:file-search-outline'],
      [this._t('parserUpdates'), String(parserStats.updates), 'mdi:update']
    ]

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="dashboard">
        <div class="hero">
          <div>
            <h1>${escapeHtml(this._t('dashboard'))}</h1>
            <p>${escapeHtml(this._t('subtitle'))}</p>
          </div>
          <div class="hero-actions">
            <button class="secondary" data-nav="parsers">${escapeHtml(this._t('viewParsers'))}</button>
            <button class="primary" data-nav="bills">${escapeHtml(this._t('viewBills'))}</button>
          </div>
        </div>
        <div class="kpis">${cards
          .map(([label, value, icon]) => `<article class="kpi"><ha-icon icon="${icon}"></ha-icon><div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div></article>`)
          .join('')}</div>
        <div class="grid-main">
          <article class="panel chart-panel">
            <div class="panel-head"><div><h2>${escapeHtml(this._t('spendingTrend'))}</h2><p>${escapeHtml(this._t('last12Months'))}</p></div><div class="legend"><span><i class="actual-dot"></i>${escapeHtml(this._t('actual'))}</span><span><i class="forecast-dot"></i>${escapeHtml(this._t('forecast'))}</span></div></div>
            ${this._chart()}
          </article>
          <article class="panel breakdown-panel">
            <div class="panel-head"><div><h2>${escapeHtml(this._t('categoryBreakdown'))}</h2></div></div>
            ${this._breakdown()}
          </article>
        </div>
        <div class="grid-bottom">
          <article class="panel">
            <div class="panel-head"><div><h2>${escapeHtml(this._t('upcomingBills'))}</h2></div></div>
            ${this._upcoming()}
          </article>
          <article class="panel recent-panel">
            <div class="panel-head"><div><h2>${escapeHtml(this._t('recentBills'))}</h2></div></div>
            ${this._recent()}
          </article>
          <article class="panel parser-health">
            <div class="panel-head"><div><h2>${escapeHtml(this._t('parserStatus'))}</h2></div></div>
            <div class="parser-stat"><span>${escapeHtml(this._t('activeParsers'))}</span><strong>${parserStats.installed}</strong></div>
            <div class="parser-stat"><span>${escapeHtml(this._t('pendingImports'))}</span><strong>${parserStats.pending}</strong></div>
            <div class="parser-stat"><span>${escapeHtml(this._t('parserUpdates'))}</span><strong class="${parserStats.updates ? 'attention' : ''}">${parserStats.updates}</strong></div>
            <div class="parser-message ${parserStats.updates ? 'attention' : ''}">${escapeHtml(parserStats.updates ? `${parserStats.updates} ${this._t('updatesAvailable')}` : this._t('upToDate'))}</div>
            <button class="secondary full" data-nav="parsers">${escapeHtml(this._t('viewParsers'))}</button>
          </article>
        </div>
        ${this._recurringOverview()}
        ${this._reimbursements()}
      </div>
    `
    for (const button of this.shadowRoot.querySelectorAll('[data-nav]')) {
      button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('billy-navigate', {
          bubbles: true,
          composed: true,
          detail: { view: button.dataset.nav }
        }))
      })
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-reimburse]')) {
      button.addEventListener('click', () => this._confirmReimbursement(button))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-undo-reimbursement]')) {
      button.addEventListener('click', () => this._undoReimbursement(button.dataset.undoReimbursement))
    }
  }

  _styles () {
    return `
      :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.dashboard{display:flex;flex-direction:column;gap:20px}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:4px 2px 2px}.hero h1{font-size:30px;line-height:1.1;margin:0 0 6px}.hero p{margin:0;color:var(--secondary-text-color);font-size:14px}.hero-actions{display:flex;gap:10px}.primary,.secondary,.error-card button{appearance:none;border-radius:10px;padding:10px 15px;font:inherit;font-weight:650;cursor:pointer}.primary{border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.secondary,.error-card button{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)}.kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.kpi{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:16px;display:flex;gap:12px;align-items:center;min-width:0}.kpi ha-icon{color:var(--primary-color);--mdc-icon-size:24px}.kpi div{display:flex;flex-direction:column;gap:4px;min-width:0}.kpi span{font-size:12px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kpi strong{font-size:20px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.panel{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;padding:18px;min-width:0}.panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.panel-head h2{font-size:18px;margin:0}.panel-head p{font-size:12px;color:var(--secondary-text-color);margin:4px 0 0}.grid-main{display:grid;grid-template-columns:minmax(0,2.1fr) minmax(300px,.9fr);gap:16px}.grid-bottom{display:grid;grid-template-columns:minmax(260px,.8fr) minmax(380px,1.5fr) minmax(260px,.7fr);gap:16px}.chart-scroll{overflow:auto hidden}.chart-scroll svg{display:block;width:100%;min-width:720px;height:auto}.grid{stroke:var(--divider-color);stroke-width:1}.axis,.month{fill:var(--secondary-text-color);font-size:11px}.forecast-label{font-style:italic}.actual-bar{fill:var(--primary-color)}.forecast-bar{fill:var(--primary-color);opacity:.22;stroke:var(--primary-color);stroke-width:1.5;stroke-dasharray:4 3}.legend{display:flex;gap:14px;color:var(--secondary-text-color);font-size:12px}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:10px;height:10px;border-radius:3px;display:inline-block}.actual-dot{background:var(--primary-color)}.forecast-dot{background:color-mix(in srgb,var(--primary-color) 25%,transparent);border:1px dashed var(--primary-color)}.breakdown-list{display:flex;flex-direction:column;gap:14px}.breakdown-row{display:flex;flex-direction:column;gap:7px}.breakdown-head{display:flex;justify-content:space-between;gap:12px;font-size:13px}.breakdown-head span{display:flex;align-items:center;gap:8px;min-width:0}.breakdown-head i{width:10px;height:10px;border-radius:50%;flex:none}.breakdown-head strong{font-size:13px}.meter{height:7px;border-radius:99px;background:var(--secondary-background-color);overflow:hidden}.meter span{display:block;height:100%;border-radius:99px}.compact-list,.recent-list{display:flex;flex-direction:column}.compact-row,.recent-row{border-top:1px solid var(--divider-color);padding:12px 0}.compact-row:first-child,.recent-row:first-child{border-top:0;padding-top:2px}.compact-row{display:flex;justify-content:space-between;align-items:center;gap:16px}.compact-row div{display:flex;flex-direction:column;gap:3px}.compact-row small,.recent-row small{color:var(--secondary-text-color)}.recent-row{display:grid;grid-template-columns:10px minmax(0,1fr) auto;align-items:center;gap:12px}.recent-row>i{width:10px;height:36px;border-radius:99px}.recent-main,.recent-value{display:flex;flex-direction:column;gap:3px}.recent-value{align-items:flex-end}.pill{font-size:10px;padding:2px 7px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color)}.pill.ok{color:var(--success-color,#2e7d32);background:color-mix(in srgb,var(--success-color,#2e7d32) 12%,transparent)}.pill.warn{color:var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 12%,transparent)}.parser-health{display:flex;flex-direction:column}.parser-stat{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--divider-color);font-size:13px}.parser-stat strong{font-size:18px}.attention{color:var(--warning-color,#f9a825)!important}.parser-message{font-size:12px;color:var(--secondary-text-color);padding:14px 0}.full{width:100%;margin-top:auto}.recurring-overview-panel{display:flex;flex-direction:column;gap:10px}.recurring-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.recurring-stats>div{padding:12px;border-radius:12px;background:var(--secondary-background-color);display:flex;flex-direction:column;gap:4px}.recurring-stats span{font-size:11px;color:var(--secondary-text-color)}.recurring-stats strong{font-size:17px}.recurring-overview-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.recurring-overview-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 12px;border:1px solid var(--divider-color);border-radius:11px}.recurring-overview-row>div{display:flex;flex-direction:column;gap:3px;min-width:0}.recurring-overview-row small{color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.reimbursements-panel{display:flex;flex-direction:column;gap:4px}.reimbursement-list{display:flex;flex-direction:column}.reimbursement-row{display:grid;grid-template-columns:minmax(220px,1fr) auto auto;gap:16px;align-items:center;padding:13px 0;border-top:1px solid var(--divider-color)}.reimbursement-row:first-child{border-top:0}.reimbursement-main{display:flex;flex-direction:column;gap:3px}.reimbursement-main small,.history-row small{color:var(--secondary-text-color)}.reimbursement-actions{display:flex;gap:8px;align-items:center}.small{padding:7px 10px;font-size:12px}.paypal{display:inline-flex;align-items:center;justify-content:center;border-radius:10px;padding:8px 11px;background:#0070ba;color:white;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap}.reimbursement-empty{padding:16px;border-radius:12px;background:color-mix(in srgb,var(--success-color,#2e7d32) 10%,transparent);color:var(--success-color,#2e7d32)}.reimbursement-history{margin-top:14px;padding-top:14px;border-top:1px solid var(--divider-color)}.reimbursement-history h3{font-size:13px;margin:0 0 8px;color:var(--secondary-text-color)}.history-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:8px 0}.history-row>div{display:flex;flex-direction:column;gap:2px}.empty{padding:28px 8px;text-align:center;color:var(--secondary-text-color);font-size:13px}.loading,.error-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:24px}.loading{text-align:center;color:var(--secondary-text-color)}.error-card p{color:var(--secondary-text-color)}
      @media(max-width:1180px){.kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-main{grid-template-columns:1fr}.grid-bottom{grid-template-columns:1fr 1fr}.parser-health{grid-column:1/-1}}
      @media(max-width:720px){.recurring-stats{grid-template-columns:1fr 1fr}.reimbursement-row,.history-row{grid-template-columns:1fr}.reimbursement-actions{flex-wrap:wrap}.hero{align-items:flex-start;flex-direction:column}.hero-actions{width:100%}.hero-actions button{flex:1}.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-bottom{grid-template-columns:1fr}.parser-health{grid-column:auto}.panel{padding:14px}.legend{display:none}.hero h1{font-size:25px}}
    `
  }
}

class BillyBills extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._data = null
    this._loading = false
    this._error = null
    this._search = ''
    this._category = 'all'
    this._status = 'all'
    this._reimbursement = 'all'
    this._year = 'all'
    this._page = 1
    this._pageSize = 25
    this._editing = null
    this._unsubscribe = null
  }

  set hass (value) {
    const changed = value !== this._hass
    this._hass = value
    if (changed && this.isConnected) {
      this._subscribe()
      this._load()
    }
  }

  get hass () {
    return this._hass
  }

  connectedCallback () {
    this._subscribe()
    this._load()
  }

  disconnectedCallback () {
    this._unsubscribe?.()
    this._unsubscribe = null
  }

  _t (key) {
    return tFor(this._hass, key)
  }

  async _subscribe () {
    if (!this._hass || this._unsubscribe) return
    try {
      this._unsubscribe = await this._hass.connection.subscribeEvents(
        () => this._load(false),
        'bill_tracker_updated'
      )
    } catch (_error) {}
  }

  async _load (showLoading = true) {
    if (!this._hass || this._loading) return
    if (showLoading) this._loading = true
    if (showLoading) this._render()
    try {
      this._data = await this._hass.callWS({ type: 'bill_tracker/list', forecast_months: 1 })
      this._error = null
    } catch (error) {
      this._error = String(error?.message || error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _money (value) {
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'
    try {
      return new Intl.NumberFormat(localeOf(this._hass), {
        style: 'currency',
        currency
      }).format(Number(value || 0))
    } catch (_error) {
      return `${Number(value || 0).toFixed(2)} ${currency}`
    }
  }

  _monthValue (year, month) {
    if (!year || !month) return ''
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`
  }

  _parseMonth (value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ''))
    if (!match) return null
    return { year: Number(match[1]), month: Number(match[2]) }
  }

  _monthLabel (row) {
    const year = Number(row?.paid_year || row?.year || 0)
    const month = Number(row?.paid_month || row?.month || 0)
    if (!year || !month) return ''
    return new Intl.DateTimeFormat(localeOf(this._hass), {
      month: 'long',
      year: 'numeric'
    }).format(new Date(year, month - 1, 1))
  }

  _date (value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
    if (!match) return '—'
    return new Intl.DateTimeFormat(localeOf(this._hass), {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  }

  _categoryById (id) {
    return (this._data?.categories || []).find(row => row.id === id) || null
  }

  _payerById (id) {
    return (this._data?.payers || []).find(row => row.id === id) || null
  }

  _filtered () {
    const query = this._search.trim().toLocaleLowerCase(localeOf(this._hass))
    return (this._data?.expenses || [])
      .filter(row => {
        if (this._category !== 'all' && row.category_id !== this._category) return false
        if (this._status === 'paid' && !row.paid) return false
        if (this._status === 'unpaid' && row.paid) return false
        if (this._reimbursement === 'pending' && !['pending', 'partial'].includes(row.reimbursement_status)) return false
        if (this._reimbursement === 'done' && row.reimbursement_status !== 'done') return false
        if (this._reimbursement === 'none' && row.reimbursement_status !== 'none') return false
        if (this._year !== 'all' && Number(row.paid_year || row.year) !== Number(this._year)) return false
        if (!query) return true
        const haystack = [
          row.category,
          row.provider,
          row.contract,
          row.payer,
          row.note,
          row.amount,
          row.due_date
        ].join(' ').toLocaleLowerCase(localeOf(this._hass))
        return haystack.includes(query)
      })
      .sort((a, b) => {
        const aKey = `${String(a.paid_year || a.year).padStart(4, '0')}${String(a.paid_month || a.month).padStart(2, '0')}${a.created_at || ''}`
        const bKey = `${String(b.paid_year || b.year).padStart(4, '0')}${String(b.paid_month || b.month).padStart(2, '0')}${b.created_at || ''}`
        return bKey.localeCompare(aKey)
      })
  }

  _rowsHtml () {
    const filtered = this._filtered()
    const pages = Math.max(1, Math.ceil(filtered.length / this._pageSize))
    this._page = Math.min(Math.max(1, this._page), pages)
    const start = (this._page - 1) * this._pageSize
    const rows = filtered.slice(start, start + this._pageSize)
    if (!rows.length) return `<div class="empty">${escapeHtml(this._t('noBills'))}</div>`
    return rows.map(row => {
      const category = this._categoryById(row.category_id)
      const splitText = (row.split || []).map(part => `${part.name} ${Number(part.percentage || 0).toLocaleString(localeOf(this._hass), { maximumFractionDigits: 2 })}%`).join(' · ')
      const details = [row.provider, row.contract].filter(Boolean).join(' · ')
      return `<article class="bill-row">
        <label class="paid-toggle" title="${escapeHtml(this._t('paymentStatus'))}"><input type="checkbox" data-paid-id="${escapeHtml(row.id)}" ${row.paid ? 'checked' : ''}><span></span></label>
        <i class="category-color" style="background:${safeColor(category?.color || row.category_color)}"></i>
        <div class="bill-main"><strong>${escapeHtml(row.category || '')}</strong><small>${escapeHtml(details || '—')}</small><small>${escapeHtml([row.payer, splitText].filter(Boolean).join(' · '))}</small></div>
        <div class="bill-month"><span>${escapeHtml(this._monthLabel(row))}</span><small>${escapeHtml(`${this._t('due')}: ${this._date(row.due_date)}`)}</small></div>
        <div class="bill-state">
          <span class="state ${row.paid ? 'paid' : 'unpaid'}">${escapeHtml(row.paid ? this._t('providerPaid') : this._t('providerUnpaid'))}</span>
          <div class="reimbursement-line">
            ${row.reimbursement_status !== 'none' ? `<label class="reimbursement-toggle" title="${escapeHtml(this._t('reimbursementToggleHelp'))}"><input type="checkbox" data-reimbursed-id="${escapeHtml(row.id)}" ${row.reimbursement_done ? 'checked' : ''} ${row.reimbursement_can_toggle ? '' : 'disabled'}><span></span></label>` : ''}
            <span class="state reimbursement ${escapeHtml(row.reimbursement_status || 'none')}">${escapeHtml(row.reimbursement_status === 'done' ? this._t('reimbursementDone') : row.reimbursement_status === 'partial' ? this._t('reimbursementPartial') : row.reimbursement_status === 'pending' ? this._t('reimbursementPending') : this._t('reimbursementNone'))}</span>
          </div>
        </div>
        <strong class="bill-amount">${escapeHtml(this._money(row.amount))}</strong>
        <div class="bill-actions"><button type="button" data-edit-bill="${escapeHtml(row.id)}">${escapeHtml(this._t('edit'))}</button><button type="button" class="danger" data-delete-bill="${escapeHtml(row.id)}">${escapeHtml(this._t('delete'))}</button></div>
      </article>`
    }).join('')
  }

  _pagerHtml () {
    const count = this._filtered().length
    const pages = Math.max(1, Math.ceil(count / this._pageSize))
    return `<div class="pager"><span>${escapeHtml(`${count} · ${this._t('page')} ${this._page}/${pages}`)}</span><div><button type="button" id="prev-page" ${this._page <= 1 ? 'disabled' : ''}>${escapeHtml(this._t('previous'))}</button><button type="button" id="next-page" ${this._page >= pages ? 'disabled' : ''}>${escapeHtml(this._t('next'))}</button></div></div>`
  }

  _renderListOnly () {
    const rows = this.shadowRoot.getElementById('bill-rows')
    const pager = this.shadowRoot.getElementById('bill-pager')
    if (rows) rows.innerHTML = this._rowsHtml()
    if (pager) pager.innerHTML = this._pagerHtml()
    this._wireRows()
    this._wirePager()
  }

  _wireRows () {
    for (const input of this.shadowRoot.querySelectorAll('[data-paid-id]')) {
      input.addEventListener('change', () => this._setPaid(input))
    }
    for (const input of this.shadowRoot.querySelectorAll('[data-reimbursed-id]')) {
      input.addEventListener('change', () => this._setReimbursement(input))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-edit-bill]')) {
      button.addEventListener('click', () => this._openBill(button.dataset.editBill))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-delete-bill]')) {
      button.addEventListener('click', () => this._deleteBill(button.dataset.deleteBill))
    }
  }

  _wirePager () {
    this.shadowRoot.getElementById('prev-page')?.addEventListener('click', () => {
      this._page -= 1
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('next-page')?.addEventListener('click', () => {
      this._page += 1
      this._renderListOnly()
    })
  }

  _render () {
    if (this._loading && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="loading">${escapeHtml(this._t('loading'))}</div>`
      return
    }
    if (this._error && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="error-card"><strong>${escapeHtml(this._t('error'))}</strong><p>${escapeHtml(this._error)}</p><button id="retry">${escapeHtml(this._t('retry'))}</button></div>`
      this.shadowRoot.getElementById('retry')?.addEventListener('click', () => this._load())
      return
    }
    if (!this._data) return

    const categories = (this._data.categories || []).slice().sort((a, b) => String(a.name).localeCompare(String(b.name), localeOf(this._hass)))
    const years = [...new Set((this._data.expenses || []).map(row => Number(row.paid_year || row.year)).filter(Boolean))].sort((a, b) => b - a)
    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="bills-page">
        <div class="hero"><div><h1>${escapeHtml(this._t('billsTitle'))}</h1><p>${escapeHtml(this._t('billsSubtitle'))}</p></div><button class="primary" id="add-bill"><ha-icon icon="mdi:plus"></ha-icon>${escapeHtml(this._t('addBill'))}</button></div>
        ${this._error ? `<div class="notice error">${escapeHtml(this._error)}</div>` : ''}
        <div class="toolbar">
          <label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input id="bill-search" type="search" value="${escapeHtml(this._search)}" placeholder="${escapeHtml(this._t('searchBills'))}"></label>
          <select id="bill-category"><option value="all">${escapeHtml(this._t('allTypes'))}</option>${categories.map(row => `<option value="${escapeHtml(row.id)}" ${this._category === row.id ? 'selected' : ''}>${escapeHtml(row.name)}</option>`).join('')}</select>
          <select id="bill-status"><option value="all" ${this._status === 'all' ? 'selected' : ''}>${escapeHtml(this._t('allStatuses'))}</option><option value="unpaid" ${this._status === 'unpaid' ? 'selected' : ''}>${escapeHtml(this._t('providerUnpaid'))}</option><option value="paid" ${this._status === 'paid' ? 'selected' : ''}>${escapeHtml(this._t('providerPaid'))}</option></select>
          <select id="bill-reimbursement"><option value="all" ${this._reimbursement === 'all' ? 'selected' : ''}>${escapeHtml(this._t('allReimbursementStatuses'))}</option><option value="pending" ${this._reimbursement === 'pending' ? 'selected' : ''}>${escapeHtml(this._t('reimbursementPending'))}</option><option value="done" ${this._reimbursement === 'done' ? 'selected' : ''}>${escapeHtml(this._t('reimbursementDone'))}</option><option value="none" ${this._reimbursement === 'none' ? 'selected' : ''}>${escapeHtml(this._t('reimbursementNone'))}</option></select>
          <select id="bill-year"><option value="all">${escapeHtml(this._t('allYears'))}</option>${years.map(year => `<option value="${year}" ${String(this._year) === String(year) ? 'selected' : ''}>${year}</option>`).join('')}</select>
        </div>
        <section class="list-card"><div id="bill-rows">${this._rowsHtml()}</div><div id="bill-pager">${this._pagerHtml()}</div></section>
      </div>
      <div class="modal" id="bill-modal" hidden><div class="modal-backdrop"></div><div class="modal-card" id="bill-modal-card"></div></div>
    `
    this.shadowRoot.getElementById('add-bill')?.addEventListener('click', () => this._openBill())
    this.shadowRoot.getElementById('bill-search')?.addEventListener('input', event => {
      this._search = event.target.value
      this._page = 1
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('bill-category')?.addEventListener('change', event => {
      this._category = event.target.value
      this._page = 1
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('bill-status')?.addEventListener('change', event => {
      this._status = event.target.value
      this._page = 1
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('bill-reimbursement')?.addEventListener('change', event => {
      this._reimbursement = event.target.value
      this._page = 1
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('bill-year')?.addEventListener('change', event => {
      this._year = event.target.value
      this._page = 1
      this._renderListOnly()
    })
    this._wireRows()
    this._wirePager()
  }

  _defaultMonth () {
    const now = new Date()
    return this._monthValue(now.getFullYear(), now.getMonth() + 1)
  }

  _splitMap (row) {
    const result = new Map()
    for (const part of row || []) result.set(String(part.payer_id), Number(part.percentage || 0))
    return result
  }

  _openBill (id = null) {
    const row = id ? (this._data?.expenses || []).find(item => item.id === id) : null
    this._editing = row || null
    const categories = (this._data?.categories || []).filter(category => category.enabled || category.id === row?.category_id)
    if (!categories.length) {
      this._error = this._t('noCategories')
      this._render()
      return
    }
    const selectedCategory = this._categoryById(row?.category_id) || categories[0]
    const payers = (this._data?.payers || []).filter(payer => payer.enabled || payer.id === row?.payer_id)
    const payerId = row?.payer_id || selectedCategory?.default_payer_id || payers[0]?.id || ''
    const paidMonth = row ? this._monthValue(row.paid_year || row.year, row.paid_month || row.month) : this._defaultMonth()
    const interval = Math.max(1, Number(selectedCategory?.interval_months || 1))
    const paid = this._parseMonth(paidMonth)
    const startDate = new Date(paid.year, paid.month - interval, 1)
    const defaultStart = this._monthValue(startDate.getFullYear(), startDate.getMonth() + 1)
    const periodStart = row ? this._monthValue(row.period_start_year, row.period_start_month) : defaultStart
    const periodEnd = row ? this._monthValue(row.period_end_year, row.period_end_month) : paidMonth
    const splitMap = this._splitMap(row?.split?.length ? row.split : this._data?.default_split || [])
    const modal = this.shadowRoot.getElementById('bill-modal')
    const card = this.shadowRoot.getElementById('bill-modal-card')
    if (!modal || !card) return
    const unit = selectedCategory?.consumption_unit || row?.consumption_unit || ''
    card.innerHTML = `<form id="bill-form">
      <div class="modal-head"><h3>${escapeHtml(row ? this._t('editBill') : this._t('addBill'))}</h3><button type="button" class="icon-close" id="bill-modal-close">×</button></div>
      <div class="form-grid">
        <label><span>${escapeHtml(this._t('billType'))}</span><select name="category_id" id="form-category" required>${categories.map(category => `<option value="${escapeHtml(category.id)}" ${category.id === selectedCategory.id ? 'selected' : ''}>${escapeHtml(category.name)}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('billingMonth'))}</span><input name="paid_month" id="form-paid-month" type="month" required value="${escapeHtml(paidMonth)}"></label>
        <label><span>${escapeHtml(this._t('amount'))}</span><input name="amount" type="number" min="0" step="0.01" required value="${escapeHtml(row?.amount ?? '')}"></label>
        <label><span>${escapeHtml(this._t('payer'))}</span><select name="payer_id"><option value="">${escapeHtml(this._t('none'))}</option>${payers.map(payer => `<option value="${escapeHtml(payer.id)}" ${payer.id === payerId ? 'selected' : ''}>${escapeHtml(payer.name)}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('provider'))}</span><input name="provider" value="${escapeHtml(row?.provider || selectedCategory?.default_provider || '')}"></label>
        <label><span>${escapeHtml(this._t('contract'))}</span><input name="contract" value="${escapeHtml(row?.contract || selectedCategory?.default_contract || '')}"></label>
        <label><span>${escapeHtml(this._t('periodStart'))}</span><input name="period_start" id="form-period-start" type="month" required value="${escapeHtml(periodStart)}"></label>
        <label><span>${escapeHtml(this._t('periodEnd'))}</span><input name="period_end" id="form-period-end" type="month" required value="${escapeHtml(periodEnd)}"></label>
        <label><span>${escapeHtml(this._t('dueDate'))}</span><input name="due_date" type="date" value="${escapeHtml(row?.due_date || '')}"></label>
        <label><span>${escapeHtml(this._t('paymentDate'))}</span><input name="payment_date" type="date" value="${escapeHtml(row?.payment_date || '')}"></label>
        <label><span>${escapeHtml(`${this._t('consumption')}${unit ? ` (${unit})` : ''}`)}</span><input name="consumption" type="number" min="0" step="any" value="${escapeHtml(row?.consumption ?? '')}" ${unit ? '' : 'disabled'}></label>
        <label class="check"><input name="paid" type="checkbox" ${row?.paid ? 'checked' : ''}><span>${escapeHtml(this._t('providerPaid'))}</span></label>
        <label class="span2"><span>${escapeHtml(this._t('note'))}</span><textarea name="note" rows="3">${escapeHtml(row?.note || '')}</textarea></label>
        ${payers.length ? `<div class="span2 split-box"><div class="split-title"><strong>${escapeHtml(this._t('split'))}</strong><small>${escapeHtml(this._t('splitHelp'))}</small></div><div class="split-grid">${payers.map(payer => `<label><span>${escapeHtml(payer.name)}</span><input class="split-input" data-payer="${escapeHtml(payer.id)}" type="number" min="0" max="100" step="0.01" value="${escapeHtml(splitMap.get(String(payer.id)) ?? 0)}"></label>`).join('')}</div><div id="split-total" class="split-total"></div></div>` : ''}
      </div>
      <div class="modal-actions"><button type="button" class="secondary" id="bill-cancel">${escapeHtml(this._t('cancel'))}</button><button type="submit" class="primary">${escapeHtml(this._t('saveBill'))}</button></div>
    </form>`
    modal.hidden = false
    const close = () => {
      modal.hidden = true
      this._editing = null
    }
    card.querySelector('#bill-modal-close')?.addEventListener('click', close)
    card.querySelector('#bill-cancel')?.addEventListener('click', close)
    modal.querySelector('.modal-backdrop')?.addEventListener('click', close)
    card.querySelector('#bill-form')?.addEventListener('submit', event => this._submitBill(event, close))
    card.querySelector('#form-category')?.addEventListener('change', () => this._applyCategoryDefaults(card))
    card.querySelector('#form-paid-month')?.addEventListener('change', () => this._autoPeriod(card))
    for (const input of card.querySelectorAll('.split-input')) input.addEventListener('input', () => this._updateSplitTotal(card))
    this._updateSplitTotal(card)
  }

  _autoPeriod (card) {
    const category = this._categoryById(card.querySelector('#form-category')?.value)
    const paid = this._parseMonth(card.querySelector('#form-paid-month')?.value)
    if (!category || !paid) return
    const interval = Math.max(1, Number(category.interval_months || 1))
    const startDate = new Date(paid.year, paid.month - interval, 1)
    const start = card.querySelector('#form-period-start')
    const end = card.querySelector('#form-period-end')
    if (start) start.value = this._monthValue(startDate.getFullYear(), startDate.getMonth() + 1)
    if (end) end.value = this._monthValue(paid.year, paid.month)
  }

  _applyCategoryDefaults (card) {
    const category = this._categoryById(card.querySelector('#form-category')?.value)
    if (!category) return
    this._autoPeriod(card)
    const provider = card.querySelector('[name="provider"]')
    const contract = card.querySelector('[name="contract"]')
    const payer = card.querySelector('[name="payer_id"]')
    if (provider) provider.value = category.default_provider || ''
    if (contract) contract.value = category.default_contract || ''
    if (payer && category.default_payer_id) payer.value = category.default_payer_id
  }

  _updateSplitTotal (card) {
    const total = [...card.querySelectorAll('.split-input')].reduce((sum, input) => sum + Number(input.value || 0), 0)
    const label = card.querySelector('#split-total')
    if (!label) return
    label.textContent = `${total.toFixed(2)}%`
    label.classList.toggle('bad', Math.abs(total - 100) > 0.05)
  }

  async _submitBill (event, close) {
    event.preventDefault()
    if (!this._hass) return
    const form = new FormData(event.currentTarget)
    const paid = this._parseMonth(form.get('paid_month'))
    const start = this._parseMonth(form.get('period_start'))
    const end = this._parseMonth(form.get('period_end'))
    const amount = Number(form.get('amount'))
    if (!paid || !start || !end || !Number.isFinite(amount) || amount < 0) return
    const split = [...event.currentTarget.querySelectorAll('.split-input')]
      .map(input => ({ payer_id: input.dataset.payer, percentage: Number(input.value || 0) }))
      .filter(part => part.payer_id && part.percentage > 0)
    if (split.length && Math.abs(split.reduce((sum, part) => sum + part.percentage, 0) - 100) > 0.05) {
      this._error = this._t('splitHelp')
      close()
      this._render()
      return
    }
    const consumptionText = String(form.get('consumption') || '').trim()
    const payload = {
      year: paid.year,
      month: paid.month,
      category_id: String(form.get('category_id') || ''),
      amount,
      note: String(form.get('note') || '').trim(),
      period_start_year: start.year,
      period_start_month: start.month,
      period_end_year: end.year,
      period_end_month: end.month,
      paid: form.get('paid') === 'on',
      payment_date: String(form.get('payment_date') || ''),
      due_date: String(form.get('due_date') || ''),
      provider: String(form.get('provider') || '').trim(),
      contract: String(form.get('contract') || '').trim()
    }
    const payerId = String(form.get('payer_id') || '')
    if (payerId) payload.payer_id = payerId
    if (split.length) payload.split = split
    if (consumptionText) payload.consumption = Number(consumptionText)
    try {
      if (this._editing) {
        await this._hass.callWS({ type: 'bill_tracker/update', expense_id: this._editing.id, ...payload })
      } else {
        await this._hass.callWS({ type: 'bill_tracker/add', ...payload })
      }
      close()
      this._editing = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      close()
      this._render()
    }
  }

  async _setPaid (input) {
    if (!this._hass || !input) return
    const paid = Boolean(input.checked)
    input.disabled = true
    try {
      await this._hass.callWS({ type: 'bill_tracker/set_paid', expense_id: input.dataset.paidId, paid })
      await this._load(false)
    } catch (error) {
      input.checked = !paid
      input.disabled = false
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _setReimbursement (input) {
    if (!this._hass || !input) return
    const done = Boolean(input.checked)
    input.disabled = true
    try {
      await this._hass.callWS({
        type: 'bill_tracker/set_reimbursement',
        expense_id: input.dataset.reimbursedId,
        done
      })
      await this._load(false)
    } catch (error) {
      input.checked = !done
      input.disabled = false
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _deleteBill (id) {
    if (!this._hass || !id || !confirm(this._t('deleteBillConfirm'))) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/delete', expense_id: id })
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  _styles () {
    return `
      :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.bills-page{display:flex;flex-direction:column;gap:18px}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.hero h1{font-size:30px;margin:0 0 6px}.hero p{margin:0;color:var(--secondary-text-color);font-size:14px}.primary,.secondary,.bill-actions button,.pager button,.error-card button{appearance:none;border-radius:10px;padding:9px 13px;font:inherit;font-weight:650;cursor:pointer}.primary{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.secondary,.bill-actions button,.pager button,.error-card button{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)}button:disabled{opacity:.45;cursor:default}.toolbar{display:grid;grid-template-columns:minmax(240px,1fr) repeat(4,minmax(145px,auto));gap:10px}.toolbar select,.search{height:44px;border:1px solid var(--divider-color);border-radius:11px;background:var(--card-background-color);color:var(--primary-text-color)}.toolbar select{padding:0 10px;font:inherit}.search{display:flex;align-items:center;gap:8px;padding:0 12px}.search ha-icon{color:var(--secondary-text-color);--mdc-icon-size:19px}.search input{flex:1;border:0;outline:0;background:transparent;color:inherit;font:inherit;min-width:0}.list-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;overflow:hidden}.bill-row{display:grid;grid-template-columns:38px 8px minmax(220px,1.4fr) minmax(155px,.65fr) auto auto auto;gap:13px;align-items:center;padding:13px 16px;border-top:1px solid var(--divider-color)}.bill-row:first-child{border-top:0}.category-color{width:8px;height:42px;border-radius:99px}.bill-main,.bill-month{display:flex;flex-direction:column;gap:3px;min-width:0}.bill-main strong,.bill-main small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bill-main small,.bill-month small{font-size:11px;color:var(--secondary-text-color)}.bill-month span{font-size:13px;text-transform:capitalize}.bill-amount{font-size:15px;text-align:right;white-space:nowrap}.state{font-size:11px;padding:4px 8px;border-radius:999px;white-space:nowrap}.state.paid{color:var(--success-color,#2e7d32);background:color-mix(in srgb,var(--success-color,#2e7d32) 11%,transparent)}.state.unpaid{color:var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 12%,transparent)}.bill-state{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.reimbursement-line{display:flex;align-items:center;gap:6px}.state.reimbursement.done{color:var(--success-color,#2e7d32);background:color-mix(in srgb,var(--success-color,#2e7d32) 11%,transparent)}.state.reimbursement.pending{color:var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 12%,transparent)}.state.reimbursement.partial{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 11%,transparent)}.state.reimbursement.none{color:var(--secondary-text-color);background:var(--secondary-background-color)}.reimbursement-toggle{position:relative;width:22px;height:22px;display:grid;place-items:center;cursor:pointer}.reimbursement-toggle input{position:absolute;opacity:0}.reimbursement-toggle span{width:18px;height:18px;border:2px solid var(--divider-color);border-radius:5px;display:grid;place-items:center}.reimbursement-toggle input:checked+span{border-color:var(--success-color,#2e7d32);background:var(--success-color,#2e7d32)}.reimbursement-toggle input:checked+span:after{content:'✓';color:white;font-size:11px;font-weight:800}.reimbursement-toggle input:disabled+span{opacity:.55;cursor:not-allowed}.bill-actions{display:flex;gap:6px}.bill-actions button{padding:6px 9px;font-size:11px}.bill-actions .danger{color:var(--error-color,#d32f2f)}.paid-toggle{position:relative;width:32px;height:32px;display:grid;place-items:center;cursor:pointer}.paid-toggle input{position:absolute;opacity:0}.paid-toggle span{width:23px;height:23px;border:2px solid var(--divider-color);border-radius:50%;display:grid;place-items:center}.paid-toggle input:checked+span{border-color:var(--success-color,#2e7d32);background:var(--success-color,#2e7d32)}.paid-toggle input:checked+span:after{content:'✓';color:white;font-size:14px;font-weight:800}.pager{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--divider-color);color:var(--secondary-text-color);font-size:12px}.pager div{display:flex;gap:7px}.pager button{padding:6px 9px;font-size:11px}.empty{padding:50px 16px;text-align:center;color:var(--secondary-text-color)}.notice{padding:11px 14px;border-radius:10px}.notice.error{background:color-mix(in srgb,var(--error-color,#d32f2f) 10%,var(--card-background-color));color:var(--error-color,#d32f2f);border:1px solid color-mix(in srgb,var(--error-color,#d32f2f) 28%,transparent)}.loading,.error-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:24px}.modal[hidden]{display:none}.modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px}.modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.55)}.modal-card{position:relative;z-index:1;width:min(850px,100%);max-height:min(90vh,900px);overflow:auto;background:var(--card-background-color);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);padding:20px}.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.modal-head h3{font-size:20px;margin:0}.icon-close{appearance:none;border:0;background:transparent;color:var(--secondary-text-color);font-size:28px;cursor:pointer}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{display:flex;flex-direction:column;gap:6px}.form-grid label>span,.split-title small{font-size:12px;color:var(--secondary-text-color)}.form-grid input,.form-grid select,.form-grid textarea{width:100%;min-height:42px;border:1px solid var(--divider-color);border-radius:9px;background:var(--secondary-background-color);color:var(--primary-text-color);padding:8px 11px;font:inherit;outline:none}.form-grid textarea{resize:vertical}.form-grid .check{flex-direction:row;align-items:center;padding-top:20px}.form-grid .check input{width:18px;min-height:18px;accent-color:var(--primary-color)}.span2{grid-column:1/-1}.split-box{border:1px solid var(--divider-color);border-radius:12px;padding:14px}.split-title{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px}.split-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.split-total{text-align:right;margin-top:8px;font-size:12px;color:var(--success-color,#2e7d32)}.split-total.bad{color:var(--error-color,#d32f2f)}.modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px;padding-top:16px;border-top:1px solid var(--divider-color)}
      @media(max-width:1100px){.toolbar{grid-template-columns:1fr 1fr}.bill-row{grid-template-columns:34px 8px minmax(180px,1fr) auto auto}.bill-month{grid-column:3}.bill-state{grid-column:4;grid-row:1}.bill-amount{grid-column:4;grid-row:2}.bill-actions{grid-column:5;grid-row:1 / span 2}}
      @media(max-width:720px){.hero{align-items:flex-start;flex-direction:column}.hero .primary{width:100%;justify-content:center}.toolbar{grid-template-columns:1fr}.bill-row{grid-template-columns:32px 8px minmax(0,1fr) auto;padding:12px}.bill-month{grid-column:3}.bill-state{grid-column:3}.bill-amount{grid-column:3;text-align:left}.bill-actions{grid-column:4;grid-row:1 / span 4;flex-direction:column}.form-grid,.split-grid{grid-template-columns:1fr}.span2{grid-column:auto}.modal{padding:8px}.modal-card{padding:16px}}
    `
  }
}

class BillyRecurring extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._data = null
    this._loading = false
    this._error = null
    this._search = ''
    this._kind = 'all'
    this._status = 'all'
    this._editing = null
    this._unsubscribe = null
  }

  set hass (value) {
    const changed = value !== this._hass
    this._hass = value
    if (changed && this.isConnected) {
      this._subscribe()
      this._load()
    }
  }

  get hass () { return this._hass }

  connectedCallback () {
    this._subscribe()
    this._load()
  }

  disconnectedCallback () {
    this._unsubscribe?.()
    this._unsubscribe = null
  }

  _t (key) { return tFor(this._hass, key) }

  async _subscribe () {
    if (!this._hass || this._unsubscribe) return
    try {
      this._unsubscribe = await this._hass.connection.subscribeEvents(
        () => this._load(false),
        'bill_tracker_updated'
      )
    } catch (_error) {}
  }

  async _load (showLoading = true) {
    if (!this._hass || this._loading) return
    if (showLoading) this._loading = true
    if (showLoading) this._render()
    try {
      this._data = await this._hass.callWS({ type: 'bill_tracker/list', forecast_months: 12 })
      this._error = null
    } catch (error) {
      this._error = String(error?.message || error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _money (value) {
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'
    try {
      return new Intl.NumberFormat(localeOf(this._hass), { style: 'currency', currency }).format(Number(value || 0))
    } catch (_error) {
      return `${Number(value || 0).toFixed(2)} ${currency}`
    }
  }

  _date (value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
    if (!match) return '—'
    return new Intl.DateTimeFormat(localeOf(this._hass), {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  }

  _kindLabel (kind) {
    if (kind === 'subscription') return this._t('subscription')
    if (kind === 'mortgage') return this._t('mortgage')
    if (kind === 'installment') return this._t('installment')
    return this._t('recurringGeneric')
  }

  _kindIcon (kind) {
    if (kind === 'subscription') return 'mdi:repeat'
    if (kind === 'mortgage') return 'mdi:home-city-outline'
    if (kind === 'installment') return 'mdi:calendar-sync-outline'
    return 'mdi:calendar-refresh-outline'
  }

  _frequency (months) {
    const value = Number(months || 1)
    if (languageOf(this._hass) === 'it') {
      const labels = { 1: 'Mensile', 2: 'Bimestrale', 3: 'Trimestrale', 4: 'Quadrimestrale', 6: 'Semestrale', 12: 'Annuale' }
      return labels[value] || `Ogni ${value} mesi`
    }
    const labels = { 1: 'Monthly', 2: 'Every 2 months', 3: 'Quarterly', 4: 'Every 4 months', 6: 'Every 6 months', 12: 'Yearly' }
    return labels[value] || `Every ${value} months`
  }

  _statusLabel (status) {
    if (status === 'inactive') return this._t('recurringInactive')
    if (status === 'ended') return this._t('recurringEnded')
    return this._t('recurringActive')
  }

  _filtered () {
    const query = this._search.trim().toLocaleLowerCase(localeOf(this._hass))
    return (this._data?.recurring_expenses || [])
      .filter(row => {
        if (this._kind !== 'all' && row.kind !== this._kind) return false
        if (this._status !== 'all' && row.status !== this._status) return false
        if (!query) return true
        return [row.name, row.provider, row.contract, row.note, this._kindLabel(row.kind)]
          .join(' ')
          .toLocaleLowerCase(localeOf(this._hass))
          .includes(query)
      })
      .sort((a, b) => {
        const statusA = a.status === 'active' ? 0 : a.status === 'inactive' ? 1 : 2
        const statusB = b.status === 'active' ? 0 : b.status === 'inactive' ? 1 : 2
        return statusA - statusB || String(a.next_due_date || '9999').localeCompare(String(b.next_due_date || '9999')) || String(a.name || '').localeCompare(String(b.name || ''), localeOf(this._hass))
      })
  }

  _rowsHtml () {
    const rows = this._filtered()
    if (!rows.length) return `<div class="empty">${escapeHtml(this._t('noRecurring'))}</div>`
    return rows.map(row => {
      const details = [row.provider, row.contract].filter(Boolean).join(' · ')
      const progress = row.kind === 'installment' && row.installment_count
        ? `${Number(row.installments_elapsed || 0)}/${Number(row.installment_count)} · ${Number(row.remaining_installments || 0)} ${this._t('remainingInstallments')}`
        : ''
      const renewal = row.auto_renew && row.next_renewal_date
        ? `${this._t('nextRenewal')}: ${this._date(row.next_renewal_date)}`
        : row.end_date
          ? `${this._t('expirationDate')}: ${this._date(row.end_date)}`
          : ''
      return `<article class="recurring-row">
        <div class="kind-icon"><ha-icon icon="${this._kindIcon(row.kind)}"></ha-icon></div>
        <div class="recurring-main"><strong>${escapeHtml(row.name)}</strong><span>${escapeHtml(this._kindLabel(row.kind))} · ${escapeHtml(this._frequency(row.interval_months))}</span><small>${escapeHtml(details || renewal || '—')}</small>${progress ? `<small>${escapeHtml(progress)}</small>` : ''}</div>
        <div class="recurring-due"><span>${escapeHtml(this._t('nextCharge'))}</span><strong>${escapeHtml(this._date(row.next_due_date))}</strong>${renewal && details ? `<small>${escapeHtml(renewal)}</small>` : ''}</div>
        <div class="recurring-value"><strong>${escapeHtml(this._money(row.amount))}</strong><small>${escapeHtml(`${this._t('monthlyEquivalent')}: ${this._money(row.monthly_equivalent)}`)}</small>${row.remaining_amount != null ? `<small>${escapeHtml(`${this._t('remainingCommitment')}: ${this._money(row.remaining_amount)}`)}</small>` : ''}</div>
        <span class="status ${escapeHtml(row.status)}">${escapeHtml(this._statusLabel(row.status))}</span>
        <div class="actions"><button type="button" data-edit-recurring="${escapeHtml(row.id)}">${escapeHtml(this._t('edit'))}</button>${row.status !== 'ended' ? `<button type="button" data-toggle-recurring="${escapeHtml(row.id)}" data-active="${row.active ? '1' : '0'}">${escapeHtml(row.active ? this._t('pause') : this._t('resume'))}</button>` : ''}<button type="button" class="danger" data-delete-recurring="${escapeHtml(row.id)}">${escapeHtml(this._t('delete'))}</button></div>
      </article>`
    }).join('')
  }

  _renderListOnly () {
    const rows = this.shadowRoot.getElementById('recurring-rows')
    if (rows) rows.innerHTML = this._rowsHtml()
    this._wireRows()
  }

  _wireRows () {
    for (const button of this.shadowRoot.querySelectorAll('[data-edit-recurring]')) {
      button.addEventListener('click', () => this._openRecurring(button.dataset.editRecurring))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-toggle-recurring]')) {
      button.addEventListener('click', () => this._toggleRecurring(button.dataset.toggleRecurring, button.dataset.active !== '1'))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-delete-recurring]')) {
      button.addEventListener('click', () => this._deleteRecurring(button.dataset.deleteRecurring))
    }
  }

  _render () {
    if (this._loading && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="loading">${escapeHtml(this._t('loading'))}</div>`
      return
    }
    if (this._error && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="error-card"><strong>${escapeHtml(this._t('error'))}</strong><p>${escapeHtml(this._error)}</p><button id="retry">${escapeHtml(this._t('retry'))}</button></div>`
      this.shadowRoot.getElementById('retry')?.addEventListener('click', () => this._load())
      return
    }
    if (!this._data) return
    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="recurring-page">
        <div class="hero"><div><h1>${escapeHtml(this._t('recurringTitle'))}</h1><p>${escapeHtml(this._t('recurringSubtitle'))}</p></div><button class="primary" id="add-recurring"><ha-icon icon="mdi:plus"></ha-icon>${escapeHtml(this._t('addRecurring'))}</button></div>
        <div class="info"><ha-icon icon="mdi:information-outline"></ha-icon><span>${escapeHtml(this._t('recurringForecastHelp'))}</span></div>
        ${this._error ? `<div class="notice error">${escapeHtml(this._error)}</div>` : ''}
        <div class="toolbar">
          <label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input id="recurring-search" type="search" value="${escapeHtml(this._search)}" placeholder="${escapeHtml(this._t('searchRecurring'))}"></label>
          <select id="recurring-kind"><option value="all">${escapeHtml(this._t('allRecurringKinds'))}</option><option value="subscription" ${this._kind === 'subscription' ? 'selected' : ''}>${escapeHtml(this._t('subscription'))}</option><option value="mortgage" ${this._kind === 'mortgage' ? 'selected' : ''}>${escapeHtml(this._t('mortgage'))}</option><option value="installment" ${this._kind === 'installment' ? 'selected' : ''}>${escapeHtml(this._t('installment'))}</option><option value="recurring" ${this._kind === 'recurring' ? 'selected' : ''}>${escapeHtml(this._t('recurringGeneric'))}</option></select>
          <select id="recurring-status"><option value="all">${escapeHtml(this._t('allRecurringStatuses'))}</option><option value="active" ${this._status === 'active' ? 'selected' : ''}>${escapeHtml(this._t('recurringActive'))}</option><option value="inactive" ${this._status === 'inactive' ? 'selected' : ''}>${escapeHtml(this._t('recurringInactive'))}</option><option value="ended" ${this._status === 'ended' ? 'selected' : ''}>${escapeHtml(this._t('recurringEnded'))}</option></select>
        </div>
        <div class="list-card" id="recurring-rows">${this._rowsHtml()}</div>
      </div>
      <div class="modal" id="recurring-modal" hidden><div class="modal-backdrop"></div><div class="modal-card" id="recurring-modal-card"></div></div>
    `
    this.shadowRoot.getElementById('add-recurring')?.addEventListener('click', () => this._openRecurring())
    this.shadowRoot.getElementById('recurring-search')?.addEventListener('input', event => {
      this._search = event.currentTarget.value
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('recurring-kind')?.addEventListener('change', event => {
      this._kind = event.currentTarget.value
      this._renderListOnly()
    })
    this.shadowRoot.getElementById('recurring-status')?.addEventListener('change', event => {
      this._status = event.currentTarget.value
      this._renderListOnly()
    })
    this._wireRows()
  }

  _today () {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  _openRecurring (id = null) {
    const row = id ? (this._data?.recurring_expenses || []).find(item => item.id === id) : null
    this._editing = row || null
    const modal = this.shadowRoot.getElementById('recurring-modal')
    const card = this.shadowRoot.getElementById('recurring-modal-card')
    if (!modal || !card) return
    const intervals = [1, 2, 3, 4, 6, 12]
    card.innerHTML = `<form id="recurring-form">
      <div class="modal-head"><h3>${escapeHtml(row ? this._t('edit') : this._t('addRecurring'))}</h3><button type="button" class="icon-close" id="recurring-close">×</button></div>
      <div class="form-grid">
        <label><span>${escapeHtml(this._t('billType'))}</span><select name="kind"><option value="subscription" ${row?.kind === 'subscription' || !row ? 'selected' : ''}>${escapeHtml(this._t('subscription'))}</option><option value="mortgage" ${row?.kind === 'mortgage' ? 'selected' : ''}>${escapeHtml(this._t('mortgage'))}</option><option value="installment" ${row?.kind === 'installment' ? 'selected' : ''}>${escapeHtml(this._t('installment'))}</option><option value="recurring" ${row?.kind === 'recurring' ? 'selected' : ''}>${escapeHtml(this._t('recurringGeneric'))}</option></select></label>
        <label><span>${escapeHtml(this._t('name'))}</span><input name="name" required maxlength="120" value="${escapeHtml(row?.name || '')}"></label>
        <label><span>${escapeHtml(this._t('amount'))}</span><input name="amount" type="number" min="0.01" step="0.01" required value="${escapeHtml(row?.amount ?? '')}"></label>
        <label><span>${escapeHtml(this._t('interval'))}</span><select name="interval_months">${intervals.map(value => `<option value="${value}" ${Number(row?.interval_months || 1) === value ? 'selected' : ''}>${escapeHtml(this._frequency(value))}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('activationDate'))}</span><input name="start_date" type="date" required value="${escapeHtml(row?.start_date || this._today())}"></label>
        <label><span>${escapeHtml(this._t('expirationDate'))}</span><input name="end_date" type="date" value="${escapeHtml(row?.end_date || '')}"></label>
        <label><span>${escapeHtml(this._t('installmentCount'))}</span><input name="installment_count" type="number" min="1" max="1200" step="1" value="${escapeHtml(row?.installment_count ?? '')}"></label>
        <label><span>${escapeHtml(this._t('renewalEvery'))}</span><select name="renewal_interval_months">${[1, 3, 6, 12, 24].map(value => `<option value="${value}" ${Number(row?.renewal_interval_months || 12) === value ? 'selected' : ''}>${value} ${escapeHtml(this._t('months'))}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('provider'))}</span><input name="provider" maxlength="120" value="${escapeHtml(row?.provider || '')}"></label>
        <label><span>${escapeHtml(this._t('contract'))}</span><input name="contract" maxlength="120" value="${escapeHtml(row?.contract || '')}"></label>
        <label class="check"><input name="auto_renew" type="checkbox" ${row?.auto_renew ? 'checked' : ''}><span>${escapeHtml(this._t('automaticRenewal'))}</span></label>
        <label class="check"><input name="active" type="checkbox" ${row?.active !== false ? 'checked' : ''}><span>${escapeHtml(this._t('enabled'))}</span></label>
        <div class="span2 hint">${escapeHtml(this._t('installmentCountHint'))}</div>
        <label class="span2"><span>${escapeHtml(this._t('note'))}</span><textarea name="note" rows="3">${escapeHtml(row?.note || '')}</textarea></label>
      </div>
      <div class="modal-actions"><button type="button" class="secondary" id="recurring-cancel">${escapeHtml(this._t('cancel'))}</button><button type="submit" class="primary">${escapeHtml(this._t('save'))}</button></div>
    </form>`
    modal.hidden = false
    const close = () => { modal.hidden = true; this._editing = null }
    card.querySelector('#recurring-close')?.addEventListener('click', close)
    card.querySelector('#recurring-cancel')?.addEventListener('click', close)
    modal.querySelector('.modal-backdrop')?.addEventListener('click', close)
    card.querySelector('#recurring-form')?.addEventListener('submit', event => this._saveRecurring(event, row?.id || null, close))
  }

  async _saveRecurring (event, id, close) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const installmentText = String(values.get('installment_count') || '').trim()
    const payload = {
      type: id ? 'bill_tracker/recurring/update' : 'bill_tracker/recurring/add',
      ...(id ? { recurring_id: id } : {}),
      name: String(values.get('name') || '').trim(),
      kind: String(values.get('kind') || 'recurring'),
      amount: Number(values.get('amount') || 0),
      interval_months: Number(values.get('interval_months') || 1),
      start_date: String(values.get('start_date') || ''),
      end_date: String(values.get('end_date') || ''),
      auto_renew: values.get('auto_renew') === 'on',
      renewal_interval_months: Number(values.get('renewal_interval_months') || 12),
      provider: String(values.get('provider') || '').trim(),
      contract: String(values.get('contract') || '').trim(),
      note: String(values.get('note') || '').trim(),
      active: values.get('active') === 'on'
    }
    if (installmentText) payload.installment_count = Number(installmentText)
    try {
      await this._hass.callWS(payload)
      close()
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      close()
      this._render()
    }
  }

  async _toggleRecurring (id, active) {
    if (!this._hass || !id) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/recurring/set_active', recurring_id: id, active })
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _deleteRecurring (id) {
    if (!this._hass || !id || !window.confirm(this._t('deleteRecurringConfirm'))) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/recurring/delete', recurring_id: id })
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  _styles () {
    return `
      :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.recurring-page{display:flex;flex-direction:column;gap:18px}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.hero h1{font-size:30px;margin:0 0 6px}.hero p{margin:0;color:var(--secondary-text-color);font-size:14px}.primary,.secondary,.actions button,.error-card button{appearance:none;border-radius:10px;padding:9px 13px;font:inherit;font-weight:650;cursor:pointer}.primary{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.secondary,.actions button,.error-card button{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)}.info{display:flex;align-items:flex-start;gap:9px;padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 8%,var(--card-background-color));border:1px solid color-mix(in srgb,var(--primary-color) 24%,var(--divider-color));color:var(--secondary-text-color);font-size:12px}.info ha-icon{color:var(--primary-color);--mdc-icon-size:18px;flex:none}.toolbar{display:grid;grid-template-columns:minmax(260px,1fr) minmax(180px,auto) minmax(160px,auto);gap:10px}.toolbar select,.search{height:44px;border:1px solid var(--divider-color);border-radius:11px;background:var(--card-background-color);color:var(--primary-text-color)}.toolbar select{padding:0 10px;font:inherit}.search{display:flex;align-items:center;gap:8px;padding:0 12px}.search ha-icon{color:var(--secondary-text-color);--mdc-icon-size:19px}.search input{flex:1;border:0;outline:0;background:transparent;color:inherit;font:inherit;min-width:0}.list-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;overflow:hidden}.recurring-row{display:grid;grid-template-columns:46px minmax(240px,1.4fr) minmax(160px,.7fr) minmax(170px,.75fr) auto auto;gap:14px;align-items:center;padding:15px 16px;border-top:1px solid var(--divider-color)}.recurring-row:first-child{border-top:0}.kind-icon{width:42px;height:42px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 11%,transparent);color:var(--primary-color);display:grid;place-items:center}.recurring-main,.recurring-due,.recurring-value{display:flex;flex-direction:column;gap:3px;min-width:0}.recurring-main span,.recurring-main small,.recurring-due span,.recurring-due small,.recurring-value small{font-size:11px;color:var(--secondary-text-color)}.recurring-main strong,.recurring-main small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.status{font-size:11px;padding:5px 8px;border-radius:999px;white-space:nowrap}.status.active{color:var(--success-color,#2e7d32);background:color-mix(in srgb,var(--success-color,#2e7d32) 11%,transparent)}.status.inactive{color:var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 12%,transparent)}.status.ended{color:var(--secondary-text-color);background:var(--secondary-background-color)}.actions{display:flex;gap:6px}.actions button{padding:6px 9px;font-size:11px}.actions .danger{color:var(--error-color,#d32f2f)}.empty{padding:50px 16px;text-align:center;color:var(--secondary-text-color)}.notice{padding:11px 14px;border-radius:10px}.notice.error{background:color-mix(in srgb,var(--error-color,#d32f2f) 10%,var(--card-background-color));color:var(--error-color,#d32f2f);border:1px solid color-mix(in srgb,var(--error-color,#d32f2f) 28%,transparent)}.loading,.error-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:24px}.modal[hidden]{display:none}.modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px}.modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.55)}.modal-card{position:relative;z-index:1;width:min(820px,100%);max-height:min(90vh,900px);overflow:auto;background:var(--card-background-color);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);padding:20px}.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.modal-head h3{font-size:20px;margin:0}.icon-close{appearance:none;border:0;background:transparent;color:var(--secondary-text-color);font-size:28px;cursor:pointer}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{display:flex;flex-direction:column;gap:6px}.form-grid label>span,.hint{font-size:12px;color:var(--secondary-text-color)}.form-grid input,.form-grid select,.form-grid textarea{width:100%;min-height:42px;border:1px solid var(--divider-color);border-radius:9px;background:var(--secondary-background-color);color:var(--primary-text-color);padding:8px 11px;font:inherit;outline:none}.form-grid textarea{resize:vertical}.form-grid .check{flex-direction:row;align-items:center;padding-top:20px}.form-grid .check input{width:18px;min-height:18px;accent-color:var(--primary-color)}.span2{grid-column:1/-1}.modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px;padding-top:16px;border-top:1px solid var(--divider-color)}
      @media(max-width:1050px){.recurring-row{grid-template-columns:46px minmax(200px,1fr) auto auto}.recurring-due{grid-column:2}.recurring-value{grid-column:3;grid-row:1 / span 2}.status{grid-column:4;grid-row:1}.actions{grid-column:4;grid-row:2}}
      @media(max-width:720px){.hero{align-items:flex-start;flex-direction:column}.hero .primary{width:100%;justify-content:center}.toolbar{grid-template-columns:1fr}.recurring-row{grid-template-columns:42px minmax(0,1fr);padding:12px}.recurring-due,.recurring-value,.status,.actions{grid-column:2;grid-row:auto}.actions{flex-wrap:wrap}.form-grid{grid-template-columns:1fr}.span2{grid-column:auto}.modal{padding:8px}.modal-card{padding:16px}}
    `
  }
}

class BillySettings extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._data = null
    this._parserData = null
    this._section = 'categories'
    this._loading = false
    this._error = null
    this._notice = ''
    this._unsubscribe = null
  }

  set hass (value) {
    const changed = value !== this._hass
    this._hass = value
    if (changed && this.isConnected) {
      this._subscribe()
      this._load()
    }
  }

  get hass () {
    return this._hass
  }

  connectedCallback () {
    this._subscribe()
    this._load()
  }

  disconnectedCallback () {
    this._unsubscribe?.()
    this._unsubscribe = null
  }

  _t (key) {
    return tFor(this._hass, key)
  }

  async _subscribe () {
    if (!this._hass || this._unsubscribe) return
    try {
      this._unsubscribe = await this._hass.connection.subscribeEvents(
        () => this._load(false),
        'bill_tracker_updated'
      )
    } catch (_error) {}
  }

  async _load (showLoading = true) {
    if (!this._hass || this._loading) return
    if (showLoading) this._loading = true
    this._render()
    try {
      const [data, parserData] = await Promise.all([
        this._hass.callWS({ type: 'bill_tracker/list', forecast_months: 1 }),
        this._hass.callWS({ type: 'bill_tracker/parser/list' }).catch(() => null)
      ])
      this._data = data
      this._parserData = parserData
      this._error = null
    } catch (error) {
      this._error = String(error?.message || error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _sectionButton (key, icon) {
    return `<button type="button" class="settings-nav-item ${this._section === key ? 'active' : ''}" data-section="${key}"><ha-icon icon="${icon}"></ha-icon><span>${escapeHtml(this._t(key === 'categories' ? 'billTypes' : key))}</span></button>`
  }

  _categories () {
    const rows = this._data?.categories || []
    return `<div class="section-head"><div><h2>${escapeHtml(this._t('billTypes'))}</h2><p>${escapeHtml(this._t('settingsSubtitle'))}</p></div><button class="primary" id="add-category">${escapeHtml(this._t('addBillType'))}</button></div>
      <div class="items">${rows.length
        ? rows.map(row => `<article class="item-row">
            <span class="color-dot" style="background:${safeColor(row.color)}"></span>
            <div class="item-main"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(`${row.interval_months} ${this._t('months')}${row.default_provider ? ` · ${row.default_provider}` : ''}`)}</small></div>
            <span class="status ${row.enabled ? 'enabled' : ''}">${escapeHtml(row.enabled ? this._t('enabled') : this._t('disabled'))}</span>
            <div class="row-actions"><button data-edit-category="${escapeHtml(row.id)}">${escapeHtml(this._t('edit'))}</button><button class="danger" data-delete-category="${escapeHtml(row.id)}">${escapeHtml(this._t('delete'))}</button></div>
          </article>`).join('')
        : `<div class="empty">${escapeHtml(this._t('noCategories'))}</div>`}</div>`
  }

  _payers () {
    const rows = this._data?.payers || []
    return `<div class="section-head"><div><h2>${escapeHtml(this._t('payers'))}</h2><p>${escapeHtml(this._t('settingsSubtitle'))}</p></div><button class="primary" id="add-payer">${escapeHtml(this._t('addPayer'))}</button></div>
      <div class="items">${rows.length
        ? rows.map(row => `<article class="item-row">
            <div class="avatar">${escapeHtml(String(row.name || '?').trim().slice(0, 1).toUpperCase())}</div>
            <div class="item-main"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(`${Number(row.share_percent || 0).toLocaleString(localeOf(this._hass), { maximumFractionDigits: 2 })}%${row.paypal_me ? ` · PayPal.Me/${row.paypal_me}` : ''}`)}</small></div>
            <span class="status ${row.enabled ? 'enabled' : ''}">${escapeHtml(row.enabled ? this._t('enabled') : this._t('disabled'))}</span>
            <div class="row-actions"><button data-edit-payer="${escapeHtml(row.id)}">${escapeHtml(this._t('edit'))}</button><button class="danger" data-delete-payer="${escapeHtml(row.id)}">${escapeHtml(this._t('delete'))}</button></div>
          </article>`).join('')
        : `<div class="empty">${escapeHtml(this._t('noPayers'))}</div>`}</div>`
  }

  _sources () {
    const rows = this._parserData?.sources || []
    return `<div class="section-head"><div><h2>${escapeHtml(this._t('sources'))}</h2><p>${escapeHtml(this._t('imapHelp'))}</p></div></div>
      <div class="items source-items">${rows.length
        ? rows.map(row => `<label class="source-row"><input type="checkbox" value="${escapeHtml(row.entry_id)}" ${row.selected ? 'checked' : ''}><div><strong>${escapeHtml(row.title || row.entry_id)}</strong><small>${escapeHtml(row.entry_id)}</small></div></label>`).join('')
        : `<div class="empty">${escapeHtml(this._t('noSources'))}</div>`}</div>
      ${rows.length ? `<div class="footer-actions"><button class="primary" id="save-sources">${escapeHtml(this._t('saveSources'))}</button></div>` : ''}`
  }

  _system () {
    const installed = this._parserData?.installed || []
    const catalog = this._parserData?.catalog?.parsers || []
    const catalogMap = new Map(catalog.map(row => [String(row.id), row]))
    const updates = installed.filter(row => {
      const remote = catalogMap.get(String(row.id))
      return row.source !== 'custom' && remote && Number(remote.version || 0) > Number(row.version || 0)
    }).length
    const info = [
      [this._t('version'), BILLY_PANEL_VERSION],
      [this._t('currency'), this._data?.currency || this._hass?.config?.currency || 'EUR'],
      [this._t('categoriesCount'), String((this._data?.categories || []).length)],
      [this._t('payersCount'), String((this._data?.payers || []).length)],
      [this._t('parsersCount'), String(installed.length)]
    ]
    return `<div class="section-head"><div><h2>${escapeHtml(this._t('system'))}</h2><p>${escapeHtml(this._t('catalogRefreshBody'))}</p></div></div>
      <div class="system-grid">${info.map(([label, value]) => `<div class="info-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>
      <article class="system-card"><ha-icon icon="mdi:update"></ha-icon><div><strong>${escapeHtml(this._t('catalogRefresh'))}</strong><p>${escapeHtml(this._t('catalogRefreshBody'))}</p><span class="status ${updates ? 'warning' : 'enabled'}">${escapeHtml(updates ? `${updates} ${this._t('updatesAvailable')}` : this._t('upToDate'))}</span></div></article>`
  }

  _developer () {
    const links = {
      github: 'https://github.com/robin994',
      linkedin: 'https://www.linkedin.com/in/roberto-tortora-379928109/',
      billy: 'https://github.com/robin994/billy',
      parser: 'https://github.com/robin994/billy-parser',
      donate: 'https://paypal.me/rtortora94'
    }
    return `<div class="section-head"><div><h2>${escapeHtml(this._t('developer'))}</h2><p>${escapeHtml(this._t('developerCredits'))}</p></div></div>
      <article class="developer-card">
        <div class="developer-avatar">RT</div>
        <div class="developer-copy"><h3>${escapeHtml(this._t('developerName'))}</h3><p>${escapeHtml(this._t('developerRole'))}</p><div class="link-actions"><a href="${links.github}" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:github"></ha-icon>${escapeHtml(this._t('githubProfile'))}</a><a href="${links.linkedin}" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:linkedin"></ha-icon>${escapeHtml(this._t('linkedinProfile'))}</a></div></div>
      </article>
      <div class="project-grid">
        <article class="project-card"><div class="project-icon"><ha-icon icon="mdi:receipt-text-outline"></ha-icon></div><div><h3>Billy</h3><p>${escapeHtml(this._t('billyRepository'))}</p></div><div class="project-actions"><a href="${links.billy}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('openRepository'))}</a><a class="star" href="${links.billy}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('starProject'))}</a></div></article>
        <article class="project-card"><div class="project-icon"><ha-icon icon="mdi:file-code-outline"></ha-icon></div><div><h3>billy-parser</h3><p>${escapeHtml(this._t('parserRepository'))}</p></div><div class="project-actions"><a href="${links.parser}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('openRepository'))}</a><a class="star" href="${links.parser}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('starProject'))}</a></div></article>
      </div>
      <article class="support-card"><div><ha-icon icon="mdi:heart-outline"></ha-icon></div><div><h3>${escapeHtml(this._t('supportDevelopment'))}</h3><p>${escapeHtml(this._t('supportDevelopmentBody'))}</p><a class="donate" href="${links.donate}" target="_blank" rel="noopener noreferrer">${escapeHtml(this._t('donate'))}</a></div></article>`
  }

  _render () {
    if (this._loading && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="loading">${escapeHtml(this._t('loading'))}</div>`
      return
    }
    if (this._error && !this._data) {
      this.shadowRoot.innerHTML = `<style>${this._styles()}</style><div class="error-card"><strong>${escapeHtml(this._t('error'))}</strong><p>${escapeHtml(this._error)}</p><button id="retry">${escapeHtml(this._t('retry'))}</button></div>`
      this.shadowRoot.getElementById('retry')?.addEventListener('click', () => this._load())
      return
    }
    if (!this._data) return

    let content = this._categories()
    if (this._section === 'payers') content = this._payers()
    if (this._section === 'sources') content = this._sources()
    if (this._section === 'system') content = this._system()
    if (this._section === 'developer') content = this._developer()

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="settings-page">
        <div class="settings-hero"><h1>${escapeHtml(this._t('settingsTitle'))}</h1><p>${escapeHtml(this._t('settingsSubtitle'))}</p></div>
        ${this._notice ? `<div class="notice">${escapeHtml(this._notice)}</div>` : ''}
        ${this._error ? `<div class="notice error">${escapeHtml(this._error)}</div>` : ''}
        <div class="settings-layout">
          <aside>${this._sectionButton('categories', 'mdi:shape-outline')}${this._sectionButton('payers', 'mdi:account-group-outline')}${this._sectionButton('sources', 'mdi:email-outline')}${this._sectionButton('system', 'mdi:cog-outline')}${this._sectionButton('developer', 'mdi:account-heart-outline')}</aside>
          <section class="settings-content">${content}</section>
        </div>
      </div>
      <div class="modal" id="modal" hidden><div class="modal-backdrop"></div><div class="modal-card" id="modal-card"></div></div>
    `

    for (const button of this.shadowRoot.querySelectorAll('[data-section]')) {
      button.addEventListener('click', () => {
        this._section = button.dataset.section
        this._notice = ''
        this._error = null
        this._render()
      })
    }
    this.shadowRoot.getElementById('add-category')?.addEventListener('click', () => this._openCategory())
    this.shadowRoot.getElementById('add-payer')?.addEventListener('click', () => this._openPayer())
    for (const button of this.shadowRoot.querySelectorAll('[data-edit-category]')) {
      button.addEventListener('click', () => this._openCategory(button.dataset.editCategory))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-delete-category]')) {
      button.addEventListener('click', () => this._deleteCategory(button.dataset.deleteCategory))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-edit-payer]')) {
      button.addEventListener('click', () => this._openPayer(button.dataset.editPayer))
    }
    for (const button of this.shadowRoot.querySelectorAll('[data-delete-payer]')) {
      button.addEventListener('click', () => this._deletePayer(button.dataset.deletePayer))
    }
    this.shadowRoot.getElementById('save-sources')?.addEventListener('click', () => this._saveSources())
  }

  _openCategory (id = null) {
    const row = id ? (this._data?.categories || []).find(item => item.id === id) : null
    const payers = this._data?.payers || []
    const modal = this.shadowRoot.getElementById('modal')
    const card = this.shadowRoot.getElementById('modal-card')
    if (!modal || !card) return
    card.innerHTML = `<form id="category-form">
      <div class="modal-head"><h3>${escapeHtml(row ? this._t('edit') : this._t('addBillType'))}</h3><button type="button" class="icon-close" id="modal-close">×</button></div>
      <div class="form-grid">
        <label class="span2"><span>${escapeHtml(this._t('name'))}</span><input name="name" required value="${escapeHtml(row?.name || '')}"></label>
        <label><span>${escapeHtml(this._t('interval'))}</span><select name="interval_months">${[1, 2, 3, 4, 6, 12].map(value => `<option value="${value}" ${Number(row?.interval_months || 1) === value ? 'selected' : ''}>${value} ${escapeHtml(this._t('months'))}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('color'))}</span><input name="color" type="color" value="${safeColor(row?.color || '#03a9f4')}"></label>
        <label><span>${escapeHtml(this._t('consumptionUnit'))}</span><input name="consumption_unit" value="${escapeHtml(row?.consumption_unit || '')}" placeholder="kWh, Smc…"></label>
        <label><span>${escapeHtml(this._t('defaultPayer'))}</span><select name="default_payer_id"><option value="">${escapeHtml(this._t('none'))}</option>${payers.map(payer => `<option value="${escapeHtml(payer.id)}" ${row?.default_payer_id === payer.id ? 'selected' : ''}>${escapeHtml(payer.name)}</option>`).join('')}</select></label>
        <label><span>${escapeHtml(this._t('defaultProvider'))}</span><input name="default_provider" value="${escapeHtml(row?.default_provider || '')}"></label>
        <label><span>${escapeHtml(this._t('defaultContract'))}</span><input name="default_contract" value="${escapeHtml(row?.default_contract || '')}"></label>
        <label class="check span2"><input name="enabled" type="checkbox" ${row?.enabled !== false ? 'checked' : ''}><span>${escapeHtml(this._t('enabled'))}</span></label>
      </div>
      <div class="modal-actions"><button type="button" class="secondary" id="modal-cancel">${escapeHtml(this._t('cancel'))}</button><button type="submit" class="primary">${escapeHtml(this._t('save'))}</button></div>
    </form>`
    modal.hidden = false
    const close = () => { modal.hidden = true }
    card.querySelector('#modal-close')?.addEventListener('click', close)
    card.querySelector('#modal-cancel')?.addEventListener('click', close)
    modal.querySelector('.modal-backdrop')?.addEventListener('click', close)
    card.querySelector('#category-form')?.addEventListener('submit', event => this._saveCategory(event, row?.id || null))
  }

  async _saveCategory (event, id) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const payload = {
      type: id ? 'bill_tracker/category/update' : 'bill_tracker/category/add',
      ...(id ? { category_id: id } : {}),
      name: String(values.get('name') || '').trim(),
      interval_months: Number(values.get('interval_months') || 1),
      enabled: values.get('enabled') === 'on',
      default_payer_id: String(values.get('default_payer_id') || ''),
      color: String(values.get('color') || ''),
      consumption_unit: String(values.get('consumption_unit') || '').trim(),
      default_provider: String(values.get('default_provider') || '').trim(),
      default_contract: String(values.get('default_contract') || '').trim()
    }
    try {
      await this._hass.callWS(payload)
      this.shadowRoot.getElementById('modal').hidden = true
      this._notice = this._t('settingsSaved')
      this._error = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _deleteCategory (id) {
    if (!window.confirm(this._t('confirmDeleteCategory'))) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/category/delete', category_id: id })
      this._notice = this._t('settingsSaved')
      this._error = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || this._t('categoryInUse'))
      this._render()
    }
  }

  _openPayer (id = null) {
    const row = id ? (this._data?.payers || []).find(item => item.id === id) : null
    const modal = this.shadowRoot.getElementById('modal')
    const card = this.shadowRoot.getElementById('modal-card')
    if (!modal || !card) return
    card.innerHTML = `<form id="payer-form">
      <div class="modal-head"><h3>${escapeHtml(row ? this._t('edit') : this._t('addPayer'))}</h3><button type="button" class="icon-close" id="modal-close">×</button></div>
      <div class="form-grid">
        <label class="span2"><span>${escapeHtml(this._t('name'))}</span><input name="name" required value="${escapeHtml(row?.name || '')}"></label>
        <label><span>${escapeHtml(this._t('share'))}</span><input name="share_percent" type="number" min="0" max="100" step="0.01" value="${escapeHtml(row?.share_percent ?? 50)}"></label>
        <label><span>${escapeHtml(this._t('paypal'))}</span><input name="paypal_me" value="${escapeHtml(row?.paypal_me || '')}"></label>
        <label class="check span2"><input name="enabled" type="checkbox" ${row?.enabled !== false ? 'checked' : ''}><span>${escapeHtml(this._t('enabled'))}</span></label>
      </div>
      <div class="modal-actions"><button type="button" class="secondary" id="modal-cancel">${escapeHtml(this._t('cancel'))}</button><button type="submit" class="primary">${escapeHtml(this._t('save'))}</button></div>
    </form>`
    modal.hidden = false
    const close = () => { modal.hidden = true }
    card.querySelector('#modal-close')?.addEventListener('click', close)
    card.querySelector('#modal-cancel')?.addEventListener('click', close)
    modal.querySelector('.modal-backdrop')?.addEventListener('click', close)
    card.querySelector('#payer-form')?.addEventListener('submit', event => this._savePayer(event, row?.id || null))
  }

  async _savePayer (event, id) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const payload = {
      type: id ? 'bill_tracker/payer/update' : 'bill_tracker/payer/add',
      ...(id ? { payer_id: id } : {}),
      name: String(values.get('name') || '').trim(),
      share_percent: Number(values.get('share_percent') || 0),
      paypal_me: String(values.get('paypal_me') || '').trim(),
      enabled: values.get('enabled') === 'on'
    }
    try {
      await this._hass.callWS(payload)
      this.shadowRoot.getElementById('modal').hidden = true
      this._notice = this._t('settingsSaved')
      this._error = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _deletePayer (id) {
    if (!window.confirm(this._t('confirmDeletePayer'))) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/payer/delete', payer_id: id })
      this._notice = this._t('settingsSaved')
      this._error = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || this._t('payerInUse'))
      this._render()
    }
  }

  async _saveSources () {
    const entryIds = [...this.shadowRoot.querySelectorAll('.source-row input:checked')].map(input => input.value)
    try {
      await this._hass.callWS({ type: 'bill_tracker/parser/sources/set', entry_ids: entryIds })
      this._notice = this._t('sourcesSaved')
      this._error = null
      await this._load(false)
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  _styles () {
    return `
      :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.settings-page{display:flex;flex-direction:column;gap:16px}.settings-hero h1{font-size:30px;line-height:1.1;margin:0 0 6px}.settings-hero p{margin:0;color:var(--secondary-text-color);font-size:14px}.settings-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px;align-items:start}.settings-layout aside{position:sticky;top:122px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:3px}.settings-nav-item{appearance:none;border:0;background:transparent;color:var(--secondary-text-color);font:inherit;padding:11px 12px;border-radius:9px;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer}.settings-nav-item.active{background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);font-weight:650}.settings-nav-item ha-icon{--mdc-icon-size:20px}.settings-content{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;padding:20px;min-height:420px}.section-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;padding-bottom:18px;border-bottom:1px solid var(--divider-color)}.section-head h2{font-size:20px;margin:0 0 5px}.section-head p{font-size:13px;line-height:1.45;color:var(--secondary-text-color);margin:0;max-width:760px}.primary,.secondary,.row-actions button,.error-card button{appearance:none;border-radius:9px;padding:9px 13px;font:inherit;font-weight:600;cursor:pointer}.primary{border:1px solid var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}.secondary,.row-actions button,.error-card button{border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)}.items{display:flex;flex-direction:column}.item-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:14px;padding:15px 2px;border-bottom:1px solid var(--divider-color)}.item-row:last-child{border-bottom:0}.color-dot{width:14px;height:42px;border-radius:99px}.avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 13%,transparent);color:var(--primary-color);font-weight:700}.item-main{display:flex;flex-direction:column;gap:4px;min-width:0}.item-main strong{font-size:14px}.item-main small{color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.status{font-size:11px;padding:4px 8px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}.status.enabled{color:var(--success-color,#2e7d32);background:color-mix(in srgb,var(--success-color,#2e7d32) 12%,transparent)}.status.warning{color:var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 12%,transparent)}.row-actions{display:flex;gap:7px}.row-actions button{padding:7px 10px;font-size:12px}.row-actions .danger{color:var(--error-color,#d32f2f)}.source-items{padding-top:4px}.source-row{display:flex;align-items:center;gap:12px;padding:15px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.source-row:last-child{border-bottom:0}.source-row input{width:18px;height:18px;accent-color:var(--primary-color)}.source-row div{display:flex;flex-direction:column;gap:3px}.source-row small{color:var(--secondary-text-color)}.footer-actions{display:flex;justify-content:flex-end;padding-top:18px;border-top:1px solid var(--divider-color)}.system-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:18px 0}.info-card{border:1px solid var(--divider-color);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px}.info-card span{font-size:11px;color:var(--secondary-text-color)}.info-card strong{font-size:18px}.system-card{display:flex;gap:14px;padding:18px;border:1px solid var(--divider-color);border-radius:14px}.system-card>ha-icon{color:var(--primary-color);--mdc-icon-size:27px}.system-card div{display:flex;flex-direction:column;align-items:flex-start;gap:5px}.system-card p{margin:0 0 4px;color:var(--secondary-text-color);font-size:13px;line-height:1.45}.developer-card{display:flex;align-items:center;gap:18px;padding:20px;border:1px solid var(--divider-color);border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--primary-color) 8%,var(--card-background-color)),var(--card-background-color))}.developer-avatar{width:68px;height:68px;flex:none;border-radius:18px;background:var(--primary-color);color:var(--text-primary-color,#fff);display:grid;place-items:center;font-size:24px;font-weight:800}.developer-copy h3,.project-card h3,.support-card h3{margin:0;font-size:18px}.developer-copy p,.project-card p,.support-card p{margin:5px 0 0;color:var(--secondary-text-color);font-size:13px;line-height:1.5}.link-actions,.project-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.link-actions a,.project-actions a,.donate{display:inline-flex;align-items:center;gap:6px;padding:8px 11px;border:1px solid var(--divider-color);border-radius:9px;text-decoration:none;color:var(--primary-text-color);font-size:12px;font-weight:650}.link-actions a:hover,.project-actions a:hover{border-color:var(--primary-color);color:var(--primary-color)}.project-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.project-card{border:1px solid var(--divider-color);border-radius:14px;padding:16px;display:grid;grid-template-columns:auto 1fr;gap:12px}.project-icon{width:42px;height:42px;border-radius:11px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);display:grid;place-items:center}.project-actions{grid-column:1/-1}.project-actions .star{color:var(--warning-color,#f9a825)}.support-card{display:grid;grid-template-columns:auto 1fr;gap:14px;margin-top:14px;padding:18px;border:1px solid color-mix(in srgb,var(--error-color,#d32f2f) 20%,var(--divider-color));border-radius:14px}.support-card>div:first-child{width:46px;height:46px;border-radius:12px;background:color-mix(in srgb,var(--error-color,#d32f2f) 12%,transparent);color:var(--error-color,#d32f2f);display:grid;place-items:center}.donate{margin-top:12px;background:#0070ba;color:white!important;border-color:#0070ba!important}.notice{padding:11px 14px;border-radius:10px;background:color-mix(in srgb,var(--success-color,#2e7d32) 10%,var(--card-background-color));color:var(--success-color,#2e7d32);border:1px solid color-mix(in srgb,var(--success-color,#2e7d32) 28%,transparent);font-size:13px}.notice.error{background:color-mix(in srgb,var(--error-color,#d32f2f) 10%,var(--card-background-color));color:var(--error-color,#d32f2f);border-color:color-mix(in srgb,var(--error-color,#d32f2f) 28%,transparent)}.empty{padding:34px;text-align:center;color:var(--secondary-text-color)}.loading,.error-card{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:24px}.modal[hidden]{display:none}.modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px}.modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.55)}.modal-card{position:relative;z-index:1;width:min(680px,100%);max-height:min(86vh,760px);overflow:auto;background:var(--card-background-color);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);padding:20px}.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.modal-head h3{font-size:20px;margin:0}.icon-close{appearance:none;border:0;background:transparent;color:var(--secondary-text-color);font-size:28px;line-height:1;cursor:pointer}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.form-grid label{display:flex;flex-direction:column;gap:6px}.form-grid label>span{font-size:12px;color:var(--secondary-text-color)}.form-grid input,.form-grid select{width:100%;height:42px;border:1px solid var(--divider-color);border-radius:9px;background:var(--secondary-background-color);color:var(--primary-text-color);padding:0 11px;font:inherit;outline:none}.form-grid input:focus,.form-grid select:focus{border-color:var(--primary-color)}.form-grid input[type=color]{padding:4px}.span2{grid-column:1/-1}.form-grid .check{flex-direction:row;align-items:center}.form-grid .check input{width:18px;height:18px;accent-color:var(--primary-color)}.modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px;padding-top:16px;border-top:1px solid var(--divider-color)}
      @media(max-width:1000px){.settings-layout{grid-template-columns:1fr}.settings-layout aside{position:static;flex-direction:row;overflow-x:auto}.settings-nav-item{white-space:nowrap}.system-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:700px){.project-grid{grid-template-columns:1fr}.developer-card{align-items:flex-start}.settings-hero h1{font-size:25px}.settings-content{padding:14px}.section-head{flex-direction:column}.section-head .primary{width:100%}.item-row{grid-template-columns:auto minmax(0,1fr) auto}.item-row .status{grid-column:2}.row-actions{grid-column:1/-1;justify-content:flex-end}.system-grid{grid-template-columns:1fr 1fr}.form-grid{grid-template-columns:1fr}.span2{grid-column:auto}.modal{padding:8px}.modal-card{padding:16px}}
    `
  }
}

class BillyPanel extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._rendered = false
    this._view = this._viewFromLocation()
  }

  set hass (value) {
    this._hass = value
    this._syncHass()
    this._updateLabels()
  }

  get hass () {
    return this._hass
  }

  set narrow (_value) {}
  set route (_value) {}
  set panel (_value) {}

  connectedCallback () {
    if (!this._rendered) this._render()
    this._syncHass()
  }

  _t (key) {
    return tFor(this._hass, key)
  }

  _viewFromLocation () {
    try {
      const view = new URLSearchParams(window.location.search).get('view')
      return ['dashboard', 'bills', 'recurring', 'parsers', 'settings'].includes(view) ? view : 'dashboard'
    } catch (_error) {
      return 'dashboard'
    }
  }

  _render () {
    this._rendered = true
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;min-height:100%;color:var(--primary-text-color);background:var(--primary-background-color);box-sizing:border-box}*{box-sizing:border-box}.shell{min-height:100vh}.topbar{position:sticky;top:0;z-index:20;background:var(--app-header-background-color,var(--card-background-color));color:var(--app-header-text-color,var(--primary-text-color));border-bottom:1px solid var(--divider-color);box-shadow:0 1px 3px rgba(0,0,0,.08)}.topbar-inner{max-width:1560px;margin:0 auto;padding:16px 24px 0}.brand-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.title{font-size:25px;font-weight:750;line-height:1.15}.subtitle{color:var(--secondary-text-color);margin-top:4px;font-size:13px}.version{color:var(--secondary-text-color);font-size:11px;padding-top:6px;white-space:nowrap}nav{display:flex;gap:4px;margin-top:12px;overflow-x:auto}nav button{appearance:none;border:0;border-bottom:3px solid transparent;background:transparent;color:var(--secondary-text-color);font:inherit;font-weight:650;padding:11px 14px 10px;cursor:pointer;white-space:nowrap}nav button.active{color:var(--primary-color);border-bottom-color:var(--primary-color)}main{max-width:1560px;margin:0 auto;padding:24px}section[hidden]{display:none!important}billy-bills,billy-recurring,billy-parser-manager,billy-dashboard,billy-settings{display:block;width:100%}@media(max-width:700px){.topbar-inner{padding:13px 12px 0}main{padding:12px}.subtitle,.version{display:none}}
      </style>
      <div class="shell">
        <header class="topbar">
          <div class="topbar-inner">
            <div class="brand-row"><div><div class="title">Billy</div><div class="subtitle" id="subtitle"></div></div><div class="version">v${BILLY_PANEL_VERSION}</div></div>
            <nav>
              <button type="button" data-view="dashboard"></button>
              <button type="button" data-view="bills"></button>
              <button type="button" data-view="recurring"></button>
              <button type="button" data-view="parsers"></button>
              <button type="button" data-view="settings"></button>
            </nav>
          </div>
        </header>
        <main>
          <section data-section="dashboard"><billy-dashboard id="dashboard"></billy-dashboard></section>
          <section data-section="bills" hidden><billy-bills id="bills-panel"></billy-bills></section>
          <section data-section="recurring" hidden><billy-recurring id="recurring-panel"></billy-recurring></section>
          <section data-section="parsers" hidden><billy-parser-manager id="parser-manager"></billy-parser-manager></section>
          <section data-section="settings" hidden><billy-settings id="settings-panel"></billy-settings></section>
        </main>
      </div>
    `

    for (const button of this.shadowRoot.querySelectorAll('nav button[data-view]')) {
      button.addEventListener('click', () => this._setView(button.dataset.view))
    }
    this.shadowRoot.addEventListener('billy-navigate', event => {
      const view = event.detail?.view
      if (view) this._setView(view)
    })
    this._updateLabels()
    this._applyView()
  }

  _setView (view) {
    if (!['dashboard', 'bills', 'recurring', 'parsers', 'settings'].includes(view)) return
    this._view = view
    this._applyView()
    try {
      const url = new URL(window.location.href)
      if (view === 'dashboard') url.searchParams.delete('view')
      else url.searchParams.set('view', view)
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    } catch (_error) {}
  }

  _applyView () {
    if (!this._rendered) return
    for (const section of this.shadowRoot.querySelectorAll('[data-section]')) {
      section.hidden = section.dataset.section !== this._view
    }
    for (const button of this.shadowRoot.querySelectorAll('nav button[data-view]')) {
      button.classList.toggle('active', button.dataset.view === this._view)
    }
    this._syncHass()
  }

  _updateLabels () {
    if (!this._rendered) return
    this.shadowRoot.getElementById('subtitle').textContent = this._t('subtitle')
    for (const view of ['dashboard', 'bills', 'recurring', 'parsers', 'settings']) {
      const button = this.shadowRoot.querySelector(`[data-view="${view}"]`)
      if (button) button.textContent = this._t(view)
    }
  }

  _syncHass () {
    if (!this._rendered || !this._hass) return
    for (const id of ['dashboard', 'bills-panel', 'recurring-panel', 'parser-manager', 'settings-panel']) {
      const element = this.shadowRoot.getElementById(id)
      if (element) element.hass = this._hass
    }
  }
}

if (!customElements.get('billy-dashboard')) customElements.define('billy-dashboard', BillyDashboard)
if (!customElements.get('billy-bills')) customElements.define('billy-bills', BillyBills)
if (!customElements.get('billy-recurring')) customElements.define('billy-recurring', BillyRecurring)
if (!customElements.get('billy-settings')) customElements.define('billy-settings', BillySettings)
if (!customElements.get('billy-panel')) customElements.define('billy-panel', BillyPanel)
