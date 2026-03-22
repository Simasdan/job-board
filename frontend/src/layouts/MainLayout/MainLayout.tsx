import { Outlet } from "react-router-dom";
import styles from './MainLayout.module.scss';
import Sidebar from "@/components/Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <aside className={styles.sidebar}>
        <Sidebar/>
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