import React from 'react';
import { WebView } from 'react-native';

const CreateAccountScene = () => <WebView source={{ uri: 'https://www.ludesco.ch/wp-login.php?action=register' }} />;

export default CreateAccountScene;
