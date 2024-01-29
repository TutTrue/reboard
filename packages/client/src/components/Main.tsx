import React from 'react'
import Link from 'next/link'

export default function Main() {
  return (
    <>
      <h1 className="text-5xl font-bold text-center mt-8">Your Ultimate Project Collaboration Hub</h1>

      <div className="container mx-auto my-8">

        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Revolutionize Your Work, Simplify Your Collaboration</h2>
          <p className="text-gray-700">ReBoard is not just a platform; it's a dynamic workspace that empowers teams to collaborate seamlessly, manage projects effortlessly, and achieve unprecedented productivity. Step into a new era of project management with ReBoard.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">Intuitive Kanban Boards</h3>
            <p className="text-gray-700">Visualize your projects with ease using our intuitive Kanban boards. Streamline your workflow, track progress, and keep everyone on the same page, whether you're in the office or working remotely.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">Collaborative Task Management</h3>
            <p className="text-gray-700">Foster teamwork with our powerful task management tools. Assign tasks, set deadlines, and communicate seamlessly within the platform, ensuring everyone stays in sync.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">Customizable Workspaces</h3>
            <p className="text-gray-700">Tailor your workspace to fit your team's unique needs. With ReBoard's customizable features, you can adapt your boards, columns, and cards to match your project requirements and workflow.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose ReBoard for Project Management?</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>User-Friendly Interface: ReBoard's clean and intuitive interface makes project management a breeze, even for those new to collaborative platforms.</li>
            <li>Security and Reliability: Your data's security is our top priority. With robust security measures and reliable infrastructure, ReBoard ensures the safety and confidentiality of your projects.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Join the ReBoard Community</h2>
          <p className="text-gray-700">Ready to take your project collaboration to the next level? Join ReBoard today and experience a streamlined, efficient, and collaborative workspace that transforms the way your team works.</p>
          <button className="dark:bg-green-700 text-white px-4 py-2 mt-4 rounded-md"> <Link href='/api/auth/signin'> Sign up for Free </Link></button>
        </section>
      </div>
    </>
  )
}
