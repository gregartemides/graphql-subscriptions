import { useSubscription } from '@apollo/client';
import { MESSAGE_SENT } from './subscriptions';

function App() {
  const { data, loading, error } = useSubscription(MESSAGE_SENT, {
  });

  if (loading) return <p>Loading subscription...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Subscription Message:</h2>
      <p>{data.messageSent ?? 'No data yet'}</p>
    </div>
  );
}

export default App;
