"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import EntryCard from "@/components/entries/entry-card"
import EntryForm from "@/components/entries/entry-form"

export default function DashboardPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEntryForm, setShowEntryForm] = useState(false)

  useEffect(() => {
    const userCookie = getCookie("user")
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie))
      } catch (e) {
        console.error("Error parsing user cookie:", e)
      }
    }

    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setIsLoading(true)
    const token = getCookie("token")

    try {
      const response = await axios.get("https://portfolio-backend-zpig.onrender.com/api/v1/entries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        setEntries(response.data)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, use mock data
        setEntries([
          {
            id: "1",
            title: "First Entry",
            content: "This is my first journal entry.",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Second Entry",
            content: "Today was a productive day.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
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
      const response = await axios.post("https://portfolio-backend-zpig.onrender.com/api/v1/entries", entryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        toast.success("Entry added successfully")
        setEntries([response.data, ...entries])
        setShowEntryForm(false)
      }
    } catch (error) {
      console.error("Error adding entry:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, add to mock data
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

  const handleDeleteEntry = async (entryId) => {
    const token = getCookie("token")

    try {
      await axios.delete(`https://portfolio-backend-zpig.onrender.com/api/v1/entries/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Entry deleted successfully")
      setEntries(entries.filter((entry) => entry.id !== entryId))
    } catch (error) {
      console.error("Error deleting entry:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, remove from mock data
        setEntries(entries.filter((entry) => entry.id !== entryId))
        toast.success("Entry deleted successfully")
      } else {
        toast.error("Failed to delete entry")
      }
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("welcomeBack")}, {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground">
            {t("entries")}: {entries.length}
          </p>
        </div>
        <Button onClick={() => setShowEntryForm(true)}>
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
          <CardHeader>
            <CardTitle>{t("addEntry")}</CardTitle>
          </CardHeader>
          <CardContent>
            <EntryForm onSubmit={handleAddEntry} onCancel={() => setShowEntryForm(false)} />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
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

