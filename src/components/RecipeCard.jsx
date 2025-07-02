import React from 'react'

const RecipeCard = ({ image, title, price }) => {
  return (
    <div className="border border-gray-300 p-4 shadow-md hover:shadow-lg transition duration-300 rounded-lg bg-white">
      <div>
        <img
          src={image}
          alt="Recipe img"
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-900 truncate" title={title}>{title}</h3>
        <div className="text-green-600 font-bold mt-2 text-base">
          Price: ${price?.toFixed(2) ?? 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
