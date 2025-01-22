"use client"

import { useState } from "react"
import axios from "axios"

export default function Home() {
  const [formData, setFormData] = useState({
    lead_time: "",
    adr: "",
    total_of_special_requests: "",
    deposit_type: "No Deposit",
    country: "",
  })
  const [prediction, setPrediction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPrediction(null)
  
    try {
      const response = await axios.post("https://hotel-cancellation-predictor-37d78d6df101.herokuapp.com/predict", {
        lead_time: Number.parseInt(formData.lead_time),
        adr: Number.parseFloat(formData.adr),
        total_of_special_requests: Number.parseInt(formData.total_of_special_requests),
        deposit_type: formData.deposit_type,
        country: formData.country,
      })
      console.log("Response:", response.data)
      setPrediction(response.data.prediction ? "Likely to cancel" : "Not likely to cancel")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to get prediction: ${err.message}. ${err.response?.data ? JSON.stringify(err.response.data) : ""}`,
        )
      } else {
        setError("Failed to get prediction. Please try again.")
      }
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Hotel Cancellation Predictor</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lead_time">
              Lead Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lead_time"
              type="number"
              name="lead_time"
              value={formData.lead_time}
              onChange={handleInputChange}
              placeholder="Enter lead time"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adr">
              ADR (Average Daily Rate)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="adr"
              type="number"
              step="0.01"
              name="adr"
              value={formData.adr}
              onChange={handleInputChange}
              placeholder="Enter ADR"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_of_special_requests">
              Total Special Requests
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="total_of_special_requests"
              type="number"
              name="total_of_special_requests"
              value={formData.total_of_special_requests}
              onChange={handleInputChange}
              placeholder="Enter total special requests"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deposit_type">
              Deposit Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="deposit_type"
              name="deposit_type"
              value={formData.deposit_type}
              onChange={handleInputChange}
              required
            >
              <option value="No Deposit">No Deposit</option>
              <option value="Non Refund">Non Refund</option>
              <option value="Refundable">Refundable</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              Country
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country code (e.g., ESP)"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </form>
        {prediction && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">Prediction:</p>
            <p>{prediction}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  )
}

