import React, { FC } from 'react';
import { useRouteError, Link } from "react-router-dom";

export const NotFoundPage: FC<{}> = () => {
  const error = useRouteError();

console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      Go to <Link to="/home">Home</Link>
    </div>
  );
}