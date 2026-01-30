import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListsContext } from '../../contexts/ListsContext.jsx';
import { UserContext } from '../../contexts/UserContext.jsx';
import styles from './Profile.module.css';

// --- Trail Cast brand gradient helpers (copied from Forecast.jsx) ---
const lerp = (a, b, t) => a + (b - a) * t;

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

const lerpHex = (aHex, bHex, t) => {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  return rgbToHex({
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  });
};

// Trail: #fb5f04 → #f0ce1a
// Cast:  #5fd6e3 → #1692df
const TRAIL_CAST_STOPS = ['#fb5f04', '#f0ce1a', '#5fd6e3', '#1692df'];

const sampleGradient = (stops, t) => {
  if (!stops?.length) return '#ffffff';
  if (stops.length === 1) return stops[0];

  const clamped = Math.max(0, Math.min(1, t));
  const n = stops.length - 1;
  const scaled = clamped * n;
  const i = Math.floor(scaled);
  const localT = scaled - i;

  const a = stops[i];
  const b = stops[Math.min(i + 1, n)];
  return lerpHex(a, b, localT);
};

const Profile = () => {
  const { user } = useContext(UserContext);
  const { lists, listsLoading, listsError, deleteList } = useContext(ListsContext);
  const [actionError, setActionError] = useState('');

  const name = user?.username || 'User';
  const possessive = name.toLowerCase().endsWith('s') ? `${name}'` : `${name}'s`;

  const handleDelete = async (list) => {
    setActionError('');
    const ok = window.confirm(`Delete "${list.name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteList(list._id);
    } catch (err) {
      setActionError(err?.message || 'Failed to delete list.');
    }
  };

  if (listsLoading) return <main className={styles.container}>Loading…</main>;
  if (listsError) return <main className={styles.container}>{listsError}</main>;

  return (
    <main className={styles.container}>
      <h2>{possessive} Profile</h2>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>My lists</h3>
          <Link to="/lists/new" state={{ seedUserLocation: true }} className={styles.newBtn}>
            + New list
          </Link>
        </div>

        {actionError ? <p className={styles.error}>{actionError}</p> : null}

        {!lists.length ? (
          <p>You haven’t saved any lists yet.</p>
        ) : (
          <ul className={styles.list}>
            {lists.map((l, idx) => {
              const t = lists.length <= 1 ? 0 : idx / (lists.length - 1);
              const hoverColor = sampleGradient(TRAIL_CAST_STOPS, t);

              return (
                <li key={l._id} className={styles.listItem}>
                  <Link
                    to={`/lists/${l._id}`}
                    className={styles.listLink}
                    style={{ '--hoverColor': hoverColor }}
                  >
                    <span className={styles.listTitle}>{l.name}</span>
                    {l.description ? <div className={styles.listDesc}>{l.description}</div> : null}
                  </Link>

                  <div className={styles.actions}>
                    <Link className={styles.editBtn} to={`/lists/${l._id}/edit`}>
                      Edit
                    </Link>
                    <button className={styles.deleteBtn} type="button" onClick={() => handleDelete(l)}>
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Profile;
