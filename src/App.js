import React, { Component } from 'react';
import {
  View,
  Text,
  AppRegistry,
  Modal,
  Button,
}
  from 'react-native';
import ImageTouch from './component/ImageTouch';
import ModalItem from './component/ModalItem';
import ListScreen from './screens/ListScreen';
import FormScreen from './screens/FormScreen';
import RequestScreen from './screens/RequestScreen';
import GeolocationScreen from './screens/GeolocationScreen';

class App extends Component {
  state = {
    exibirModal: false
  }

  renderModal = () => {
    return (
      <View>
        <Button title="Abrir Modal"
          onPress={() => this.setState({ exibirModal: true })} />
        <Modal 
        visible={this.state.exibirModal}
        onRequestClose={() => this.setState({exibirModal: false})}>

          <Text> este é o conteudo do Modal</Text>
          <Button title="Fechar Modal"
          onPress={() => this.setState({ exibirModal: false })} />
        </Modal>
      </View>
    )
  }

  render() {
    return (
      <View style={{
        backgroundColor: '#eee',
        flex: 1
      }}>
         {/*<ListScreen />*/}
                {/*<FormScreen />*/}
                {/*{this.renderModal()}*/}
                {<RequestScreen />}
                {/*<GeolocationScreen />*/}

      </View>
    )
  }
}
AppRegistry.registerComponent('MeuProjeto', () => App);
