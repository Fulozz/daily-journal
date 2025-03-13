"use client"

import { useState, useEffect } from "react"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import EntryCard from "@/components/entries/entry-card"
import EntryForm from "@/components/entries/entry-form"
import { getEntries, createEntry, updateEntry, deleteEntry } from "@/lib/api"
import { set } from "date-fns"

export default function EntriesPage() {
  const { t } = useLanguage()
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    setMounted(true)
    fetchEntries()
  }, [refreshTrigger])

  const refreshEntries = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const fetchEntries = async () => {
    setIsLoading(true)
    const token = getCookie("token")
    try {
      const response = await getEntries(token)
      if (response) {
        setEntries(response)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, use mock data
        setEntries([
          {
            id: "1",
            title: "First day at work",
            content:
              "Today was my first day at the new job. Everyone was very welcoming and I'm excited to start this new chapter.",
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            id: "2",
            title: "Weekend trip planning",
            content:
              "Planning a weekend trip to the mountains. Need to pack hiking gear and check the weather forecast.",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "3",
            title: "New recipe attempt",
            content:
              "Tried a new pasta recipe today. It turned out pretty good! Next time I'll add more garlic and less salt.",
            createdAt: new Date().toISOString(),
          },
        ])
      } else {
        toast.error("Failed to fetch entries")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEntry = async (entryData) => {
    const token = getCookie("token")
    try {
      const response = await createEntry(token, entryData)
      if (response) {
        toast.success("Entry added successfully")
        setEntries([response, ...entries])
        setShowEntryForm(false)
        refreshEntries()
      }
    } catch (error) {
      console.error("Error adding entry:", error)
      if (error.response?.status === 404) {
        const newEntry = {
          id: Date.now().toString(),
          ...entryData,
          createdAt: new Date().toISOString(),
        }
        setEntries([newEntry, ...entries])
        toast.success("Entry added successfully")
        setShowEntryForm(false)
      } else {
        toast.error("Failed to add entry")
      }
    }
  }

  const handleUpdateEntry = async (entryData) => {
    const token = getCookie("token")
    try {
      const response = await updateEntry(token, editingEntry._id || editingEntry.id, entryData)
      if (response) {
        toast.success("Entry updated successfully")
        const updatedEntries = entries.map((entry) =>
          (entry._id || entry.id) === (editingEntry._id || editingEntry.id) ? { ...entry, ...entryData } : entry,
        )
        setEntries(updatedEntries)
        setEditingEntry(null)
        refreshEntries()
        setShowEntryForm(false)
      }
    } catch (error) {
      console.error("Error updating entry:", error)
      if (error.response?.status === 404) {
        const updatedEntries = entries.map((entry) =>
          (entry._id || entry.id) === (editingEntry._id || editingEntry.id) ? { ...entry, ...entryData } : entry,
        )
        setEntries(updatedEntries)
        toast.success("Entry updated successfully")
        setEditingEntry(null)
      } else {
        toast.error("Failed to update entry")
      }
    }
  }

  const handleDeleteEntry = async (entryId) => {
    const token = getCookie("token")
    try {
      await deleteEntry(token, entryId)
      toast.success("Entry deleted successfully")
      setEntries(entries.filter((entry) => (entry._id || entry.id) !== entryId))
      refreshEntries()
    } catch (error) {
      console.error("Error deleting entry:", error)
      if (error.response?.status === 404) {
        setEntries(entries.filter((entry) => (entry._id || entry.id) !== entryId))
        toast.success("Entry deleted successfully")
      } else {
        toast.error("Failed to delete entry")
      }
    }
  }

  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setShowEntryForm(true)
  }

  const handleCancelForm = () => {
    setShowEntryForm(false)
    setEditingEntry(null)
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("entries")}</h1>
        <Button onClick={() => setShowEntryForm(true)} disabled={showEntryForm}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addEntry")}
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("search")}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showEntryForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <EntryForm
              onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
              onCancel={handleCancelForm}
              initialData={editingEntry}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry._id || entry.id}
              entry={entry}
              onDelete={handleDeleteEntry}
              onEdit={handleEditEntry}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">{t("noEntries")}</p>
            <Button onClick={() => setShowEntryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addEntry")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

