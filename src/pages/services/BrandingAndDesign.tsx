import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const BrandingAndDesign: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Fund Your Idea | Branding and Design</title>
        <meta name="description" content="Creative branding and design services to make your idea stand out." />
      </Helmet>
      <div className="relative pt-32 pb-12 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="mb-8">
            <Link
              to="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (location.key !== 'default') {
                  navigate(-1);
                } else {
                  navigate('/services');
                }
              }}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              ← Back to services
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branding & Design</h1>
          <p className="text-gray-600">Placeholder content for Branding & Design service.</p>
        </div>
      </div>
    </>
  );
};

export default BrandingAndDesign;
