import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Import slick carousel css
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme css
import { Link } from 'react-router-dom';

// Sample image URLs for carousel
const carouselImages = [
  'https://via.placeholder.com/600x300',
  'https://via.placeholder.com/600x300/0000FF/808080',
  'https://via.placeholder.com/600x300/FF0000/FFFFFF',
];

// Sample product objects
const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'This is the first product',
    price: '$100',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'This is the second product',
    price: '$200',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'This is the third product',
    price: '$300',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Product 4',
    description: 'This is the fourth product',
    price: '$400',
    imageUrl: 'https://via.placeholder.com/150',
  },
  // Add more products as needed
];

function Home() {
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "gray", borderRadius: "50%" }}
        onClick={onClick}
      />
    );
  };
  
  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "gray", borderRadius: "50%" }}
        onClick={onClick}
      />
    );
  };
  
  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  

  return (
    <div className="container mx-auto p-4">
<div className="flex space-x-4 mb-4">
  <p>Home</p>
  <p>About</p>
  <p>Services</p>
  <p>Contact</p>
</div>

      {/* Carousel Section */}
      <Slider {...settings} style={{ zIndex: -1 }}>
  {carouselImages.map((image, index) => (
    <div key={index}>
      <img src={image} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
    </div>
  ))}
</Slider>


      {/* Product List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {products.map((product) => (
        <Link to={`/product/${product.id}`}>
        <div key={product.id} className="p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-blue-500 font-bold">{product.price}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
