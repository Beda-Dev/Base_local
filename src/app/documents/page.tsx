import { CrudTable } from "@/components/crud-table"
import { useState, useEffect } from "react"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const response = await fetch('/api/documents')
    const data = await response.json()
    setDocuments(data)
  }

  const addDocument = async (data) => {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchDocuments()
    }
  }

  const updateDocument = async (id, data) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      fetchDocuments()
    }
  }

  const deleteDocument = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchDocuments()
      }
    }
  }

  return (
    <CrudTable
      title="Documents"
      columns={['Nom', 'Type', 'Date']}
      data={documents}
      onAdd={addDocument}
      onUpdate={updateDocument}
      onDelete={deleteDocument}
      formFields={[
        { name: 'file_name', label: 'Nom du fichier' },
        { name: 'file_type', label: 'Type de fichier' },
        { name: 'created_at', label: 'Date de création' },
      ]}
    />
  )
}
