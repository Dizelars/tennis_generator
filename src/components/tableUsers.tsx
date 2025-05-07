import { User } from "../types/User";
import classNames from "classnames";
import styles from "./tableUsers.module.css";

type Props = {
  users: User[];
  selectedUsers: User[];
  onToggle: (user: User) => void;
};

export const TableUsers = ({ users, selectedUsers, onToggle }: Props) => {
  return (
    <>
      <section className={classNames(styles.users)}>
          <div className={classNames(styles.container)}>
              <div className={classNames(styles.users_wrapper)}>
                  <p className={classNames(styles.users_title)}>Список игроков</p>
                  <div className={classNames(styles.users_list)}>
                      {users.map((user, index) => {
                        const isChecked = selectedUsers.some(u => u.name === user.name);
                        return (
                          <div key={index} className={classNames(styles.users_item)}>
                            <label>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggle(user)}
                              />
                            </label>
                            <p className={classNames(styles.user_name)}>{user.name}</p>
                          </div>
                        );
                      })}
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};