'use client'
import { Search } from 'lucide-react';
import Link from "next/link"
import { useState } from "react"
import CTASection from '@/components/sections/CTASection';
import FAQSection from '@/components/sections/FAQSection';

// FAQ categories and questions
const faqCategories = [
  {
    id: 'general',
    title: 'General Questions',
    description: 'Understanding the Platform',
    faqs: [
      {
        question: 'What is the Feedback, Reviews & Reputation Management System?',
        answer: 'Our system is an all-in-one platform that helps businesses collect customer feedback, manage online reviews across multiple platforms, analyze sentiment using AI, and improve overall reputation through strategic response and amplification of positive experiences.'
      },
      {
        question: 'How does your system help improve my business reputation?',
        answer: 'We help you gather authentic feedback, respond promptly to reviews, showcase positive experiences across multiple channels, and gain insights into customer sentiment. This comprehensive approach leads to higher customer satisfaction, better online ratings, and increased trust in your brand.'
      },
      {
        question: 'Can I manage multiple locations and departments from one account?',
        answer: 'Yes! Our Premium plan supports up to 3 business locations, while our Enterprise and Agency plans allow for unlimited locations and departments, all manageable from a single dashboard with customizable access controls.'
      },
      {
        question: 'Which industries is this platform best suited for?',
        answer: 'Our platform is versatile and works across various industries including retail, hospitality, healthcare, professional services, home services, and more. Any business that values customer feedback and online reputation can benefit from our tools.'
      }
    ]
  },
  {
    id: 'feedback',
    title: 'Feedback Collection',
    description: 'How Feedback Works',
    faqs: [
      {
        question: 'How do I collect feedback from my customers?',
        answer: 'You can collect feedback through multiple channels: email campaigns, SMS messages, QR codes placed in your business, web widgets on your website, or direct links. Our system makes it easy to create and distribute feedback requests through any of these channels.'
      },
      {
        question: 'Which channels can I use for feedback (Email, SMS, WhatsApp, QR Codes)?',
        answer: 'Depending on your plan, you can use Email (all plans), SMS (Premium and above), WhatsApp (Enterprise and above), and QR codes (all plans). Each channel is fully customizable to match your brand voice and feedback needs.'
      },
      {
        question: 'Can I customize the feedback templates and messages?',
        answer: 'Absolutely! You can fully customize all feedback request templates with your branding, questions, and messaging. We offer both pre-designed templates to get you started quickly and complete customization options for a tailored approach.'
      }
    ]
  },
  {
    id: 'reviews',
    title: 'Reviews & Reputation Management',
    description: 'Managing Online Reviews',
    faqs: [
      {
        question: 'Can I manage reviews from Google, Facebook, Yelp, and other platforms in one place?',
        answer: 'Yes, our platform aggregates reviews from all major review sites including Google, Facebook, Yelp, TripAdvisor, and industry-specific sites. You can view, respond to, and analyze all reviews from a single dashboard.'
      },
      {
        question: 'How does the system alert me about negative reviews?',
        answer: 'You can set up real-time alerts for reviews that meet certain criteria, such as those below a specific star rating. Notifications can be sent via email, SMS, or directly in the platform, ensuring you never miss an opportunity to address customer concerns quickly.'
      },
      {
        question: 'Can I respond to customer reviews directly through the platform?',
        answer: 'Absolutely! You can draft, preview, and publish responses to reviews across all connected platforms directly from our dashboard. This saves you time and ensures consistent brand voice in all your communications.'
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Plans, Pricing, and Billing',
    description: 'Subscription Details',
    faqs: [
      {
        question: 'What are the different subscription plans you offer?',
        answer: 'We offer four main plans: Basic (for small businesses), Premium (for growing businesses), Enterprise (for larger organizations), and Agency (for companies managing multiple clients). Each plan includes different features and capabilities to suit businesses at various stages.'
      },
      {
        question: 'How does billing work (monthly, annual, semi-annual)?',
        answer: 'We offer both monthly and annual billing options. Annual plans come with a significant discount (typically 10% savings). You can choose your preferred billing cycle during signup or change it later from your account settings.'
      },
      {
        question: 'Do you offer a free trial?',
        answer: 'Yes, we offer a 14-day free trial on our Basic and Premium plans so you can experience the platform before committing. No credit card is required to start your trial.'
      }
    ]
  },
  {
    id: 'tech',
    title: 'Technical Support & Administration',
    description: 'Help and Management',
    faqs: [
      {
        question: 'How can I contact support if I have issues?',
        answer: 'Support options vary by plan. Basic plans include community support, Premium plans add dedicated email support, while Enterprise and Agency plans include priority support via both phone and email with faster response times.'
      },
      {
        question: 'What kind of onboarding help do you provide?',
        answer: 'All plans include access to our knowledge base and video tutorials. Premium plans add email onboarding assistance, while Enterprise and Agency plans include personalized onboarding sessions with a dedicated account manager to ensure your team gets maximum value from our platform.'
      },
      {
        question: 'Is my customer data GDPR-compliant?',
        answer: 'Yes, our platform is fully GDPR-compliant. We implement strict data protection measures, allow for data export and deletion requests, and maintain transparent data processing practices. Your customer data is always handled with the utmost security and privacy.'
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqCategories.flatMap(category => {
    return category.faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || activeCategory === category.id;
      return matchesSearch && matchesCategory;
    }).map(faq => ({ ...faq, category: category.id }));
  });

  return (
    <section
    >
      <div className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked
            <span className="hero-gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform, features, and how we can help your business grow.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand text-white'
                : 'bg-accent hover:bg-accent/80 text-foreground'
            }`}
          >
            All Questions
          </button>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-brand text-white'
                  : 'bg-accent hover:bg-accent/80 text-foreground'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Display FAQs */}
        <div className="max-w-3xl mx-auto">
          {searchQuery && (
            <p className="mb-6 text-muted-foreground">
              {filteredFAQs.length === 0
                ? `No questions found for "${searchQuery}"`
                : `Found ${filteredFAQs.length} ${
                  filteredFAQs.length === 1 ? 'result' : 'results'
                } for "${searchQuery}"`
              }
            </p>
          )}

          {filteredFAQs.length > 0 ? (
            <FAQSection
              title={`Search Results for "${searchQuery}"`}
              subtitle="Here are the questions that match your search."
              items={filteredFAQs}
            />
          ) : (
            activeCategory === 'all' ? (
              faqCategories.map((category) => (
                <div key={category.id} className="mb-12">
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground mb-6">{category.description}</p>
                  <FAQSection
                    title={category.title}
                    subtitle={category.description}
                    items={category.faqs}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p>No questions found. Please try another search or category.</p>
              </div>
            )
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Reach out to us for personalized assistance with any questions or issues you may have.
          </p>
          <Link
            href="/contact"
            className="btn btn-primary btn-lg"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <CTASection
        title="Ready to Transform Your Customer Feedback Into Growth?"
        subtitle="Join thousands of businesses using our platform to build stronger customer relationships."
        buttonText="Get Started Today"
        buttonLink="/contact"
      />
    </section>
  );
};

export default FAQ;
