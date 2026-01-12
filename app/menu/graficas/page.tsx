export default function GraficasPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundImage: "url('/img/fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
    >
      <main className="w-full max-w-2xl rounded bg-white p-8 shadow text-center">
        <h1 className="mb-4 text-2xl font-semibold">Gráficas</h1>
        <p className="mb-6">Visualizaciones de datos y métricas.</p>
        <a href="/menu" className="rounded bg-zinc-200 px-4 py-2 text-zinc-800 hover:bg-zinc-300">Volver al menú</a>
      </main>
    </div>
  );
}
