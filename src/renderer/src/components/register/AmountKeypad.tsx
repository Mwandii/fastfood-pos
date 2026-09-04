import { useState } from 'react'

interface AmountKeypadProps {
  productName: string
  onConfirm: (amount: number) => void
  onClose: () => void
}

function AmountKeypad({ productName, onConfirm, onClose }: AmountKeypadProps) {
  const [amount, setAmount] = useState('')

  function handleDigit(digit: string): void {
    setAmount((prev) => prev + digit)
  }

  function handleBackspace(): void {
    setAmount((prev) => prev.slice(0, -1))
  }

  function handleClear(): void {
    setAmount('')
  }

  function handleConfirm(): void {
    const value = parseInt(amount, 10)
    if (!value || value <= 0) return
    onConfirm(value)
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-80" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-white font-semibold text-lg mb-2">{productName}</h2>
        <p className="text-gray-400 text-sm mb-4">Enter amount</p>

        <div className="bg-gray-900 rounded-lg px-4 py-3 mb-4 text-right">
          <span className="text-white text-2xl font-mono">
            KSh {amount || '0'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {digits.map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold"
          >
            ⌫
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!amount || parseInt(amount, 10) <= 0}
            className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default AmountKeypad