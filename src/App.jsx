import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Building2,
  User,
  CreditCard,
  Receipt,
  FileText,
  CheckCircle2,
  ShoppingBag,
  Percent,
  Truck,
  Lock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';

function App() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput.trim() === 'admin' && passwordInput === 'innox2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  // --- STATE INITIALIZATION ---
  const [formData, setFormData] = useState({
    createdAt: new Date().toISOString().split('T')[0],
    sellerInfo: {
      name: 'INNOX BUILDWELL LLP',
      address: '1912 Mapple, Paramount Symphony',
      addressLine2: 'Crossing Republik, Ghaziabad - 201016',
      phone: 'MOB. No. 9166297578'
    },
    customerInfo: {
      name: '',
      address: ''
    }
  });

  const [paymentTerms, setPaymentTerms] = useState([]);

  const [termsConditions, setTermsConditions] = useState([]);

  const [orderItems, setOrderItems] = useState([
    { name: '', quantity: '', price: '' }
  ]);



  // --- DYNAMIC CALCULATIONS ---
  const parseQty = (qty) => {
    if (typeof qty === 'number') return qty;
    if (!qty) return 0;
    const parsed = parseFloat(qty);
    return isNaN(parsed) ? 0 : parsed;
  };

  const subtotal = orderItems.reduce((acc, item) => acc + (parseQty(item.quantity) * (parseFloat(item.price) || 0)), 0);
  const total = subtotal;

  // --- FORM HANDLERS ---
  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // --- ITEM HANDLERS ---
  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    if (field === 'quantity') {
      newItems[index][field] = value;
    } else if (field === 'price') {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = value;
    }
    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { name: '', quantity: '', price: '' }]);
  };

  const removeItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  // --- PDF DOWNLOAD TRIGGER ---
  const downloadInvoice = () => {
    const element = document.getElementById('invoice-capture');
    if (!element) return;

    // Define options for html2pdf
    const options = {
      margin: [12, 12, 12, 12], // [top, left, bottom, right] margins in mm
      filename: `invoice_${formData.createdAt || 'order'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Trigger download
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        // Success micro-animation (confetti explosion!)
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#a855f7', '#10b981', '#3b82f6']
        });
      })
      .catch(err => {
        console.error('PDF generation error:', err);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header-section">
            <h1 className="login-title">
              <FileText className="text-primary" size={28} />
              INNOX BUILDWELL
            </h1>
            <p className="login-subtitle">Invoice Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="login-input-wrapper">
                <User size={18} className="login-input-icon" />
                <input
                  type="text"
                  placeholder="Enter username"
                  className="form-input login-input"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="form-input login-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* --- PAGE HEADER --- */}
      <header className="app-header">
        <div className="header-title">
          <h1>
            <FileText className="text-primary" size={32} />
            INNOX BUILDWELL LLP
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => {
            setIsAuthenticated(false);
            setUsernameInput('');
            setPasswordInput('');
          }} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            Sign Out
          </button>
          <button onClick={downloadInvoice} className="btn btn-primary">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </header>

      {/* --- DASHBOARD GRID --- */}
      <main className="main-dashboard">

        {/* --- LEFT HAND SIDE: FORM CONTROLS --- */}
        <section className="glass-card">
          <div className="card-header">
            <h2>
              <Receipt size={20} className="text-primary" />
              Invoice Configuration
            </h2>
            <span className="badge-preview">Real-time Editor</span>
          </div>

          <div className="card-body">

            {/* 1. Header & General Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText size={16} /> General Settings
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Invoice Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.createdAt}
                    onChange={e => handleInputChange(null, 'createdAt', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Customer Details input */}
            <div className="form-section">
              <h3 className="section-title">
                <User size={16} /> Customer Details
              </h3>
              <div className="form-grid">
                <div className="form-group form-grid-col-2">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Customer/Client name..."
                    className="form-input"
                    value={formData.customerInfo.name}
                    onChange={e => handleInputChange('customerInfo', 'name', e.target.value)}
                  />
                </div>
                <div className="form-group form-grid-col-2">
                  <label className="form-label">Customer Address</label>
                  <input
                    type="text"
                    placeholder="Customer billing address..."
                    className="form-input"
                    value={formData.customerInfo.address}
                    onChange={e => handleInputChange('customerInfo', 'address', e.target.value)}
                  />
                </div>
              </div>
            </div>





            {/* 6. Order Items Dynamic Form */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>
                  <ShoppingBag size={16} /> Order Items
                </h3>
                <button type="button" onClick={addItem} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="items-builder-list">
                {orderItems.map((item, index) => (
                  <div key={index} className="item-builder-row">
                    <div className="form-group">
                      {index === 0 && <label className="form-label">Item Description</label>}
                      <input
                        type="text"
                        placeholder="e.g. Ergonomic Office Chair"
                        className="form-input"
                        value={item.name}
                        onChange={e => handleItemChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      {index === 0 && <label className="form-label">Qty</label>}
                      <input
                        type="text"
                        placeholder="e.g. 2 or 10 Box"
                        className="form-input"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      {index === 0 && <label className="form-label">Unit Price</label>}
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="form-input"
                        value={item.price}
                        onChange={e => handleItemChange(index, 'price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-icon-danger"
                        disabled={orderItems.length === 1}
                        style={{ opacity: orderItems.length === 1 ? 0.4 : 1, cursor: orderItems.length === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Terms Input Section */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>
                  <CreditCard size={16} /> Payment Terms
                </h3>
                <button type="button" onClick={() => setPaymentTerms([...paymentTerms, ''])} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Line
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {paymentTerms.map((term, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. Bank Account details..."
                      className="form-input"
                      value={term}
                      onChange={e => {
                        const newTerms = [...paymentTerms];
                        newTerms[index] = e.target.value;
                        setPaymentTerms(newTerms);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentTerms(paymentTerms.filter((_, i) => i !== index))}
                      className="btn-icon-danger"
                      style={{ height: '2.375rem', width: '2.375rem', padding: 0 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions Input Section */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>
                  <FileText size={16} /> Terms & Conditions
                </h3>
                <button type="button" onClick={() => setTermsConditions([...termsConditions, ''])} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Line
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {termsConditions.map((term, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. Late payment interest details..."
                      className="form-input"
                      value={term}
                      onChange={e => {
                        const newTerms = [...termsConditions];
                        newTerms[index] = e.target.value;
                        setTermsConditions(newTerms);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setTermsConditions(termsConditions.filter((_, i) => i !== index))}
                      className="btn-icon-danger"
                      style={{ height: '2.375rem', width: '2.375rem', padding: 0 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- RIGHT HAND SIDE: LIVE PREVIEW CONTAINER --- */}
        <section className="preview-container">
          <div className="preview-header">
            <span className="badge-preview">Live PDF Preview (A4 Dimensions)</span>
            <button onClick={downloadInvoice} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <Download size={14} /> Download
            </button>
          </div>

          {/* --- A4 SHEET CAPTURE WRAPPER --- */}
          <div className="a4-wrapper">
            <div id="invoice-capture" className="a4-page">

              {/* Header section */}
              <div className="inv-header">
                <div className="inv-logo-section">
                  <span className="inv-brand-name">{formData.sellerInfo.name}</span>
                </div>
                <div className="inv-title-section">
                  <h4 className="inv-title">INVOICE</h4>
                  <div className="inv-meta-text">
                    <span className="inv-meta-label">Date:</span> {new Date(formData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Addresses section */}
              <div className="inv-addresses-section">

                {/* Own By */}
                <div className="address-block">
                  <span className="address-title">Own By</span>
                  <div className="address-content">
                    <strong>{formData.sellerInfo.name}</strong><br />
                    {formData.sellerInfo.address}<br />
                    {formData.sellerInfo.addressLine2}<br />
                    <strong>{formData.sellerInfo.phone}</strong>
                  </div>
                </div>

                {/* Billed To */}
                <div className="address-block">
                  <span className="address-title">Billed To</span>
                  <div className="address-content">
                    <strong>{formData.customerInfo.name}</strong><br />
                    {formData.customerInfo.address}
                  </div>
                </div>

              </div>



              {/* Items Table */}
              <div className="inv-table-container">
                <table className="inv-table">
                  <thead>
                    <tr>
                      <th className="item-sn">#</th>
                      <th className="item-description">Item Description</th>
                      <th className="item-qty align-center">Qty</th>
                      <th className="item-price align-right">Price</th>
                      <th className="item-total align-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="item-description"><strong>{item.name || 'Untitled Item'}</strong></td>
                        <td className="align-center">{item.quantity}</td>
                        <td className="align-right">{(parseFloat(item.price) || 0).toLocaleString()}</td>
                        <td className="align-right">{(parseQty(item.quantity) * (parseFloat(item.price) || 0)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Terms and Summary Section */}
              <div className="inv-terms-summary-wrapper" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '20px', alignItems: 'flex-start' }}>

                {/* Left side: Terms */}
                <div className="inv-terms-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, maxWidth: '60%', textAlign: 'left' }}>

                  {/* Payment Terms */}
                  {paymentTerms.length > 0 && (
                    <div className="inv-terms-block">
                      <h5 style={{ fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '4px', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px' }}>Payment Terms</h5>
                      <ol style={{ paddingLeft: '12px', margin: 0, fontSize: '8px', color: '#4b5563' }}>
                        {paymentTerms.map((term, i) => term.trim() && (
                          <li key={i} style={{ marginBottom: '2px' }}>{term}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {termsConditions.length > 0 && (
                    <div className="inv-terms-block">
                      <h5 style={{ fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase', color: '#1e3a8a', marginBottom: '4px', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px' }}>Terms & Conditions</h5>
                      <ol style={{ paddingLeft: '12px', margin: 0, fontSize: '8px', color: '#4b5563' }}>
                        {termsConditions.map((term, i) => term.trim() && (
                          <li key={i} style={{ marginBottom: '2px' }}>{term}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                </div>

                {/* Right side: Grand Total */}
                <div className="inv-total-block" style={{ minWidth: '180px', display: 'flex', justifyContent: 'flex-end' }}>
                  <table className="inv-summary-table" style={{ width: '100%' }}>
                    <tbody>
                      <tr className="total-row" style={{ borderTop: '2px solid #1e3a8a' }}>
                        <td style={{ fontSize: '11px', fontWeight: 'bold', padding: '8px 0', color: '#1e3a8a', textAlign: 'left' }}>Total Amount:</td>
                        <td className="val" style={{ fontSize: '11px', fontWeight: 'bold', padding: '8px 0', textAlign: 'right', color: '#1e3a8a' }}>{total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Invoice Footer */}
              <footer className="inv-footer">
                This is a computer-generated invoice and does not require a physical signature.<br />
                Thank you for your business!<br />
                For any queries, contact us at {formData.sellerInfo.phone}
              </footer>

            </div>
          </div>
        </section>
      </main>

      {/* --- STICKY FLOATING DOWNLOAD BUTTON FOR CONVENIENCE --- */}
      <button onClick={downloadInvoice} className="btn-download-sticky">
        <Download size={20} style={{ marginRight: '6px', marginBottom: '10px' }} />
        Download Invoice (A4 PDF)
      </button>
    </div>
  );
}

export default App;
