import React { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Stylesheet
} from 'react-native';

class InfoScreen extends Component {
  constructor(props) {
    super(props);
  }

  _SrujansFunction(userid) {
    console.log(userid);
  }

  render() {
    return (
      <View>
        <Text>Hacker Info</Text>
        <Text>Name</Text>
        <Text>SSN</Text>
        <Text>Mothers Maiden Name</Text>
      </View>
    );
  }

}

export default InfoScreen;
