import 'bootstrap/dist/css/bootstrap.css';

const cssUniversal = ({ Component, pagePros }) => {
  return <Component {...pagePros} />;
};

export default cssUniversal;
