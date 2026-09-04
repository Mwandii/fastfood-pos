import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.api.ping().then((result) => {
      console.log(result)
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-5xl font-bold text-white">FastFood POS</h1>
    </div>
  )
}

export default App