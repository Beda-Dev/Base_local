import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"
import { useState } from "react"

interface CrudTableProps {
  title: string
  columns: string[]
  data: any[]
  onAdd: (data: any) => void
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
  formFields: { name: string; label: string; type?: string }[]
}

export function CrudTable({ 
  title, 
  columns, 
  data, 
  onAdd, 
  onUpdate, 
  onDelete, 
  formFields 
}: CrudTableProps) {
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      onUpdate(editId, formData)
    } else {
      onAdd(formData)
    }
    setOpen(false)
    setFormData({})
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={() => setOpen(true)}>Ajouter</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (                                                                  
                <TableCell key={column}>{item[column.toLowerCase()]}</TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditId(item.id)
                      setFormData(item)
                      setOpen(true)
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier" : "Ajouter"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name}>{field.label}</label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">{editId ? "Modifier" : "Ajouter"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
