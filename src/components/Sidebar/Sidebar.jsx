import LocationSearch from '../LocationSearch/LocationSearch.jsx';
import ListSearch from '../ListSearch/ListSearch.jsx';
import styles from './Sidebar.module.css';

const LandingSidebar = ({ getWeather }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.locationSearchWrap}>
        <LocationSearch getWeather={getWeather} autoLoad={false} />
      </div>

      <div className={styles.listSearchWrap}>
        <ListSearch />
      </div>
    </aside>
  );
};

export default LandingSidebar;