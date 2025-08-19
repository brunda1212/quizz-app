import React from 'react'

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"
function Home() {

      const navigate = useNavigate();

  const handleLogout = () => {
   Cookies.remove("jwt_token");
    navigate("/login");


    
  };
  return (
  <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="nav bg-white/80 backdrop-blur-md shadow-md mt-2 mx-3 px-4 py-2 rounded-xl flex justify-between items-center">
        <div>
          <img
            className="height_of_logo rounded-xl"
            src="https://res-console.cloudinary.com/dxdhln0xc/thumbnails/v1/image/upload/v1755101500/U2NyZWVuc2hvdF8yMDI1LTA4LTEzXzIxNDA0Nl9maDJzcGs=/drilldown"
            alt="logo"
          />
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="border border-gray-400 text-gray-700 font-medium rounded-lg px-3 py-1 hover:bg-red-500 hover:text-white transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 max-w-md text-center">
          <img
            className="rounded-lg mx-auto"
            src="https://res-console.cloudinary.com/dxdhln0xc/thumbnails/v1/image/upload/v1755102244/U2NyZWVuc2hvdF8yMDI1LTA4LTEzXzIxNTEzNl9kazg5ZzE=/drilldown"
            alt="quiz preview"
          />
          <h1 className="text-blue-600 text-2xl font-bold mt-4">
            How many of these questions do you actually know?
          </h1>
          <h3 className="text-gray-700 mt-2">
            Test yourself with these fun quiz questions and answers
          </h3>
          <div className="mt-4">
            <Link to="/quizz">
              <button className="bg-blue-500 text-white font-medium px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                Start Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

 