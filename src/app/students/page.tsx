import { CrudTable } from "@/components/crud-table"
import { useState, useEffect } from "react"

export default function StudentsPage() {
  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const response = await fetch('/api/students')
    const data = await response.json()
    setStudents(data)
  }

  const addStudent = async (data) => {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchStudents()
    }
  }

  const updateStudent = async (id, data) => {
    const response = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchStudents()
    }
  }

  const deleteStudent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchStudents()
      }
    }
  }

  return (
    <CrudTable
      title="Étudiants"
      columns={['Nom', 'Prénom', 'Email', 'Date de naissance']}
      data={students}
      onAdd={addStudent}
      onUpdate={updateStudent}
      onDelete={deleteStudent}
      formFields={[
        { name: 'last_name', label: 'Nom' },
        { name: 'first_name', label: 'Prénom' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'birth_date', label: 'Date de naissance', type: 'date' },
      ]}
    />
  )
}
