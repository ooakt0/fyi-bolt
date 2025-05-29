import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import RotatingCarousel from '../../components/services/RotatingCarousel';
import { Video } from 'lucide-react';

const StaticWebDevelopment: React.FC = () => {
  const navigate = useNavigate();

  const images = [
    { src: '/images/staticWebDevelopment.png', alt: 'Static Web Development' },
    { src: '/images/brandingNdesign.png', alt: 'Branding and Design' },
    { src: '/images/appPrototyping.png', alt: 'App Prototyping' },
    { src: '/images/seoDigitalMarketing.png', alt: 'SEO and Digital Marketing' },
  ];

  const offers = [
    { icon: <Video />, text: 'Custom Landing Pages' },
    { icon: <Video />, text: 'E-commerce Solutions' },
    { icon: <Video />, text: 'Portfolio Sites' },
    { icon: <Video />, text: 'Responsive Design' },
    { icon: <Video />, text: 'SEO-Ready Websites' },
  ];

  const steps = [
    'Contact us with your requirements.',
    'Receive a tailored proposal.',
    'Approve the design and development plan.',
    'Launch your website.',
  ];

  return (
    <>
      <Helmet>
        <title>Fund Your Idea | Static Web Development</title>
        <meta name="description" content="Custom landing pages, e-commerce, portfolio sites, responsive design, SEO-ready." />
      </Helmet>
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="container-custom mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold mb-4">Static Web Development</h1>
              <p className="text-lg mb-6">Custom landing pages, e-commerce, portfolio sites, responsive design, SEO-ready.</p>
              <button
                onClick={() => navigate('/services')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100"
              >
                Explore More Services
              </button>
            </div>
            <div className="md:w-1/3 mb-14">
              <RotatingCarousel images={images} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-7xl">
          {/* What We Offer */}
          <div className="py-[16px] px-[6px]">
            <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-500 to-purple-600 text-white`}
                >
                  <div className="text-4xl mb-4">{offer.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{offer.text}</h3>
                  <p className="text-sm">Delivering excellence in {offer.text.toLowerCase()}.</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="py-[16px] px-[6px]">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="flex flex-col space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <div className="text-blue-600 text-2xl font-bold">{index + 1}</div>
                  <div>
                    <h3 className="text-lg font-bold">Step {index + 1}</h3>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Video */}
          <div className="py-[16px] px-[6px] text-center">
            <h2 className="text-3xl font-bold mb-8">See It In Action</h2>
            <div className="relative w-full max-w-3xl mx-auto">
              <img
                src="/images/staticWebDevelopment.png"
                alt="Video Placeholder"
                className="rounded-lg shadow-lg"
              />
              <button className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-[4px] text-center">
          <button className="bg-white text-blue-600 px-[6px] py-[3px] rounded-lg shadow-lg hover:bg-gray-100">
            Request This Service
          </button>
        </div>
      </div>
    </>
  );
};

export default StaticWebDevelopment;
