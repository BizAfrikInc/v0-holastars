import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Blog = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-holastars-light to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Resources to Help You <span className="hero-gradient-text">Grow</span></h1>
            <p className="text-lg text-gray-700 mb-8">
              Insights, guides, and expert advice on reputation management, customer feedback, and business growth.
            </p>

            <div className="relative max-w-xl mx-auto">
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-4 pr-12 py-6 rounded-full border-gray-200"
              />
              <Button className="absolute right-1 top-1 rounded-full w-10 h-10 p-0 flex items-center justify-center btn-gradient">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gray-200 h-64 lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800"
                  alt="Featured Article"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-sm font-medium text-holastars-primary mb-2">Featured</div>
                <h2 className="text-2xl lg:text-3xl font-semibold mb-4">5 Ways to Turn Negative Reviews into Growth Opportunities</h2>
                <p className="text-gray-600 mb-6">
                  Learn how to effectively respond to and learn from negative feedback, turning potential setbacks into valuable opportunities for business growth and improvement.
                </p>
                <div className="mt-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">May 2, 2023 • 8 min read</p>
                    </div>
                  </div>
                  <Button className="btn-gradient">Read Article</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList>
                <TabsTrigger value="all">All Articles</TabsTrigger>
                <TabsTrigger value="reputation">Reputation Management</TabsTrigger>
                <TabsTrigger value="customer">Customer Experience</TabsTrigger>
                <TabsTrigger value="growth">Business Growth</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reputation" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles
                  .filter(article => article.category === "Reputation Management")
                  .map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="customer" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles
                  .filter(article => article.category === "Customer Experience")
                  .map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="growth" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles
                  .filter(article => article.category === "Business Growth")
                  .map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles
                  .filter(article => article.category === "Technology")
                  .map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-holastars-primary text-holastars-primary hover:bg-holastars-primary hover:text-white">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-holastars-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest reputation management tips, tricks, and insights delivered straight to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-6"
              />
              <Button className="btn-gradient whitespace-nowrap">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

// Article Card Component
const ArticleCard = ({ article }: { article: ArticleType }) => {
  return (
    <Card className="overflow-hidden hover-card-effect">
      <div className="aspect-video bg-gray-200">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pt-6">
        <div className="text-sm font-medium text-holastars-primary mb-2">{article.category}</div>
        <CardTitle className="text-xl">{article.title}</CardTitle>
        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
          <div>
            <p className="text-sm font-medium">{article.author}</p>
            <p className="text-xs text-gray-500">{article.date} • {article.readTime}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${article.id}`} className="text-holastars-primary hover:text-holastars-secondary font-medium text-sm flex items-center">
          Read More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Data types and mock data
type ArticleType = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
};

const articles: ArticleType[] = [
  {
    id: "1",
    title: "The Psychology Behind Customer Reviews",
    excerpt: "Understanding how psychology influences customer reviews and how to use this knowledge to improve your business.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
    category: "Reputation Management",
    author: "Michael Chen",
    date: "Apr 28, 2023",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "7 Key Metrics to Track in Your Reputation Management Strategy",
    excerpt: "Learn which metrics matter most when measuring the effectiveness of your reputation management efforts.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=800",
    category: "Reputation Management",
    author: "David Rodriguez",
    date: "Apr 15, 2023",
    readTime: "7 min read"
  },
  {
    id: "3",
    title: "How to Create a Customer Feedback Loop That Drives Growth",
    excerpt: "Implement a system that turns customer feedback into actionable insights and continuous improvement.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800",
    category: "Customer Experience",
    author: "Amara Okafor",
    date: "Apr 10, 2023",
    readTime: "6 min read"
  },
  {
    id: "4",
    title: "Local SEO and Online Reviews: The Ultimate Guide",
    excerpt: "Discover how online reviews impact your local SEO and how to optimize your strategy for better visibility.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    category: "Business Growth",
    author: "Sarah Johnson",
    date: "Mar 28, 2023",
    readTime: "9 min read"
  },
  {
    id: "5",
    title: "AI in Customer Feedback Analysis: Current Trends and Future Possibilities",
    excerpt: "Explore how artificial intelligence is revolutionizing the way businesses analyze and act on customer feedback.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800",
    category: "Technology",
    author: "Michael Chen",
    date: "Mar 15, 2023",
    readTime: "8 min read"
  },
  {
    id: "6",
    title: "Building Trust in the Digital Age: A Case Study of Top Brands",
    excerpt: "Learn from successful brands that have mastered the art of building customer trust in an increasingly digital world.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=800",
    category: "Business Growth",
    author: "David Rodriguez",
    date: "Mar 5, 2023",
    readTime: "10 min read"
  },
];

export default Blog;
