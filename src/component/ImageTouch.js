import React, {Component} from 'react';
import{
  View,
  Image,
  TouchableHighlight,
  Linking
}
from 'react-native';

class ImageTouch extends Component{
  abrirImagem = ()=>{
    
    const url = this.props.url;
    Linking.canOpenURL(url)
    .then((can) =>{
      if(can)
      Linking.openURL(url);
      else alert("Nao foi possivel abrir a imagem")
    })
  }
  render(){
const url = this.props.url;
    return(
      <View>
      <TouchableHighlight onPress={this.abrirImagem} >
      <Image source={{ uri: url }}
      style={{width: 200, height: 100}} />
      </TouchableHighlight>
      </View>
    )

  }

}
export default ImageTouch;
