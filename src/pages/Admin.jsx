import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  CircleDollarSign,
  Clipboard,
  Code2,
  FilePlus2,
  LockKeyhole,
  LogOut,
  NotebookPen,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { adminRequest } from '../api/admin'

const EMPTY_STATE = { transactions: [], tasks: [], notes: [] }
const MONEY_TYPES = [
  { value: 'receivable', label: 'Owed to me', icon: ArrowDownLeft },
  { value: 'payable', label: 'I owe', icon: ArrowUpRight },
  { value: 'collected', label: 'Repayment received', icon: ArrowDownLeft },
  { value: 'repaid', label: 'Repayment sent', icon: ArrowUpRight },
  { value: 'income', label: 'Received', icon: ArrowDownLeft },
  { value: 'expense', label: 'Expense', icon: ArrowUpRight },
  { value: 'saving', label: 'Savings', icon: Wallet },
]
const PRIORITIES = ['low', 'medium', 'high']
const LANGUAGES = ['Plain text', 'JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'JSON', 'SQL', 'Markdown', 'Bash']

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function money(amount) {
  return `৳${new Intl.NumberFormat('en-BD', { maximumFractionDigits: 2 }).format(amount || 0)}`
}

function formatDate(date) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm font-medium text-chalk transition hover:border-white/25 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function IconButton({ label, className = '', ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-md text-chalk-dim transition hover:bg-white/[0.07] hover:text-chalk disabled:opacity-40 ${className}`}
      {...props}
    />
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`grid gap-1.5 text-xs font-medium text-chalk-dim ${className}`}>
      <span>{label}</span>
      {props.children}
    </label>
  )
}

const inputClass = 'w-full rounded-md border border-white/10 bg-[#151512] px-3 py-2.5 text-sm text-chalk outline-none placeholder:text-chalk-faint focus:border-[#91a98b]/70'

function Login({ onLogin, setupError }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await adminRequest('POST', { action: 'login', username, password })
      onLogin(result.state)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center overflow-y-auto bg-[#111210] px-5 py-10 text-chalk">
      <div className="w-full max-w-[420px]">
        <a href="/" className="mb-10 inline-flex items-center gap-2 text-xs text-chalk-dim transition hover:text-chalk">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
        <div className="mb-7 flex size-12 items-center justify-center rounded-md border border-[#91a98b]/30 bg-[#91a98b]/10 text-[#adc5a7]">
          <LockKeyhole size={21} />
        </div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#adc5a7]">Private workspace</p>
        <h1 className="text-3xl font-medium tracking-tight">Good to have you back.</h1>
        <p className="mt-2 text-sm text-chalk-dim">Sign in to open your personal desk.</p>
        <form onSubmit={submit} className="mt-8 grid gap-5">
          <Field label="Username">
            <input autoComplete="username" className={inputClass} value={username} onChange={(event) => setUsername(event.target.value)} required />
          </Field>
          <Field label="Password">
            <input type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          {(error || setupError) && <p role="alert" className="text-sm text-[#f09582]">{error || setupError}</p>}
          <button disabled={busy} className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#91a98b] px-4 text-sm font-semibold text-[#10120f] transition hover:bg-[#a7bb9f] disabled:opacity-60">
            <LockKeyhole size={16} /> {busy ? 'Checking…' : 'Enter workspace'}
          </button>
        </form>
        <div className="mt-8 flex items-center gap-2 border-t border-white/[0.08] pt-5 text-xs text-chalk-faint">
          <ShieldCheck size={14} /> Encrypted session · private by design
        </div>
      </div>
    </main>
  )
}

function Summary({ label, value, hint, tone = 'chalk' }) {
  const tones = {
    chalk: 'text-chalk', green: 'text-[#b4c9a8]', amber: 'text-[#e1b77c]', red: 'text-[#e78b78]',
  }
  return (
    <div className="min-w-0 border-l border-white/10 pl-4 first:border-0 first:pl-0">
      <p className="text-xs text-chalk-dim">{label}</p>
      <p className={`mt-2 truncate text-xl font-medium ${tones[tone]}`}>{value}</p>
      <p className="mt-1 truncate text-[11px] text-chalk-faint">{hint}</p>
    </div>
  )
}

function MoneyDesk({ state, save, busy }) {
  const [editingId, setEditingId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ type: 'expense', title: '', person: '', amount: '', date: today(), details: '' })
  const entries = useMemo(() => [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)), [state.transactions])
  const totals = useMemo(() => state.transactions.reduce((total, item) => {
    total[item.type] += Number(item.amount)
    return total
  }, { receivable: 0, payable: 0, collected: 0, repaid: 0, income: 0, expense: 0, saving: 0 }), [state.transactions])
  const cash = totals.income + totals.payable + totals.collected - totals.expense - totals.saving - totals.receivable - totals.repaid

  function startNew() {
    setEditingId('')
    setForm({ type: 'expense', title: '', person: '', amount: '', date: today(), details: '' })
    setFormOpen(true)
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({ ...item, amount: String(item.amount) })
    setFormOpen(true)
  }

  async function submit(event) {
    event.preventDefault()
    const item = { ...form, amount: Number(form.amount), id: editingId || makeId() }
    const transactions = editingId
      ? state.transactions.map((entry) => entry.id === editingId ? item : entry)
      : [item, ...state.transactions]
    if (await save({ ...state, transactions })) setFormOpen(false)
  }

  async function remove(id) {
    if (!window.confirm('Delete this money record?')) return
    await save({ ...state, transactions: state.transactions.filter((item) => item.id !== id) })
    if (editingId === id) setFormOpen(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-2 gap-y-6 border-y border-white/10 py-5 sm:grid-cols-3 lg:grid-cols-5">
        <Summary label="Available balance" value={money(cash)} hint="Cash in − cash out, including debts" tone={cash < 0 ? 'red' : 'chalk'} />
        <Summary label="Owed to you" value={money(Math.max(0, totals.receivable - totals.collected))} hint="Lent minus repayments received" tone="green" />
        <Summary label="You owe" value={money(Math.max(0, totals.payable - totals.repaid))} hint="Borrowed minus repayments sent" tone="amber" />
        <Summary label="Savings" value={money(totals.saving)} hint="Moved into savings" tone="green" />
        <Summary label="Expenses" value={money(totals.expense)} hint="Total recorded spending" tone="red" />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Money log</h2>
          <p className="mt-1 text-xs text-chalk-faint">One ledger for cash flow, debts, and savings.</p>
        </div>
        <Button onClick={startNew}><Plus size={15} /> Add record</Button>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-md border border-white/10 bg-[#151512] p-4 sm:grid-cols-2 lg:grid-cols-6">
          <Field label="Record type" className="sm:col-span-1 lg:col-span-2">
            <select className={inputClass} value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              {MONEY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </Field>
          <Field label="Title" className="sm:col-span-1 lg:col-span-2">
            <input className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. March rent" maxLength={120} required />
          </Field>
          <Field label="Amount (BDT)">
            <input type="number" min="0.01" step="0.01" className={inputClass} value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required />
          </Field>
          <Field label="Date">
            <input type="date" className={inputClass} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
          </Field>
          <Field label="Person / account" className="sm:col-span-1 lg:col-span-2">
            <input className={inputClass} value={form.person} onChange={(event) => setForm({ ...form, person: event.target.value })} placeholder="Optional" maxLength={120} />
          </Field>
          <Field label="Details" className="sm:col-span-2 lg:col-span-3">
            <input className={inputClass} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Add context or a reminder" maxLength={2000} />
          </Field>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <Button type="submit" disabled={busy} className="border-[#91a98b]/40 text-[#c0d2b8]"><Check size={15} /> {editingId ? 'Update' : 'Save'}</Button>
            <IconButton label="Cancel" type="button" onClick={() => setFormOpen(false)}><X size={17} /></IconButton>
          </div>
        </form>
      )}

      <div className="mt-5 overflow-x-auto rounded-md border border-white/[0.08]">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.025] text-[11px] uppercase tracking-wider text-chalk-faint">
            <tr><th className="px-4 py-3 font-medium">Record</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 text-right font-medium">Amount</th><th className="w-24 px-3 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {entries.map((item) => {
              const type = MONEY_TYPES.find((candidate) => candidate.value === item.type)
              const Icon = type.icon
              return (
                <tr key={item.id} className="group hover:bg-white/[0.02]">
                  <td className="max-w-[280px] px-4 py-3.5">
                    <p className="truncate font-medium text-chalk">{item.title}</p>
                    {(item.person || item.details) && <p className="mt-1 truncate text-xs text-chalk-faint">{[item.person, item.details].filter(Boolean).join(' · ')}</p>}
                  </td>
                  <td className="px-4 py-3.5"><span className="inline-flex items-center gap-2 text-xs text-chalk-dim"><Icon size={14} className={['income', 'receivable', 'saving'].includes(item.type) ? 'text-[#a8bd9e]' : 'text-[#d99a82]'} />{type.label}</span></td>
                  <td className="px-4 py-3.5 text-xs text-chalk-dim">{formatDate(item.date)}</td>
                  <td className={`px-4 py-3.5 text-right font-medium tabular-nums ${['income', 'payable', 'collected'].includes(item.type) ? 'text-[#b4c9a8]' : 'text-chalk'}`}>{['income', 'payable', 'collected'].includes(item.type) ? '+' : '−'}{money(item.amount)}</td>
                  <td className="px-2 py-2"><div className="flex justify-end"><IconButton label={`Edit ${item.title}`} onClick={() => startEdit(item)}><Pencil size={15} /></IconButton><IconButton label={`Delete ${item.title}`} onClick={() => remove(item.id)}><Trash2 size={15} /></IconButton></div></td>
                </tr>
              )
            })}
            {entries.length === 0 && <tr><td colSpan="5" className="px-4 py-12 text-center text-sm text-chalk-faint">No records yet. Add the first one to start your ledger.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MonthlyDesk({ state, save, busy }) {
  const [month, setMonth] = useState(`${today().slice(0, 7)}`)
  const [editingId, setEditingId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: '', details: '', dueDate: today(), category: '', priority: 'medium' })
  const tasks = useMemo(() => state.tasks.filter((task) => task.dueDate.startsWith(month)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [state.tasks, month])
  const completeCount = tasks.filter((task) => task.completed).length
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T12:00:00`))

  function shiftMonth(direction) {
    const date = new Date(`${month}-01T12:00:00`)
    date.setMonth(date.getMonth() + direction)
    setMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
    setFormOpen(false)
  }

  function startNew() {
    setEditingId('')
    setForm({ title: '', details: '', dueDate: `${month}-01`, category: '', priority: 'medium' })
    setFormOpen(true)
  }

  function startEdit(task) {
    setEditingId(task.id)
    setForm({ title: task.title, details: task.details, dueDate: task.dueDate, category: task.category, priority: task.priority })
    setFormOpen(true)
  }

  async function submit(event) {
    event.preventDefault()
    const item = { ...form, id: editingId || makeId(), completed: state.tasks.find((task) => task.id === editingId)?.completed || false }
    const nextTasks = editingId ? state.tasks.map((task) => task.id === editingId ? item : task) : [...state.tasks, item]
    if (await save({ ...state, tasks: nextTasks })) setFormOpen(false)
  }

  async function toggle(task) {
    await save({ ...state, tasks: state.tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item) })
  }

  async function remove(id) {
    if (!window.confirm('Delete this task?')) return
    await save({ ...state, tasks: state.tasks.filter((task) => task.id !== id) })
    if (editingId === id) setFormOpen(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs text-chalk-faint">Monthly board</p>
          <h2 className="mt-1 text-2xl font-medium">{monthLabel}</h2>
          <p className="mt-1 text-sm text-chalk-dim">{completeCount} of {tasks.length} complete</p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Previous month" onClick={() => shiftMonth(-1)}><ArrowLeft size={17} /></IconButton>
          <Button className="min-h-9 px-3" onClick={() => setMonth(today().slice(0, 7))}>Today</Button>
          <IconButton label="Next month" onClick={() => shiftMonth(1)}><ArrowRight size={17} /></IconButton>
          <Button onClick={startNew} className="ml-2"><Plus size={15} /> Add task</Button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-md border border-white/10 bg-[#151512] p-4 sm:grid-cols-2 lg:grid-cols-6">
          <Field label="Task" className="sm:col-span-2 lg:col-span-3">
            <input className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="A clear, actionable title" maxLength={160} required />
          </Field>
          <Field label="Due date" className="sm:col-span-1 lg:col-span-1">
            <input type="date" className={inputClass} value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
          </Field>
          <Field label="Priority">
            <select className={inputClass} value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority[0].toUpperCase() + priority.slice(1)}</option>)}</select>
          </Field>
          <Field label="Category">
            <input className={inputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Work, personal…" maxLength={60} />
          </Field>
          <Field label="Notes / steps" className="sm:col-span-2 lg:col-span-5">
            <textarea rows="2" className={`${inputClass} resize-y`} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Break the task into useful detail" maxLength={4000} />
          </Field>
          <div className="flex items-end gap-2"><Button type="submit" disabled={busy} className="border-[#91a98b]/40 text-[#c0d2b8]"><Check size={15} /> {editingId ? 'Update' : 'Save task'}</Button><IconButton type="button" label="Cancel" onClick={() => setFormOpen(false)}><X size={17} /></IconButton></div>
        </form>
      )}

      <div className="mt-4 divide-y divide-white/[0.08]">
        {tasks.map((task) => (
          <article key={task.id} className={`group flex gap-3 py-4 ${task.completed ? 'opacity-60' : ''}`}>
            <button type="button" onClick={() => toggle(task)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition ${task.completed ? 'border-[#91a98b] bg-[#91a98b] text-[#111210]' : 'border-white/25 text-transparent hover:border-[#91a98b]'}`}>
              {task.completed && <Check size={13} />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className={`font-medium ${task.completed ? 'text-chalk-dim line-through' : 'text-chalk'}`}>{task.title}</h3>
                {task.category && <span className="rounded-sm bg-white/[0.06] px-2 py-0.5 text-[10px] text-chalk-dim">{task.category}</span>}
                <span className={`text-[10px] uppercase tracking-wide ${task.priority === 'high' ? 'text-[#e78b78]' : task.priority === 'low' ? 'text-chalk-faint' : 'text-[#e1b77c]'}`}>{task.priority}</span>
              </div>
              {task.details && <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-chalk-dim">{task.details}</p>}
              <p className="mt-2 text-[11px] text-chalk-faint">Due {formatDate(task.dueDate)}</p>
            </div>
            <div className="flex shrink-0 items-start opacity-100 sm:opacity-0 sm:transition group-hover:opacity-100 group-focus-within:opacity-100">
              <IconButton label={`Edit ${task.title}`} onClick={() => startEdit(task)}><Pencil size={15} /></IconButton>
              <IconButton label={`Delete ${task.title}`} onClick={() => remove(task.id)}><Trash2 size={15} /></IconButton>
            </div>
          </article>
        ))}
        {tasks.length === 0 && <div className="py-16 text-center"><CheckCheck size={25} className="mx-auto text-chalk-faint" /><p className="mt-3 text-sm text-chalk-dim">A clear month. Add a task when something lands.</p></div>}
      </div>
    </div>
  )
}

function NotesDesk({ state, save, busy }) {
  const [selectedId, setSelectedId] = useState(state.notes[0]?.id || '')
  const selected = state.notes.find((note) => note.id === selectedId)
  const [draft, setDraft] = useState(selected ? { ...selected } : null)
  const [copied, setCopied] = useState(false)

  function choose(note) {
    if (draft && selected && JSON.stringify(draft) !== JSON.stringify(selected) && !window.confirm('Discard unsaved changes?')) return
    setSelectedId(note.id)
    setDraft({ ...note })
  }

  async function createNote() {
    const note = { id: makeId(), title: 'Untitled note', language: 'Plain text', body: '', updatedAt: new Date().toISOString() }
    if (await save({ ...state, notes: [note, ...state.notes] })) {
      setSelectedId(note.id)
      setDraft(note)
    }
  }

  async function saveNote(event) {
    event.preventDefault()
    if (!draft) return
    const note = { ...draft, updatedAt: new Date().toISOString() }
    if (await save({ ...state, notes: state.notes.map((item) => item.id === note.id ? note : item) })) setDraft(note)
  }

  async function removeNote() {
    if (!selected || !window.confirm(`Delete “${selected.title}”?`)) return
    const notes = state.notes.filter((note) => note.id !== selected.id)
    if (await save({ ...state, notes })) {
      setSelectedId(notes[0]?.id || '')
      setDraft(notes[0] ? { ...notes[0] } : null)
    }
  }

  async function copyBody() {
    if (!draft) return
    await navigator.clipboard.writeText(draft.body)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="mx-auto grid min-h-[560px] max-w-6xl overflow-hidden rounded-md border border-white/[0.09] lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex min-h-[220px] flex-col border-b border-white/[0.08] bg-[#141411] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <div><p className="text-sm font-medium">Notebook</p><p className="mt-0.5 text-[11px] text-chalk-faint">{state.notes.length} {state.notes.length === 1 ? 'note' : 'notes'}</p></div>
          <IconButton label="New note" onClick={createNote}><FilePlus2 size={17} /></IconButton>
        </div>
        <div className="max-h-[280px] flex-1 overflow-y-auto lg:max-h-none">
          {state.notes.map((note) => (
            <button key={note.id} onClick={() => choose(note)} className={`block w-full border-b border-white/[0.05] px-4 py-3 text-left transition ${selectedId === note.id ? 'bg-[#91a98b]/[0.09]' : 'hover:bg-white/[0.025]'}`}>
              <span className={`block truncate text-sm ${selectedId === note.id ? 'text-[#c0d2b8]' : 'text-chalk'}`}>{note.title || 'Untitled note'}</span>
              <span className="mt-1 block truncate font-mono text-[10px] text-chalk-faint">{note.body || 'Empty note'} · {note.language}</span>
            </button>
          ))}
          {state.notes.length === 0 && <p className="px-4 py-8 text-center text-xs text-chalk-faint">Your notebook is empty.</p>}
        </div>
      </aside>
      {draft ? (
        <form onSubmit={saveNote} className="flex min-h-[420px] min-w-0 flex-col bg-[#111210]">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] px-3 py-2.5 sm:px-4">
            <Code2 size={16} className="mr-1 text-[#91a98b]" />
            <input aria-label="Note title" className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm font-medium text-chalk outline-none placeholder:text-chalk-faint" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} maxLength={120} placeholder="Untitled note" />
            <select aria-label="Language" className="max-w-[132px] rounded border border-white/10 bg-[#151512] px-2 py-1.5 text-xs text-chalk-dim outline-none" value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })}>{LANGUAGES.map((language) => <option key={language}>{language}</option>)}</select>
            <IconButton label={copied ? 'Copied' : 'Copy note'} onClick={copyBody} type="button">{copied ? <Check size={16} /> : <Clipboard size={16} />}</IconButton>
            <IconButton label="Delete note" onClick={removeNote} type="button"><Trash2 size={16} /></IconButton>
            <Button type="submit" disabled={busy} className="min-h-8 border-[#91a98b]/40 px-2.5 text-xs text-[#c0d2b8]"><Save size={14} /> Save</Button>
          </div>
          <div className="grid flex-1 grid-cols-[42px_minmax(0,1fr)]">
            <div className="select-none border-r border-white/[0.05] px-3 py-4 text-right font-mono text-xs leading-6 text-chalk-faint">{Array.from({ length: Math.max(1, draft.body.split('\n').length) }, (_, index) => <div key={index}>{index + 1}</div>)}</div>
            <textarea spellCheck="false" aria-label="Note content" className="min-h-[390px] w-full resize-y bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-[#d4d2c9] outline-none placeholder:text-chalk-faint" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Start writing, sketch a snippet, or leave yourself a note…" />
          </div>
          <div className="flex justify-between border-t border-white/[0.08] px-4 py-2 text-[10px] text-chalk-faint"><span>{draft.language}</span><span>{draft.body.length} characters · {draft.body.split(/\s+/).filter(Boolean).length} words</span></div>
        </form>
      ) : (
        <div className="grid min-h-[420px] place-items-center p-8 text-center"><div><NotebookPen size={26} className="mx-auto text-chalk-faint" /><p className="mt-3 text-sm text-chalk-dim">Choose a note or create a new one.</p><Button onClick={createNote} className="mt-4"><Plus size={15} /> New note</Button></div></div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'money', label: 'Money', icon: CircleDollarSign },
  { id: 'month', label: 'Monthly', icon: CheckCheck },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
]

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)
  const [state, setState] = useState(EMPTY_STATE)
  const [activeTab, setActiveTab] = useState('money')
  const [saveStatus, setSaveStatus] = useState('saved')
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    let active = true
    adminRequest().then((result) => {
      if (!active) return
      setState(result.state || EMPTY_STATE)
      setAuthenticated(true)
    }).catch((error) => {
      if (active && error.status !== 401) setPageError(error.message)
    }).finally(() => { if (active) setReady(true) })
    return () => { active = false }
  }, [])

  async function save(nextState) {
    setSaveStatus('saving')
    setPageError('')
    try {
      await adminRequest('PUT', nextState)
      setState(nextState)
      setSaveStatus('saved')
      return true
    } catch (error) {
      setSaveStatus('error')
      setPageError(error.message)
      return false
    }
  }

  async function logout() {
    await adminRequest('POST', { action: 'logout' }).catch(() => {})
    setAuthenticated(false)
    setState(EMPTY_STATE)
  }

  if (!ready) return <main className="grid min-h-dvh place-items-center bg-[#111210] text-sm text-chalk-dim">Opening your workspace…</main>
  if (!authenticated) return <Login setupError={pageError} onLogin={(nextState) => { setState(nextState || EMPTY_STATE); setAuthenticated(true); setPageError('') }} />

  return (
    <main className="h-screen supports-[height:100dvh]:h-dvh overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#111210] text-chalk">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#111210]/95 backdrop-blur">
        <div className="mx-auto flex min-h-[64px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7">
          <a href="/" className="flex min-w-0 items-center gap-3 text-sm font-medium"><span className="flex size-8 items-center justify-center rounded border border-[#91a98b]/30 bg-[#91a98b]/10 text-[#adc5a7]"><Wallet size={16} /></span><span className="truncate">Riyad <span className="text-chalk-faint">/ Private desk</span></span></a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[11px] text-chalk-faint sm:inline-flex"><span className="size-1.5 rounded-full bg-[#91a98b]" />{saveStatus === 'saving' ? 'Saving' : saveStatus === 'error' ? 'Not saved' : 'All changes saved'}</span>
            <IconButton label="Sign out" onClick={logout}><LogOut size={17} /></IconButton>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-7 sm:px-7 sm:pt-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[11px] uppercase tracking-[0.16em] text-[#adc5a7]">Personal operations</p><h1 className="mt-1.5 text-2xl font-medium tracking-tight sm:text-3xl">Your desk, in order.</h1></div>
          <nav aria-label="Workspace sections" className="flex items-center gap-1 rounded-md border border-white/[0.09] bg-[#151512] p-1">
            {TABS.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={`inline-flex min-h-9 items-center gap-2 rounded px-3 text-xs font-medium transition ${activeTab === id ? 'bg-[#91a98b]/15 text-[#c0d2b8]' : 'text-chalk-dim hover:text-chalk'}`}><Icon size={15} />{label}</button>)}
          </nav>
        </div>
        {pageError && <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-md border border-[#e78b78]/25 bg-[#e78b78]/[0.07] px-4 py-3 text-sm text-[#efa08e]"><span>{pageError}</span><IconButton label="Dismiss" onClick={() => setPageError('')}><X size={16} /></IconButton></div>}
        {activeTab === 'money' && <MoneyDesk state={state} save={save} busy={saveStatus === 'saving'} />}
        {activeTab === 'month' && <MonthlyDesk state={state} save={save} busy={saveStatus === 'saving'} />}
        {activeTab === 'notes' && <NotesDesk state={state} save={save} busy={saveStatus === 'saving'} />}
        <footer className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-white/[0.07] pt-4 text-[10px] text-chalk-faint"><span>Private desk · shared workspace</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} /> Session protected</span></footer>
      </div>
    </main>
  )
}