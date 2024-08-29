import Slider from "react-slick";

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

const Carousel = ({ carouselImages }) => (
  <Slider {...settings} style={{ zIndex: -1 }}>
    {carouselImages.map((image, index) => (
      <div key={index}>
        <img src={image} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
      </div>
    ))}
  </Slider>
);

export default Carousel;
