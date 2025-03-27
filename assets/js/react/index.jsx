import { define } from 'remount';
import App from './App';
import Router from './Router';

define({ 'x-application': App });
define({ 'x-router': Router });
