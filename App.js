import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

import Camera from 'react-native-camera';
class App extends Component {
  componentDidMount(){
          console.log("HERE");
  }
    scanBarcode(data) {
        console.log("xxxx");
        console.log(data);
    }
    render() {
        return (

        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={(e) => this.scanBarcode(e)}
          barCodeTypes={[Camera.constants.BarCodeType.qr]}>
        </Camera>


        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});

export default App;

