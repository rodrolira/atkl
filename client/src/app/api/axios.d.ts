import instance from './axios';

declare module './axios' {
    import axios from 'axios';
    export default instance ;
  }