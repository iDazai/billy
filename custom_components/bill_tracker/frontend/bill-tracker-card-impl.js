import {
  billyCategoryLabel,
  billyLocale,
  billyT
} from './bill-tracker-i18n.js?v=0.6.1'

const BILL_TRACKER_VERSION = '0.6.1'

class BillTrackerCard extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._hass = null
    this._config = BillTrackerCard.getStubConfig()
    this._data = null
    this._loading = false
    this._error = ''
    this._editing = null
    this._formOpen = false
    this._transferOpen = false
    this._importText = ''
    this._busy = false
    this._message = ''
    this._billFilterCategory = 'all'
    this._billFilterStatus = 'all'
    this._billFilterTimeMode = 'all'
    this._billFilterYear = 'all'
    this._billFilterFrom = ''
    this._billFilterTo = ''
    this._billPage = 1
    this._billPageSize = 10
    this._unsubscribers = []
  }

  static getStubConfig () {
    return {
      title: '',
      columns: 'full',
      history_months: 12,
      forecast_months: 12
    }
  }

  static getConfigElement () {
    return document.createElement('bill-tracker-card-editor')
  }

  setConfig (config) {
    this._config = { ...BillTrackerCard.getStubConfig(), ...(config || {}) }
    this._render()
  }

  set hass (hass) {
    const first = !this._hass
    this._hass = hass
    if (first) {
      this._subscribe()
      this._load()
    }
  }

  disconnectedCallback () {
    for (const unsubscribe of this._unsubscribers) unsubscribe?.()
    this._unsubscribers = []
  }

  getCardSize () {
    return 10
  }

  getGridOptions () {
    const configured = this._config.columns ?? 'full'
    return {
      columns:
        configured === 'full'
          ? 'full'
          : Math.max(1, Math.min(12, Number(configured || 12))),
      min_columns: 6
    }
  }

  _t (key, vars = {}) {
    return billyT(this._hass, key, vars)
  }

  _locale () {
    return billyLocale(this._hass)
  }

  _escape (value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  _categoryLabel (category) {
    return billyCategoryLabel(this._hass, category)
  }

  _categoryById (id) {
    return (this._data?.categories || []).find(item => item.id === id) || null
  }

  _payerById (id) {
    return (this._data?.payers || []).find(item => item.id === id) || null
  }

  _money (value) {
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'
    try {
      return new Intl.NumberFormat(this._locale(), {
        style: 'currency',
        currency
      }).format(Number(value || 0))
    } catch (_error) {
      return `${Number(value || 0).toFixed(2)} ${currency}`
    }
  }

  _monthValue (year, month) {
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`
  }

  _parseMonth (value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ''))
    if (!match) return null
    const year = Number(match[1])
    const month = Number(match[2])
    return year >= 2000 && month >= 1 && month <= 12 ? { year, month } : null
  }

  _addMonths (year, month, delta) {
    const absolute = year * 12 + month - 1 + delta
    return {
      year: Math.floor(absolute / 12),
      month: ((absolute % 12) + 12) % 12 + 1
    }
  }

  _formatDate (value) {
    const text = String(value || '')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
    const [year, month, day] = text.split('-').map(Number)
    return new Intl.DateTimeFormat(this._locale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(year, month - 1, day))
  }

  _monthLabel (year, month) {
    const text = new Intl.DateTimeFormat(this._locale(), {
      month: 'short',
      year: 'numeric'
    }).format(new Date(Number(year), Number(month) - 1, 1))
    return text.replace(/\.$/, '')
  }

  _periodText (item) {
    const start = this._monthLabel(item.period_start_year, item.period_start_month)
    const end = this._monthLabel(item.period_end_year, item.period_end_month)
    return start === end ? start : `${start} → ${end}`
  }

  _splitText (item) {
    return (item.split || [])
      .filter(part => Number(part.percentage || 0) > 0)
      .map(part => `${part.name || this._payerById(part.payer_id)?.name || ''} ${Number(part.percentage).toFixed(Number(part.percentage) % 1 ? 1 : 0)}%`)
      .join(' · ')
  }

  _billYears (expenses) {
    return [
      ...new Set(
        (expenses || [])
          .map(item => Number(item.paid_year))
          .filter(Number.isInteger)
      )
    ].sort((a, b) => b - a)
  }

  _filterBills (expenses) {
    let rows = (expenses || []).slice()
    if (this._billFilterCategory !== 'all') {
      rows = rows.filter(item => item.category_id === this._billFilterCategory)
    }
    if (this._billFilterStatus === 'paid') {
      rows = rows.filter(item => Boolean(item.paid))
    } else if (this._billFilterStatus === 'unpaid') {
      rows = rows.filter(item => !Boolean(item.paid))
    }
    if (this._billFilterTimeMode === 'year' && this._billFilterYear !== 'all') {
      const year = Number(this._billFilterYear)
      rows = rows.filter(item => Number(item.paid_year) === year)
    } else if (this._billFilterTimeMode === 'range') {
      let from = this._billFilterFrom || ''
      let to = this._billFilterTo || ''
      if (from && to && from > to) [from, to] = [to, from]
      rows = rows.filter(item => {
        const key = this._monthValue(item.paid_year, item.paid_month)
        return (!from || key >= from) && (!to || key <= to)
      })
    }
    return rows
  }

  async _subscribe () {
    if (!this._hass) return
    for (const type of ['bill_tracker_updated', 'bill_tracker_import_updated']) {
      try {
        const unsubscribe = await this._hass.connection.subscribeEvents(
          () => this._load(),
          type
        )
        this._unsubscribers.push(unsubscribe)
      } catch (_error) {
        // An explicit reload follows every local write.
      }
    }
  }

  async _load () {
    if (!this._hass || this._loading) return
    this._loading = true
    try {
      this._data = await this._hass.callWS({
        type: 'bill_tracker/list',
        forecast_months: Math.max(
          1,
          Math.min(24, Number(this._config.forecast_months || 12))
        )
      })
      this._error = ''
    } catch (error) {
      this._error = String(error?.message || error)
    } finally {
      this._loading = false
      this._render()
    }
  }

  _formHtml () {
    const categories = (this._data?.categories || []).filter(
      item => item.enabled || item.id === this._editing?.category_id
    )
    const payers = this._data?.payers || []
    const now = new Date()
    const editing = this._editing
    const categoryId = editing?.category_id || categories[0]?.id || ''
    const category = this._categoryById(categoryId)
    const paidMonth = editing
      ? this._monthValue(editing.paid_year, editing.paid_month)
      : this._monthValue(now.getFullYear(), now.getMonth() + 1)
    const periodEnd = editing
      ? this._monthValue(editing.period_end_year, editing.period_end_month)
      : paidMonth
    const parsedEnd = this._parseMonth(periodEnd) || {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    }
    const periodStart = editing
      ? this._monthValue(editing.period_start_year, editing.period_start_month)
      : this._monthValue(
          this._addMonths(
            parsedEnd.year,
            parsedEnd.month,
            -(Math.max(1, Number(category?.interval_months || 1)) - 1)
          ).year,
          this._addMonths(
            parsedEnd.year,
            parsedEnd.month,
            -(Math.max(1, Number(category?.interval_months || 1)) - 1)
          ).month
        )
    const defaultPayer =
      editing?.payer_id || category?.default_payer_id || payers[0]?.id || ''
    const currency = this._data?.currency || this._hass?.config?.currency || 'EUR'

    return `<div class="modal" id="form-modal">
      <div class="dialog">
        <div class="dialog-head">
          <strong>${this._escape(this._t(editing ? 'edit_bill' : 'add_bill'))}</strong>
          <button class="icon" id="form-close" type="button">×</button>
        </div>
        <form id="bill-form">
          <label>${this._escape(this._t('type'))}
            <select id="category" required>
              ${categories
                .map(
                  item => `<option value="${this._escape(item.id)}" ${item.id === categoryId ? 'selected' : ''}>${this._escape(this._categoryLabel(item))}</option>`
                )
                .join('')}
            </select>
          </label>
          <label>${this._escape(this._t('payment_month'))}
            <input id="paid-month" type="month" required value="${this._escape(paidMonth)}">
          </label>
          <label>${this._escape(this._t('amount', { currency }))}
            <input id="amount" type="number" min="0" step="0.01" required value="${editing ? this._escape(editing.amount) : ''}">
          </label>
          <label>${this._escape(this._t('provider'))}
            <input id="provider" type="text" maxlength="100" value="${this._escape(editing?.provider || category?.default_provider || '')}">
          </label>
          <label>${this._escape(this._t('contract'))}
            <input id="contract" type="text" maxlength="100" value="${this._escape(editing?.contract || category?.default_contract || '')}">
          </label>
          <label>${this._escape(this._t('consumption'))}${category?.consumption_unit ? ` (${this._escape(category.consumption_unit)})` : ''}
            <input id="consumption" type="number" min="0" step="any" ${category?.consumption_unit ? '' : 'disabled'} value="${editing?.consumption ?? ''}">
          </label>
          <label>${this._escape(this._t('period_start'))}
            <input id="period-start" type="month" required value="${this._escape(periodStart)}">
          </label>
          <label>${this._escape(this._t('period_end'))}
            <input id="period-end" type="month" required value="${this._escape(periodEnd)}">
          </label>
          <label>${this._escape(this._t('due_date'))}
            <input id="due-date" type="date" value="${this._escape(editing?.due_date || '')}">
          </label>
          <label>${this._escape(this._t('payment_date'))}
            <input id="payment-date" type="date" value="${this._escape(editing?.payment_date || '')}">
          </label>
          ${
            payers.length
              ? `<label>${this._escape(this._t('payer'))}
            <select id="payer">
              ${payers
                .map(
                  payer => `<option value="${this._escape(payer.id)}" ${payer.id === defaultPayer ? 'selected' : ''}>${this._escape(payer.name)}</option>`
                )
                .join('')}
            </select>
          </label>`
              : ''
          }
          <label class="check"><input id="paid" type="checkbox" ${editing?.paid ? 'checked' : ''}> ${this._escape(this._t('paid'))}</label>
          <label class="wide">${this._escape(this._t('note'))}
            <input id="note" type="text" maxlength="120" value="${this._escape(editing?.note || '')}">
          </label>
          <div class="actions wide">
            <button class="secondary" id="form-cancel" type="button">${this._escape(this._t('cancel'))}</button>
            <button class="primary" type="submit">${this._escape(this._t('save'))}</button>
          </div>
        </form>
      </div>
    </div>`
  }

  _transferHtml () {
    return `<div class="modal" id="transfer-modal">
      <div class="dialog transfer-dialog">
        <div class="dialog-head">
          <strong>${this._escape(this._t('import_export'))}</strong>
          <button class="icon" id="transfer-close" type="button">×</button>
        </div>
        <div class="transfer-grid">
          <section>
            <h3>${this._escape(this._t('import_csv'))}</h3>
            <input id="csv-file" type="file" accept=".csv,text/csv">
            <button class="primary" id="csv-import" type="button" ${!this._importText || this._busy ? 'disabled' : ''}>${this._escape(this._t('import'))}</button>
          </section>
          <section>
            <h3>Export</h3>
            <button class="secondary export" data-format="csv" type="button">${this._escape(this._t('export_csv'))}</button>
            <button class="secondary export" data-format="xlsx" type="button">${this._escape(this._t('export_xlsx'))}</button>
            <button class="secondary export" data-format="pdf" type="button">${this._escape(this._t('export_pdf'))}</button>
          </section>
        </div>
        ${this._message ? `<div class="message">${this._escape(this._message)}</div>` : ''}
      </div>
    </div>`
  }

  _renderDebts () {
    const debts = this._data?.debts || []
    if (!debts.length) return `<div class="empty">✓ ${this._escape(this._t('no_balance'))}</div>`
    return debts
      .map(debt => {
        const count = Number(debt.expense_count || 0)
        const billLabel = this._t(count === 1 ? 'bill_singular' : 'bill_plural')
        const paypal = debt.paypal_url
          ? `<a class="paypal small" href="${this._escape(debt.paypal_url)}" target="_blank" rel="noopener noreferrer">${this._escape(this._t('pay_with_paypal'))}</a>`
          : `<button class="secondary small" type="button" disabled title="${this._escape(this._t('paypal_missing_hint'))}">${this._escape(this._t('paypal_missing'))}</button>`
        return `<div class="debt">
          <div><strong>${this._escape(debt.from_name)} → ${this._escape(debt.to_name)}</strong><small>${count} ${this._escape(billLabel)}</small></div>
          <b>${this._money(debt.amount)}</b>
          <div class="debt-actions">
            ${paypal}
            <button class="secondary small settle" data-from="${this._escape(debt.from_payer_id)}" data-to="${this._escape(debt.to_payer_id)}" data-amount="${Number(debt.amount || 0)}" type="button">${this._escape(this._t('mark_settled'))}</button>
          </div>
        </div>`
      })
      .join('')
  }

  _renderBills () {
    const expenses = this._data?.expenses || []
    const categories = (this._data?.categories || [])
      .slice()
      .sort((a, b) => this._categoryLabel(a).localeCompare(this._categoryLabel(b), this._locale()))
    const years = this._billYears(expenses)
    const filtered = this._filterBills(expenses)
    const totalPages = Math.max(1, Math.ceil(filtered.length / this._billPageSize))
    if (this._billPage > totalPages) this._billPage = totalPages
    if (this._billPage < 1) this._billPage = 1
    const start = (this._billPage - 1) * this._billPageSize
    const rows = filtered.slice(start, start + this._billPageSize)

    const toolbar = `<div class="bill-filters">
      <label>${this._escape(this._t('type'))}
        <select id="bill-filter-category">
          <option value="all" ${this._billFilterCategory === 'all' ? 'selected' : ''}>${this._escape(this._t('all_types'))}</option>
          ${categories.map(category => `<option value="${this._escape(category.id)}" ${category.id === this._billFilterCategory ? 'selected' : ''}>${this._escape(this._categoryLabel(category))}</option>`).join('')}
        </select>
      </label>
      <label>${this._escape(this._t('status'))}
        <select id="bill-filter-status">
          <option value="all" ${this._billFilterStatus === 'all' ? 'selected' : ''}>${this._escape(this._t('all'))}</option>
          <option value="unpaid" ${this._billFilterStatus === 'unpaid' ? 'selected' : ''}>${this._escape(this._t('unpaid'))}</option>
          <option value="paid" ${this._billFilterStatus === 'paid' ? 'selected' : ''}>${this._escape(this._t('paid'))}</option>
        </select>
      </label>
      <label>${this._escape(this._t('period'))}
        <select id="bill-filter-time-mode">
          <option value="all" ${this._billFilterTimeMode === 'all' ? 'selected' : ''}>${this._escape(this._t('all_history'))}</option>
          <option value="year" ${this._billFilterTimeMode === 'year' ? 'selected' : ''}>${this._escape(this._t('by_year'))}</option>
          <option value="range" ${this._billFilterTimeMode === 'range' ? 'selected' : ''}>${this._escape(this._t('month_range'))}</option>
        </select>
      </label>
      ${this._billFilterTimeMode === 'year' ? `<label>${this._escape(this._t('year'))}
        <select id="bill-filter-year">
          <option value="all" ${this._billFilterYear === 'all' ? 'selected' : ''}>${this._escape(this._t('all_years'))}</option>
          ${years.map(year => `<option value="${year}" ${String(year) === String(this._billFilterYear) ? 'selected' : ''}>${year}</option>`).join('')}
        </select>
      </label>` : ''}
      ${this._billFilterTimeMode === 'range' ? `<label>${this._escape(this._t('from'))}<input id="bill-filter-from" type="month" value="${this._escape(this._billFilterFrom)}"></label><label>${this._escape(this._t('to'))}<input id="bill-filter-to" type="month" value="${this._escape(this._billFilterTo)}"></label>` : ''}
      <label>${this._escape(this._t('per_page'))}
        <select id="bill-page-size">
          ${[10, 20, 50].map(size => `<option value="${size}" ${Number(this._billPageSize) === size ? 'selected' : ''}>${size}</option>`).join('')}
        </select>
      </label>
    </div>`

    const resultText = this._t('results_of', { filtered: filtered.length, total: expenses.length })
    const list = rows.length
      ? rows.map(item => {
          const category = this._categoryById(item.category_id)
          const details = [item.provider, item.contract]
            .filter(Boolean)
            .map(value => this._escape(value))
            .join(' · ')
          const consumption =
            item.consumption !== null && item.consumption !== undefined
              ? `${Number(item.consumption).toLocaleString(this._locale())} ${this._escape(item.consumption_unit || '')}`
              : ''
          return `<div class="bill-row">
            <label class="paid-toggle" title="${this._escape(item.paid ? this._t('paid') : this._t('unpaid'))}">
              <input class="paid-change" type="checkbox" data-id="${this._escape(item.id)}" ${item.paid ? 'checked' : ''}>
              <span>✓</span>
            </label>
            <div>
              <strong>${this._escape(category ? this._categoryLabel(category) : item.category || '')}</strong>
              <small>${this._escape(this._periodText(item))}</small>
              ${details ? `<small>${details}</small>` : ''}
              ${consumption ? `<small>${consumption}</small>` : ''}
              ${item.due_date ? `<small>${this._escape(this._t('due_date'))}: ${this._escape(this._formatDate(item.due_date))}</small>` : ''}
              ${item.payment_date ? `<small>${this._escape(this._t('payment_date'))}: ${this._escape(this._formatDate(item.payment_date))}</small>` : ''}
              ${item.note ? `<small>${this._escape(item.note)}</small>` : ''}
            </div>
            <div class="amount">${this._money(item.amount)}</div>
            <div class="row-actions">
              <button class="icon edit" data-id="${this._escape(item.id)}" type="button" title="${this._escape(this._t('edit_bill'))}">✎</button>
              <button class="icon delete" data-id="${this._escape(item.id)}" type="button" title="${this._escape(this._t('delete'))}">×</button>
            </div>
          </div>`
        }).join('')
      : `<div class="empty">${this._escape(expenses.length ? this._t('no_filtered_bills') : this._t('no_bills'))}</div>`

    const pagination = `<div class="bill-pagination">
      <span>${this._escape(resultText)} · ${this._escape(this._t('page_of', { page: this._billPage, pages: totalPages }))}</span>
      <div>
        <button class="secondary small bill-page" type="button" data-page="${this._billPage - 1}" ${this._billPage <= 1 ? 'disabled' : ''}>← ${this._escape(this._t('previous'))}</button>
        <button class="secondary small bill-page" type="button" data-page="${this._billPage + 1}" ${this._billPage >= totalPages ? 'disabled' : ''}>${this._escape(this._t('next'))} →</button>
      </div>
    </div>`

    return `${toolbar}<div class="bill-filter-summary">${this._escape(resultText)}</div>${list}${pagination}`
  }

  _renderUpcoming () {
    const upcoming = (this._data?.upcoming || []).slice(0, 8)
    if (!upcoming.length) return '<div class="empty">—</div>'
    return `<div class="upcoming-grid">${upcoming
      .map(
        item => `<div class="upcoming-item"><span>${this._escape(this._monthLabel(item.year, item.month))}</span><strong>${this._escape(item.category || '')}</strong><b>${this._money(item.amount)}</b></div>`
      )
      .join('')}</div>`
  }

  _render () {
    if (!this.shadowRoot) return
    if (!this._data) {
      this.shadowRoot.innerHTML = `<ha-card><div class="loading">${this._escape(this._loading ? this._t('loading') : this._error || this._t('not_available'))}</div></ha-card>`
      return
    }

    const summary = this._data.summary || {}
    const pending = Number(summary.automatic_import_pending || 0)
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card { padding:18px; overflow:hidden; }
        .loading { padding:20px; }
        .head { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
        .title { font-size:20px; font-weight:700; }
        .head-actions,.actions,.row-actions,.debt-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        button,a { box-sizing:border-box; min-height:38px; padding:0 12px; border-radius:10px; border:0; font:inherit; font-weight:600; cursor:pointer; text-decoration:none; }
        button:disabled { opacity:.5; cursor:not-allowed; }
        .primary { background:var(--primary-color); color:var(--text-primary-color,#fff); }
        .secondary,.icon { background:transparent; border:1px solid var(--divider-color); color:var(--primary-text-color); }
        .icon { min-width:36px; padding:0 8px; }
        .small { font-size:12px; min-height:34px; }
        .paypal { background:#0070ba; color:#fff; border:1px solid #0070ba; }
        .paypal:hover { filter:brightness(1.08); }
        .stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
        .stat { padding:12px; border:1px solid var(--divider-color); border-radius:12px; min-width:0; }
        .stat span { display:block; color:var(--secondary-text-color); font-size:11px; }
        .stat strong { display:block; margin-top:4px; font-size:18px; overflow-wrap:anywhere; }
        .parser-note { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px; padding:10px 12px; border:1px solid var(--divider-color); border-radius:10px; font-size:12px; }
        .parser-note.pending { border-color:var(--warning-color,#f0ad4e); }
        .section { margin-top:18px; }
        .section h3 { margin:0 0 8px; font-size:15px; }
        .bill-row { display:grid; grid-template-columns:38px minmax(180px,1fr) auto auto; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid var(--divider-color); }
        .bill-row:last-child { border-bottom:0; }
        .bill-row small,.debt small { display:block; margin-top:3px; color:var(--secondary-text-color); font-size:11px; }
        .amount { font-weight:700; white-space:nowrap; }
        .paid-toggle { position:relative; cursor:pointer; }
        .paid-toggle input { position:absolute; opacity:0; }
        .paid-toggle span { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:2px solid var(--divider-color); border-radius:8px; color:transparent; font-weight:800; }
        .paid-toggle input:checked + span { background:var(--success-color,#43a047); border-color:var(--success-color,#43a047); color:white; }
        .debt { display:grid; grid-template-columns:minmax(180px,1fr) auto auto; gap:10px; align-items:center; padding:9px 0; border-bottom:1px solid var(--divider-color); }
        .debt-actions { justify-content:flex-end; }
        .empty { color:var(--secondary-text-color); padding:8px 0; }
        .bill-filters { display:grid; grid-template-columns:repeat(auto-fit,minmax(145px,1fr)); gap:8px; margin-bottom:8px; padding:10px; border:1px solid var(--divider-color); border-radius:12px; }
        .bill-filters label { font-size:11px; }
        .bill-filters input,.bill-filters select { min-height:38px; font-size:14px; }
        .bill-filter-summary { color:var(--secondary-text-color); font-size:11px; margin:6px 0 2px; }
        .bill-pagination { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:10px; color:var(--secondary-text-color); font-size:11px; flex-wrap:wrap; }
        .bill-pagination > div { display:flex; gap:8px; }
        .upcoming-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:8px; }
        .upcoming-item { border:1px solid var(--divider-color); border-radius:10px; padding:10px; }
        .upcoming-item span,.upcoming-item strong { display:block; font-size:12px; }
        .upcoming-item span { color:var(--secondary-text-color); }
        .upcoming-item b { display:block; margin-top:5px; }
        .modal { position:fixed; inset:0; z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(0,0,0,.52); box-sizing:border-box; }
        .dialog { width:min(840px,100%); max-height:calc(100vh - 40px); overflow:auto; background:var(--card-background-color); color:var(--primary-text-color); border-radius:16px; box-shadow:0 18px 50px rgba(0,0,0,.35); }
        .dialog-head { position:sticky; top:0; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; border-bottom:1px solid var(--divider-color); background:var(--card-background-color); }
        form { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; padding:16px; }
        label { display:flex; flex-direction:column; gap:5px; color:var(--secondary-text-color); font-size:12px; min-width:0; }
        label.check { flex-direction:row; align-items:center; color:var(--primary-text-color); }
        input,select { box-sizing:border-box; width:100%; min-height:44px; padding:8px 10px; border:1px solid var(--divider-color); border-radius:10px; background:var(--card-background-color); color:var(--primary-text-color); font-size:16px; }
        label.check input { width:20px; min-height:20px; }
        .wide { grid-column:1 / -1; }
        .actions { justify-content:flex-end; }
        .transfer-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:16px; }
        .transfer-grid section { display:grid; gap:10px; align-content:start; padding:12px; border:1px solid var(--divider-color); border-radius:12px; }
        .transfer-grid h3 { margin:0; }
        .message { margin:0 16px 16px; padding:10px; border-radius:10px; background:color-mix(in srgb,var(--primary-color) 10%,transparent); font-size:12px; white-space:pre-wrap; }
        .error { margin-top:10px; color:var(--error-color); font-size:12px; }
        @media (max-width:760px) { .stats { grid-template-columns:1fr 1fr; } form { grid-template-columns:1fr 1fr; } .wide { grid-column:1/-1; } .debt { grid-template-columns:1fr auto; } .debt-actions { grid-column:1/-1; justify-content:flex-start; } .transfer-grid { grid-template-columns:1fr; } }
        @media (max-width:520px) { ha-card { padding:13px; } .stats { grid-template-columns:1fr; } .modal { padding:8px; align-items:flex-end; } .dialog { max-height:calc(100vh - 16px); } form { grid-template-columns:1fr; } .wide { grid-column:1; } .bill-row { grid-template-columns:34px 1fr auto; } .bill-row .amount { grid-column:2; } .row-actions { grid-column:3; grid-row:1/span 2; } .debt { grid-template-columns:1fr; } }
      </style>
      <ha-card>
        <div class="head">
          <div class="title">${this._escape(this._config.title || this._t('card_title'))}</div>
          <div class="head-actions">
            <button class="secondary" id="transfer" type="button">⇅ ${this._escape(this._t('import_export'))}</button>
            <button class="secondary" id="settings" type="button">⚙ ${this._escape(this._t('settings'))}</button>
            <button class="primary" id="add" type="button">+ ${this._escape(this._t('add_bill'))}</button>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><span>${this._escape(this._t('current_month'))}</span><strong>${this._money(summary.current_month)}</strong></div>
          <div class="stat"><span>${this._escape(this._t('average_6_months'))}</span><strong>${this._money(summary.average_6_months)}</strong></div>
          <div class="stat"><span>${this._escape(this._t('next_month'))}</span><strong>${this._money(summary.next_month_estimate)}</strong></div>
          <div class="stat"><span>${this._escape(this._t('outstanding'))}</span><strong>${this._money(summary.unpaid_total ?? summary.outstanding_total)}</strong></div>
        </div>
        <div class="parser-note ${pending ? 'pending' : ''}">
          <span>${pending ? this._escape(this._t('parser_status', { count: pending })) : this._escape(this._t('parser_hint'))}</span>
          <button class="secondary small" id="parser-settings" type="button">${this._escape(this._t('settings'))}</button>
        </div>
        ${this._error ? `<div class="error">${this._escape(this._error)}</div>` : ''}
        <div class="section"><h3>${this._escape(this._t('reimbursements'))}</h3>${this._renderDebts()}</div>
        <div class="section"><h3>${this._escape(this._t('upcoming'))}</h3>${this._renderUpcoming()}</div>
        <div class="section"><h3>${this._escape(this._t('recent_bills'))}</h3>${this._renderBills()}</div>
        ${this._formOpen ? this._formHtml() : ''}
        ${this._transferOpen ? this._transferHtml() : ''}
      </ha-card>`

    this.shadowRoot.getElementById('add')?.addEventListener('click', () => {
      this._editing = null
      this._formOpen = true
      this._render()
    })
    for (const id of ['settings', 'parser-settings']) {
      this.shadowRoot.getElementById(id)?.addEventListener('click', () => {
        history.pushState(null, '', '/config/integrations/integration/bill_tracker')
        window.dispatchEvent(new Event('location-changed'))
      })
    }
    this.shadowRoot.getElementById('transfer')?.addEventListener('click', () => {
      this._message = ''
      this._transferOpen = true
      this._render()
    })
    this.shadowRoot.getElementById('form-close')?.addEventListener('click', () => this._closeForm())
    this.shadowRoot.getElementById('form-cancel')?.addEventListener('click', () => this._closeForm())
    this.shadowRoot.getElementById('form-modal')?.addEventListener('click', event => {
      if (event.target?.id === 'form-modal') this._closeForm()
    })
    this.shadowRoot.getElementById('bill-form')?.addEventListener('submit', event => this._submit(event))
    this.shadowRoot.getElementById('category')?.addEventListener('change', () => this._categoryChanged())
    this.shadowRoot.getElementById('paid-month')?.addEventListener('change', () => this._autoPeriod())
    this.shadowRoot.getElementById('transfer-close')?.addEventListener('click', () => {
      this._transferOpen = false
      this._render()
    })
    this.shadowRoot.getElementById('transfer-modal')?.addEventListener('click', event => {
      if (event.target?.id === 'transfer-modal') {
        this._transferOpen = false
        this._render()
      }
    })
    this.shadowRoot.getElementById('csv-file')?.addEventListener('change', event => this._readCsv(event.target))
    this.shadowRoot.getElementById('csv-import')?.addEventListener('click', () => this._importCsv())
    this.shadowRoot.querySelectorAll('.export').forEach(button =>
      button.addEventListener('click', () => this._export(button.dataset.format))
    )
    this.shadowRoot.querySelectorAll('.edit').forEach(button =>
      button.addEventListener('click', () => {
        this._editing = (this._data.expenses || []).find(item => item.id === button.dataset.id) || null
        this._formOpen = Boolean(this._editing)
        this._render()
      })
    )
    this.shadowRoot.querySelectorAll('.delete').forEach(button =>
      button.addEventListener('click', () => this._delete(button.dataset.id))
    )
    this.shadowRoot.querySelectorAll('.paid-change').forEach(input =>
      input.addEventListener('change', () => this._setPaid(input.dataset.id, input.checked))
    )
    const filterBindings = [
      ['bill-filter-category', '_billFilterCategory'],
      ['bill-filter-status', '_billFilterStatus'],
      ['bill-filter-time-mode', '_billFilterTimeMode'],
      ['bill-filter-year', '_billFilterYear'],
      ['bill-filter-from', '_billFilterFrom'],
      ['bill-filter-to', '_billFilterTo']
    ]
    for (const [id, property] of filterBindings) {
      this.shadowRoot.getElementById(id)?.addEventListener('change', event => {
        this[property] = event.target.value
        this._billPage = 1
        this._render()
      })
    }
    this.shadowRoot.getElementById('bill-page-size')?.addEventListener('change', event => {
      this._billPageSize = Number(event.target.value || 10)
      this._billPage = 1
      this._render()
    })
    this.shadowRoot.querySelectorAll('.bill-page').forEach(button =>
      button.addEventListener('click', () => {
        const page = Number(button.dataset.page || 1)
        if (Number.isInteger(page) && page > 0) {
          this._billPage = page
          this._render()
        }
      })
    )
    this.shadowRoot.querySelectorAll('.settle').forEach(button =>
      button.addEventListener('click', () => this._settle(button))
    )
  }

  _closeForm () {
    this._editing = null
    this._formOpen = false
    this._error = ''
    this._render()
  }

  _categoryChanged () {
    const category = this._categoryById(this.shadowRoot.getElementById('category')?.value)
    const provider = this.shadowRoot.getElementById('provider')
    const contract = this.shadowRoot.getElementById('contract')
    const payer = this.shadowRoot.getElementById('payer')
    const consumption = this.shadowRoot.getElementById('consumption')
    if (provider) provider.value = String(category?.default_provider || '')
    if (contract) contract.value = String(category?.default_contract || '')
    if (payer && category?.default_payer_id) payer.value = category.default_payer_id
    if (consumption) {
      consumption.disabled = !category?.consumption_unit
      if (!category?.consumption_unit) consumption.value = ''
    }
    this._autoPeriod()
  }

  _autoPeriod () {
    const category = this._categoryById(this.shadowRoot.getElementById('category')?.value)
    const paid = this._parseMonth(this.shadowRoot.getElementById('paid-month')?.value)
    if (!category || !paid) return
    const start = this._addMonths(
      paid.year,
      paid.month,
      -(Math.max(1, Number(category.interval_months || 1)) - 1)
    )
    const startInput = this.shadowRoot.getElementById('period-start')
    const endInput = this.shadowRoot.getElementById('period-end')
    if (startInput) startInput.value = this._monthValue(start.year, start.month)
    if (endInput) endInput.value = this._monthValue(paid.year, paid.month)
  }

  async _submit (event) {
    event.preventDefault()
    if (!this._hass) return
    const paid = this._parseMonth(this.shadowRoot.getElementById('paid-month')?.value)
    const start = this._parseMonth(this.shadowRoot.getElementById('period-start')?.value)
    const end = this._parseMonth(this.shadowRoot.getElementById('period-end')?.value)
    const amount = Number(this.shadowRoot.getElementById('amount')?.value)
    if (!paid || !start || !end || !Number.isFinite(amount) || amount < 0) {
      this._error = 'Invalid bill data'
      this._render()
      return
    }
    const rawConsumption = this.shadowRoot.getElementById('consumption')?.value || ''
    const payload = {
      year: paid.year,
      month: paid.month,
      category_id: this.shadowRoot.getElementById('category')?.value,
      amount,
      note: this.shadowRoot.getElementById('note')?.value?.trim() || '',
      period_start_year: start.year,
      period_start_month: start.month,
      period_end_year: end.year,
      period_end_month: end.month,
      paid: Boolean(this.shadowRoot.getElementById('paid')?.checked),
      payment_date: this.shadowRoot.getElementById('payment-date')?.value || '',
      due_date: this.shadowRoot.getElementById('due-date')?.value || '',
      provider: this.shadowRoot.getElementById('provider')?.value?.trim() || '',
      contract: this.shadowRoot.getElementById('contract')?.value?.trim() || ''
    }
    const payerId = this.shadowRoot.getElementById('payer')?.value
    if (payerId) payload.payer_id = payerId
    if (rawConsumption !== '') payload.consumption = Number(rawConsumption)
    try {
      if (this._editing) {
        await this._hass.callWS({
          type: 'bill_tracker/update',
          expense_id: this._editing.id,
          ...payload
        })
      } else {
        await this._hass.callWS({ type: 'bill_tracker/add', ...payload })
      }
      this._editing = null
      this._formOpen = false
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _delete (id) {
    if (!confirm(this._t('delete_confirm'))) return
    try {
      await this._hass.callWS({ type: 'bill_tracker/delete', expense_id: id })
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _setPaid (id, paid) {
    try {
      await this._hass.callWS({
        type: 'bill_tracker/set_paid',
        expense_id: id,
        paid: Boolean(paid)
      })
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _settle (button) {
    if (!confirm(this._t('settlement_confirm'))) return
    try {
      await this._hass.callWS({
        type: 'bill_tracker/settlement/add',
        from_payer_id: button.dataset.from,
        to_payer_id: button.dataset.to,
        amount: Number(button.dataset.amount || 0),
        note: ''
      })
      await this._load()
    } catch (error) {
      this._error = String(error?.message || error)
      this._render()
    }
  }

  async _readCsv (input) {
    const file = input?.files?.[0]
    if (!file) {
      this._importText = ''
      this._render()
      return
    }
    if (file.size > 5_000_000) {
      this._message = 'CSV too large'
      this._importText = ''
      this._render()
      return
    }
    this._importText = await file.text()
    this._message = file.name
    this._render()
  }

  async _importCsv () {
    if (!this._importText || this._busy) return
    this._busy = true
    try {
      const result = await this._hass.callWS({
        type: 'bill_tracker/import_csv',
        content: this._importText,
        create_missing_categories: true,
        create_missing_payers: true
      })
      this._message = this._t('import_done', { count: result.imported || 0 })
      this._importText = ''
      await this._load()
      this._transferOpen = true
    } catch (error) {
      this._message = this._t('import_error', {
        error: String(error?.message || error)
      })
    } finally {
      this._busy = false
      this._render()
    }
  }

  _download (result) {
    const binary = atob(result.content_base64 || '')
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    const blob = new Blob([bytes], {
      type: result.mime_type || 'application/octet-stream'
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = result.filename || 'billy-export'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async _export (format) {
    try {
      const result = await this._hass.callWS({
        type: 'bill_tracker/export',
        format,
        status: 'all',
        category_id: 'all',
        trend: 'both',
        language: this._hass?.language || 'en'
      })
      this._download(result)
      this._message = result.filename
    } catch (error) {
      this._message = this._t('export_error', {
        error: String(error?.message || error)
      })
    }
    this._render()
  }
}

class BillTrackerCardEditor extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._config = BillTrackerCard.getStubConfig()
    this._hass = null
  }

  set hass (hass) {
    this._hass = hass
    this._render()
  }

  setConfig (config) {
    this._config = { ...BillTrackerCard.getStubConfig(), ...(config || {}) }
    this._render()
  }

  _render () {
    if (!this.shadowRoot) return
    this.shadowRoot.innerHTML = `<style>
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      label { display:grid; gap:5px; color:var(--secondary-text-color); font-size:12px; }
      input,select { min-height:44px; box-sizing:border-box; width:100%; border:1px solid var(--divider-color); border-radius:10px; padding:8px 10px; background:var(--card-background-color); color:var(--primary-text-color); font-size:16px; }
      @media(max-width:520px){ .grid{ grid-template-columns:1fr; } }
    </style>
    <div class="grid">
      <label>Title<input data-key="title" value="${String(this._config.title || '').replaceAll('"', '&quot;')}"></label>
      <label>Width<select data-key="columns"><option value="full" ${this._config.columns === 'full' ? 'selected' : ''}>Full</option>${[6, 8, 10, 12].map(value => `<option value="${value}" ${Number(this._config.columns) === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
      <label>History months<input data-key="history_months" type="number" min="3" max="36" value="${Number(this._config.history_months || 12)}"></label>
      <label>Forecast months<input data-key="forecast_months" type="number" min="1" max="24" value="${Number(this._config.forecast_months || 12)}"></label>
    </div>`
    this.shadowRoot.querySelectorAll('input,select').forEach(input =>
      input.addEventListener('change', () => {
        const key = input.dataset.key
        let value = input.value
        if (['history_months', 'forecast_months'].includes(key)) value = Number(value)
        if (key === 'columns' && value !== 'full') value = Number(value)
        this._config = { ...this._config, [key]: value }
        const event = new Event('config-changed', {
          bubbles: true,
          composed: true
        })
        event.detail = { config: this._config }
        this.dispatchEvent(event)
      })
    )
  }
}

if (!customElements.get('bill-tracker-card-impl')) {
  customElements.define('bill-tracker-card-impl', BillTrackerCard)
}
if (!customElements.get('bill-tracker-card-editor-impl')) {
  customElements.define('bill-tracker-card-editor-impl', BillTrackerCardEditor)
}

console.info(`Billy / Bill Tracker implementation v${BILL_TRACKER_VERSION} loaded`)
