import { Outlet } from "react-router-dom";
import styles from './MainLayout.module.scss';

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        Sidebar goes here
      </aside>
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          Footer goes here
        </footer>
      </div>
    </div>
  )
}

export default MainLayout