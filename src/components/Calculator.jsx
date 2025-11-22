import { useState } from 'react'

const defaultForm = {
  basic: 15000,
  hra: 6000,
  da: 0,
  conveyance: 1600,
  special_allowance: 2000,
  overtime: 0,
  bonus: 0,
  other_earnings: 0,
  pt_amount: 200,
  other_deductions: 0,
  non_account_worker: false,
}

export default function Calculator() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const handleCalc = async () => {
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        employee_code: 'TEMP',
        month: '2025-04',
        earnings: {
          basic: Number(form.basic) || 0,
          hra: Number(form.hra) || 0,
          da: Number(form.da) || 0,
          conveyance: Number(form.conveyance) || 0,
          special_allowance: Number(form.special_allowance) || 0,
          overtime: Number(form.overtime) || 0,
          bonus: Number(form.bonus) || 0,
          other_earnings: Number(form.other_earnings) || 0,
        },
        pt_amount: Number(form.pt_amount) || 0,
        other_deductions: Number(form.other_deductions) || 0,
        non_account_worker: !!form.non_account_worker,
      }

      const res = await fetch(`${backend}/api/payroll/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
      alert('Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const Currency = ({ children }) => (
    <span className="tabular-nums">₹ {Number(children || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
  )

  const Input = ({ label, value, onChange, step = '1', type = 'number' }) => (
    <label className="block">
      <span className="text-sm text-blue-200/90">{label}</span>
      <input
        type={type}
        value={value}
        step={step}
        onChange={(e) => onChange(e.target.type === 'number' ? parseFloat(e.target.value || 0) : e.target.value)}
        className="mt-1 w-full rounded-lg bg-slate-900/60 border border-blue-500/20 px-3 py-2 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
    </label>
  )

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Payroll Calculator (India)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Basic" value={form.basic} onChange={(v) => update('basic', v)} />
        <Input label="HRA" value={form.hra} onChange={(v) => update('hra', v)} />
        <Input label="DA" value={form.da} onChange={(v) => update('da', v)} />
        <Input label="Conveyance" value={form.conveyance} onChange={(v) => update('conveyance', v)} />
        <Input label="Special Allowance" value={form.special_allowance} onChange={(v) => update('special_allowance', v)} />
        <Input label="Overtime" value={form.overtime} onChange={(v) => update('overtime', v)} />
        <Input label="Bonus" value={form.bonus} onChange={(v) => update('bonus', v)} />
        <Input label="Other Earnings" value={form.other_earnings} onChange={(v) => update('other_earnings', v)} />

        <Input label="Professional Tax (PT)" value={form.pt_amount} onChange={(v) => update('pt_amount', v)} />
        <Input label="Other Deductions" value={form.other_deductions} onChange={(v) => update('other_deductions', v)} />

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.non_account_worker}
            onChange={(e) => update('non_account_worker', e.target.checked)}
            className="rounded border-blue-500/30 bg-slate-900/60"
          />
          <span className="text-blue-200/90 text-sm">Non-Account Worker (no PF/ESI)</span>
        </label>
      </div>

      <button
        onClick={handleCalc}
        disabled={loading}
        className="mt-4 w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60"
      >
        {loading ? 'Calculating…' : 'Calculate'}
      </button>

      {result && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
          <div className="bg-slate-900/40 rounded-xl p-4 border border-blue-500/20">
            <h3 className="font-semibold text-white mb-2">Earnings (Gross)</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Gross Earnings</span><Currency>{result.breakdown.earnings_gross}</Currency></div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-xl p-4 border border-blue-500/20">
            <h3 className="font-semibold text-white mb-2">Statutory Deductions</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(result.statutory_deductions).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><Currency>{v}</Currency></div>
              ))}
              <div className="mt-2 border-t border-blue-500/20 pt-2 flex justify-between font-semibold">
                <span>Total Deductions</span><Currency>{result.breakdown.total_deductions}</Currency>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-xl p-4 border border-blue-500/20">
            <h3 className="font-semibold text-white mb-2">Employer Contributions</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(result.employer_contributions).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><Currency>{v}</Currency></div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-xl p-4 border border-blue-500/20">
            <h3 className="font-semibold text-white mb-2">Net & Cost Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Net Salary</span><Currency>{result.net_salary}</Currency></div>
              <div className="flex justify-between"><span>Employer Cost</span><Currency>{result.employer_cost}</Currency></div>
              <div className="flex justify-between"><span>PF Wage (Basic+DA)</span><Currency>{result.breakdown.pf_wage}</Currency></div>
              <div className="flex justify-between"><span>PF Wage Capped</span><Currency>{result.breakdown.pf_wage_capped}</Currency></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
