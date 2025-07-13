import { NextPageContext } from 'next';
import ErrorPage from '../components/ErrorPage';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  return (
    <ErrorPage
      error={err}
      reset={() => window.location.reload()}
      statusCode={statusCode || 500}
      title="Something went wrong"
      message="An unexpected error occurred while loading this page. Please try again or contact support if the problem persists."
    />
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
