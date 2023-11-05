import Link from 'next/link';

const TermsOfUseList = [
  {
    title: 'Acceptance of Terms',
    content:
      'By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website.',
  },
  {
    title: 'Use of Our Website',
    content:
      'You may use our website for lawful purposes and in accordance with these Terms. You agree not to use our website in any way that violates applicable laws or regulations.',
  },
  {
    title: 'Intellectual Property',
    content:
      'All content on our website, including text, graphics, logos, images, and software, is the property of Flower Haven and is protected by intellectual property laws.',
  },
  {
    title: 'Privacy',
    content:
      'Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices concerning the collection and use of your personal information.',
  },
  {
    title: 'Disclaimer of Warranties',
    content:
      'Our website is provided "as is" and "as available" without any warranties of any kind, either expressed or implied. We do not warrant that our website will be error-free or uninterrupted.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'In no event shall Flower Haven or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from your use of our website.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify or replace these Terms at any time. Your continued use of our website after any such changes constitutes your acceptance of the new Terms.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions about these Terms, please contact us at contact@blossomlane.com.',
  },
];
const companyName = 'Blossom Lane';
const companyUrl = 'www.blossomLane.com';

export const dynamic = 'force-static';

export default function TermsOfUse() {
  return (
    <div className="mx-auto max-w-7xl my-16 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold mb-6">Terms of Use</h1>
      <div className="prose prose-sm text-gray-400">
        <p>
          Welcome to{' '}
          <Link
            href={process.env.APP_BASE_URL}
            className="text-primary-500 hover:underline font-semibold"
          >
            {companyName}
          </Link>
          !
        </p>

        <p>
          These Terms of Use (&quot;Terms&quot;) govern your use of our website
          (
          <Link
            href={process.env.APP_BASE_URL}
            className="text-primary-500 hover:text-primary-400 hover:underline font-semibold"
          >
            {companyUrl}
          </Link>
          ) and any related services provided by{' '}
          <span className="font-bold">{companyName}</span>. By accessing or
          using our website, you agree to comply with these Terms. Please read
          them carefully.
        </p>

        <ul className="mt-4 list-decimal">
          {TermsOfUseList.map((tos, idx) => (
            <div key={idx}>
              <li>{tos.title}</li>
              <p>{tos.content}</p>
            </div>
          ))}
        </ul>

        <p className="mt-4">
          Thank you for visiting{' '}
          <Link
            href={process.env.APP_BASE_URL}
            className="text-primary-500 hover:text-primary-400 hover:underline"
          >
            {companyName}
          </Link>
          !
        </p>
      </div>
    </div>
  );
}
