import React from "react";
import { StyleSheet, View, Text, Modal } from "react-native";
import PropTypes from "prop-types";
// import LottieAnimation from "lottie-react-native";
// import { ViewPropTypes } from "deprecated-react-native-prop-types";

export default class AnimatedLoader extends React.PureComponent {
  static defaultProps = {
    visible: false,
    overlayColor: "rgba(0, 0, 0, 0.25)",
    animationType: "none",
    // source: require("../node_modules/react-native-animated-loader/src/loader.json"),
    animationStyle: {},
    speed: 1,
    loop: true,
    top: 0,
    bottom: 0,
    setModalVisible: () => {},
  };

  static propTypes = {
    visible: PropTypes.bool,
    overlayColor: PropTypes.string,
    animationType: PropTypes.oneOf(["none", "slide", "fade"]),
    source: PropTypes.object,
    // animationStyle: ViewPropTypes.style,
    speed: PropTypes.number,
    loop: PropTypes.bool,
    top: PropTypes.number,
    bottom: PropTypes.number,
    setModalVisible: PropTypes.func,
  };

  animation = React.createRef();

  componentDidMount() {
    if (this.animation.current) {
      this.animation.current.play();
    }
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      if (this.animation.current) {
        this.animation.current.play();
      }
    }
  }

  _renderLottie = () => {
    const { source, animationStyle, speed, loop } = this.props;
    return (
      // <LottieAnimation
      //   ref={this.animation}
      //   source={source}
      //   loop={loop}
      //   speed={speed}
      //   style={[styles.animationStyle, animationStyle]}
      // />
      <View>
        <Text>Loading...</Text>
      </View>
    );
  };

  render() {
    const {
      visible,
      overlayColor,
      animationType,
      top,
      bottom,
      setModalVisible,
    } = this.props;

    return (
      <Modal
        transparent
        visible={visible}
        animationType={animationType}
        supportedOrientations={["portrait"]}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: overlayColor, top: top, bottom: bottom },
          ]}
        >
          <View>{this._renderLottie()}</View>
          {this.props.children}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    // top: 0,
    // bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  animationStyle: {
    height: "100%",
    width: "100%",
  },
});
