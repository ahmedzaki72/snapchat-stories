import React, { Component } from 'react';
import { View, StyleSheet, ScrollView} from "react-native";
import StoryThumbnail from './storyThumbnail';
import StoryModal from './storyModal';




export default class Discovery extends Component {
    constructor(props) {
        super(props);
       this.thumbnails = props.stories.map( () => React.createRef());
        this.state = {
            selectedStory : null,
            position : null , 
            story : null
        }
      }
    
    selectedStory = async(story, index) => {
        const position  = await this.thumbnails[index].current.measure();
        this.setState({selectedStory : story, position})
    }

    onRequestClose = () => {
        this.setState({
            position : null,
            selectedStory : null,
        })
    }
    render() {
        const { onRequestClose } = this;
        const { stories } = this.props;
        const {selectedStory, position} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View
                        style={styles.content}
                        contentInsetAdjustmentBehavior="automatic"
                    >
                        {stories.map((story , index) => <StoryThumbnail
                            ref={this.thumbnails[index]}
                             key={story.id}
                             onPress={()=> this.selectedStory(story, index)}
                             selected={!!selectedStory && selectedStory.id === story.id}
                             {...{ story }} />)
                            }
                    </View>
                </ScrollView>
                {
                  selectedStory && (
                      <StoryModal story={selectedStory} {...{position, onRequestClose}}/>
                  )
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingTop : 64,  
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
    },
  });

