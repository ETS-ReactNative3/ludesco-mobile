import React, { Component, PropTypes} from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Avatar, Drawer, Divider, COLOR, TYPO, PRIMARY_COLORS, Checkbox } from 'react-native-material-ui';
import store,{isConnected} from '../state/container';
import { fetchJSON } from '../util/http';
import { loadReservations,
         loadCustomGames,
         loadDevice,
         loadCategories,
         toggleNotificationsInfo,
         toggleNotificationsParties,
         navigateTo } from '../actions/actions';
import { connect } from 'react-redux';

var HTMLView = require('react-native-htmlview');

const mapStateToProps = (state, ownProps) => {
   return {
     categories: state.categories,
     notificationInfo : state.notificationInfo,
     notificationParties : state.notificationParties
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
     toggleNotificationsInfo() {
       dispatch(toggleNotificationsInfo());
     },
     toggleNotificationsParties() {
       dispatch(toggleNotificationsParties())
     },
     navigateTo(routeName) {
       dispatch(navigateTo(routeName));
       ownProps.close();
     }
   }
}

class AndroidDrawerView extends Component {
    constructor(props) {
        super(props);
        store.dispatch(loadDevice());
        store.dispatch(loadCategories());
    }

    toggleCategory(check, value) {
      const { categories } = this.props;
      const newCat = categories.map((c) => {
        const [label] = c;
        if(value!==label) return c;
        return [label, check];
      });
      store.dispatch({type:'CATEGORIES_LOADED', categories:newCat});
    }

    render() {
        const { categories, notificationInfo, notificationParties, toggleNotificationsInfo, toggleNotificationsParties } = this.props;
        return (
            <ScrollView>
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/nav.png')} />}>
                </Drawer.Header>
                <Drawer.Section
                  title="Ludesco 9 - 16 au 18 mars"
                    items={[{
                        icon: 'list',
                        value: 'Programme',
                        onPress: () => this.props.navigateTo('Programme')
                    }, {
                        icon: 'date-range',
                        value: 'Agenda',
                        onPress: () => this.props.navigateTo('Agenda')
                    }, {
                      icon: 'games',
                      value: 'Le Studio',
                      onPress: () => this.props.navigateTo('Studio')
                    }]}
                />
            <Divider />
            <Drawer.Section
              title="Notifications"/>
              <Checkbox onCheck={toggleNotificationsInfo}
                        value=""
                        primary="googleGreen"
                        label="Notifications Info"
                        checked={notificationInfo}  />
            <Divider />
            <Drawer.Section
              title="Filtres par catégorie"/>
            {categories.sort().map((c,i) => {
              const [label, checked] = c;
              const decodedLabel = label.replace(/&amp;/g, '&');
              return <Checkbox key={i}
                               onCheck={(check, label) => {this.toggleCategory(check, label)}}
                               checked={checked}
                               value={label}
                               label={decodedLabel} />
            })}
            </Drawer>
            </ScrollView>
        );
    }
}

const AndroidDrawerViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AndroidDrawerView);

export default AndroidDrawerViewContainer;
