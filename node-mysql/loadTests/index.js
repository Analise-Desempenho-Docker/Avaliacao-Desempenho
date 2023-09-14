import http from 'k6/http';

import { sleep } from 'k6';


export default function () {
  sleep(20);

  http.get('http://172.17.0.1:3000/movies/1');

  sleep(1);

}
