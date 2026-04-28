import React, {useMemo, useState} from 'react';

export default function App() {
  const [parcela, setParcela] = useState('');
  const [saldo, setSaldo] = useState('');
  const [contrato, setContrato] = useState('');
  const [prazo, setPrazo] = useState('96');

  const fmt = (n) =>
    isFinite(n)
      ? n.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : '-';

  function solveRate(pv, pmt, n) {
    let lo = 0.0001;
    let hi = 0.08;

    for (let k = 0; k < 80; k++) {
      let mid = (lo + hi) / 2;
      let val = (pmt * (1 - Math.pow(1 + mid, -n))) / mid;

      if (val > pv) lo = mid;
      else hi = mid;
    }

    return (lo + hi) / 2;
  }

  const data = useMemo(() => {
    const p = parseFloat(parcela.replace(',', '.'));
    const s = parseFloat(saldo.replace(',', '.'));
    const c = parseFloat(contrato.replace(',', '.'));
    const n = parseInt(prazo);

    if (!(p > 0 && s > 0 && c > 0 && n > 0)) return null;

    const parcelasTot = Math.round(c / p);
    const rest = Math.max(1, parcelasTot);
    const pagas = Math.max(0, n - rest);

    const i = solveRate(s, p, rest);

    const pv = (p * (1 - Math.pow(1 + i, -n))) / i;
    const anual = Math.pow(1 + i, 12) - 1;

    return {
      parcelasTot,
      rest,
      pagas,
      i,
      anual,
      pv,
    };
  }, [parcela, saldo, contrato, prazo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Calculadora de Juros Consignado
        </h1>

        <p className="text-slate-600 mb-6">
          Informe os dados do contrato para estimar a taxa real.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-xl"
            placeholder="Valor da parcela"
            value={parcela}
            onChange={(e) => setParcela(e.target.value)}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Saldo devedor"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Valor do contrato"
            value={contrato}
            onChange={(e) => setContrato(e.target.value)}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Prazo original (ex 96)"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />
        </div>

        {data && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="text-sm text-slate-500">
                Juros Mensal Estimado
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {(data.i * 100).toFixed(2)}%
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="text-sm text-slate-500">
                Juros Anual
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {(data.anual * 100).toFixed(2)}%
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="text-sm text-slate-500">
                Valor Emprestado Estimado
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {fmt(data.pv)}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="text-sm text-slate-500">
                Parcelas Restantes Est.
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {data.rest}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="text-sm text-slate-500">
                Parcelas Pagas Est.
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {data.pagas}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
