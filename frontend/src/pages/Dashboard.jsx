import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/client'
import './pages.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/dashboard/')
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="empty-state">Loading dashboard…</p>
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Could not load dashboard: {error}. Is the Django server running on port 8000?
      </div>
    )
  }

  return (
    <>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of products and stock at Nyondo Hardware.</p>
      </header>

      <section className="card-grid">
        <article className="stat-card">
          <h2>Active products</h2>
          <p className="value">{stats.product_count}</p>
        </article>
        <article className="stat-card">
          <h2>Total units in stock</h2>
          <p className="value">{stats.total_stock_units}</p>
        </article>
        <article className="stat-card">
          <h2>Entries this week</h2>
          <p className="value">{stats.stock_entries_this_week}</p>
        </article>
        <article className="stat-card">
          <h2>Low stock items</h2>
          <p className="value">{stats.low_stock_count}</p>
        </article>
      </section>

      {stats.low_stock_products.length > 0 && (
        <section className="panel">
          <h2>Products below 10 units</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>On hand</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {stats.low_stock_products.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity_on_hand}</td>
                  <td>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="empty-state">
        <Link to="/stock">Register stock</Link> or add products from the Stock page.
      </p>
    </>
  )
}