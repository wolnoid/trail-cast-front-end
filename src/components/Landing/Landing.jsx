import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Forecast from '../Forecast/Forecast.jsx';
import { useWeatherList } from '../../hooks/useWeatherList.js';
import LocationSearch from '../LocationSearch/LocationSearch.jsx';
import ListSearch from '../ListSearch/ListSearch.jsx';
import { SEED_LOCATIONS } from '../../constants/seedLocations.js';
import styles from './Landing.module.css';

const pickRandomUnique = (arr, n) => {
  const copy = [...arr];
  const picked = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return picked;
};

const Landing = () => {
  const { locations, setLocations, addLocation, addLocationsBatch } = useWeatherList({ limit: 5 });

  // Build the payload to seed CreateList
  const seedLocations = (locations || [])
    .filter((l) => l && (l.lon ?? l.longitude) != null && (l.lat ?? l.latitude) != null)
    .map((l) => ({
      name: l.name,
      lon: l.lon ?? l.longitude,
      lat: l.lat ?? l.latitude,
      forecast: l.forecast, // optional
      source: l.source ?? 'landing',
    }));

  const canMakeList = seedLocations.length > 0;

  const getWeather = useCallback(
    async (location) => {
      await addLocation(location, { insertAt: 'top' });
    },
    [addLocation]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const seeds = pickRandomUnique(SEED_LOCATIONS, 4);
        await addLocationsBatch(seeds, { insertAt: 'bottom' });
      } catch (e) {
        if (!cancelled) console.error('Landing seed load failed:', e);
      }
    })();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          try {
            await addLocation(
              {
                name: 'Your Location',
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              },
              { insertAt: 'top' }
            );
          } catch (e) {
            if (!cancelled) console.error('Landing geolocation forecast failed:', e);
          }
        },
        () => {}
      );
    }

    return () => {
      cancelled = true;
    };
  }, [addLocationsBatch, addLocation]);

  return (
    <main className={styles.container}>
      <section className={styles.gridArea}>
        <Forecast locations={locations} setLocations={setLocations} mode="newestTop" reorderable={true} limit={5} />
      </section>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarItem}>
          <LocationSearch getWeather={getWeather} autoLoad={false} />
        </div>

        <div className={`${styles.sidebarItem} ${styles.listSearchWrap}`}>
          <ListSearch />
        </div>

        <div className={styles.sidebarItem}>
          <Link
            to="/lists/new"
            state={{ seedLocations }}
            className={`${styles.makeListBtn} ${!canMakeList ? styles.makeListBtnDisabled : ''}`}
            aria-disabled={!canMakeList}
            onClick={(e) => {
              if (!canMakeList) e.preventDefault();
            }}
          >
            + Make List
          </Link>
        </div>
      </aside>
    </main>
  );
};

export default Landing;