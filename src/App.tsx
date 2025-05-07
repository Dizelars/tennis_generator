import './App.css';
import { useEffect, useState } from 'react';
import { getContent } from './components/content';

type User = {
  name: string;
  direction: string;
};

function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const c = await getContent();
        const parsed = JSON.parse(c);

        // Безопасная проверка структуры объекта
        const usersList: unknown = parsed?.department?.design?.users;
        if (!Array.isArray(usersList)) {
          throw new Error('Invalid format: users not found');
        }

        setUsers(usersList as User[]);
      } catch (error) {
        setHasError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  if (hasError) return <div>Errored: {hasError.message}</div>;
  if (isLoading || !users) return <div>Loading...</div>;

  return (
    <div className='App'>
      {users.map((user, index) => (
        <div key={index}>
          <strong>{user.name}</strong> — {user.direction}
        </div>
      ))}
    </div>
  );
}

export default App;
