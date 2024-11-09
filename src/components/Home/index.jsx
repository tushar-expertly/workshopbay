import React from "react";
import Layout from "../layout";
// import Slider from "../slider/slider";
import startupPng from "../../Assets/startup.jpg";
// import OurExperts from '../OurExperts'
// import Testimonials from '../Testimonials'

function Home() {
  return (
    <Layout>
      <div class="py-16 bg-red-100">
        <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div class="md:5/12 lg:w-5/12">
              <img
                src={startupPng}
                alt="imagae"
                loading="lazy"
                width=""
                height=""
              />
            </div>
            <div class="md:7/12 lg:w-6/12">
              <h2 class="text-2xl text-gray-900 font-bold md:text-4xl">
                Discover Our Webinar Offerings
              </h2>
              <p class="mt-6 text-gray-600">
                At Workshopbay, we believe in the transformative impact of
                education. Our mission is to equip individuals and organizations
                around the world with high-quality online training programs that
                unleash potential and foster success.
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          {/* <p className="mt-4 text-gray-600">
        We provide exceptional features that will assist you in creating an outstanding
        website.
      </p> */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">
                Steering Your Skill Growth.
              </h3>
              <p className="mt-4 text-gray-600">
                Our team of skilled professionals and education experts curate a
                diverse range of online courses focused on fast and effective
                learning. We respect your time by providing microlearning
                modules that help you gain key skills in an efficient manner.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">
                Unforgettable Learning Journeys.
              </h3>
              <p className="mt-4 text-gray-600">
                Wave farewell to dull lectures and information overload. Our
                courses are crafted to be engaging and interactive. By
                leveraging cutting-edge technologies such as simulations,
                gamification, and AI-powered assessments, we offer a truly
                immersive learning experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">
                More Than Just Traditional Courses.
              </h3>
              <p className="mt-4 text-gray-600">
                We are dedicated to fostering a supportive learning environment.
                Connect with fellow learners in our vibrant online community,
                interact with instructors directly, and receive valuable
                insights from industry professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <Slider /> */}
    </Layout>
  );
}

export default Home;
