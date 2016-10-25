import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, View, TouchableHighlight} from "react-native";
import { TYPO, PRIMARY, COLOR, PRIMARY_COLORS, THEME_NAME } from '../../node_modules/react-native-material-design/lib/config.js';
import Icon from '../../node_modules/react-native-material-design/lib/Icon';
import IconToggle from '../../node_modules/react-native-material-design/lib/IconToggle';

const typos = StyleSheet.create(TYPO);

export default class Checkbox extends Component {

    static propTypes = {
        label: PropTypes.string,
        theme: PropTypes.oneOf(THEME_NAME),
        primary: PropTypes.oneOf(PRIMARY_COLORS),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        onCheck: PropTypes.func,
        margin: PropTypes.number,
        iconSize: PropTypes.number
    };

    static defaultProps = {
        theme: 'light',
        primary: PRIMARY,
        disabled: false
    };

    render() {
        const { theme, primary, checked, disabled, value, onCheck, margin, iconSize } = this.props;

        const status = (()=> {
            if (disabled) {
                return 'disabled'
            } else if (checked) {
                return 'checked'
            } else {
                return 'default'
            }
        })();

        const colorMap = {
            light: {
                disabled: '#000000',
                checked: COLOR[`${primary}500`].color,
                default: '#000000'
            },
            dark: {
                disabled: '#ffffff',
                checked: COLOR[`${primary}500`].color,
                default: '#ffffff'
            }
        };

        const opacityMap = {
            light: {
                checked: 1,
                default: 0.54,
                disabled: 0.26
            },
            dark: {
                checked: 1,
                default: 0.7,
                disabled: 0.3
            }
        };

        const underlayMap = {
            light: 'rgba(0,0,0,.12)',
            dark: 'rgba(255,255,255,.12)'
        }

        const labelColorMap = {
            light: '#000000',
            dark: '#ffffff'
        };

        const CURR_COLOR = colorMap[theme][status];
        const OPACITY = opacityMap[theme][status];
        const LABEL_COLOR = labelColorMap[theme];
        const UNDERLAY_COLOR = underlayMap[theme];

        return (
            <TouchableHighlight
                style={{marginLeft: 16}}
                onPress={() => { disabled ? null : onCheck(!checked, value) }}
                underlayColor={disabled ? 'rgba(0,0,0,0)' : UNDERLAY_COLOR}
                activeOpacity={1}
            >
                <View style={styles.container}>
                    <IconToggle
                        disabled={disabled}
                        color={CURR_COLOR}
                        onPress={() => { disabled ? null : onCheck(!checked, value) }}
                    >
                        <Icon name={checked ? 'check-box' : 'check-box-outline-blank'}
                              size={iconSize ? iconSize : 24}
                              color={CURR_COLOR}
                              key={value}
                              style={{
                                  width: 16,
                                  opacity: OPACITY,
                                  margin: margin ? margin : 16,
                              }}
                        />
                    </IconToggle>
                    <View
                        style={styles.labelContainer}
                        onPress={() => onCheck(!checked, value)}
                    >
                        <Text
                            style={[
                                typos.paperFontBody1,
                                styles.label,
                                COLOR[`${theme}PrimaryOpacity`],
                                disabled && COLOR[`${theme}DisabledOpacity`], {
                                    color: LABEL_COLOR
                                },
                            ]}
                        >
                            {this.props.label}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    label: {
        marginLeft: 16,
        opacity: COLOR.darkPrimaryOpacity.opacity
    }
});
