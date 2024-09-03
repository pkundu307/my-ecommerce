import React from 'react';
import ProductForm from '../components/ProductForm';


const AdminPanel: React.FC = () => {




 
  return (
    <div className="admin-panel p-4 ">
      <h1 className="text-2xl font-bold m-14">Admin Panel</h1>
   <ProductForm/>
    </div>
  );
};

export default AdminPanel;
