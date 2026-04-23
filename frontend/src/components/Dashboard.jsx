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
    // Scroll to top where form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen animate-fade-in-up">
      {/* Navbar */}
      <nav className="bg-app-surface border-b border-app-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold tracking-tight text-white">LostFound</span>
            </div>
            <div className="flex items-center relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-sm font-medium text-white hover:border-app-accent hover:bg-gray-700 transition"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-app-surface border border-app-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-app-border mb-1">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:w-1/3">
            <div className="bg-app-surface border border-app-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-medium text-white mb-6">
                {editingId ? 'Edit Item' : 'Report New Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Item Name</label>
                  <input type="text" className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="itemName" value={formData.itemName} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 resize-none h-24 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="description" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Type</label>
                    <select className="w-full bg-app-base border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="type" value={formData.type} onChange={handleChange} required>
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Date</label>
                    <input type="date" className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Location</label>
                  <input type="text" className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="location" value={formData.location} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Contact Info</label>
                  <input type="text" className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full bg-app-accent hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 active:scale-[0.98]">
                    {editingId ? 'Save Changes' : 'Submit Target'}
                  </button>
                  {editingId && (
                    <button type="button" className="w-full mt-2 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 text-sm font-medium py-2 px-4 rounded-lg transition" onClick={() => {setEditingId(null); setFormData({itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: ''})}}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: List & Search */}
          <div className="lg:w-2/3">
            
            {/* Search Bar */}
            <div className="bg-app-surface border border-app-border rounded-xl p-4 mb-6">
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
                <input 
                  className="flex-1 bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent" 
                  type="text" 
                  placeholder="Search item name..." 
                  value={search.name} 
                  onChange={(e) => setSearch({...search, name: e.target.value})} 
                />
                <select 
                  className="sm:w-40 bg-app-base border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-app-accent" 
                  value={search.category} 
                  onChange={(e) => setSearch({...search, category: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Lost">Lost only</option>
                  <option value="Found">Found only</option>
                </select>
                <div className="flex gap-2">
                  <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition" type="submit">
                    Filter
                  </button>
                  <button className="bg-transparent hover:bg-gray-800 border border-transparent text-gray-400 text-sm font-medium py-2 px-4 rounded-lg transition" type="button" onClick={() => { setSearch({name:'', category:''}); fetchItems(); }}>
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item._id} className="bg-app-surface border border-app-border rounded-xl p-5 hover:border-gray-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-white line-clamp-1">{item.itemName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'Lost' ? 'bg-app-danger/10 text-red-400 border border-app-danger/20' : 'bg-app-success/10 text-green-400 border border-app-success/20'}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 flex-grow">{item.description}</p>
                  
                  <div className="space-y-1.5 mb-5 text-sm">
                    <div className="flex text-gray-500">
                      <span className="w-20 font-medium">Location:</span> 
                      <span className="text-gray-300 truncate">{item.location}</span>
                    </div>
                    <div className="flex text-gray-500">
                      <span className="w-20 font-medium">Date:</span> 
                      <span className="text-gray-300">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-gray-500">
                      <span className="w-20 font-medium">Contact:</span> 
                      <span className="text-gray-300 truncate">{item.contactInfo}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500">
                      Reported by <span className="text-gray-300">{item.user?.name}</span>
                    </div>
                    
                    {user && item.user?._id === user.id && (
                      <div className="flex gap-2">
                        <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition" onClick={() => handleEdit(item)}>Edit</button>
                        <span className="text-gray-700">|</span>
                        <button className="text-xs font-medium text-red-400 hover:text-red-300 transition" onClick={() => handleDelete(item._id)}>Delete</button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
              
              {items.length === 0 && (
                <div className="col-span-full py-12 text-center border border-dashed border-gray-700 rounded-xl">
                  <p className="text-gray-500">No items found matching your criteria.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
