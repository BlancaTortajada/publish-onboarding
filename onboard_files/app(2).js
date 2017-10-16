(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var photoUpload = require('./photo-upload');

var helpers = require('hmpo-frontend-toolkit').helpers;

helpers.documentReady(photoUpload.init);

},{"./photo-upload":2,"hmpo-frontend-toolkit":"hmpo-frontend-toolkit"}],2:[function(require,module,exports){
'use strict';

var helpers = require('hmpo-frontend-toolkit').helpers;

var NAME = 'PHOTO_UPLOAD';

var photoFileId = 'photo',
    photoSubmitId = 'photo-submit',
    photoInput,
    label,
    progress,
    percentage,
    bodyContent;

var photoUpload;

function focussed() {
    helpers.addClass(label, 'focus');
}

function blurred() {
    helpers.removeClass(label, 'focus');
}

function setupPercentageDisplay() {
    var percWrapper = document.createElement('div');

    percWrapper.className = 'percentage';

    percentage = document.createElement('p');
    percentage.id = 'percentage';

    percWrapper.appendChild(percentage);
    progress.parentNode.appendChild(percWrapper);
}

photoUpload = {
    init: function init() {
        photoInput = document.getElementById(photoFileId);

        if (photoInput && 'outline' in document.body.style) {
            helpers.once(photoInput, NAME, function () {
                photoUpload.setup();
            });
        } else if (photoInput) {
            helpers.removeClass(photoInput, 'photo-choose-file');
        }
    },

    setup: function setup() {
        helpers.addClass(document.getElementById(photoSubmitId), 'hide');

        label = document.querySelector('label[for="' + photoFileId + '"]');
        helpers.removeClass(document.getElementById('photo-label-text'), 'visually-hidden');
        helpers.addClasses(label, ['button', 'photo-upload-label']);
        label.setAttribute('role', 'button');

        var errorMsg = document.getElementById('photo-error');
        if (errorMsg) {
            var group = label.parentNode;
            group.insertBefore(errorMsg, label);
        }

        bodyContent = document.getElementById('content');
        bodyContent = bodyContent.getElementsByTagName('header')[0].parentNode;
        progress = document.getElementById('progress');

        helpers.addEvent(photoInput, 'focus', focussed);
        helpers.addEvent(photoInput, 'blur', blurred);
        helpers.addEvent(photoInput, 'change', photoUpload.fileAdded);
    },

    fileAdded: function fileAdded(e) {
        var target = helpers.target(e);

        if (target.files) {
            photoUpload.showProgress(true);
            photoUpload.uploadFile();
        } else {
            photoUpload.showProgress();
            document.getElementsByTagName('form')[0].submit();
        }
    },

    showProgress: function showProgress(withProgress) {
        var back = document.getElementById('back');
        if (back) {
            back.parentNode.removeChild(back);
        }

        helpers.addClass(bodyContent, 'hide');
        helpers.removeClass(progress, 'hide');

        if (withProgress) {

            progress.setAttribute('aria-valuenow', '0');
            progress.setAttribute('aria-valuemin', '0');
            progress.setAttribute('aria-valuemax', '100');
        }
    },

    setLocation: function setLocation(url) {
        location.href = url;
    },

    uploadFile: function uploadFile() {
        var formData = new FormData(document.getElementsByTagName('form')[0]),
            xhr = new XMLHttpRequest();

        setupPercentageDisplay();

        xhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
                var perc = Math.round((e.loaded / e.total ) * 100);
                progress.setAttribute('aria-valuenow', perc);
                percentage.innerHTML = perc + '%';
            }
        }, false);
        xhr.upload.addEventListener('load', function () {
            helpers.addClass(percentage.parentNode, 'hide');
            progress.innerHTML = 'Processing image';
        }, false);
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.getResponseHeader('Location')) {
                    photoUpload.setLocation(xhr.getResponseHeader('Location'));
                } else {
                    document.querySelector('form').submit();
                }
            }
        });

        xhr.open('POST', document.querySelector('form').getAttribute('action'));
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(formData);
        progress.parentNode.focus();
    }

};

module.exports = photoUpload;

},{"hmpo-frontend-toolkit":"hmpo-frontend-toolkit"}]},{},[1]);
