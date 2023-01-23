import * as React from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const onError = errEvent => {
      setHasError(true);
      setError(errEvent.error);
    };
    window.addEventListener("error", onError);

    return () => {
      window.removeEventListener("error", onError);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ paddingLeft: '2rem', marginTop: '50px'}}>
        <h1 style={{ fontSize: '17px', marginBottom: '30px'}}>Oops.... Something went wrong</h1>
        <p style={{ marginBottom: '10px'}}>There was an error displaying subreddits</p>
        <p>Please reload page to try again.</p>
      </div>
    );
  }
  return children;
};

export default ErrorBoundary;
