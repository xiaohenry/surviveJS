// Sets up a FinalStore, deals with bootstrapping (restore data) and snapshotting (save data).
import makeFinalStore from 'alt-utils/lib/makeFinalStore';

export default function(alt, storage, storeName) {
    const finalStore = makeFinalStore(alt);

    try {
        alt.bootstrap(storage.get(storeName)); // Use the data that we have saved.
    } catch(e) {
        console.error('Failed to bootstrap data', e);
    }

    finalStore.listen(() => {
        // Debug flag is an escape hatch. If it is set, the data won't get saved to localStorage.
        // The reasoning is that by doing this, you can set the flag (localStorage.setItem('debug', 'true')),
        // hit localStorage.clear() and refresh the browser to get a clean slate.
        // if the debug flag is set, do NOT take a snapshot
        if (!storage.get('debug')) {
            storage.set(storeName, alt.takeSnapshot());
        }
    });
}
