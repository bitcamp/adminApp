import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';

import Camera from 'react-native-camera';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonVisible: false,
      data: null,
    }
  }

  _onPress() {
    this.setState({buttonVisible: false});
  }

    scanBarcode(data) {
        console.log(data);
        this.setState({ buttonVisible: true,
                        data: data});
    }

  render() {
    var button = null;
      if (this.state.buttonVisible) {
        button = (<DataView 
                    onPress={this._onPress} 
                    data={this.state.data}
                    title="Info" />);
      }
    return (
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={(e) => this.scanBarcode(e)}
          barCodeTypes={[Camera.constants.BarCodeType.qr]}>
          {button}
        </Camera>
    );
  }
}

class DataView extends Component {
  getDefaultProps() {
    return {
      title: "Info",
      data: null,
    }
  }
  render() {
    return (
      <View style={styles.cancelButton}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={styles.cancelButtonText}>{this.props.title}</Text>
          <Text style={styles.cancelButtonText}>{this.props.data.data}</Text>
        </TouchableOpacity>
      </View>
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
    },
    camera: {
      height: 568,
      alignItems: 'center',
    },
    rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    rectangle: {
      height: 250,
      width: 250,
      borderWidth: 2,
      borderColor: '#00FF00',
      backgroundColor: 'transparent',
    },
    cancelButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 3,
      padding: 15,
      width: 100,
      bottom: 10,
    },
    cancelButtonText: {
      fontSize: 17,
      fontWeight: '500',
      color: '#0097CE',
    },
});

export default App;

