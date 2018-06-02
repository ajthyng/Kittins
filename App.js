import React, { Component } from 'react';
import {
  FlatList
} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from "./src/store/configureStore";
import KittinList from "./src/components/KittinList/KittinList";

const store = configureStore();


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <KittinList/>
      </Provider>
    );
  }
}