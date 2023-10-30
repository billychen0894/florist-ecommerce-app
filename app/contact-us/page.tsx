import Link from 'next/link';

const contactSection = [
  {
    title: 'Support',
    email: 'contact@blossomlane.com',
    phoneNumber: '+17781231234',
  },
  // add more ...
];

const locationsSection = [
  {
    locationName: 'Vancouver',
    address: '123 W 25th Ave. Vancouver, B.C., Canada V6N 3K4',
  },
  // add more...
];

export default function ContactUs() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Get in touch
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Have questions, suggestions, or need assistance with your floral
                needs? Feel free to reach out to us. We&apos;re here to help!
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {contactSection.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    {item.title}
                  </h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <Link
                          className="font-semibold text-secondary-500"
                          href={`mailto:${item.email}`}
                        >
                          {item.email}
                        </Link>
                      </dd>
                    </div>
                    <div className="mt-1">
                      <dt className="sr-only">Phone number</dt>
                      <dd>{item.phoneNumber}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Locations
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Explore our floral boutiques located in various neighborhoods,
                bringing fresh and vibrant blooms closer to you.
              </p>
            </div>
            {locationsSection.map((location, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8"
              >
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    {location.locationName}
                  </h3>
                  <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                    <p>{location.address}</p>
                  </address>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
