import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import assetService from '../services/assetService';
import { PROBLEM_CATEGORIES } from '../utils/constants';

export const MyThings = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Add / Edit Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'LAPTOP',
    brand: '',
    model: '',
    purchaseDate: '',
    warrantyEndDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assetService.getMyAssets();
      setAssets(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your things');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingAssetId(null);
    setFormData({
      name: '',
      category: 'LAPTOP',
      brand: '',
      model: '',
      purchaseDate: '',
      warrantyEndDate: '',
      notes: '',
    });
    setShowAddForm(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAssetId(asset.id);
    setFormData({
      name: asset.name,
      category: asset.category,
      brand: asset.brand || '',
      model: asset.model || '',
      purchaseDate: asset.purchaseDate || '',
      warrantyEndDate: asset.warrantyEndDate || '',
      notes: asset.notes || '',
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      purchaseDate: formData.purchaseDate || null,
      warrantyEndDate: formData.warrantyEndDate || null,
    };

    try {
      if (editingAssetId) {
        await assetService.updateAsset(editingAssetId, payload);
        setSuccessMsg('Thing updated successfully!');
      } else {
        await assetService.createAsset(payload);
        setSuccessMsg('New thing added to your inventory!');
      }
      setShowAddForm(false);
      fetchAssets();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your things?`)) {
      return;
    }
    try {
      await assetService.deleteAsset(id);
      setSuccessMsg(`"${name}" removed successfully.`);
      fetchAssets();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const getWarrantyBadge = (asset) => {
    if (!asset.warrantyEndDate) {
      return (
        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
          No Warranty Info
        </span>
      );
    }
    if (asset.warrantyStatus === 'ACTIVE') {
      return (
        <span className="badge badge-success">
          Warranty Active (until {asset.warrantyEndDate})
        </span>
      );
    }
    return (
      <span className="badge badge-warning">
        Warranty Expired ({asset.warrantyEndDate})
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>My Things</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Maintain an inventory of your laptops, appliances, vehicles, and devices to track warranties and repairs.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add Thing
        </button>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Add / Edit Form Card */}
      {showAddForm && (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {editingAssetId ? 'Edit Thing' : 'Add a New Thing'}
            </h2>
            <button onClick={() => setShowAddForm(false)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Name / Nickname *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Work Laptop, Living Room AC, Honda Bike"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', backgroundColor: 'white' }}
                >
                  {PROBLEM_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Brand (Manufacturer)
                </label>
                <input
                  type="text"
                  name="brand"
                  maxLength={100}
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. HP, Apple, Samsung, Honda"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Model / Specs
                </label>
                <input
                  type="text"
                  name="model"
                  maxLength={100}
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Pavilion 15, iPhone 14 Pro, Activa 6G"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Warranty End Date
                </label>
                <input
                  type="date"
                  name="warrantyEndDate"
                  value={formData.warrantyEndDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Notes / Serial Number / Maintenance Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Serial number, past battery replacement dates, purchase store info..."
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Saving...' : editingAssetId ? 'Update Thing' : 'Save Thing'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Asset Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your inventory...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No things registered yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Register your everyday items (HP Laptop, iPhone, AC, Washing Machine, Honda Bike) to keep track of warranties,
            repair histories, and maintenance reminders.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            + Add Your First Thing
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {assets.map((asset) => {
            const cat = PROBLEM_CATEGORIES.find((c) => c.value === asset.category);
            return (
              <div key={asset.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{cat?.icon || '📦'}</span>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{asset.name}</h2>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {cat?.label || asset.category}
                      </span>
                    </div>
                  </div>
                  <div>{getWarrantyBadge(asset)}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Brand:</span>
                    <strong>{asset.brand || 'Not specified'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Model:</span>
                    <strong>{asset.model || 'Not specified'}</strong>
                  </div>
                  {asset.purchaseDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Purchased:</span>
                      <span>{asset.purchaseDate}</span>
                    </div>
                  )}
                </div>

                {asset.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                    "{asset.notes}"
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: asset.problemCount > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {asset.problemCount} Problem{asset.problemCount === 1 ? '' : 's'} Reported
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(asset)}
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id, asset.name)}
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <Link
                  to={`/problems/report?assetId=${asset.id}`}
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.25rem' }}
                >
                  + Report Issue for this Item
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyThings;
