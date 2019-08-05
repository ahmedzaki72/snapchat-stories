import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Video } from "expo";
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from "react-native-gesture-handler";


const { width: wWidth, height: wHeight } = Dimensions.get("window");

const {
    set,
    cond,
    eq,
    add,
    multiply,
    lessThan,
    spring,
    startClock,
    stopClock,
    clockRunning,
    sub,
    defined,
    Value,
    Clock,
    event,
    block,
    interpolate,
    lessOrEq,
    greaterThan,
    and,
    call,
} = Animated

function runSpring(value, dest) {
    const clock = new Clock();
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
    };

    const config = {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        toValue: new Value(0),
    };

    return [
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.velocity, 0),
            set(state.position, value),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        spring(clock, state, config),
        cond(state.finished, stopClock(clock)),
        set(value, state.position),
    ];
}


export default class StoryModal extends Component {
    constructor(props) {
        super(props);
        const { x, y, width, height } = props.position
        this.translateX = new Value(x);
        this.translateY = new Value(y);
        this.width = new Value(width);
        this.height = new Value(height);
        this.velocityY = new Value(0);
        this.state = new Value(State.UNDETERMINED);
        this.onGestureEvent = event([{
            nativeEvent: {
                translationX: this.translateX,
                translationY: this.translateY,
                velocityY: this.velocityY,
                state: this.state
            }
        }], { useNativeDriver: true });
    }
    render() {
        const { translateX, translateY, width, height, onGestureEvent } = this;
        const { story, onRequestClose } = this.props;
        const style = {
            ...StyleSheet.absoluteFillObject,
            width,
            height,
            transform: [
                { translateY },
                { translateX },
            ]
        }
        return (
            <View style={styles.container}>
                <Animated.Code>
                    {
                        () => block([
                            cond(eq(this.state, State.UNDETERMINED), runSpring(translateX, 0)),
                            cond(eq(this.state, State.UNDETERMINED), runSpring(translateY, 0)),
                            cond(eq(this.state, State.UNDETERMINED), runSpring(width, wWidth)),
                            cond(eq(this.state, State.UNDETERMINED), runSpring(height, wHeight)),
                            cond(and(eq(this.state, State.END), lessOrEq(this.velocityY, 0)), block([
                                runSpring(translateX, 0),
                                runSpring(translateY, 0),
                                runSpring(width, wWidth),
                                runSpring(height, wHeight),
                            ])),
                            cond(and(eq(this.state, State.END), greaterThan(this.velocityY, 0)), block([
                                runSpring(translateX, this.props.position.x),
                                runSpring(translateY, this.props.position.y),
                                runSpring(width, this.props.position.width),
                                runSpring(height, this.props.position.height),
                                cond(eq(height, this.props.position.height), call([], onRequestClose))
                            ])),
                            cond(eq(this.state, State.ACTIVE), set(this.height, interpolate(this.translateY, {
                                inputRange: [0, wHeight],
                                outputRange: [wHeight, this.props.position.height],
                            }))),
                            cond(eq(this.state, State.ACTIVE), set(this.width, interpolate(this.translateY, {
                                inputRange: [0, wHeight],
                                outputRange: [wWidth, this.props.position.width],
                            }))),
                        ])
                    }
                </Animated.Code>
                <PanGestureHandler
                    activeOffsetY={100}
                    onHandlerStateChange={onGestureEvent}
                    {...{ onGestureEvent }}
                >
                    <Animated.View {...{ style }}>
                    {
                        !story.video && (
                          <Image source={story.source} style={styles.image} />
                        )
                      }
                      {
                        story.video && (
                          <Video
                            source={story.video}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={styles.video}
                          />
                        )
                      }
                    </Animated.View>
                </PanGestureHandler>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    },
    image: {
        ...StyleSheet.absoluteFill,
        width: null,
        height: null,
        borderRadius: 5
    },
    video: {
        ...StyleSheet.absoluteFill,
        borderRadius: 5,
      },
});

