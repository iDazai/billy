const BILLY_FRONTEND_VERSION = '0.11.3'
const BILLY_IMPL_URL = `/bill_tracker/bill-tracker-card-impl.js?v=${BILLY_FRONTEND_VERSION}`
const BILLY_WIDGETS_URL = `/bill_tracker/billy-widgets.js?v=${BILLY_FRONTEND_VERSION}`

let billyImplementationPromise = null
let billyWidgetsPromise = null

function loadBillyImplementation () {
  if (!billyImplementationPromise) {
    billyImplementationPromise = import(BILLY_IMPL_URL).catch(error => {
      billyImplementationPromise = null
      throw error
    })
  }
  return billyImplementationPromise
}

function loadBillyWidgets () {
  if (!billyWidgetsPromise) {
    billyWidgetsPromise = import(BILLY_WIDGETS_URL).catch(error => {
      billyWidgetsPromise = null
      throw error
    })
  }
  return billyWidgetsPromise
}

class BillyCardHost extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._config = null
    this._hass = null
    this._inner = null
    this._loading = false
    this._loadError = null
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

  connectedCallback () {
    this._ensureImplementation()
  }

  setConfig (config) {
    this._config = { ...config }
    if (this._inner) this._inner.setConfig(this._config)
    else this._ensureImplementation()
  }

  set hass (hass) {
    this._hass = hass
    if (this._inner) this._inner.hass = hass
    else this._ensureImplementation()
  }

  getCardSize () {
    return this._inner?.getCardSize?.() ?? 12
  }

  getGridOptions () {
    return (
      this._inner?.getGridOptions?.() ?? { columns: 'full', min_columns: 6 }
    )
  }

  async _ensureImplementation () {
    if (this._inner || this._loading) return
    this._loading = true
    this._renderLoading()
    try {
      await loadBillyImplementation()
      await customElements.whenDefined('bill-tracker-card-impl')
      if (!this.isConnected && !this._config && !this._hass) return
      const inner = document.createElement('bill-tracker-card-impl')
      this._inner = inner
      this.shadowRoot.replaceChildren(inner)
      if (this._config) inner.setConfig(this._config)
      if (this._hass) inner.hass = this._hass
      this._loadError = null
    } catch (error) {
      this._loadError = String(error?.message || error)
      this._renderLoading()
      console.error('Billy frontend failed to load', error)
    } finally {
      this._loading = false
    }
  }

  _renderLoading () {
    if (!this.shadowRoot || this._inner) return
    const message = this._loadError
      ? `Billy frontend failed to load: ${this._escape(this._loadError)}`
      : 'Loading Billy…'
    this.shadowRoot.innerHTML = `<ha-card><div style="padding:20px">${message}</div></ha-card>`
  }

  _escape (value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
}

class BillyCardEditorHost extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this._config = BillyCardHost.getStubConfig()
    this._hass = null
    this._inner = null
    this._loading = false
    this._loadError = null
  }

  connectedCallback () {
    this._ensureImplementation()
  }

  setConfig (config) {
    this._config = { ...BillyCardHost.getStubConfig(), ...config }
    if (this._inner) this._inner.setConfig(this._config)
    else this._ensureImplementation()
  }

  set hass (hass) {
    this._hass = hass
    if (this._inner) this._inner.hass = hass
  }

  async _ensureImplementation () {
    if (this._inner || this._loading) return
    this._loading = true
    this._renderLoading()
    try {
      await loadBillyImplementation()
      await customElements.whenDefined('bill-tracker-card-editor-impl')
      const inner = document.createElement('bill-tracker-card-editor-impl')
      this._inner = inner
      this.shadowRoot.replaceChildren(inner)
      inner.setConfig(this._config)
      if (this._hass) inner.hass = this._hass
      this._loadError = null
    } catch (error) {
      this._loadError = String(error?.message || error)
      this._renderLoading()
      console.error('Billy card editor failed to load', error)
    } finally {
      this._loading = false
    }
  }

  _renderLoading () {
    if (!this.shadowRoot || this._inner) return
    const message = this._loadError
      ? `Billy editor failed to load: ${this._escape(this._loadError)}`
      : 'Loading Billy editor…'
    this.shadowRoot.innerHTML = `<div style="padding:16px;color:var(--primary-text-color)">${message}</div>`
  }

  _escape (value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
}

// Register the lightweight host elements before exposing Billy to HA's card picker.
// This avoids the picker trying to instantiate the full card while its implementation
// module is still downloading/evaluating on a cold frontend load.
if (!customElements.get('bill-tracker-card')) {
  customElements.define('bill-tracker-card', BillyCardHost)
}
if (!customElements.get('bill-tracker-card-editor')) {
  customElements.define('bill-tracker-card-editor', BillyCardEditorHost)
}

window.customCards = window.customCards || []
if (!window.customCards.some(card => card.type === 'bill-tracker-card')) {
  window.customCards.push({
    type: 'bill-tracker-card',
    name: 'Billy - Bill Tracker',
    description: 'Recurring bills, expense splitting, balances and forecasts',
    preview: false,
    documentationURL: 'https://github.com/robin994/billy'
  })
}

// Start preloading immediately, but the custom element hosts above are already
// available even if the implementation takes longer to arrive.
loadBillyImplementation().catch(error => {
  console.error('Billy implementation preload failed', error)
})
loadBillyWidgets().catch(error => {
  console.error('Billy widgets preload failed', error)
})

console.info(`Billy frontend bootstrap v${BILLY_FRONTEND_VERSION} loaded`)
