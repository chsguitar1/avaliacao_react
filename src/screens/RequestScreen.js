import React, { Component } from 'react';
import {
    Button,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Geolocation,
    List,
    ListItem,
    SearchBar,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    TouchableHighlight, Dimensions,
} from 'react-native';

import axios from 'axios';

const POSTS_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const FILTER = '?query=';
const LOCALTION = '&location=';
const KEY = '&key=AIzaSyDIqHxFwsBLMzH1f3HxJRektM7nb-i7jbc';
let url_photo;
const { height, width } = Dimensions.get('window');
class RequestScreen extends Component {
    state = {
        erro: '',
        posts: null,
        aguarde: false,
        filter: '',
        exibirModal: false,
        details: null,

    }

    componentDidMount() {
        const config = { enableHighAccuracy: false };
        navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
    }
    // Callback disparado quando a localização é obtida.
    locationSuccess = (position) => {
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        })
    }

    // Callback disparado se ocorrer algum erro ao obter a localização.
    locationError = (error) => {
        //  console.warn(error);
    }

    onChangeText = (text) => {
        const state = {
            filter: text
        }

        this.setState(state);
    }

    onItemPress = (item) => {
        this.setState({ exibirModal: true });
        this.setState({ details: item });


    }

    onBuscarPress = () => {
        const { filter, latitude, longitude } = this.state;
        this.setState({ aguarde: true });
        FILTER = FILTER + filter;
        LOCALTION = LOCALTION + latitude + ',' + longitude;
        let posts = null;
        let erro;
        console.log(POSTS_URL + FILTER + LOCALTION + KEY);
        axios.get(POSTS_URL + FILTER + LOCALTION + KEY)
            .then((response) => {
                if (response.status === 200) {
                    posts = response.data;
                } else {
                    erro = "Tente novamente mais tarde";
                }
            }).catch((exception) => {
                console.warn(exception);
                erro = 'Verifique sua conexão com a Internet.';
            }).finally(() => {
                this.setState({
                    aguarde: false, posts: posts, erro: erro, filter: ''
                });
            })
            

    }
    setUrlPhoto(item) {
        if(item.photos){
        url_photo = item.photos.map((photo) => {
            return (
                photo.photo_reference
            )
        })}
    }
    renderModal = () => {
        if (this.state.exibirModal) {
            const itemLatitude = this.state.details.geometry.location.lat;
            const itemLongitude = this.state.details.geometry.location.lng;
            console.log('itemlatitude' + itemLatitude);
            this.setUrlPhoto(this.state.details);
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Modal
                        animationType={"slide"}
                        visible={this.state.exibirModal}
                        onRequestClose={() => this.setState({ exibirModal: false })}>
                        <Image
                            style={{ width: 400, height: 200 }}
                            source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + url_photo + KEY }}
                        />
                        <Text style={{ fontWeight: "bold", fontSize: 30 }}>{this.state.details.name + ' [' + this.state.details.rating + ']'} </Text>
                        <Text style={{ fontSize: 20 }}>{this.state.details.formatted_address} </Text>

                        <Image
                            style={{ width: 400, height: 200 }}
                            source={{
                                uri: 'https://maps.googleapis.com/maps/api/staticmap?markers='
                                + itemLatitude + ',' + itemLongitude + '&zoom=16&size=600x300&key=AIzaSyD__7tb-mlVPZDV6gPuDnSEkG6skVb2Lx0'
                            }}
                        />

                    </Modal>
                </View>
            )
        }
    }
    renderForm = () => {
        return (
            <View>
                <TextInput value={this.state.filter}
                    onChangeText={this.onChangeText}
                />
                <Button title="Buscar" onPress={this.onBuscarPress} />
            </View>
        )
    }
    renderItem = (record) => {
        const { item, index } = record;
        let url_ref = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=';
        this.setUrlPhoto(item);
        return (
            <TouchableOpacity
                onPress={() => this.onItemPress(item)}>
                <View style={{
                    backgroundColor: '#fff',
                    marginHorizontal: 16, marginVertical: 8,
                    padding: 16, borderRadius: 5,
                    elevation: 2, shadowOffset: {
                        width: 2,
                        height: 2,
                    }, shadowColor: '#333'
                }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=' + url_photo + KEY }}
                    />
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>{item.formatted_address}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderContent = () => {
        if (this.state.aguarde) {
            return (
                <ActivityIndicator size="large" color="#f00" />
            )
        }

        if (this.state.erro) {
            return (
                <Text style={{ color: '#f00' }} >{this.state.erro}</Text>
            )
        }

        let content = [];
        if (this.state.posts) {
            return (
                <FlatList
                    data={this.state.posts.results}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.name}
                />
            )
        }
    }

    render() {
        const { latitude, longitude } = this.state;
        const { height, width } = Dimensions.get('window');
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch'
            }}>
                {this.renderForm()}
                {this.renderContent()}
                {this.renderModal()}
            </View>
        )
    }
}

export default RequestScreen;