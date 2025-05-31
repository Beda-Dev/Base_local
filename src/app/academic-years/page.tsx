import { CrudTable } from "@/components/crud-table"
import { useState, useEffect } from "react"

export default function AcademicYearsPage() {
  const [years, setYears] = useState([])

  useEffect(() => {
    fetchYears()
  }, [])

  const fetchYears = async () => {
    const response = await fetch('/api/academic-years')
    const data = await response.json()
    setYears(data)
  }

  const addYear = async (data) => {
    const response = await fetch('/api/academic-years', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchYears()
    }
  }

  const updateYear = async (id, data) => {
    const response = await fetch(`/api/academic-years/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchYears()
    }
  }

  const deleteYear = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette année académique ?')) {
      const response = await fetch(`/api/academic-years/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchYears()
      }
    }
  }

  return (
    <CrudTable
      title="Années Académiques"
      columns={['Année', 'Statut']}
      data={years}
      onAdd={addYear}
      onUpdate={updateYear}
      onDelete={deleteYear}
      formFields={[
        { name: 'year', label: 'Année' },
        { name: 'status', label: 'Statut' },
      ]}
    />
  )
}
