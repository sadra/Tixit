import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === undefined) {
    return axios.create({
      //SPACENAME.SERVICENAME.svc.cluster.local
      baseURL:
        'http://ingress-nginx.ingress-nginx-controller.svc.cluster.local',
      //It has Host and Cookie headers inside
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
