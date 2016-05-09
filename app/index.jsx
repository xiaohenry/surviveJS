import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

// trigger persistency logic during initialization, passing an (Alt instance, storage, storageName)

import alt from './libs/alt';
import storage from './libs/storage'; // export set & get method from storage obj
import persist from './libs/persist'; // import unnamed function, and call it persist

// first time this is called, it will bootstrap the saved data. Then, it will listen to any store changes
persist(alt, storage, 'app');

ReactDOM.render(<App />, document.getElementById('app'));
