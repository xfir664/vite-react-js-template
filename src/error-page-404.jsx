import { useRouteError } from "react-router-dom";

export default function ErrorPage404() {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <h1>Hi! It is an Error Page</h1>
      <h2>404 Not Found Error</h2>
      <p>
        <i>{error.statusText}</i>
      </p>
      <p>
        <i>{error.data}</i>
      </p>
    </div>
  );
}
