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
import {FlatList, Animated, Dimensions, View, StyleSheet} from 'react-native';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {get} from "../../actions/picture";

const getRandomColor = () => {
  let colors = [
    '#1B9196',
    '#0B797E',
    '#00484C',
    '#2B859E',
    '#024558',
  ];
  return colors[Math.floor(Math.random() * 100) % colors.length]
};
const KittinFlatList = styled(FlatList)`
  height: 100%;
  width: 100%;
  background-color: white;
`;

const KittinContainer = styled.View`
  min-width: ${props => props.size}px;
  max-width: ${props => props.size + 50}px;
  height: ${props => props.size}px;
  max-height: ${props => props.size}px;
  flex: 1;
  background-color: ${props => props.color};
`;

const Kittin = styled(Animated.Image)`
  flex: 1;
  height: 100%;
  width: 100%;
`;

class KittinList extends Component {
  constructor(props) {
    super(props);
    let data= [];
    const {width, height} = Dimensions.get('window');
    const orientation = width > height ? 'l' : 'p';
    const columns = width > height ? 5 : 3;
    for (let i = 0; i < 100; i++) {
      data.push({url: null, color: getRandomColor()});
    }

    const size = Math.floor(Dimensions.get('window').width / columns);
    this.state = {
      size,
      columns,
      orientation,
      data,
      opacity: new Animated.Value(0)
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
    this.props.getKittins(40);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleWindowChange);
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props);
    let {kittinURLs} = props;
    let {data} = state;
    if (kittinURLs.length > 0) {
      kittinURLs.forEach((url, index) => {
        data[index].url = url;
      });
    }

    return {
      ...state,
      data
    }
  }

  renderKittin = ({item}) => (
    <KittinContainer
      color={item.color}
      size={this.state.size}>
      {item.url ? <Kittin style={{opacity: this.state.opacity}} source={{uri: item.url}} /> : null}
    </KittinContainer>
  );

  render() {
    const {columns, data} = this.state;
    const {height, width} = Dimensions.get('window');

    if (this.props.kittinURLs.length > 0 && this.state.opacity.__getAnimatedValue() === 0) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }

    return (
      <KittinFlatList
        keyExtractor={(_, i) => `${i}`}
        key={(height > width ? 'v' : 'h')}
        numColumns={columns}
        data={data}
        renderItem={this.renderKittin}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    kittinURLs: state.kittins.urls
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getKittins: (totalKittins) => dispatch(get(totalKittins))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(KittinList);