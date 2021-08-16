import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  let baseUrl = '';
  let options = {};

  if (typeof window === undefined) {
    //SPACENAME.SERVICENAME.svc.cluster.local
    baseUrl = 'http://ingress-nginx.ingress-nginx-controller.svc.cluster.local';
    options = {
      //It has Host and Cookie headers inside
      headers: req.headers,
    };
  }

  const { data } = axios
    .get(`${baseUrl}/api/users/currentuser`, options)
    .catch((err) => {
      console.log(err.message);
    });

  return data;
};

export default LandingPage;
