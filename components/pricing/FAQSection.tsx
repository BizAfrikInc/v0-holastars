
const faqs = [
  {
    question: "Is there a free trial available?",
    answer: "Yes, all plans include a 7-day free trial. No credit card required to get started."
  },
  {
    question: "Can I change plans later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
  },
  {
    question: "How many team members can I add?",
    answer: "Team members are tied to the number of locations and departments. You can add as many as you want, but charges apply based on your plan tier."
  },
  {
    question: "Do I need technical knowledge to use Hola Stars?",
    answer: "Not at all! Our platform is designed to be user-friendly and intuitive, with no technical knowledge required."
  },
  {
    question: "What happens after my free trial ends?",
    answer: "You'll be prompted to select a plan to continue using Hola Stars. If you choose not to subscribe, your account will be limited but won't be deleted."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your account settings. Your service will continue until the end of your current billing period."
  },
];

const FAQSection = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to common questions about our pricing and plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
