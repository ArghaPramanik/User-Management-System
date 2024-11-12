'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, UserPlus, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const Alert = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
    <div className="flex justify-between items-center">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  </div>
)

export default function UserManagementApp() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const usersWithDOB = data.map(user => ({ ...user, dateOfBirth: '2001-01-01' }));
      setUsers(usersWithDOB);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert({ message: "Failed to fetch users. Please try again.", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await fetch(`${API_URL}/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            id: editingUser.id,
            name,
            email,
            dateOfBirth,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        if (!response.ok) throw new Error('Failed to update user');
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === editingUser.id ? { ...updatedUser, dateOfBirth } : user));
        setAlert({ message: "User updated successfully (simulated)", type: "success" });
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            dateOfBirth,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        if (!response.ok) throw new Error('Failed to add user');
        const newUser = await response.json();
        setUsers([...users, { ...newUser, dateOfBirth }]);
        setAlert({ message: "User added successfully (simulated)", type: "success" });
      }
      setName('');
      setEmail('');
      setDateOfBirth('');
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setAlert({ message: "Failed to save user. Please try again.", type: "error" });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setDateOfBirth(user.dateOfBirth || '');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== id));
      setAlert({ message: "User deleted successfully (simulated)", type: "success" });
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ message: "Failed to delete user. Please try again.", type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">User Management System</h1>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <CardTitle className="flex items-center">
              {editingUser ? <Pencil className="mr-2" /> : <UserPlus className="mr-2" />}
              {editingUser ? 'Edit User' : 'Add New User'}
            </CardTitle>
            <CardDescription className="text-purple-100">Enter user details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Name...."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email address...."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md transition-all duration-300">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Registered Users
            </CardTitle>
            <CardDescription className="text-indigo-100">Manage your users here</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 my-4">No users found. Add a user to see them listed here.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-indigo-600">Name</TableHead>
                      <TableHead className="text-indigo-600">Email</TableHead>
                      <TableHead className="text-indigo-600">Date of Birth</TableHead>
                      <TableHead className="text-indigo-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {users.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.dateOfBirth}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" onClick={() => handleEdit(user)} className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
