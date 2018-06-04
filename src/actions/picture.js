/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import axios from 'axios';

export const actions = {
  REQUEST_PICTURE: 'REQUEST-PICTURE',
  PICTURE_SUCCESS: 'PICTURE-SUCCESS',
  PICTURE_FAILURE: 'PICTURE-FAILURE',
  RESET_KITTINS: 'RESET-KITTINS'
};

const PHOTO_SEARCH_METHOD = 'flickr.photos.search';

const flickrSmallURL = (photo) => {
  let {farm, server, id, secret} = photo;
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_q.jpg`
};

const flickrLargeURL = (photo) => {
  let {farm, server, id, secret} = photo;
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`
};

const requestPicture = (silentLoad) => ({
  type: actions.REQUEST_PICTURE,
  isLoading: !silentLoad
});

const pictureSuccess = (urls) => ({
  type: actions.PICTURE_SUCCESS,
  urls
});

const pictureFailure = (search) => ({
  type: actions.PICTURE_FAILURE,
  search
});

export function resetKittins() {
  return {
    type: actions.RESET_KITTINS
  };
}

export function get(number = 10, pageNumber = 1, silentLoad = false) {
  return (dispatch) => {
    dispatch(requestPicture(silentLoad));
    let options = {
      url: 'https://api.flickr.com/services/rest/',
      params: {
        method: PHOTO_SEARCH_METHOD,
        api_key: '00f81d94a94452200fda0e495c11490a',
        nojsoncallback: 1,
        format: 'json',
        text: 'kittens',
        tags: 'kittens',
        content_type: 1,
        per_page: number,
        page: pageNumber,
        safe_search: 3
      },
    };
    axios.get(options.url, {
      params: options.params
    }).then(res => {
      let photoResults = res.data.photos.photo;
      dispatch(pictureSuccess(photoResults.map(photo => ({
        small: flickrSmallURL(photo),
        large: flickrLargeURL(photo)
      }))));
    }).catch(err => {
      dispatch(pictureFailure('kittens'));
    });
  }
}