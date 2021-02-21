/*
    Authors: Jack Chou, Jeffrey Liu, Darien Tsai
*/
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import firebase from "firebase/app";
import 'firebase/database'
import io from 'socket.io-client';
import {APIKEY, FBKEY} from '../key'

console.log(firebase);
let app = firebase.initializeApp({
    apiKey: FBKEY,
    projectId: 'crowdmap-305402',
    databaseURL: 'https://crowdmap-305402-default-rtdb.firebaseio.com/'
});

class HeatMap extends Component {
    static defaultProps = {
        center: {
            lat: 33.998470127751006,
            lng: -117.94746979872437
        },
        zoom: 15
    };

    constructor(){
        super();

        this.state = {
            mapStatus: false,
            heatMapData: {
                positions:[],
                options: {
                    radius: 13,
                    opacity: 0.3
                }
            },
        };
    }

    addPoints = (data) => {
        let newData = this.state.heatMapData;
        for(let i = 0; i < data.length; i++) {
            newData["positions"].push({lat: data[i][0], lng: data[i][1]});
        }
        this.setState({heatMapData: newData, mapStatus: true});
    }
    render() {
        return (
            this.state.mapStatus ?
            (<GoogleMapReact
                style={{ height: '100vh', width: '100%' }}
                bootstrapURLKeys={{ key: APIKEY }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                heatmapLibrary={true}
                heatmap={this.state.heatMapData}
                >
            </GoogleMapReact>) : (<></>)
        );
    }
    componentDidMount() {
        const socket = io('https://crowdmap-server.herokuapp.com');

        socket.on('connect', () =>{
          socket.emit("update", {"coord": [100, 100]});
        });
        socket.on('get', (data) =>{
          this.addPoints(data);
          // for(let i = 0; i < data.length; i ++)
          //   firebase.database().ref("record/" + i).set(data[i]).catch(console.error);
        });

    }
}

export default HeatMap;
