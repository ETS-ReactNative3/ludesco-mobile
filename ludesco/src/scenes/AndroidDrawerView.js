import React, { Component, PropTypes} from 'react';
import { View, Text, Image, ScrollView, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Avatar, Drawer, Divider, COLOR, TYPO, PRIMARY_COLORS, Checkbox } from 'react-native-material-ui';
import store,{isConnected} from '../state/container';
import { toggleNotificationsInfo,
         toggleNotificationsParties,
         logout,
         loadReservations} from '../actions/actions';
import { connect } from 'react-redux';
import NavigationService from '../navigation/NavigationService.js';

var HTMLView = require('react-native-htmlview');

const mapStateToProps = (state, ownProps) => {
   return {
     categories: state.profile.categories,
     notificationInfo : state.notificationInfo,
     notificationParties : state.notificationParties,
     user : state.profile.user
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
     navigate(routeName) {
       NavigationService.navigate(routeName);
       ownProps.close();
     }
   }
}

class AndroidDrawerView extends Component {
    constructor(props) {
        super(props);
    }

    toggleCategory(check, value) {
      const { categories } = this.props;
      const newCat = categories.map((c) => {
        const {id, name} = c;
        if(value!==id) return c;
        return {id : id, name : name , checked : check};
      });
      store.dispatch({type:'CATEGORIES_LOADED', categories:newCat});
    }

    render() {
        const { user, categories, notificationInfo, notificationParties, toggleNotificationsInfo, toggleNotificationsParties } = this.props;

        items = [{
            icon: 'list',
            value: 'Programme',
            onPress: () => this.props.navigate('Programme')
        }, {
            icon: 'date-range',
            value: 'Agenda',
            onPress: () => {
              if(user) {
                store.dispatch(loadReservations()).then(() => {
                  this.props.navigate('Agenda');
                });
              } else {
                this.props.navigate('Agenda');
              }
            }
        }];

        if(user) {
          items.push({
            icon: 'exit-to-app',
            value: 'Se déconnecter',
            onPress: () => store.dispatch(logout())
          });
        }
        return (
            <ScrollView style={{marginTop: Platform.OS === 'ios' ? 40 : 0}}>
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/nav.png')} />}>
                </Drawer.Header>
                <Drawer.Section
                  title="Ludesco 10 - 15 au 17 mars"
                    items={items}
                />
            <Divider />

            { /*
            <Drawer.Section
              title="Notifications"/>
              <Checkbox onCheck={toggleNotificationsInfo}
                        value=""
                        primary="googleGreen"
                        label="Notifications Info"
                        checked={notificationInfo}  />
            <Divider />*/
            }
            <Drawer.Section
              title="Filtres par catégorie"/>
            {categories.sort().map(c => {
              const {id, name, checked} = c;
              return <Checkbox key={id}
                               onCheck={(check, id) => {this.toggleCategory(check, id)}}
                               checked={checked}
                               value={id}
                               label={name} />
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
