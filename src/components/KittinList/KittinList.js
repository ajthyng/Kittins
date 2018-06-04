/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import React, {Component} from 'react';
import {
  FlatList,
  Animated,
  ActivityIndicator,
  Dimensions,
  Alert,
  View,
  StyleSheet
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {get, resetKittins} from "../../actions/picture";
import {Transition} from "react-navigation-fluid-transitions";

const TouchElement = Ripple;

const colors = [
  '#011f4b',
  '#03396c',
  '#005b96',
  '#6497b1',
  '#b3cde0',
  '#efbbff',
  '#d896ff',
  '#be29ec',
  '#800080',
  '#660066',
  '#a3c1ad',
  '#a0d6b4',
  '#5f9ea0',
  '#317873',
  '#49796b',
];

const PlaceKittin = require('Kittins/resources/img/placekittin.jpg');

const getRandomColor = () => {
  let index = Math.floor(Math.random() * 100) % colors.length;
  return colors[index]
};
const KittinFlatList = styled(FlatList)`
  height: 100%;
  width: 100%;
  background-color: ${getRandomColor()};
`;

const KittinContainer = styled.View`
  min-width: ${props => props.size}px;
  max-width: ${props => props.size}px;
  height: ${props => props.size}px;
  max-height: ${props => props.size}px;
  flex: 1;
  background-color: ${props => props.color};
`;

const KittinLoading = styled(ActivityIndicator)`
  width: 100%;
  height: 80px;
  align-content: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: transparent;
  opacity: 0.7;
`;

const KittinTouch = styled(TouchElement)`
  width: 100%;
  height: 100%;
  flex: 1;
`;

const generateKittinPlaceholders = () => {
  let kittins = [];
  const totalKittins = 45;
  for (let i = 0; i < totalKittins; i++) {
    kittins.push({
      url: null,
      key: `${i}`,
      color: getRandomColor(),
    });
  }
  return kittins;
};

class KittinList extends Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    const columns = width > height ? 5 : 3;
    const size = Math.floor(width / columns);
    this.state = {
      columns,
      size,
      orientation: width > height ? 'l' : 'p',
      data: generateKittinPlaceholders(),
      firstLoad: true
    }
  }

  handleWindowChange = ({window}) => {
    let {width, height} = window;
    const columns = width > height ? 5 : 3;
    const orientation = width > height ? 'l' : 'h';
    const size = Math.floor(window.width / columns);
    this.setState(prevState => {
      if (prevState.orientation === orientation) {
        return {
          size, columns
        }
      } else {
        return {
          size, columns, orientation
        }
      }
    });
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleWindowChange);
    this.props.getKittins(45);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleWindowChange);
  }

  static getDerivedStateFromProps(props, state) {
    let {kittinURLs} = props;
    let {data} = state;
    let firstLoad = true;
    if (kittinURLs.length > 0) {
      data = kittinURLs.reduce((accum, url, index) => {
        accum.push({
          color: (data[index] || {}).color || getRandomColor(),
          url: url.small,
          largeUrl: url.large,
          key: index,
        });
        return accum;
      }, []);
      firstLoad = false;
    }

    return {
      ...state,
      data,
      firstLoad
    }
  }

  renderKittin = ({item}) => {
    let kittin = (
      <KittinTouch
        rippleColor={item.color}
        onPress={() => {
          this.props.navigation.navigate('Kittin', {url: item.largeUrl, key: item.key});
        }}>
        <Transition shared={item.key}>
          <KittinImage dimensions={{width: this.state.size, height: this.state.size}} source={{uri: item.url}}/>
        </Transition>
      </KittinTouch>
    );
    return (
      <KittinContainer
        color={item.color}
        size={this.state.size}>
        {item.url ? kittin : null}
      </KittinContainer>
    );
  };

  getKittins = () => {
    this.props.resetKittins();
    this.props.getKittins(15);
  };

  getMoreKittins = () => {
    this.props.getMoreKittins(30, this.props.pageNumber);
  };

  render() {
    const {columns, data, size} = this.state;
    const {height, width} = Dimensions.get('window');

    return (
      <KittinFlatList
        keyExtractor={(_, i) => `${i}`}
        key={(height > width ? 'v' : 'h')}
        refreshing={this.props.refreshing && !this.state.firstLoad}
        onRefresh={this.getKittins}
        numColumns={columns}
        data={data}
        removeClippedSubviews={true}
        renderItem={this.renderKittin}
        onEndReached={this.getMoreKittins}
        onEndThreshold={0.5}
        ListFooterComponent={() => (<KittinLoading animating={true} size='large' color='white'/>)}
      />
    );
  }
}

const KittinViewContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const KittinImage = styled.Image`
  width: ${props => props.dimensions.width}px;
  height: ${props => props.dimensions.width}px;
`;

export class KittinView extends Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      dimensions: {width, height}
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateDimensions);
  }

  updateDimensions = () => {
    const {width, height} = Dimensions.get('window');
    this.setState(prevState => {
      return {
        ...prevState,
        dimensions: {width, height}
      }
    });

  };

  render() {
    const uri = this.props.navigation.getParam('url', '');
    const key = this.props.navigation.getParam('key', '');
    return (
      <KittinViewContainer contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
        <Transition shared={key}>
          <KittinImage dimensions={this.state.dimensions} source={{uri}}/>
        </Transition>
      </KittinViewContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    kittinURLs: state.kittins.urls,
    refreshing: state.kittins.isLoading,
    pageNumber: state.kittins.pageNumber,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getKittins: (totalKittins, page) => dispatch(get(totalKittins, page)),
    resetKittins: () => dispatch(resetKittins()),
    getMoreKittins: (totalKittins, page) => dispatch(get(totalKittins, page, true))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(KittinList);