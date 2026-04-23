import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState({ name: '', category: '' });
  
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/items/search?name=${search.name}&category=${search.category}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/items', formData);
      }
      setFormData({
        itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: ''
      });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        console.error(err);
        alert('Unauthorized or Error deleting');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: item.date ? item.date.substring(0, 10) : '',
      contactInfo: item.contactInfo
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="animate-in">
      <nav className="navbar navbar-expand navbar-saas sticky-top">
        <div className="container-fluid max-w-1200">
          <span className="navbar-brand mb-0">LostFound</span>
          <div className="d-flex position-relative">
            <button 
              className="btn btn-transparent p-0 rounded-circle d-flex align-items-center justify-content-center" 
              style={{width: '32px', height: '32px'}}
              onClick={() => setShowProfile(!showProfile)}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            {showProfile && (
              <div className="dropdown-menu dropdown-menu-end show mt-2 shadow" style={{position: 'absolute', right: 0, top: '100%', minWidth: '200px', backgroundColor: '#1f2937', borderColor: '#374151'}}>
                <div className="px-3 py-2 border-bottom border-secondary mb-1">
                  <div className="fw-medium text-white text-truncate" style={{fontSize: '0.9rem'}}>{user?.name}</div>
                  <div className="text-muted text-truncate" style={{fontSize: '0.8rem'}}>{user?.email}</div>
                </div>
                <button className="dropdown-item text-danger small" onClick={handleLogout} style={{fontSize: '0.85rem'}}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="page-container">
        <div className="row g-4">
          
          {/* Left Form */}
          <div className="col-lg-4">
            <div className="card-saas position-sticky" style={{top: '5rem'}}>
              <div className="card-header-saas">
                {editingId ? 'Edit Item' : 'Report New Item'}
              </div>
              <div className="card-body-saas">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">ITEM NAME</label>
                    <input type="text" className="form-control" name="itemName" value={formData.itemName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">DESCRIPTION</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label">TYPE</label>
                      <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label">DATE</label>
                      <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">LOCATION</label>
                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">CONTACT INFO</label>
                    <input type="text" className="form-control" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-2">
                    {editingId ? 'Save Changes' : 'Submit Target'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-transparent w-100" onClick={() => {setEditingId(null); setFormData({itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: ''})}}>
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Right Grid */}
          <div className="col-lg-8">
            <div className="card-saas mb-4">
              <div className="card-body-saas py-3">
                <form className="d-flex flex-column flex-md-row gap-2" onSubmit={handleSearch}>
                  <input className="form-control flex-grow-1" type="text" placeholder="Search item name..." value={search.name} onChange={(e) => setSearch({...search, name: e.target.value})} />
                  <select className="form-select" style={{width: 'auto', minWidth: '150px'}} value={search.category} onChange={(e) => setSearch({...search, category: e.target.value})}>
                    <option value="">All Types</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                  <button className="btn btn-transparent px-4" type="submit">Filter</button>
                  <button className="btn btn-transparent border-0" type="button" onClick={() => { setSearch({name:'', category:''}); fetchItems(); }}>Clear</button>
                </form>
              </div>
            </div>

            <div className="row g-3">
              {items.map(item => (
                <div key={item._id} className="col-md-6">
                  <div className="card-saas h-100 d-flex flex-column">
                    <div className="card-body-saas">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 text-truncate me-2" style={{fontSize: '1.05rem'}}>{item.itemName}</h5>
                        <span className={item.type === 'Lost' ? 'pill-lost' : 'pill-found'}>{item.type}</span>
                      </div>
                      
                      <p className="text-muted small mb-3 flex-grow-1">{item.description}</p>
                      
                      <div className="small text-muted mb-1"><span className="fw-medium text-white opacity-75">Location:</span> {item.location}</div>
                      <div className="small text-muted mb-1"><span className="fw-medium text-white opacity-75">Date:</span> {new Date(item.date).toLocaleDateString()}</div>
                      <div className="small text-muted mb-3"><span className="fw-medium text-white opacity-75">Contact:</span> {item.contactInfo}</div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary">
                        <div className="small text-muted" style={{fontSize: '0.75rem'}}>
                          Reported by <span className="text-white opacity-75">{item.user?.name}</span>
                        </div>
                        
                        {user && item.user?._id === user.id && (
                          <div>
                            <button className="btn btn-link text-primary p-0 text-decoration-none small me-2" style={{fontSize: '0.8rem'}} onClick={() => handleEdit(item)}>Edit</button>
                            <button className="btn btn-link text-danger p-0 text-decoration-none small" style={{fontSize: '0.8rem'}} onClick={() => handleDelete(item._id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="col-12">
                  <div className="p-5 text-center text-muted" style={{border: '1px dashed #374151', borderRadius: '12px'}}>
                    No items found matching your criteria.
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
