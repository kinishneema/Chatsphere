import React from "react";
import { Link } from "react-router-dom";



const Landing = () => {
  return (
    <div className=" text-white h-screen">
      {/* Hero Section */}
      <section className="flex flex-col justify-center px-6 py-10">
        <h1 className="text-5xl font-bold">Welcome to <span className="text-blue-500">ChatSphere</span></h1>
        <p className="mt-4 text-lg max-w-lg">
          Experience seamless real-time messaging with speed, security, and simplicity.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link to="/signup">
          <button className="btn btn-primary bg-blue-500 text-white">Get Started With Us</button>
          </Link>
          <Link to="/login">
          <button className="btn btn-primary bg-white text-blue-500 hover:bg-gray-200">Login Now</button>
          </Link>
         

        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-2 text-gray-900 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl text-white font-bold">Why Choose <span className="text-blue-500">ChatSphere?</span></h2>
          <div className="grid md:grid-cols-3 gap-5 mt-5 md:mt-12">
            <div className="p-6 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Real-Time Messaging</h3>
              <p className="mt-2">Send and receive messages instantly with Socket.io!</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="mt-2">Keep your account safe with encrypted passwords and secure authentication.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">User-Friendly</h3>
              <p className="mt-2">Effortlessly navigate a seamless chat experience with a user-friendly and responsive interface.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 text-center bg-gray-900 text-gray-300">
        <p>&copy; Made with Hardwork, Hit & Trial</p>
      </footer>
    </div>
  );
};

export default Landing;
