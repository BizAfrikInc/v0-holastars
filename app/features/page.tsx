import { BarChart3, BookOpen, BookUser, CheckCircle, CircleCheck, CirclePlus, Gift, ListCheck, Mail, MessageSquare, Share2, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Features = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand/10 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6">Powerful Features to <span className="hero-gradient-text">Grow Your Business</span></h1>
            <p className="text-lg text-gray-700 mb-8">
              Everything you need to collect customer feedback, manage online reviews, and build a sterling reputation that drives growth.
            </p>
            <Button size="lg" className="btn-gradient">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Categories Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="feedback" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 h-auto p-1 bg-gray-100 rounded-lg w-full max-w-2xl">
                <TabsTrigger value="feedback" className="px-2 py-3 text-xs md:text-sm text-center">
                  Feedback Collection
                </TabsTrigger>
                <TabsTrigger value="reviews" className="px-2 py-3 text-xs md:text-sm text-center">
                  Review Management
                </TabsTrigger>
                <TabsTrigger value="automation" className="px-2 py-3 text-xs md:text-sm text-center">
                  Automation & AI
                </TabsTrigger>
                <TabsTrigger value="business" className="px-2 py-3 text-xs md:text-sm text-center">
                  Business Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="feedback" className="mt-6">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Comprehensive Feedback Collection</h2>
                  <p className="text-gray-700 mb-6">
                    Collect valuable customer feedback through multiple channels, making it effortless for customers to share their experiences and for you to gain insights.
                  </p>
                  <ul className="space-y-4">
                    {feedbackFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-brand mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <video
                    autoPlay
                    muted
                    loop
                    className="rounded-lg w-full h-auto"
                    poster="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800"
                  >
                    <source src="/api/placeholder/800/600" type="video/mp4" />
                    <img
                      src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800"
                      alt="Feedback Collection Dashboard"
                      className="rounded-lg w-full h-auto"
                    />
                  </video>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {feedbackCards.map((card, index) => (
                  <Card key={index} className="hover-card-effect">
                    <CardContent className="pt-6">
                      <div className="bg-gradient-to-r from-brand to-brand-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <card.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Streamlined Review Management</h2>
                  <p className="text-gray-700 mb-6">
                    Monitor, respond to, and showcase reviews from all major platforms in one centralized dashboard, saving you time and improving your online presence.
                  </p>
                  <ul className="space-y-4">
                    {reviewFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-brand mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <video
                    autoPlay
                    muted
                    loop
                    className="rounded-lg w-full h-auto"
                    poster="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800"
                  >
                    <source src="/api/placeholder/800/600" type="video/mp4" />
                    <img
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800"
                      alt="Review Management Dashboard"
                      className="rounded-lg w-full h-auto"
                    />
                  </video>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {reviewCards.map((card, index) => (
                  <Card key={index} className="hover-card-effect">
                    <CardContent className="pt-6">
                      <div className="bg-gradient-to-r from-brand to-brand-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <card.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Intelligent Automation & AI</h2>
                  <p className="text-gray-700 mb-6">
                    Save time and improve results with smart automation tools that handle routine tasks and AI that provides actionable insights from your customer feedback.
                  </p>
                  <ul className="space-y-4">
                    {automationFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-brand mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <video
                    autoPlay
                    muted
                    loop
                    className="rounded-lg w-full h-auto"
                    poster="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800"
                  >
                    <source src="/api/placeholder/800/600" type="video/mp4" />
                    <img
                      src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800"
                      alt="Automation Dashboard"
                      className="rounded-lg w-full h-auto"
                    />
                  </video>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {automationCards.map((card, index) => (
                  <Card key={index} className="hover-card-effect">
                    <CardContent className="pt-6">
                      <div className="bg-gradient-to-r from-brand to-brand-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <card.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-6">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Essential Business Tools</h2>
                  <p className="text-gray-700 mb-6">
                    Manage your entire reputation strategy with powerful business tools designed for efficiency, scalability, and comprehensive reporting.
                  </p>
                  <ul className="space-y-4">
                    {businessFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-brand mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <video
                    autoPlay
                    muted
                    loop
                    className="rounded-lg w-full h-auto"
                    poster="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
                  >
                    <source src="/api/placeholder/800/600" type="video/mp4" />
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
                      alt="Business Tools Dashboard"
                      className="rounded-lg w-full h-auto"
                    />
                  </video>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {businessCards.map((card, index) => (
                  <Card key={index} className="hover-card-effect">
                    <CardContent className="pt-6">
                      <div className="bg-gradient-to-r from-brand to-brand-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <card.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-brand/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8">Seamless Integrations</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            Hola Stars integrates with the tools and platforms you already use, making it easy to incorporate into your existing workflow.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {['Google', 'Facebook', 'Yelp', 'Zapier', 'Salesforce', 'HubSpot', 'Mailchimp', 'Shopify', 'Slack', 'Zoom', 'Stripe', 'WordPress'].map((integration, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 h-24 flex items-center justify-center hover-card-effect">
                <span className="font-medium text-gray-800">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-brand to-brand-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6">Ready to Transform Your Reputation?</h2>
            <p className="text-lg mb-8">
              Join thousands of businesses using Hola Stars to collect feedback, manage reviews, and grow their reputation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-brand hover:bg-gray-100">
                Book a Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// Feature data
const feedbackFeatures = [
  {
    title: "Multi-channel Feedback Collection",
    description: "Collect feedback via email, SMS, WhatsApp, QR codes, and embedded forms to reach customers where they are."
  },
  {
    title: "Customizable Feedback Forms",
    description: "Create branded feedback forms with your colors, logo, and tailored questions for each customer segment."
  },
  {
    title: "Smart Routing",
    description: "Automatically direct positive feedback to review sites and negative feedback to your team for resolution."
  },
  {
    title: "NPS, CSAT, and CES Surveys",
    description: "Use industry-standard metrics to measure customer satisfaction and track improvements over time."
  }
];

const feedbackCards = [
  {
    title: "Customer Journey Mapping",
    description: "Track feedback across the entire customer journey to identify areas of excellence and opportunities for improvement.",
    icon: BookUser
  },
  {
    title: "Feedback Analytics",
    description: "Turn feedback data into actionable insights with powerful analytics and sentiment analysis tools.",
    icon: CircleCheck
  },
  {
    title: "In-moment Feedback",
    description: "Capture feedback at critical touchpoints when the experience is fresh in your customers' minds.",
    icon: CirclePlus
  }
];

const reviewFeatures = [
  {
    title: "Unified Review Dashboard",
    description: "Monitor and respond to reviews from Google, Facebook, Yelp, and 50+ other platforms in one place."
  },
  {
    title: "Review Response Templates",
    description: "Save time with customizable templates for common review responses while maintaining a personal touch."
  },
  {
    title: "Review Alerts",
    description: "Receive instant notifications of new reviews so you can respond promptly to customer feedback."
  },
  {
    title: "Review Widgets",
    description: "Showcase your best reviews on your website with customizable widgets that update automatically."
  }
];

const reviewCards = [
  {
    title: "Competitor Benchmarking",
    description: "Track your online reputation against competitors and set goals to outperform them.",
    icon: Star
  },
  {
    title: "Review Generation",
    description: "Turn happy customers into positive reviews with our streamlined review request process.",
    icon: MessageSquare
  },
  {
    title: "Review Insights",
    description: "Identify trends and common themes in your reviews to understand what customers love and what needs improvement.",
    icon: BookOpen
  }
];

const automationFeatures = [
  {
    title: "Smart Review Request Timing",
    description: "Automatically send review requests at the optimal time to maximize response rates."
  },
  {
    title: "Automated Email Campaigns with Analytics",
    description: "Set up automated email sequences and track their performance with detailed analytics."
  },
  {
    title: "Automated Social Media Posting",
    description: "Automatically post your best reviews to social media platforms to maximize reach."
  },
  {
    title: "AI Response Suggestions",
    description: "Get AI-powered suggestions for review responses that maintain your brand voice."
  }
];

const automationCards = [
  {
    title: "Smart Tagging",
    description: "Automatically categorize feedback by topic, sentiment, location, or custom tags for easier analysis.",
    icon: ListCheck
  },
  {
    title: "Automated Email Campaigns",
    description: "Create sophisticated email campaigns that nurture customers and drive more positive reviews.",
    icon: Mail
  },
  {
    title: "Social Media Automation",
    description: "Automatically share your best reviews across all your social media channels.",
    icon: Share2
  }
];

const businessFeatures = [
  {
    title: "Team Leaderboards",
    description: "Motivate your team with performance leaderboards that track individual and team achievements."
  },
  {
    title: "Reward and Gift Campaigns",
    description: "Create incentive programs and gift campaigns to encourage customer feedback and loyalty."
  },
  {
    title: "Advanced Analytics and Competitor Insights",
    description: "Get detailed insights into your reputation performance and benchmark against competitors."
  },
  {
    title: "White Label Solutions",
    description: "Offer reputation management under your own brand with our fully customizable white label platform."
  }
];

const businessCards = [
  {
    title: "Team Leaderboards",
    description: "Gamify performance with competitive leaderboards that motivate your team to excel.",
    icon: Trophy
  },
  {
    title: "Reward Campaigns",
    description: "Create custom reward programs to incentivize positive customer interactions and feedback.",
    icon: Gift
  },
  {
    title: "Advanced Analytics",
    description: "Deep dive into performance metrics with comprehensive analytics and reporting tools.",
    icon: BarChart3
  }
];

export default Features;
