import { useEffect, useState } from 'react'
import API from '../api/axios'

interface User {
  id: number
  name: string
  email: string
  role?: string
}

export default function TeamList() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
  })

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users')
      setUsers(res.data)
    } catch {
      setError('Không thể tải danh sách thành viên')
    }
  }

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/users', form)
      setForm({ name: '', email: '', password: '', role: 'member' })
      fetchUsers()
    } catch {
      alert('Không thể thêm thành viên')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">👥 Thành viên nhóm</h2>

      {/* FORM THÊM THÀNH VIÊN */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">➕ Thêm thành viên</h3>
        <form onSubmit={addUser} className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="member">Thành viên</option>
            <option value="admin">Quản trị</option>
          </select>
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Thêm thành viên
          </button>
        </form>
      </div>

      {/* DANH SÁCH THÀNH VIÊN */}
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border text-sm">{u.role ?? 'member'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
