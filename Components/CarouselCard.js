import { Image, View, Dimensions } from "react-native";

const CarouselCard = ({ item, height, width, borderRadius }) => {
  return (
    <Image
      source={item}
      style={{
        width: width,
        height: height,
        resizeMode: "stretch",
        borderRadius: borderRadius,
      }}
    />
  );
};

export default CarouselCard;
