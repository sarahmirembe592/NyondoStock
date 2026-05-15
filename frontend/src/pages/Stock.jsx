import { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPost, unwrapList } from '../api/client'
import './pages.css'

const PRODUCT_CATEGORIES = [
  { value: 'cement', label: 'Cement' },
  { value: 'iron_bars', label: 'Iron bars' },
  { value: 'nails', label: 'Nails' },
  { value: 'iron_sheets', label: 'Iron sheets' },
  { value: 'other', label: 'Other' },
]

const emptyProductForm = {
  name: '',
  category: 'cement',
  unit: 'bag',
}

const emptyStockForm = {
  product: '',
  quantity: '',
  unit_cost: '',
  unit_price: '',
  received_at: '',
  note: '',
}

function formatDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function Stock() {
  const [products, setProducts] = useState([])
  const [entries, setEntries] = useState([])
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [stockForm, setStockForm] = useState({
    ...emptyStockForm,
    received_at: formatDateTimeLocal(new Date()),
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([apiGet('/products/'), apiGet('/stock/')])
      .then(([productData, stockData]) => {
        setProducts(unwrapList(productData))
        setEntries(unwrapList(stockData))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleAddProduct(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await apiPost('/products/', productForm)
      setProductForm(emptyProductForm)
      setSuccess('Product added.')
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddStock(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await apiPost('/stock/', {
        product: Number(stockForm.product),
        quantity: Number(stockForm.quantity),
        unit_cost: stockForm.unit_cost,
        unit_price: stockForm.unit_price,
        received_at: new Date(stockForm.received_at).toISOString(),
        note: stockForm.note,
      })
      setStockForm({
        ...emptyStockForm,
        product: stockForm.product,
        received_at: formatDateTimeLocal(new Date()),
      })
      setSuccess('Stock entry recorded.')
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="empty-state">Loading stock data…</p>
  }

  return (
    <>
      <header className="page-header">
        <h1>Stock</h1>
        <p>Register products and record stock arrivals with cost and selling price.</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-info">{success}</div>}

      <section className="panel">
        <h2>Add product</h2>
        <form className="form-grid" onSubmit={handleAddProduct}>
          <div className="form-field">
            <label htmlFor="product-name">Name</label>
            <input
              id="product-name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              placeholder="e.g. CEM II 32.5"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="product-unit">Unit</label>
            <input
              id="product-unit"
              value={productForm.unit}
              onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
              required
              placeholder="bag, piece, kg"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            Add product
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Register stock arrival</h2>
        <form className="form-grid" onSubmit={handleAddStock}>
          <div className="form-field">
            <label htmlFor="stock-product">Product</label>
            <select
              id="stock-product"
              value={stockForm.product}
              onChange={(e) => setStockForm({ ...stockForm, product: e.target.value })}
              required
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.quantity_on_hand} {p.unit} on hand)
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="stock-qty">Quantity</label>
            <input
              id="stock-qty"
              type="number"
              min="1"
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="stock-cost">Unit cost (UGX)</label>
            <input
              id="stock-cost"
              type="number"
              min="0"
              step="0.01"
              value={stockForm.unit_cost}
              onChange={(e) => setStockForm({ ...stockForm, unit_cost: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="stock-price">Unit price (UGX)</label>
            <input
              id="stock-price"
              type="number"
              min="0"
              step="0.01"
              value={stockForm.unit_price}
              onChange={(e) => setStockForm({ ...stockForm, unit_price: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="stock-received">Received at</label>
            <input
              id="stock-received"
              type="datetime-local"
              value={stockForm.received_at}
              onChange={(e) => setStockForm({ ...stockForm, received_at: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="stock-note">Note (optional)</label>
            <input
              id="stock-note"
              value={stockForm.note}
              onChange={(e) => setStockForm({ ...stockForm, note: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting || products.length === 0}>
            Record stock
          </button>
        </form>
        {products.length === 0 && (
          <p className="empty-state">Add a product first before recording stock.</p>
        )}
      </section>

      <section className="panel">
        <h2>Products</h2>
        {products.length === 0 ? (
          <p className="empty-state">No products yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>On hand</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.quantity_on_hand}</td>
                  <td>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel">
        <h2>Stock history</h2>
        {entries.length === 0 ? (
          <p className="empty-state">No stock entries yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.product_name}</td>
                  <td>
                    {entry.quantity} {entry.product_unit}
                  </td>
                  <td>{Number(entry.unit_cost).toLocaleString()}</td>
                  <td>{Number(entry.unit_price).toLocaleString()}</td>
                  <td>{new Date(entry.received_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}