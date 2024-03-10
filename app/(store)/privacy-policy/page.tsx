import Link from 'next/link';

export const dynamic = 'force-static';

export default function PrivacyPolicy() {
  const companyName = 'Blossom Lane';
  const companyUrl = 'www.blossomLane.com';

  return (
    <div className="mx-auto max-w-7xl my-16 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-gray-400">
        <p>
          This Privacy Policy describes how {companyName} collects, uses, and
          shares your personal information when you use our website (
          <Link
            href={process.env.APP_BASE_URL}
            className="text-primary-500 hover:text-primary-400 hover:underline font-semibold"
          >
            {companyUrl}
          </Link>
          ) and our related services. Please read this policy carefully to
          understand our practices regarding your personal information.
        </p>

        <p>
          By using our website and services, you agree to the terms of this
          Privacy Policy. If you do not agree with our practices, please do not
          use our website or services.
        </p>

        <h2 className="mt-4 text-xl font-semibold">Information We Collect</h2>
        <p>
          We may collect various types of information from you, including but
          not limited to:
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>Your name, email address, and contact information.</li>
          <li>Information about your orders and transactions.</li>
          <li>Payment information, such as credit card details.</li>
          <li>Your preferences and communication preferences.</li>
        </ul>

        <h2 className="mt-4 text-xl font-semibold">
          How We Use Your Information
        </h2>
        <p>
          We use the information we collect for various purposes, including but
          not limited to:
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>Processing your orders and transactions.</li>
          <li>Providing customer support and responding to your inquiries.</li>
          <li>Improving our website and services.</li>
          <li>Marketing and promoting our products and services.</li>
        </ul>

        <h2 className="mt-4 text-xl font-semibold">Information Sharing</h2>
        <p>
          We may share your information with third parties for various purposes,
          including order processing, payment processing, and marketing. We take
          measures to ensure that your information is protected when shared with
          third parties.
        </p>

        <h2 className="mt-4 text-xl font-semibold">Security</h2>
        <p>
          We take security measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction.
        </p>

        <p>
          Thank you for choosing{' '}
          <Link
            href={process.env.APP_BASE_URL}
            className="text-primary-500 hover:text-primary-400 hover:underline"
          >
            {companyName}
          </Link>
          ! If you have any questions or concerns about our Privacy Policy or
          practices, please contact us at{' '}
          <a href={`mailto:contact@${companyUrl}`} className="text-primary-500">
            contact@{companyUrl}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
