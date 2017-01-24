import React, { Component, PropTypes} from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Checkbox from '../components/checkbox';
import { Avatar, Drawer, Divider, COLOR, TYPO, PRIMARY_COLORS } from 'react-native-material-design';
import store,{isConnected} from '../state/container';
import { fetchJSON } from '../util/http';
import { loadReservations,
         loadCustomGames,
         loadDevice,
         loadCategories,
         toggleNotificationsInfo,
         toggleNotificationsParties } from '../actions/actions';
import { connect } from 'react-redux';
import LudescoNavigator from '../navigation/LudescoNavigator';

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
     }
   }
}

class AndroidDrawerView extends Component {
    static propTypes = {
      close : React.PropTypes.func.isRequired,
      categories : React.PropTypes.array.isRequired
    }

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

    changeScene = (route) => {
        const { drawer, close } = this.props;
        this.setState({
            route: route
        });
        if(route.title=='myreservations' && isConnected()) {
          store.dispatch(loadReservations());
        } else if(route.title=='customGames') {
          store.dispatch(loadCustomGames());
        }
        LudescoNavigator.navigateTo(route);
        close();
    };

    render() {
        const { categories, notificationInfo, notificationParties, toggleNotificationsInfo, toggleNotificationsParties } = this.props;
        return (
            <ScrollView>
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/nav.png')} />}>
                </Drawer.Header>
                <Drawer.Section
                  style={{marginLeft:20}}
                  title="Ludesco 8 - 10 au 12 mars"
                    items={[{
                        icon: 'list',
                        value: 'Programme',
                        onPress: () => this.changeScene({title:'programme'}),
                        onLongPress: () => this.changeScene({title:'programme'})
                    }, {
                        icon: 'date-range',
                        value: 'Réservations',
                        onPress: () => this.changeScene({title:'myreservations'}),
                        onLongPress: () => this.changeScene({title:'myreservations'})
                    }, {
                        icon: 'games',
                        value: 'Parties spontanées',
                        onPress: () => this.changeScene({title:'customGames'}),
                        onLongPress: () => this.changeScene({title:'customGames'})
                    }]}
                />
            <Divider />
            <Drawer.Section
              title="Notifications"/>
              <Checkbox onCheck={toggleNotificationsInfo}
                        value=""
                        primary="googleGreen"
                        label="Notifications Info"
                        checked={notificationInfo}
                        iconSize={16}
                        margin={8} />
              <Checkbox onCheck={toggleNotificationsParties}
                        value=""
                        primary="googleGreen"
                        label="Notifications Parties"
                        checked={notificationParties}
                        iconSize={16}
                        margin={8} />
            <Divider />
            <Drawer.Section
              title="Filtres par catégorie"/>
            {categories.sort().map((c,i) => {
              const [label, checked] = c;
              return <Checkbox key={i}
                               onCheck={(check, label) => {this.toggleCategory(check, label)}}
                               checked={checked}
                               value={label}
                               label={<HTMLView value={label} />}
                               margin={8}
                               iconSize={16} />
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

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 20
    }
};
