const BILLY_WIDGETS_VERSION = '0.11.3'

const CARD_META = [
  ['billy-summary-card', 'Billy - Summary', 'Compact monthly bill summary'],
  [
    'billy-spending-card',
    'Billy - Spending',
    'Historical spending and forecast',
  ],
  [
    'billy-breakdown-card',
    'Billy - Breakdown',
    'Current spending by bill type',
  ],
  [
    'billy-upcoming-card',
    'Billy - Upcoming',
    'Upcoming bills and recurring charges',
  ],
  [
    'billy-recurring-card',
    'Billy - Recurring',
    'Recurring expenses and installments',
  ],
  [
    'billy-balances-card',
    'Billy - Balances',
    'Outstanding reimbursements between payers',
  ],
  [
    'billy-parser-status-card',
    'Billy - Parser status',
    'Parser health and update status',
  ],
]

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function number(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function isoToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function addMonths(key, amount) {
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, month - 1 + amount, 1)
  return monthKey(date)
}

function monthLabel(key, locale) {
  const [year, month] = String(key).split('-').map(Number)
  if (!year || !month) return String(key)
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(year, month - 1, 1),
  )
}

function dateLabel(value, locale) {
  if (!value) return ''
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

class BillyWidgetBase extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._config = {}
    this._hass = null
    this._data = null
    this._parserData = null
    this._loading = false
    this._error = ''
    this._connection = null
  }

  static getStubConfig() {
    return {}
  }

  setConfig(config) {
    this._config = { ...this.constructor.getStubConfig(), ...(config || {}) }
    this._render()
    if (this._hass) this._load()
  }

  set hass(value) {
    const previousConnection = this._connection
    this._hass = value
    this._connection = value?.connection || null
    if (!this._data || previousConnection !== this._connection) this._load()
    else this._render()
  }

  getCardSize() {
    return 3
  }

  getGridOptions() {
    return { columns: 6, min_columns: 3 }
  }

  get locale() {
    return (
      this._hass?.locale?.language ||
      this._hass?.language ||
      navigator.language ||
      'en'
    )
  }

  get currency() {
    return this._data?.currency || this._hass?.config?.currency || 'EUR'
  }

  money(value) {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
      maximumFractionDigits: 2,
    }).format(number(value))
  }

  async _load() {
    if (!this._hass || this._loading) return
    this._loading = true
    this._error = ''
    this._render()
    try {
      const tasks = [
        this._hass.callWS({
          type: 'bill_tracker/list',
          forecast_months: Math.max(
            1,
            Math.min(24, Number(this._config.forecast_months || 12)),
          ),
        }),
      ]
      if (this.needsParserData)
        tasks.push(this._hass.callWS({ type: 'bill_tracker/parser/list' }))
      const result = await Promise.all(tasks)
      this._data = result[0]
      if (this.needsParserData) this._parserData = result[1]
    } catch (error) {
      this._error = error?.message || String(error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _navigate(view = 'dashboard') {
    const path = `/billy?view=${encodeURIComponent(view)}`
    history.pushState(null, '', path)
    window.dispatchEvent(new Event('location-changed'))
  }

  _styles(extra = '') {
    return `
      :host{display:block}
      *{box-sizing:border-box}
      ha-card{height:100%;overflow:hidden;background:var(--ha-card-background,var(--card-background-color));color:var(--primary-text-color)}
      .card{padding:16px}
      .head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      .head h2{margin:0;font-size:17px;font-weight:700;line-height:1.25}
      .head p{margin:3px 0 0;color:var(--secondary-text-color);font-size:12px}
      .link{border:0;background:transparent;color:var(--primary-color);font:inherit;font-size:12px;font-weight:650;cursor:pointer;padding:2px 0}
      .muted{color:var(--secondary-text-color)}
      .empty,.loading,.error{padding:22px 8px;text-align:center;color:var(--secondary-text-color);font-size:13px}
      .error{color:var(--error-color,#db4437)}
      .amount{font-variant-numeric:tabular-nums}
      ${extra}
    `
  }

  _shell(title, subtitle, body, view = 'dashboard') {
    if (this._loading && !this._data)
      body = '<div class="loading">Loading Billy…</div>'
    if (this._error) body = `<div class="error">${esc(this._error)}</div>`
    return `
      <style>${this._styles(this.extraStyles || '')}</style>
      <ha-card>
        <div class="card">
          <div class="head">
            <div><h2>${esc(title)}</h2>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>
            <button class="link" data-open-billy>Open Billy</button>
          </div>
          ${body}
        </div>
      </ha-card>`
  }

  _bind(view = 'dashboard') {
    this.shadowRoot
      ?.querySelector('[data-open-billy]')
      ?.addEventListener('click', () => this._navigate(view))
  }

  _render() {}
}

class BillySummaryCard extends BillyWidgetBase {
  static getStubConfig() {
    return { title: 'Billy', forecast_months: 1 }
  }

  get extraStyles() {
    return `
      .hero{display:grid;grid-template-columns:1.25fr 1fr;gap:10px;margin-bottom:10px}
      .metric{padding:12px;border-radius:12px;background:var(--secondary-background-color)}
      .metric.primary{background:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color));border:1px solid color-mix(in srgb,var(--primary-color) 24%,transparent)}
      .label{display:block;color:var(--secondary-text-color);font-size:11px;margin-bottom:4px}
      .value{display:block;font-size:20px;font-weight:750}
      .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .grid .value{font-size:15px}
      @media(max-width:420px){.hero{grid-template-columns:1fr}.grid{grid-template-columns:1fr 1fr}}
    `
  }

  _render() {
    if (!this.shadowRoot) return
    const summary = this._data?.summary || {}
    const body = `
      <div class="hero">
        <div class="metric primary"><span class="label">This month</span><span class="value amount">${this.money(summary.current_month)}</span></div>
        <div class="metric"><span class="label">Outstanding</span><span class="value amount">${this.money(summary.outstanding_total)}</span></div>
      </div>
      <div class="grid">
        <div class="metric"><span class="label">Next month</span><span class="value amount">${this.money(summary.next_month_estimate)}</span></div>
        <div class="metric"><span class="label">Year total</span><span class="value amount">${this.money(summary.year_total)}</span></div>
        <div class="metric"><span class="label">Monthly recurring</span><span class="value amount">${this.money(summary.recurring_monthly_equivalent)}</span></div>
        <div class="metric"><span class="label">Reimbursements</span><span class="value amount">${this.money(summary.reimbursement_total)}</span></div>
      </div>`
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Billy',
      'Household bills at a glance',
      body,
    )
    this._bind('dashboard')
  }
}

class BillySpendingCard extends BillyWidgetBase {
  static getStubConfig() {
    return {
      title: 'Spending',
      months: 12,
      forecast_months: 3,
      show_recurring: true,
    }
  }

  getCardSize() {
    return 5
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 }
  }

  get extraStyles() {
    return `
      .chart{display:flex;align-items:flex-end;gap:7px;height:210px;padding:12px 4px 0;border-bottom:1px solid var(--divider-color)}
      .bar-wrap{height:100%;min-width:0;flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;gap:4px}
      .bar{width:100%;min-height:2px;border-radius:5px 5px 1px 1px;background:var(--primary-color);position:relative;overflow:hidden}
      .bar.recurring{background:var(--warning-color,#f39c12)}
      .bar.forecast{opacity:.38}
      .month{text-align:center;color:var(--secondary-text-color);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px;color:var(--secondary-text-color);font-size:11px}
      .legend i{display:inline-block;width:8px;height:8px;border-radius:3px;margin-right:5px;background:var(--primary-color)}
      .legend .rec i{background:var(--warning-color,#f39c12)}
      .legend .for i{opacity:.38}
    `
  }

  _rows() {
    if (!this._data) return []
    const requested = Math.max(
      3,
      Math.min(24, Number(this._config.months || 12)),
    )
    const current = monthKey()
    const first = addMonths(current, -(requested - 1))
    const monthly = new Map(
      (this._data.monthly || []).map((row) => [row.key, row]),
    )
    const recurringByMonth = new Map()
    if (this._config.show_recurring !== false) {
      for (const item of this._data.recurring_history || []) {
        const key = String(item.due_date || '').slice(0, 7)
        if (!key) continue
        recurringByMonth.set(
          key,
          number(recurringByMonth.get(key)) + number(item.amount),
        )
      }
    }
    const rows = []
    for (let offset = 0; offset < requested; offset += 1) {
      const key = addMonths(first, offset)
      rows.push({
        key,
        bill: number(monthly.get(key)?.total),
        recurring: number(recurringByMonth.get(key)),
        forecast: false,
      })
    }
    for (const row of (this._data.forecast || []).slice(
      0,
      Number(this._config.forecast_months || 3),
    )) {
      rows.push({
        key: row.key,
        bill: number(row.bill_total),
        recurring:
          this._config.show_recurring === false
            ? 0
            : number(row.recurring_total),
        forecast: true,
      })
    }
    return rows
  }

  _render() {
    if (!this.shadowRoot) return
    const rows = this._rows()
    const max = Math.max(1, ...rows.map((row) => row.bill + row.recurring))
    const bars = rows
      .map((row) => {
        const totalHeight = Math.max(
          3,
          ((row.bill + row.recurring) / max) * 160,
        )
        const recurringHeight =
          row.bill + row.recurring > 0
            ? (row.recurring / (row.bill + row.recurring)) * totalHeight
            : 0
        const billHeight = Math.max(0, totalHeight - recurringHeight)
        const title = `${row.key}: ${this.money(row.bill + row.recurring)}`
        return `<div class="bar-wrap" title="${esc(title)}">
          ${row.recurring > 0 ? `<div class="bar recurring ${row.forecast ? 'forecast' : ''}" style="height:${recurringHeight}px"></div>` : ''}
          ${row.bill > 0 ? `<div class="bar ${row.forecast ? 'forecast' : ''}" style="height:${billHeight}px"></div>` : '<div style="height:2px"></div>'}
          <div class="month">${esc(monthLabel(row.key, this.locale))}</div>
        </div>`
      })
      .join('')
    const body = rows.length
      ? `<div class="chart">${bars}</div><div class="legend"><span><i></i>Bills</span><span class="rec"><i></i>Recurring</span><span class="for"><i></i>Forecast</span></div>`
      : '<div class="empty">No spending data yet.</div>'
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Spending',
      'History and forecast',
      body,
    )
    this._bind('dashboard')
  }
}

class BillyBreakdownCard extends BillyWidgetBase {
  static getStubConfig() {
    return { title: 'This month', limit: 8, show_recurring: true }
  }

  get extraStyles() {
    return `
      .rows{display:flex;flex-direction:column;gap:10px}.row{display:grid;grid-template-columns:minmax(90px,1fr) minmax(90px,2fr) auto;gap:10px;align-items:center}.name{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.track{height:8px;border-radius:999px;background:var(--secondary-background-color);overflow:hidden}.fill{height:100%;border-radius:inherit;background:var(--primary-color)}.price{font-size:12px;font-weight:650}
    `
  }

  _items() {
    if (!this._data) return []
    const key = monthKey()
    const totals = new Map()
    for (const expense of this._data.expenses || []) {
      if (!expense.paid) continue
      const paidKey = `${expense.paid_year}-${String(expense.paid_month).padStart(2, '0')}`
      if (paidKey !== key) continue
      const name = expense.category || expense.category_name || 'Other'
      totals.set(name, number(totals.get(name)) + number(expense.amount))
    }
    if (this._config.show_recurring !== false) {
      for (const item of this._data.current_month_recurring || []) {
        totals.set(
          item.name || 'Recurring',
          number(totals.get(item.name || 'Recurring')) + number(item.amount),
        )
      }
    }
    return [...totals.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, Math.max(1, Number(this._config.limit || 8)))
  }

  _render() {
    if (!this.shadowRoot) return
    const items = this._items()
    const max = Math.max(1, ...items.map((item) => item.amount))
    const body = items.length
      ? `<div class="rows">${items
          .map(
            (item) =>
              `<div class="row"><div class="name">${esc(item.name)}</div><div class="track"><div class="fill" style="width:${Math.max(2, (item.amount / max) * 100)}%"></div></div><div class="price amount">${this.money(item.amount)}</div></div>`,
          )
          .join('')}</div>`
      : '<div class="empty">No expenses this month.</div>'
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'This month',
      'Spending breakdown',
      body,
    )
    this._bind('dashboard')
  }
}

class BillyUpcomingCard extends BillyWidgetBase {
  static getStubConfig() {
    return { title: 'Upcoming', limit: 6, days: 90, forecast_months: 3 }
  }

  get extraStyles() {
    return `
      .list{display:flex;flex-direction:column}.item{display:grid;grid-template-columns:55px minmax(0,1fr) auto;gap:9px;align-items:center;padding:9px 0;border-bottom:1px solid var(--divider-color)}.item:last-child{border-bottom:0}.date{font-size:11px;color:var(--secondary-text-color)}.name{min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kind{display:block;margin-top:2px;font-size:10px;color:var(--secondary-text-color)}.price{font-size:12px;font-weight:700}
    `
  }

  _items() {
    if (!this._data) return []
    const today = isoToday()
    const maxDate = new Date(`${today}T12:00:00`)
    maxDate.setDate(
      maxDate.getDate() + Math.max(1, Number(this._config.days || 90)),
    )
    const maxIso = maxDate.toISOString().slice(0, 10)
    const items = []
    for (const expense of this._data.expenses || []) {
      const due = String(expense.due_date || '')
      if (expense.paid || !due || due < today || due > maxIso) continue
      items.push({
        name: expense.category || expense.provider || 'Bill',
        amount: number(expense.amount),
        due,
        source: 'bill',
      })
    }
    for (const item of this._data.upcoming || []) {
      const due = item.due_date || `${item.key}-28`
      if (due < today || due > maxIso) continue
      items.push({
        name: item.category || 'Upcoming',
        amount: number(item.amount),
        due,
        source: item.source,
      })
    }
    const seen = new Set()
    return items
      .sort((a, b) => a.due.localeCompare(b.due))
      .filter((item) => {
        const key = `${item.name}|${item.amount}|${item.due}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, Math.max(1, Number(this._config.limit || 6)))
  }

  _render() {
    if (!this.shadowRoot) return
    const items = this._items()
    const body = items.length
      ? `<div class="list">${items
          .map(
            (item) =>
              `<div class="item"><div class="date">${esc(dateLabel(item.due, this.locale))}</div><div class="name">${esc(item.name)}<span class="kind">${item.source === 'recurring' ? 'Recurring' : item.source === 'bill_forecast' ? 'Estimated bill' : 'Bill'}</span></div><div class="price amount">${this.money(item.amount)}</div></div>`,
          )
          .join('')}</div>`
      : '<div class="empty">Nothing due in this window.</div>'
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Upcoming',
      `Next ${Number(this._config.days || 90)} days`,
      body,
    )
    this._bind('bills')
  }
}

class BillyRecurringCard extends BillyWidgetBase {
  static getStubConfig() {
    return { title: 'Recurring expenses', limit: 6, active_only: true }
  }

  get extraStyles() {
    return `
      .list{display:flex;flex-direction:column}.item{display:grid;grid-template-columns:9px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--divider-color)}.item:last-child{border-bottom:0}.dot{width:9px;height:36px;border-radius:999px;background:var(--primary-color)}.name{font-size:13px;font-weight:650}.meta{display:block;margin-top:3px;color:var(--secondary-text-color);font-size:10px}.price{text-align:right;font-size:12px;font-weight:700}.remaining{display:block;margin-top:2px;color:var(--secondary-text-color);font-size:10px;font-weight:400}
    `
  }

  _items() {
    return (this._data?.recurring_expenses || [])
      .filter(
        (item) =>
          this._config.active_only === false || item.status === 'active',
      )
      .sort((a, b) =>
        String(a.next_due_date || '9999').localeCompare(
          String(b.next_due_date || '9999'),
        ),
      )
      .slice(0, Math.max(1, Number(this._config.limit || 6)))
  }

  _render() {
    if (!this.shadowRoot) return
    const items = this._items()
    const body = items.length
      ? `<div class="list">${items
          .map((item) => {
            const installment =
              item.kind === 'installment' && item.remaining_installments != null
            const cadence =
              Number(item.interval_months || 1) === 1
                ? 'monthly'
                : `every ${Number(item.interval_months)} months`
            return `<div class="item"><div class="dot" style="background:${esc(item.color || 'var(--primary-color)')}"></div><div><div class="name">${esc(item.name)}</div><span class="meta">${esc(item.kind || 'recurring')} · ${cadence}${item.next_due_date ? ` · next ${esc(dateLabel(item.next_due_date, this.locale))}` : ''}</span></div><div class="price amount">${this.money(item.amount)}${installment ? `<span class="remaining">${Number(item.remaining_installments)} left</span>` : ''}</div></div>`
          })
          .join('')}</div>`
      : '<div class="empty">No recurring expenses.</div>'
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Recurring expenses',
      `${items.length} shown`,
      body,
    )
    this._bind('recurring')
  }
}

class BillyBalancesCard extends BillyWidgetBase {
  static getStubConfig() {
    return { title: 'Reimbursements', limit: 6, show_paypal: true }
  }

  get extraStyles() {
    return `
      .list{display:flex;flex-direction:column}.debt{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--divider-color)}.debt:last-child{border-bottom:0}.route{font-size:13px}.route strong{font-weight:700}.meta{display:block;color:var(--secondary-text-color);font-size:10px;margin-top:2px}.right{display:flex;align-items:center;gap:7px}.price{font-size:12px;font-weight:700}.paypal{border:1px solid var(--divider-color);border-radius:8px;background:var(--secondary-background-color);color:var(--primary-text-color);padding:5px 7px;font-size:10px;text-decoration:none}
    `
  }

  _render() {
    if (!this.shadowRoot) return
    const debts = (this._data?.debts || []).slice(
      0,
      Math.max(1, Number(this._config.limit || 6)),
    )
    const payerMap = new Map(
      (this._data?.payers || []).map((payer) => [String(payer.id), payer.name]),
    )
    const body = debts.length
      ? `<div class="list">${debts
          .map((debt) => {
            const from =
              debt.from_name ||
              payerMap.get(String(debt.from_payer_id)) ||
              'Payer'
            const to =
              debt.to_name || payerMap.get(String(debt.to_payer_id)) || 'Payer'
            const paypal = this._config.show_paypal !== false && debt.paypal_url
            return `<div class="debt"><div class="route"><strong>${esc(from)}</strong> → ${esc(to)}<span class="meta">${Number(debt.item_count || debt.expense_count || 0)} items</span></div><div class="right"><span class="price amount">${this.money(debt.amount)}</span>${paypal ? `<a class="paypal" href="${esc(debt.paypal_url)}" target="_blank" rel="noopener">PayPal</a>` : ''}</div></div>`
          })
          .join('')}</div>`
      : '<div class="empty">Everyone is even.</div>'
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Reimbursements',
      'Outstanding balances',
      body,
    )
    this._bind('bills')
  }
}

class BillyParserStatusCard extends BillyWidgetBase {
  get needsParserData() {
    return true
  }

  static getStubConfig() {
    return { title: 'Billy Parser', forecast_months: 1 }
  }

  get extraStyles() {
    return `
      .stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.stat{padding:12px;border-radius:11px;background:var(--secondary-background-color)}.value{display:block;font-size:21px;font-weight:750}.label{display:block;margin-top:3px;color:var(--secondary-text-color);font-size:10px}.alert{color:var(--warning-color,#f39c12)}.bad{color:var(--error-color,#db4437)}
    `
  }

  _render() {
    if (!this.shadowRoot) return
    const rows = this._parserData?.catalog?.parsers || []
    const counts = this._parserData?.catalog?.counts || {}
    const experimental = rows.filter(
      (row) => row.catalog_status === 'experimental',
    ).length
    const errors = rows.filter((row) => row.status === 'error').length
    const body = `<div class="stats">
      <div class="stat"><span class="value">${Number(counts.installed || rows.filter((row) => row.installed).length)}</span><span class="label">Installed</span></div>
      <div class="stat"><span class="value alert">${experimental}</span><span class="label">Experimental</span></div>
      <div class="stat"><span class="value alert">${Number(counts.outdated || 0)}</span><span class="label">Updates</span></div>
      <div class="stat"><span class="value ${errors ? 'bad' : ''}">${errors}</span><span class="label">Errors</span></div>
    </div>`
    this.shadowRoot.innerHTML = this._shell(
      this._config.title || 'Billy Parser',
      'Community parser health',
      body,
      'parsers',
    )
    this._bind('parsers')
  }
}

const DEFINITIONS = [
  ['billy-summary-card', BillySummaryCard],
  ['billy-spending-card', BillySpendingCard],
  ['billy-breakdown-card', BillyBreakdownCard],
  ['billy-upcoming-card', BillyUpcomingCard],
  ['billy-recurring-card', BillyRecurringCard],
  ['billy-balances-card', BillyBalancesCard],
  ['billy-parser-status-card', BillyParserStatusCard],
]

for (const [name, klass] of DEFINITIONS) {
  if (!customElements.get(name)) customElements.define(name, klass)
}

window.customCards = window.customCards || []
for (const [type, name, description] of CARD_META) {
  if (window.customCards.some((card) => card.type === type)) continue
  window.customCards.push({
    type,
    name,
    description,
    preview: true,
    documentationURL: 'https://github.com/robin994/billy',
  })
}

console.info(`Billy widgets v${BILLY_WIDGETS_VERSION} loaded`)
