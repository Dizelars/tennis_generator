import "./App.css";
import { useEffect, useState } from "react";
import { getContent } from "./utils/content";
import { TableUsers } from "./components/tableUsers";
import { User } from "./types/User";

type Pair = [User, User?];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [tournamentPairs, setTournamentPairs] = useState<Pair[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const c = await getContent();
        const parsed = JSON.parse(c);
        const usersList = parsed?.department?.design?.users;
        if (!Array.isArray(usersList)) throw new Error('Invalid data');
        setUsers(usersList);
      } catch (error) {
        setHasError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const toggleUser = (user: User) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.name === user.name);
      return exists ? prev.filter((u) => u.name !== user.name) : [...prev, user];
    });
  };

  const generateTournament = () => {
    const shuffled = [...selectedUsers].sort(() => Math.random() - 0.5);
    const pairs: Pair[] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    }

    setTournamentPairs(pairs);
  };

  const resetTournament = () => {
    setTournamentPairs(null);
  };

  if (hasError) return <div>Ошибка: {hasError.message}</div>;
  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="App">
      {tournamentPairs ? (
        <div>
          <h2>Турнирная сетка</h2>
          {tournamentPairs.map(([user1, user2], index) => (
            <div key={index}>
              <strong>{user1.name}</strong>
              {' vs '}
              <strong>{user2?.name ?? '— (ожидает соперника)'}</strong>
            </div>
          ))}
          <button onClick={resetTournament}>Назад к выбору игроков</button>
        </div>
      ) : (
        <>
          <TableUsers
            users={users}
            selectedUsers={selectedUsers}
            onToggle={toggleUser}
          />
          <button
            onClick={generateTournament}
            disabled={selectedUsers.length < 2}
          >
            Сгенерировать турнир
          </button>
        </>
      )}
    </div>
  );
}

export default App;
