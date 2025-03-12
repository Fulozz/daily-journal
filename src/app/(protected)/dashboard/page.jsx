"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import EntryCard from "@/components/entries/entry-card"
import EntryForm from "@/components/entries/entry-form"
import { getEntries, createEntry, deleteEntry, getUser } from "@/lib/api"

export default function DashboardPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [mounted, setMounted] = useState(false)

    // Adicione um estado para controlar o recarregamento
    const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Modifique o useEffect para depender do refreshTrigger
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
  }, [refreshTrigger])

  // Função para forçar o recarregamento dos dados
  const refreshEntries = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const fetchEntries = async () => {
    setIsLoading(true)
    const token = getCookie("token")
    try {
      const entriesData = await getEntries(token)
      setEntries(entriesData)
    } catch (error) {
      toast.error("Failed to fetch entries")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEntry = async (entryData) => {
    const token = getCookie("token")
      // Evita múltiplos envios
    if (isLoading) return
    try {
      const newEntry = await createEntry(token, entryData)
      toast.success("Entry added successfully")
      setEntries([newEntry, ...entries])
      setShowEntryForm(false)
      refreshEntries() // Recarrega os dados após adicionar
    } catch (error) {
      toast.error("Failed to add entry")
    }
  }

  const handleDeleteEntry = async (entryId) => {
    const token = getCookie("token")

    try {
      await deleteEntry(token, entryId)
      toast.success("Entry deleted successfully")
      setEntries(entries.filter((entry) => entry._id !== entryId))
      refreshEntries() // Recarrega os dados após adicionar
    } catch (error) {
      toast.error("Failed to delete entry")
    }
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
          {[1, 2, 3].map((i, index) => (
            <Card key={index} className="animate-pulse">
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
          {filteredEntries.map((entry, index) => (
            <EntryCard key={index} entry={entry} onDelete={handleDeleteEntry} />
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

