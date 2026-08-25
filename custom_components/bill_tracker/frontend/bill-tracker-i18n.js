const translations = {
  en: {
    card_title: 'Billy',
    loading: 'Loading Billy…',
    not_available: 'Billy is not available',
    settings: 'Settings',
    add_bill: 'Add bill',
    edit_bill: 'Edit bill',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    type: 'Bill type',
    payment_month: 'Payment month',
    amount: 'Amount ({currency})',
    provider: 'Provider',
    contract: 'Contract / plan',
    consumption: 'Consumption',
    due_date: 'Due date',
    payment_date: 'Payment date',
    paid: 'Paid',
    unpaid: 'Unpaid',
    note: 'Note',
    current_month: 'This month',
    average_6_months: '6-month average',
    next_month: 'Next month estimate',
    outstanding: 'Bills to pay',
    recent_bills: 'Recent bills',
    no_bills: 'No bills yet',
    upcoming: 'Upcoming',
    reimbursements: 'Reimbursements',
    no_balance: 'Everything settled',
    mark_settled: 'Mark settled',
    import_export: 'Import / Export',
    import_csv: 'Import CSV',
    export_csv: 'Export CSV',
    export_xlsx: 'Export Excel',
    export_pdf: 'Export PDF',
    choose_file: 'Choose CSV file',
    import: 'Import',
    close: 'Close',
    automatic_pending: 'Automatic imports pending',
    parser_hint: 'Manage automatic bill parsers from Billy integration settings.',
    delete_confirm: 'Delete this bill?',
    settlement_confirm: 'Mark this balance as settled?',
    interval_1: 'Monthly',
    interval_2: 'Every 2 months',
    interval_3: 'Quarterly',
    interval_4: 'Every 4 months',
    interval_6: 'Every 6 months',
    interval_12: 'Yearly',
    payer: 'Paid by',
    period_start: 'Period start',
    period_end: 'Period end',
    split: 'Split',
    import_done: 'Import complete: {count} bills',
    export_error: 'Export failed: {error}',
    import_error: 'Import failed: {error}',
    parser_status: '{count} bill(s) waiting for review'
  },
  it: {
    card_title: 'Billy',
    loading: 'Caricamento Billy…',
    not_available: 'Billy non è disponibile',
    settings: 'Impostazioni',
    add_bill: 'Aggiungi bolletta',
    edit_bill: 'Modifica bolletta',
    cancel: 'Annulla',
    save: 'Salva',
    delete: 'Elimina',
    type: 'Tipo di bolletta',
    payment_month: 'Mese di pagamento',
    amount: 'Importo ({currency})',
    provider: 'Fornitore',
    contract: 'Contratto / offerta',
    consumption: 'Consumo',
    due_date: 'Scadenza',
    payment_date: 'Data pagamento',
    paid: 'Pagata',
    unpaid: 'Da pagare',
    note: 'Nota',
    current_month: 'Questo mese',
    average_6_months: 'Media 6 mesi',
    next_month: 'Stima prossimo mese',
    outstanding: 'Bollette da pagare',
    recent_bills: 'Bollette recenti',
    no_bills: 'Nessuna bolletta inserita',
    upcoming: 'Prossime bollette',
    reimbursements: 'Rimborsi',
    no_balance: 'Tutto saldato',
    mark_settled: 'Segna come saldato',
    import_export: 'Importa / Esporta',
    import_csv: 'Importa CSV',
    export_csv: 'Esporta CSV',
    export_xlsx: 'Esporta Excel',
    export_pdf: 'Esporta PDF',
    choose_file: 'Scegli file CSV',
    import: 'Importa',
    close: 'Chiudi',
    automatic_pending: 'Import automatici in attesa',
    parser_hint: 'Gestisci i parser automatici dalle impostazioni dell’integrazione Billy.',
    delete_confirm: 'Eliminare questa bolletta?',
    settlement_confirm: 'Segnare questo saldo come chiuso?',
    interval_1: 'Mensile',
    interval_2: 'Bimestrale',
    interval_3: 'Trimestrale',
    interval_4: 'Quadrimestrale',
    interval_6: 'Semestrale',
    interval_12: 'Annuale',
    payer: 'Pagata da',
    period_start: 'Inizio competenza',
    period_end: 'Fine competenza',
    split: 'Divisione',
    import_done: 'Import completato: {count} bollette',
    export_error: 'Export fallito: {error}',
    import_error: 'Import fallito: {error}',
    parser_status: '{count} bolletta/e in attesa di revisione'
  }
}

export function billyLanguage (hass) {
  const value = String(hass?.language || hass?.locale?.language || 'en')
    .replace('_', '-')
    .split('-', 1)[0]
    .toLowerCase()
  return translations[value] ? value : 'en'
}

export function billyLocale (hass) {
  return hass?.locale?.language || hass?.language || navigator.language || 'en'
}

export function billyT (hass, key, vars = {}) {
  const language = billyLanguage(hass)
  let value = translations[language]?.[key] ?? translations.en[key] ?? key
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement))
  }
  return value
}

const categoryTranslations = {
  en: {
    internet: 'Internet',
    electricity: 'Electricity',
    water: 'Water',
    gas: 'Gas',
    condominium: 'Condominium',
    phone: 'Phone',
    tari: 'Waste / TARI',
    other: 'Other'
  },
  it: {
    internet: 'Internet',
    electricity: 'Elettricità',
    water: 'Acqua',
    gas: 'Gas',
    condominium: 'Condominio',
    phone: 'Telefono',
    tari: 'TARI / Rifiuti',
    other: 'Altro'
  }
}

export function billyCategoryLabel (hass, category) {
  if (!category) return ''
  const language = billyLanguage(hass)
  return (
    categoryTranslations[language]?.[category.id] ||
    categoryTranslations.en[category.id] ||
    category.name ||
    category.id ||
    ''
  )
}
