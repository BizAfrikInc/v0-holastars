"use client"

import { AlertCircle, CheckCircle, Facebook, Loader2, MapPin, Plus, Settings, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { SocialMediaApi } from "@/lib/api/social-media"
import { useAuthStore } from "@/store/authStore"

interface SocialMediaConnection {
  id: string
  platform: "google_business" | "facebook" | "yelp"
  platformAccountId: string
  platformAccountName: string
  isActive: boolean
  autoPostEnabled: boolean
  minRatingThreshold: string
  createdAt: string
}

const platformConfig = {
  google_business: {
    name: "Google Business",
    icon: MapPin,
    color: "bg-blue-500",
    description: "Connect your Google My Business account to automatically respond to reviews",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Share positive feedback as posts on your Facebook business page",
  },
  yelp: {
    name: "Yelp",
    icon: Star,
    color: "bg-red-500",
    description: "Integrate with your Yelp business profile for review management",
  },
}

export default function SocialMediaConnections() {
  const { registeredBusiness } = useAuthStore()
  const { toast } = useToast()
  const [connections, setConnections] = useState<SocialMediaConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const platforms = ["google_business", "facebook", "yelp"] as const;
  type Platform = typeof platforms[number]; // "google_business" | "facebook" | "yelp"
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("google_business");
  const [connectionForm, setConnectionForm] = useState({
    platformAccountId: "",
    platformAccountName: "",
    accessToken: "",
    refreshToken: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (registeredBusiness?.id) {
      fetchConnections()
    }
  }, [registeredBusiness?.id])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const { data: response } = await SocialMediaApi.getConnections(registeredBusiness!.id)
      if (response.success) {
        setConnections(response.data)
      }
    } catch (error) {
      console.error("Error fetching connections:", error)
      toast({
        title: "Error",
        description: "Failed to load social media connections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!selectedPlatform || !connectionForm.platformAccountId || !connectionForm.accessToken) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const { data: response } = await SocialMediaApi.connect(
        {
          platform: selectedPlatform,
          platformAccountId: connectionForm.platformAccountId,
          platformAccountName: connectionForm.platformAccountName || connectionForm.platformAccountId,
          accessToken: connectionForm.accessToken,
          refreshToken: connectionForm.refreshToken,
          autoPostEnabled: true,
          minRatingThreshold: "4",
        },
        registeredBusiness!.id,
      )

      if (response.success) {
        toast({
          title: "Success",
          description: `${platformConfig[selectedPlatform as keyof typeof platformConfig].name} account connected successfully`,
        })
        setConnectDialogOpen(false)
        setConnectionForm({
          platformAccountId: "",
          platformAccountName: "",
          accessToken: "",
          refreshToken: "",
        })
        setSelectedPlatform("google_business")
        fetchConnections()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error connecting account:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect social media account. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleAutoPost = async (connectionId: string, enabled: boolean) => {
    try {
      const { data: response } = await SocialMediaApi.updateConnection(connectionId, {
        autoPostEnabled: enabled,
      })

      if (response.success) {
        setConnections((prev) =>
          prev.map((conn) => (conn.id === connectionId ? { ...conn, autoPostEnabled: enabled } : conn)),
        )
        toast({
          title: "Settings Updated",
          description: `Auto-posting ${enabled ? "enabled" : "disabled"} successfully`,
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update auto-posting settings",
        variant: "destructive",
      })
    }
  }

  const handleUpdateMinRating = async (connectionId: string, minRating: string) => {
    try {
      const { data: response } = await SocialMediaApi.updateConnection(connectionId, {
        minRatingThreshold: minRating,
      })

      if (response.success) {
        setConnections((prev) =>
          prev.map((conn) => (conn.id === connectionId ? { ...conn, minRatingThreshold: minRating } : conn)),
        )
        toast({
          title: "Settings Updated",
          description: "Minimum rating threshold updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rating threshold",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async (connectionId: string, platformName: string) => {
    try {
      const { data: response } = await SocialMediaApi.disconnectAccount(connectionId)

      if (response.success) {
        setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))
        toast({
          title: "Account Disconnected",
          description: `${platformName} account has been disconnected successfully`,
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      })
    }
  }

  const getAvailablePlatforms = () => {
    const connectedPlatforms = connections.map((conn) => conn.platform)
    return Object.keys(platformConfig).filter((platform) => !connectedPlatforms.includes(platform)) as Platform[]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Connections</CardTitle>
          <CardDescription>Loading your social media connections...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Social Media Connections
        </CardTitle>
        <CardDescription>
          Connect your social media accounts to automatically share positive customer feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected Accounts */}
        {connections.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connected Accounts</h3>
            {connections.map((connection) => {
              const config = platformConfig[connection.platform]
              const IconComponent = config.icon

              return (
                <div key={connection.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-muted-foreground">{connection.platformAccountName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={connection.isActive ? "default" : "secondary"}>
                        {connection.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleDisconnect(connection.id, config.name)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`auto-post-${connection.id}`}>Auto-post feedback</Label>
                      <Switch
                        id={`auto-post-${connection.id}`}
                        checked={connection.autoPostEnabled}
                        onCheckedChange={(checked) => handleToggleAutoPost(connection.id, checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum rating to post</Label>
                      <Select
                        value={connection.minRatingThreshold}
                        onValueChange={(value) => handleUpdateMinRating(connection.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="5">5 Stars Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add New Connection */}
        {getAvailablePlatforms().length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAvailablePlatforms().map((platform) => {
                const config = platformConfig[platform as keyof typeof platformConfig]
                const IconComponent = config.icon

                return (
                  <Card key={platform} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">{config.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
                      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full" onClick={() => setSelectedPlatform(platform)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Connect {platformConfig[selectedPlatform as keyof typeof platformConfig]?.name}
                            </DialogTitle>
                            <DialogDescription>
                              Enter your account credentials to connect your social media account
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="accountId">Account ID *</Label>
                              <Input
                                id="accountId"
                                placeholder="Your account/page ID"
                                value={connectionForm.platformAccountId}
                                onChange={(e) =>
                                  setConnectionForm((prev) => ({
                                    ...prev,
                                    platformAccountId: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="accountName">Account Name</Label>
                              <Input
                                id="accountName"
                                placeholder="Display name for this account"
                                value={connectionForm.platformAccountName}
                                onChange={(e) =>
                                  setConnectionForm((prev) => ({
                                    ...prev,
                                    platformAccountName: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="accessToken">Access Token *</Label>
                              <Input
                                id="accessToken"
                                type="password"
                                placeholder="Your API access token"
                                value={connectionForm.accessToken}
                                onChange={(e) =>
                                  setConnectionForm((prev) => ({
                                    ...prev,
                                    accessToken: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="refreshToken">Refresh Token</Label>
                              <Input
                                id="refreshToken"
                                type="password"
                                placeholder="Refresh token (if applicable)"
                                value={connectionForm.refreshToken}
                                onChange={(e) =>
                                  setConnectionForm((prev) => ({
                                    ...prev,
                                    refreshToken: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleConnect} disabled={submitting} className="flex-1">
                                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Connect Account
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setConnectDialogOpen(false)}
                                disabled={submitting}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {connections.length === 0 && (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Social Media Connections</h3>
            <p className="text-muted-foreground mb-4">
              Connect your social media accounts to automatically share positive customer feedback
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
