import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Image, TouchableWithoutFeedback } from 'react-native';


const width = Dimensions.get("window").width / 2 - 16 * 2;
const height = width * 1.77;


export default class StoryThumbnail extends Component {
 
    thumbnail = React.createRef();

    measure = (): Position => new Promise(
        resolve => this.thumbnail.current.measureInWindow( (x, y, width, height) => resolve ({x, y, width, height}))
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

