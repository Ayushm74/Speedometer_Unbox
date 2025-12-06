/*
  Based on marklundin/react-localstorage-hoc
  Add `keys` parameters to store only desired keys, not whole state
*/

/*
  A higher order function that wraps a component with functionality
  that saves its state to local storage. This allows the component's state
  to persist across page reloads under the same domain.
*/

/*
  Check if localStorage is available (it may fail, e.g., iOS private mode)
*/
let hasLocalStorage = localStorage;

if (hasLocalStorage) {
  let testKey = 'react-localstorage.hoc.test-key';
  try {
    // Some environments throw errors when accessing localStorage
    localStorage.setItem(testKey, 'foo');
    localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorage = false; // disable if access fails
  }
}

/*
  The HOC function:
  Wraps the passed Component and syncs selected state keys to localStorage.
  `keys` = array of state fields to persist.
*/
let WrapWithLocalStorate = (Component, keys) => {

  // If no localStorage available, return original component untouched
  if (!hasLocalStorage) return Component;

  // Storage key equals component displayName
  let name = Component.displayName;

  class LocalStorageComponent extends Component {

    constructor() {
      super();
      // Save which keys should be stored
      this.keys = keys;
    }

    componentWillMount() {
      // Load from localStorage on initialization
      const ls = localStorage.getItem(name);
      if (ls) {
        // Merge stored state into component state
        this.setState(JSON.parse(ls));
      }
    }

    componentWillUpdate(nextProps, nextState) {
      // Save filtered state into localStorage before update
      localStorage.setItem(
        name,
        JSON.stringify(this._filterKeys(nextState))
      );
    }

    // Returns only the state keys specified in `keys` array
    _filterKeys(state) {
      let newState = {};
      if (this.keys) {
        let obj = {};
        // Include only selected keys
        this.keys.map(k => obj[k] = state[k]);
        newState = obj;
      } else {
        // If no key filtering provided, save entire state
        newState = state;
      }
      return newState;
    }

  }

  // Keep display name consistent
  LocalStorageComponent.displayName = name;

  return LocalStorageComponent;
};

export default WrapWithLocalStorate;
