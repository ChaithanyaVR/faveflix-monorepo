import * as React from "react";
import Navbar from "../components/Navbar";



const Dashboard: React.FC = () => {


  return (
    <>
      <Navbar />
      <div className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">My Favorite Movies & Shows</h2>
       
      </div>
    </>
  );
};

export default Dashboard;
