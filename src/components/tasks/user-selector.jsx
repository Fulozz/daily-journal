"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { searchUsers } from "@/lib/api"
import { getCookie } from "cookies-next"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"

export default function UserSelector({ selectedUser, onUserSelect, onClear }) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query || query.length < 2) {
      setUsers([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const token = getCookie("token")
      const results = await searchUsers(token, query)
      setUsers(results)
    } catch (error) {
      console.error("Error searching users:", error)
      // Mock data for development
      setUsers([
        { _id: "1", name: "John Doe", email: "john@example.com" },
        { _id: "2", name: "Jane Smith", email: "jane@example.com" },
        { _id: "3", name: "Bob Johnson", email: "bob@example.com" },
      ])
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [])

  const handleSearch = (value) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col space-y-2">
      {selectedUser ? (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedUser.name}</span>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground" onClick={onClear}>
              <X className="h-3 w-3" />
              <span className="sr-only">Clear</span>
            </Button>
          </Badge>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{selectedUser ? selectedUser.name : "Select user..."}</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search users..." value={searchQuery} onValueChange={handleSearch} />
              {loading && <div className="py-6 text-center text-sm">Loading...</div>}
              {!loading && (
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user._id}
                        onSelect={() => {
                          onUserSelect(user)
                          setOpen(false)
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedUser?._id === user._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

