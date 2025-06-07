import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Code, Video, Brush, Smartphone, FileText, Search } from 'lucide-react';

const services = [
  {
    icon: <Code className="h-8 w-8 text-primary-600" />,
    title: 'Static Web Development',
    description:
      'Build fast, responsive, and SEO-friendly static websites. Perfect for businesses looking to establish a strong online presence.',
    image: '/images/staticWebDevelopment.png',
    // route: 'static-web-development',
  },
  {
    icon: <Video className="h-8 w-8 text-primary-600" />,
    title: 'AI Video Creation',
    description:
      'Create engaging videos using AI-powered tools. Ideal for marketing campaigns and social media content.',
    image: '/images/aiVideoCreation.png',
    // route: 'ai-video-creation',
  },
  {
    icon: <Brush className="h-8 w-8 text-primary-600" />,
    title: 'Branding & Design',
    description:
      'Craft unique brand identities and stunning designs that resonate with your audience.',
    image: '/images/brandingNdesign.png',
    // route: 'branding-and-design',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary-600" />,
    title: 'App Prototyping',
    description:
      'Design and prototype mobile and web applications to bring your ideas to life.',
    image: '/images/appPrototyping.png',
    // route: 'app-prototyping',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary-600" />,
    title: 'Business Plan Writing',
    description:
      'Develop comprehensive business plans tailored to your startup’s needs.',
    image: '/images/businessPlan.png',
    // route: 'business-plan-writing',
  },
  {
    icon: <Search className="h-8 w-8 text-primary-600" />,
    title: 'SEO & Digital Marketing',
    description:
      'Boost your online presence with expert SEO strategies and digital marketing campaigns.',
    image: '/images/seoDigitalMarketing.png',
    // route: 'seo-digital-marketing',
  },
];

const Services: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Fund Your Idea</title>
        <meta name="description" content="Explore the services we offer to help bring your ideas to life." />
      </Helmet>
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
          <p className="text-gray-600">We offer expert solutions in SEO, digital marketing, branding, design, app prototyping, and business plan writing—helping your business stand out, grow, and succeed online.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-200 transition-transform transform hover:scale-105 cursor-pointer"
                // onClick={() => window.location.href = `/services/${service.route}`}
              >
                <img src={service.image} alt={service.title} className="w-full h-80 object-cover rounded-md mb-4" />
                <div className="mb-4 flex justify-center">{service.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
