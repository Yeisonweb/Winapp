function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6">🎮 Bienvenido a WinApp</h1>
      <p className="text-xl text-gray-400 mb-8">La plataforma de apuestas online más segura</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">💰 Dinero Real</h3>
          <p className="text-gray-400">Apuesta dinero real y gana grandes premios</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">🎯 Múltiples Juegos</h3>
          <p className="text-gray-400">Monopolio, Póker, Dados, Blackjack y más</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">🔒 Seguro</h3>
          <p className="text-gray-400">Transacciones seguras y autenticación verificada</p>
        </div>
      </div>
    </div>
  )
}

export default Home
