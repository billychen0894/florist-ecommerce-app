const faqs = [
  {
    question: 'What types of flowers are available?',
    answer:
      'We offer a wide variety of flowers, including roses, lilies, tulips, sunflowers, and more. You can explore our selection and choose the perfect blooms for your occasion.',
  },
  {
    question: 'Can I customize my flower arrangement?',
    answer:
      "Absolutely! We offer customization options to help you create a unique and personalized flower arrangement. Contact our team, and we'll bring your floral vision to life.",
  },
  {
    question: 'How can I track my flower delivery?',
    answer:
      "Once your order is on its way, we'll provide you with a tracking number. You can use this number to track the status and delivery of your beautiful blooms.",
  },
  {
    question: 'What is your return policy?',
    answer:
      "We strive for your complete satisfaction. If you're not satisfied with your order, please contact us within [insert timeframe] to discuss our return and refund policy.",
  },
];

export default function Faq() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Can’t find the answer you’re looking for? Reach out to our{' '}
              <a
                href="/contact-us"
                className="font-semibold text-primary-500 hover:text-primary-400"
              >
                customer support
              </a>{' '}
              team.
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
