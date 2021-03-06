'use strict';

var React = require('react');
var assign = require('object-assign');
var colorUtils = require('./utils/color');

var HueSpectrum = require('./HueSpectrum');
var SaturationSpectrum = require('./SaturationSpectrum');

var toHsv = colorUtils.toHsv;

function emptyFn() {}

var RESULT = React.createClass({

    displayName: 'ColorPicker',

    getDefaultProps: function getDefaultProps() {
        return {
            defaultColor: require('./defaultColor'),
            saturationWidth: 300,
            saturationHeight: 300,
            hueHeight: null,
            hueWidth: 30,
            hueMargin: 10
        };
    },

    getInitialState: function getInitialState() {
        return {
            value: this.props.defaultValue
        };
    },

    prepareClassName: function prepareClassName(props) {
        var className = props.className || '';

        className += ' cp';

        return className;
    },

    prepareProps: function prepareProps(props) {

        props.className = this.prepareClassName(props);

        return props;
    },

    render: function render() {

        var props = this.prepareProps(assign({}, this.props));
        var hueStyle = assign({}, this.props.hueStyle) || {};

        hueStyle.marginLeft = this.props.hueMargin;

        var value = props.value ? this.toColorValue(this.props.value) : null;

        var defaultValue = !value ? this.toColorValue(this.state.value || props.defaultValue || props.defaultColor) : null;

        var saturationConfig = {
            onDrag: this.handleSaturationDrag,
            onChange: this.handleSaturationChange,
            onMouseDown: this.handleSaturationMouseDown,
            height: props.saturationHeight,
            width: props.saturationWidth,
            inPicker: true
        };

        var hueConfig = {
            onDrag: this.handleHueDrag,
            onChange: this.handleHueChange,
            height: props.hueHeight || props.saturationHeight,
            width: props.hueWidth,
            inPicker: true,
            style: hueStyle
        };

        var divConfig = {
            className: props.className,
            defaultValue: props.defaultValue,
            onDrag: props.onDrag
        };

        if (this.state.dragHue) {
            ;(value || defaultValue).h = this.state.dragHue;
        }

        //both value and defaultValue are objects like: {h,s,v}
        if (value) {
            saturationConfig.value = assign({}, value);
            hueConfig.value = assign({}, value);
        } else {
            saturationConfig.defaultValue = assign({}, defaultValue);
            hueConfig.defaultValue = assign({}, defaultValue);
        }

        return React.createElement(
            'div',
            divConfig,
            React.createElement(SaturationSpectrum, saturationConfig),
            React.createElement(HueSpectrum, hueConfig)
        );
    },

    toColorValue: function toColorValue(value) {
        return typeof value == 'string' ? toHsv(value) : value;
    },

    toStringValue: require('./utils/toStringValue'),

    handleChange: function handleChange(color) {

        this.state.dragHue = null;

        color = assign({}, color);

        var value = this.toStringValue(color);(this.props.onChange || emptyFn)(value, color);
    },

    handleSaturationChange: function handleSaturationChange(color) {
        this.handleChange(color);
    },

    handleHueChange: function handleHueChange(color) {
        this.handleChange(color);
    },

    handleHueDrag: function handleHueDrag(hsv) {
        this.handleDrag(hsv);
    },

    handleSaturationDrag: function handleSaturationDrag(hsv) {
        this.handleDrag(hsv);
    },

    handleDrag: function handleDrag(color) {

        if (!this.props.value) {
            this.setState({
                value: color
            });
        }

        ;(this.props.onDrag || emptyFn)(this.toStringValue(color), color);
    },

    handleSaturationMouseDown: function handleSaturationMouseDown(hsv) {
        this.setState({
            dragHue: hsv.h
        });
    }
});

RESULT.HueSpectrum = HueSpectrum;
RESULT.SaturationSpectrum = SaturationSpectrum;

module.exports = RESULT;