import MainLayout from "@/layouts/MainLayout";
import FAQItem from "@/components/FAQItem";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const faqItems = [
    {
      question: "What documents do I need for Estidama certification?",
      answer: "Required documents vary based on the certification type (PBRS, PCRS, PVRS, or Public Realm). When you start your application on Green Guard, we'll provide a detailed checklist specific to your project type. This typically includes architectural plans, energy efficiency reports, water conservation strategies, and material specifications."
    },
    {
      question: "How does the AI feedback work?",
      answer: "Our AI analyzes your uploaded documents, comparing them against Estidama requirements and best practices. It then generates specific recommendations for improvement, highlighting areas that meet standards and pointing out where changes are needed. This pre-assessment helps you refine your submission before final review."
    },
    {
      question: "How long does the certification process take?",
      answer: "With Green Guard, most certifications can be completed in 4-6 weeks, compared to the traditional 3-4 month process. This includes document preparation, AI feedback cycles, and official review. Simple projects may be faster, while complex developments may take longer. Our dashboard shows real-time progress at each stage."
    },
    {
      question: "Can I get help from experts when preparing my application?",
      answer: "Yes! Green Guard provides a directory of approved consultants and firms specialized in Estidama certification. Through our platform, you can connect directly with these experts who can help prepare your documents or address specific requirements. Their expertise complements our AI feedback for the best results."
    },
    {
      question: "What happens if my application is rejected?",
      answer: "If your application doesn't meet the requirements, you'll receive detailed feedback explaining why. You can then make the necessary corrections and resubmit. Our AI pre-screening significantly reduces rejection rates by identifying issues before final submission. We're committed to helping you succeed."
    }
  ];

  return (
    <MainLayout>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
              Find answers to common questions about Green Guard and the certification process.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}

            <div className="mt-10 text-center">
              <p className="text-neutral-500 mb-4">Still have questions? Contact our support team.</p>
              <Button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
