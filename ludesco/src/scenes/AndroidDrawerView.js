import React, { Component } from 'react';
import { Image, ScrollView, Platform } from 'react-native';
import { Drawer, Divider, Checkbox } from 'react-native-material-ui';
import { connect } from 'react-redux';
import store from '../state/container';
import { logout, loadReservations } from '../actions/actions';
import NavigationService from '../navigation/NavigationService';

const mapStateToProps = state => ({
  categories: state.profile.categories,
  notificationInfo: state.notificationInfo,
  notificationParties: state.notificationParties,
  user: state.profile.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  navigate(routeName) {
    NavigationService.navigate(routeName);
    ownProps.close();
  },
});

class AndroidDrawerView extends Component {
  toggleCategory(check, value) {
    const { categories } = this.props;
    const newCat = categories.map((c) => {
      const { id, name } = c;
      if (value !== id) return c;
      return { id, name, checked: check };
    });
    store.dispatch({ type: 'CATEGORIES_LOADED', categories: newCat });
  }

  render() {
    const {
      user,
      categories,
      navigate,
    } = this.props;

    const items = [{
      icon: 'list',
      value: 'Programme',
      onPress: () => navigate('Programme'),
    }, {
      icon: 'date-range',
      value: 'Agenda',
      onPress: () => {
        if (user) {
          store.dispatch(loadReservations()).then(() => {
            navigate('Agenda');
          });
        } else {
          navigate('Agenda');
        }
      },
    }];

    if (user) {
      items.push({
        icon: 'exit-to-app',
        value: 'Se déconnecter',
        onPress: () => store.dispatch(logout()),
      });
    }

    return (
      <ScrollView style={{ marginTop: Platform.OS === 'ios' ? 40 : 0 }}>
        <Drawer theme="light">
          <Drawer.Header image={<Image source={require('./../img/nav.png')} />}>
          </Drawer.Header>
          <Drawer.Section
            title="Ludesco 10 - 15 au 17 mars"
            items={items}
          />
          <Divider />

          <Drawer.Section title="Filtres par catégorie" />
          {categories.sort().map((c) => {
            const { id, name, checked } = c;
            return (
              <Checkbox
                key={id}
                onCheck={(check, _id) => { this.toggleCategory(check, _id); }}
                checked={checked}
                value={id}
                label={name}
              />
            );
          })}
        </Drawer>
      </ScrollView>
    );
  }
}

const AndroidDrawerViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AndroidDrawerView);

export default AndroidDrawerViewContainer;
