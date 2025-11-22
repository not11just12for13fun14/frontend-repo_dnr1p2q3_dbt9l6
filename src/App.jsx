import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <header className="relative z-10 px-6 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Cashew Payroll Calculator (India)</h1>
        <p className="mt-2 text-blue-200/80">Compute gross, statutory deductions (PF/ESI/PT), employer contributions (EPS/EPF/EDLI/Admin), net salary, and employer cost.</p>
      </header>

      <main className="relative z-10 px-6 pb-20 max-w-4xl mx-auto">
        <Calculator />
      </main>

      <footer className="relative z-10 text-center text-blue-300/60 pb-6">
        <p>Tip: Use the toggle for non-account workers (no PF/ESI).</p>
      </footer>
    </div>
  )
}

export default App
