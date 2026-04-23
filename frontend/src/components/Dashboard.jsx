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
    if(window.confirm('Are you sure?')) {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container-fluid">
          <a className="navbar-brand floating-icon" href="#">
            <i className="bi bi-box-seam me-2"></i> Lost & Found System
          </a>
          <div className="d-flex align-items-center position-relative">
            <div className="profile-bubble me-3" onClick={() => setShowProfile(!showProfile)}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {showProfile && (
              <div className="dropdown-menu-glass position-absolute end-0 mt-2 p-3 shadow-lg" style={{top: '100%', zIndex: 1000, minWidth: '200px'}}>
                <div className="text-center mb-3">
                  <div className="fw-bold fs-5">{user?.name}</div>
                  <div className="text-muted small">{user?.email}</div>
                </div>
                <hr className="border-secondary" />
                <button className="btn btn-danger w-100 btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card glass-card tilt-card mb-4" style={{border: '1px solid rgba(14, 165, 233, 0.3)'}}>
              <div className="card-header border-bottom-0 bg-transparent pt-4 pb-0 fw-bold fs-5 text-info">
                {editingId ? 'Edit Item Details' : 'Report New Item'}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input type="text" className="form-control" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <textarea className="form-control" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
                  </div>
                  <div className="mb-2">
                    <select className="form-control" name="type" value={formData.type} onChange={handleChange} required>
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type="text" className="form-control" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <input type="text" className="form-control" name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'} Item</button>
                  {editingId && <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: ''})}}>Cancel</button>}
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="mb-4">
              <form className="d-flex" onSubmit={handleSearch}>
                <input className="form-control me-2" type="text" placeholder="Search by name" value={search.name} onChange={(e) => setSearch({...search, name: e.target.value})} />
                <select className="form-control me-2" value={search.category} onChange={(e) => setSearch({...search, category: e.target.value})}>
                  <option value="">All Types</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
                <button className="btn btn-outline-success" type="submit">Search</button>
                <button className="btn btn-outline-secondary ms-2" type="button" onClick={() => { setSearch({name:'', category:''}); fetchItems(); }}>Clear</button>
              </form>
            </div>

            <div className="row">
              {items.map(item => (
                <div key={item._id} className="col-md-6 mb-4">
                  <div className="card glass-card tilt-card h-100">
                    <div className="card-body">
                      <h5 className="card-title d-flex justify-content-between align-items-center mb-3">
                        {item.itemName} 
                        <span className={`badge ${item.type === 'Lost' ? 'bg-danger' : 'bg-success'} shadow-sm`}>{item.type}</span>
                      </h5>
                      <p className="card-text text-muted">{item.description}</p>
                      <p className="mb-1"><strong>Location:</strong> {item.location}</p>
                      <p className="mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>Contact:</strong> {item.contactInfo}</p>
                      <p className="mb-2"><small>Reported by: {item.user?.name}</small></p>
                      
                      {user && item.user?._id === user.id && (
                        <div className="mt-2">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
