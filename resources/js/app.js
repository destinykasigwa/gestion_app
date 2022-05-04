/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

//  require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

 import ReactDOM from 'react-dom';
 import Adhesion from './components/Adhesion';
 import UpdateMembre from './components/EditMembre';
 
 if (document.getElementById('adhesionContainer')) {
     ReactDOM.render(<Adhesion />, document.getElementById('adhesionContainer'));
 }else if(document.getElementById('updateMembreContainer')){
    ReactDOM.render(<UpdateMembre />, document.getElementById('updateMembreContainer'));
 }
