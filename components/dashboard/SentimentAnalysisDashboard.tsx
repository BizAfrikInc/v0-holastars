"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { SentimentAnalysis } from "@/lib/db/schema/sentiment-analysis"

interface SentimentStats {
  positive: number
  negative: number
  neutral: number
  total: number
}

interface SentimentAnalysisDashboardProps {
  businessId: string
}

export function SentimentAnalysisDashboard({ businessId }: SentimentAnalysisDashboardProps) {
  const [stats, setStats] = useState<SentimentStats>({ positive: 0, negative: 0, neutral: 0, total: 0 })
  const [negativeSentiments, setNegativeSentiments] = useState<SentimentAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSentimentData()
  }, [businessId])

  const fetchSentimentData = async () => {
    try {
      // TODO: Implement API endpoints for sentiment analysis
      // For now, using mock data
      setStats({ positive: 45, negative: 12, neutral: 23, total: 80 })
      setNegativeSentiments([])
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sentiment analysis data",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        <p className="text-muted-foreground">Monitor customer sentiment from feedback responses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Responses analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
            <div className="mt-2">
              <Progress value={stats.total > 0 ? (stats.positive / stats.total) * 100 : 0} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}% of responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            <div className="mt-2">
              <Progress value={stats.total > 0 ? (stats.negative / stats.total) * 100 : 0} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}% of responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            <div className="h-4 w-4 text-gray-600">-</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
            <div className="mt-2">
              <Progress value={stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}% of responses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="negative">Negative Sentiments</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Overall sentiment breakdown of analyzed responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Positive</span>
                  <span className="text-sm text-muted-foreground">{stats.positive} responses</span>
                </div>
                <Progress value={stats.total > 0 ? (stats.positive / stats.total) * 100 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Negative</span>
                  <span className="text-sm text-muted-foreground">{stats.negative} responses</span>
                </div>
                <Progress value={stats.total > 0 ? (stats.negative / stats.total) * 100 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Neutral</span>
                  <span className="text-sm text-muted-foreground">{stats.neutral} responses</span>
                </div>
                <Progress value={stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Negative Sentiments - Follow Up Required
              </CardTitle>
              <CardDescription>These responses require immediate attention and follow-up</CardDescription>
            </CardHeader>
            <CardContent>
              {negativeSentiments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No negative sentiments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {negativeSentiments.map((sentiment) => (
                    <div key={sentiment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive">
                          Negative - {Math.round(sentiment.confidence * 100)}% confidence
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {sentiment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      {sentiment.summary && <p className="text-sm">{sentiment.summary}</p>}
                      {sentiment.keywords && sentiment.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {sentiment.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Actionable insights from sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Overall Sentiment Health</h4>
                  <p className="text-sm text-muted-foreground">
                    {stats.total > 0 && stats.positive / stats.total > 0.7
                      ? "Your customers are generally satisfied with positive sentiment dominating responses."
                      : stats.total > 0 && stats.negative / stats.total > 0.3
                        ? "There's room for improvement - consider addressing the negative feedback patterns."
                        : "Your sentiment distribution appears balanced. Monitor trends over time."}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Action Items</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Follow up with customers who provided negative feedback</li>
                    <li>• Analyze common keywords in negative responses</li>
                    <li>• Leverage positive feedback for marketing testimonials</li>
                    <li>• Monitor sentiment trends over time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
