// Ensure a single global Symbol.observable is defined before Redux loads
import $$observable from 'symbol-observable'

if (typeof Symbol === 'function' && !Symbol.observable) {
  Symbol.observable = $$observable
}

