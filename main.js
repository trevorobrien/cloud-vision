// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var CV_URL = 'https://vision.googleapis.com/v1/images:annotate?fields=responses&key=' + window.apiKey;

$(function () {
  $('#fileform').on('submit', uploadFiles);

  var WIN = $(window);
  var DOC = $(document);
  var BODY = $("body");

  var _winW;
  var _winH;

  $('h1').each(function(i){
    $('span', this).each(function(j) {
      $(this).css({
        transitionDelay: .1 + Math.random()/3 + 's'
      })
    })
  })

  resizeHandler();
// EVENTS
/////////

  // UTIL EVENTS
  WIN.on('resize',resizeHandler);

// FUNCTIONS
////////////

  function scrollHandler() {

  }

  function resizeHandler () { // Set the size of images and preload them
    _winW = window.innerWidth;
    _winH = window.innerHeight;
  }

  function showTeam (team) {
    $('.js-teams').css({
      display: 'block'
    })
    $('form').css({
      display: 'none'
    })
    $('.js-' + team).css({
      visibility: 'visible'
    })
    $('.js-video-' + team.toLowerCase()).css({
      display: 'block'
    })
    BODY.css({
      backgroundColor: "#000"
    })
    $('.js-content-' + team.toLowerCase()).addClass('d-b').addClass('ms-d-f')

    setTimeout(function(){
      $('.js-logo').addClass('in')
    },1000)
  }

  ////// END FRONT END STUFF







  $('.js-scan-field').on('change', function(e){
   $('.js-scan').text('SCANNING...').css({
    background: 'black',
    color: 'white'
   })
   setTimeout(function(){
    $('.js-scan').text('SCANNING...').text('SCANNED!').css({
     background: 'transparent',
     border: 'solid white 3px',
     color: 'white'
    })
    $('.js-submit').css({
      opacity: 1,
      transition: '1s'
    })
   },1000)
  });

  /**
   * 'submit' event handler - reads the image bytes and sends it to the Cloud
   * Vision API.
   */
  function uploadFiles (event) {
    event.preventDefault(); // Prevent the default form post

    // Grab the file and asynchronously convert to base64.
    var file = $('#fileform [name=fileField]')[0].files[0];
    var reader = new FileReader();
    reader.onloadend = processFile;
    reader.readAsDataURL(file);
  }

  /**
   * Event handler for a file's data url - extract the image data and pass it off.
   */
  function processFile (event) {
    var content = event.target.result;
    sendFileToCloudVision(content.replace('data:image/jpeg;base64,', ''));
  }

  /**
   * Sends the given file contents to the Cloud Vision API and outputs the
   * results.
   */
  function sendFileToCloudVision (content) {
    var type = $('#fileform [name=type]').val();

    // Strip out the file prefix when you convert to json.
    var request = {
      requests: [{
        image: {
          content: content
        },
        features: [{
          type: type,
          maxResults: 200
        }]
      }]
    };

    $.post({
      url: CV_URL,
      data: JSON.stringify(request),
      contentType: 'application/json'
    }).fail(function (jqXHR, textStatus, errorThrown) {
      $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
      alert('ERRORS: ' + textStatus + ' ' + errorThrown)
    }).done(displayJSON);

    $('.js-submit').val('...').css({
     background: 'black',
     color: 'white'
    })
  }

  /**
   * Displays the results.
   */
  function displayJSON (data) {
    var contents = JSON.stringify(data, null, 4);
    console.log(data)
    if (data.responses[0].logoAnnotations[0].description.toLowerCase().indexOf('raiders') !== -1) {
      showTeam('raiders')
    }
    if (data.responses[0].logoAnnotations[0].description.toLowerCase().indexOf('eagles') !== -1) {
      showTeam('eagles')
    }
    if (data.responses[0].logoAnnotations[0].description.toLowerCase().indexOf('falcons') !== -1) {
      showTeam('falcons')
    }
    if (data.responses[0].logoAnnotations[0].description.toLowerCase().indexOf('patriots') !== -1) {
      showTeam('patriots')
    }
  }
});
