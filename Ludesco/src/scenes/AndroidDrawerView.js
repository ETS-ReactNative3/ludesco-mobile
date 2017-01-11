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
        this.state = {
            route: null
        }
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
        const { drawer, navigator, close } = this.props;
        this.setState({
            route: route
        });
        if(route.title=='myreservations' && isConnected()) {
          store.dispatch(loadReservations());
        } else if(route.title=='customGames') {
          store.dispatch(loadCustomGames());
        }
        navigator.push(route);
        close();
    };

    render() {
        const { route } = this.state;
        const { categories, notificationInfo, notificationParties, toggleNotificationsInfo, toggleNotificationsParties } = this.props;

        return (
            <ScrollView>
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/nav.jpg')} />}>
                </Drawer.Header>
                <Drawer.Section
                  title="Ludesco"
                    items={[{
                        icon: 'list',
                        value: 'Programme',
                        active: route === 'programme',
                        onPress: () => this.changeScene('welcome'),
                        onLongPress: () => this.changeScene('welcome')
                    }, {
                        icon: 'date-range',
                        value: 'Réservations',
                        active: route === 'myreservations',
                        onPress: () => this.changeScene({title:'myreservations'}),
                        onLongPress: () => this.changeScene({title:'myreservations'})
                    }, {
                        icon: 'games',
                        value: 'Parties éphémères',
                        active: route === 'customGames',
                        onPress: () => this.changeScene({title:'customGames'}),
                        onLongPress: () => this.changeScene({title:'customGames'})
                    }]}
                />
            <Divider />
            <Drawer.Section
              title="Notifications"/>
              <Checkbox onCheck={toggleNotificationsInfo} value="" primary="googleGreen" label="Notifications Info" checked={notificationInfo} />
              <Checkbox onCheck={toggleNotificationsParties} value="" primary="googleGreen" label="Notifications Parties" checked={notificationParties} />
            <Divider />
            <Drawer.Section
              title="Filtres par catégorie"/>
            {categories.sort().map((c,i) => {
              const [label, checked] = c;
              return <Checkbox key={i} onCheck={(check, label) => {this.toggleCategory(check, label)}} checked={checked} value={label} label={<HTMLView value={label} />} margin={8} iconSize={16} />
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
