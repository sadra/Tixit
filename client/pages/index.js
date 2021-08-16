import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ context }) => {
  const client = buildClient(context);

  const { data } = client.get(`/api/users/currentuser`).catch((err) => {
    console.log(err.message);
  });

  return data;
};

export default LandingPage;
