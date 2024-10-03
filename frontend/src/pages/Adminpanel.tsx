import React from "react";
import { Link } from "react-router-dom";

interface Widget {
  title: string;
  description: string;
  color: string;
  to: string;
  gradient:string[];
  icon: string;
  stat: string;
  linkText: string;
  isActive: boolean;
}

const widgets: Widget[] = [
  {
    title: "banner carousel",
    description: "View total sales this month.",
    color: "#c4db7d",
    gradient: ["#c4db7d", "#008080"], 
    icon: "shopping-cart",
    stat: "$15,300", 
    to: "/carouselset",
    linkText: "View Sales",
    isActive: true,
  },
  {
    title: "Total Sales",
    description: "View total sales this month.",
    color: "#00FFFF",
    gradient: ["#00FFFF", "#008080"], 
    icon: "shopping-cart",
    stat: "$15,300", 
    to: "/sales",
    linkText: "View Sales",
    isActive: true,
  },
  {
    title: "New Orders",
    description: "Check new orders placed.",
    color: "#FAEBD7",
    gradient: ["#FAEBD7", "#FFDEAD"],
    icon: "clipboard-list",
    stat: "1245 Orders",
    to: "/orders",
    linkText: "View Orders",
    isActive: false,
  },
  {
    title: "Customer Feedback",
    description: "Read feedback from customers.",
    color: "#7FFFD4",
    gradient: ["#7FFFD4", "#40E0D0"],
    icon: "comments",
    stat: "87 Reviews",
    to: "/feedback",
    linkText: "View Feedback",
    isActive: true,
  },
  {
    title: "Inventory Status",
    description: "Monitor your inventory levels.",
    color: "#ADFF2F",
    gradient: ["#ADFF2F", "#9ACD32"],
    icon: "warehouse",
    stat: "In Stock",
    to: "/addproduct",
    linkText: "View Inventory",
    isActive: true,
  },
  {
    title: "Pending Shipments",
    description: "View pending shipment orders.",
    color: "#FFD700",
    gradient: ["#FFD700", "#FFB300"],
    icon: "shipping-fast",
    stat: "25 Pending",
    to: "/shipments",
    linkText: "View Shipments",
    isActive: true,
  },
  {
    title: "Registered Users",
    description: "Monitor the number of registered users.",
    color: "#FF4500",
    gradient: ["#FF4500", "#FF6347"],
    icon: "user",
    stat: "5,420 Users",
    to: "/users",
    linkText: "View Users",
    isActive: false,
  },
  {
    title: "Revenue Growth",
    description: "Check revenue growth this quarter.",
    color: "#32CD32",
    gradient: ["#32CD32", "#2E8B57"],
    icon: "chart-line",
    stat: "12% Increase",
    to: "/revenue",
    linkText: "View Growth",
    isActive: true,
  },
  {
    title: "Support Tickets",
    description: "View and manage support tickets.",
    color: "#6A5ACD",
    gradient: ["#6A5ACD", "#483D8B"],
    icon: "headset",
    stat: "14 Open Tickets",
    to: "/support",
    linkText: "Manage Tickets",
    isActive: false,
  },
];


const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {widgets.map((widget, index) => (
        
          <div
            style={{ backgroundColor: `${widget.color}` }}
            key={index}
            className="flex flex-col items-start p-6 pb-5 bg-white h-64 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
              
            <h3 className="text-lg font-semibold mb-2">{widget.title}<Link to={widget.to}>↗️</Link></h3>
            <p className="text-gray-600">{widget.description}</p>
          </div>

        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
