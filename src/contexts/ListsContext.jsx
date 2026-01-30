import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserContext } from './UserContext.jsx';
import * as listService from '../services/listService.js';

// Non-null default prevents "destructure of null" crashes even if Provider is missing
export const ListsContext = createContext({
  lists: [],
  listsLoading: false,
  listsError: '',
  refresh: async () => {},
  createList: async () => {
    throw new Error('ListsProvider is missing (wrap your app in <ListsProvider>).');
  },
  updateList: async () => {
    throw new Error('ListsProvider is missing (wrap your app in <ListsProvider>).');
  },
  deleteList: async () => {
    throw new Error('ListsProvider is missing (wrap your app in <ListsProvider>).');
  },
});

export function ListsProvider({ children }) {
  const { user } = useContext(UserContext);

  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [listsError, setListsError] = useState('');

  // Prevent duplicate concurrent loads
  const inflightRef = useRef(null);

  const loadLists = useCallback(
    async (force = false) => {
      if (!user) {
        setLists([]);
        setListsLoading(false);
        setListsError('');
        inflightRef.current = null;
        return;
      }

      if (inflightRef.current && !force) {
        await inflightRef.current;
        return;
      }

      const run = (async () => {
        try {
          setListsLoading(true);
          setListsError('');
          const data = await listService.getMyLists();
          setLists(Array.isArray(data) ? data : []);
        } catch (err) {
          setListsError(err?.message || 'Failed to load lists.');
          setLists([]);
        } finally {
          setListsLoading(false);
        }
      })();

      inflightRef.current = run;
      await run;
      inflightRef.current = null;
    },
    [user]
  );

  useEffect(() => {
    loadLists(false);
  }, [loadLists]);

  const refresh = useCallback(() => loadLists(true), [loadLists]);

  const createList = useCallback(
    async ({ name, description = '' }) => {
      if (!user) throw new Error('You must be signed in.');
      const created = await listService.createList({ name, description });
      setLists((prev) => [created, ...prev]);
      return created;
    },
    [user]
  );

  const updateList = useCallback(
    async (listId, { name, description }) => {
      if (!user) throw new Error('You must be signed in.');
      const updated = await listService.updateList(listId, { name, description });
      setLists((prev) => prev.map((l) => (l._id === listId ? updated : l)));
      return updated;
    },
    [user]
  );

  const deleteList = useCallback(
    async (listId) => {
      if (!user) throw new Error('You must be signed in.');
      await listService.deleteList(listId);
      setLists((prev) => prev.filter((l) => l._id !== listId));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      lists,
      listsLoading,
      listsError,
      refresh,
      createList,
      updateList,
      deleteList,
    }),
    [lists, listsLoading, listsError, refresh, createList, updateList, deleteList]
  );

  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}
