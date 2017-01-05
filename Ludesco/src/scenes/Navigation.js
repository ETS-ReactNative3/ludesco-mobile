import React, { Component, PropTypes} from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Checkbox from '../components/checkbox';
import { Avatar, Drawer, Divider, COLOR, TYPO, PRIMARY_COLORS } from 'react-native-material-design';
import store,{isConnected} from '../state/container';
import { fetchJSON } from '../util/http';
import { loadReservations,loadCustomGames, login, loadDevice } from '../actions/actions';

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: null,
            categories: []
        }

        fetchJSON('public/categories')
          .then((categories) => {
            let cat = categories.map((c) => [c.name, true]);
            this.setState({categories: cat});
          });

        store.dispatch(loadDevice());
    }

    toggleCategory(check, value) {
      let categories = this.state.categories;
      let newCat = categories.map((c) => {
        let [label] = c;
        if(value!==label) return c;
        return [label, check];
      });
      let storedCat = newCat.filter((c) => {
        let [label, value] = c;
        return value;
      }).map((c) => {
        let [label, value] = c;
        return label;
      });
      this.setState({categories:newCat})
      store.dispatch({type:'CATEGORIES', categories:storedCat})
    }

    changeScene = (route) => {
        const { drawer, navigator } = this.props;
        this.setState({
            route: route
        });
        if(route.title=='myreservations' && isConnected()) {
          store.dispatch(loadReservations());
        } else if(route.title=='customGames') {
          store.dispatch(loadCustomGames());
        }
        this.props.navigator.push(route);
        drawer.closeDrawer();
    };

    render() {
        const { route } = this.state;

        return (
            <ScrollView>
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/nav.jpg')} />}>
                </Drawer.Header>
                <Drawer.Section
                    items={[{
                        icon: 'list',
                        value: 'Programme',
                        label: '12',
                        active: route === 'programme',
                        onPress: () => this.changeScene('welcome'),
                        onLongPress: () => this.changeScene('welcome')
                    }, {
                        icon: 'date-range',
                        value: 'Mes réservations',
                        labels: '12',
                        active: route === 'myreservations',
                        onPress: () => this.changeScene({title:'myreservations'}),
                        onLongPress: () => this.changeScene({title:'myreservations'})
                    }, {
                        icon: 'date-range',
                        value: 'Programme joueurs',
                        labels: '12',
                        active: route === 'customGames',
                        onPress: () => this.changeScene({title:'customGames'})
                    }]}
                />
            </Drawer>
            <Divider />
            {this.state.categories.map((c,i) => {
              const [label, checked] = c;
              return <Checkbox key={i} onCheck={(check, label) => {this.toggleCategory(check, label)}} checked={checked} value={label} label={label} margin={8} iconSize={16} />
            })}
            </ScrollView>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 20
    }
};
