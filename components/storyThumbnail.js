import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Image, TouchableWithoutFeedback, Platform } from 'react-native';
import Constants from 'expo-constants';

const width = Dimensions.get("window").width / 2 - 16 * 2;
const height = width * 1.77;
const offset = (v) => (Platform.OS === "android" ? (v + Constants.statusBarHeight) : v);


export default class StoryThumbnail extends Component {
 
    thumbnail = React.createRef();

    measure =async (): Position => new Promise(
        resolve => this.thumbnail.current.measureInWindow( (x, y, width, height) => resolve ({x, y :  offset(y), width, height}))
    );

    render() {
        const {thumbnail} = this
        const { story, onPress, selected} = this.props;
        if(selected) {
            return <View style={styles.image}/>
        }else{
            return (
                <TouchableWithoutFeedback {...{onPress}}>
                    <Image source={story.source} style={styles.image} ref={thumbnail} />
                </TouchableWithoutFeedback>
            );
        }
    }
}

const styles = StyleSheet.create({
    image: {
        width,
        height,
        marginTop: 16,
        borderRadius: 6,
    },
});

