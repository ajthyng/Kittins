import React, { Component } from 'react';
import {Provider} from 'react-redux';
import configureStore from "./src/store/configureStore";
import KittinNav from './src/Navigator';
const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <KittinNav/>
      </Provider>
    );
  }
}