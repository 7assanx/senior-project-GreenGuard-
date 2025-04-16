import MainLayout from "@/layouts/MainLayout";

export default function About() {
  return (
    <MainLayout>
      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Simplifying Sustainable Certification
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <img
                  className="w-full rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Team of professionals in sustainable building"
                />
              </div>
              <div className="md:w-1/2 md:pl-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">What Is Green Guard?</h3>
                <p className="text-neutral-700 mb-4">
                  Green Guard is a smart certification platform designed to simplify the Estidama Pearl Rating System process for buildings, communities, and villas in the UAE.
                </p>
                <p className="text-neutral-700 mb-4">
                  Our platform combines AI-powered document analysis with expert support to guide you through every step of the certification journey.
                </p>
                <p className="text-neutral-700">
                  Whether you're seeking Pearl Building Rating certification, Public Realm Rating, or Pearl Villa Rating, Green Guard streamlines the entire process from application to approval.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">About the Estidama Pearl Rating System</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-primary-dark mb-3">Understanding Pearl Ratings</h4>
                  <p className="text-neutral-700 mb-3">
                    The Pearl Rating System is a sustainability framework used in the UAE to evaluate buildings, communities, and public spaces based on their environmental performance.
                  </p>
                  <p className="text-neutral-700">
                    Each certification type focuses on different aspects of sustainable development, from energy efficiency to community planning.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-dark mb-3">Rating Categories</h4>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                      <span><strong>PCRS:</strong> For large-scale communities and urban planning</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                      <span><strong>Public Realm:</strong> For outdoor public spaces, parks, and streets</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                      <span><strong>PBRS:</strong> For individual buildings including offices and apartments</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-primary mt-1 mr-2"></i>
                      <span><strong>PVRS:</strong> Specifically for private villas and residential homes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
