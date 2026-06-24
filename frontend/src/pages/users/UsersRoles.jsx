import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import api from '../../services/api';
import { UserPlus, MoreVertical, X, Loader2, Edit2, Trash2 } from 'lucide-react';

export default function UsersRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'HR Executive', password: '' });
  const [editingUser, setEditingUser] = useState({ id: null, name: '', email: '', role: '', password: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', newUser);
      setUsers([...users, response.data.data]);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', role: 'HR Executive', password: '' });
    } catch (error) {
      console.error('Failed to create user', error);
      alert('Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(user => (user._id || user.id) !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user');
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      };
      if (editingUser.password) {
        payload.password = editingUser.password;
      }
      const response = await api.put(`/users/${editingUser.id}`, payload);
      const updatedUser = response.data.data;
      setUsers(users.map(user => ((user._id || user.id) === editingUser.id ? { ...user, ...updatedUser } : user)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user', error);
      alert('Failed to update user');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <PageTitle title="Users & Roles" subtitle="Manage system access and workflow roles." />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2.5 rounded-xl font-medium hover:bg-brand-dark/90 transition-colors"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden min-h-[300px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-dark">{user.name}</td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-medium text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === (user._id || user.id) ? null : (user._id || user.id));
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-dark transition-colors relative z-10"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {activeDropdown === (user._id || user.id) && (
                    <div 
                      className="absolute right-12 top-4 w-32 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        onClick={() => {
                          setActiveDropdown(null);
                          openEditModal(user);
                        }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        onClick={() => {
                          setActiveDropdown(null);
                          handleDeleteUser(user._id || user.id);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-brand-dark">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-white"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option>HR Executive</option>
                    <option>HR Manager</option>
                    <option>Operations Manager</option>
                    <option>Director</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-dark text-white font-medium hover:bg-brand-dark/90 transition-colors">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-brand-dark">Edit User</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                  <input 
                    type="password"
                    placeholder="Leave blank to keep current password"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-white"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option>HR Executive</option>
                    <option>HR Manager</option>
                    <option>Operations Manager</option>
                    <option>Director</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-dark text-white font-medium hover:bg-brand-dark/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

