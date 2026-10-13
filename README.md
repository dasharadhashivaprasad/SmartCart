# SmartCart

SmartCart is a React Native CLI shopping demo built with TypeScript. It uses the DummyJSON catalog for real product data and stores the cart, wishlist, product cache, and simulated order history on the device.

## Requirements

- Node.js 22.11 or newer
- JDK 17 and Android Studio with Android SDK 37 / Build Tools 37
- Android emulator or USB debugging enabled on a device

## Install and run

From this directory:

```sh
npm install
npx react-native start
```

In a second terminal:

```sh
npx react-native run-android
```

To build an APK without launching an emulator:

```sh
cd android
./gradlew assembleDebug
```

On Windows, run .\gradlew.bat assembleDebug. The generated debug APK is under android/app/build/outputs/apk/debug/.

## Architecture and data flow

- src/api/productsApi.ts calls DummyJSON for product pages, category lists, searches, product details, and same-category recommendations.
- src/app/store.ts combines Redux Toolkit slices for products, cart, wishlist, and orders. src/app/hooks.ts exposes typed Redux hooks.
- src/navigation/ declares typed stack routes and the five bottom tabs.
- src/components/ contains the shared safe-area wrapper, product card, and product grid.
- src/theme.ts defines the shared colors and spacing values.

Home fetches 20 products at a time and requests the next page as the list approaches its end. Search waits 350 ms after typing, then calls the API. Category screens request products for the selected category. Product detail requests the full item and up to eight products from the same category, excluding itself.

## Cart, checkout, and local data

The cart slice owns product quantities. src/utils/cartCalculations.ts calculates the subtotal and a flat $5 delivery fee. The wishlist and orders have their own slices. After state restoration, src/services/storage.ts saves those collections and the most recently loaded product list to AsyncStorage. If storage fails, the app starts with empty local collections and remains usable.

Checkout validates the delivery form and creates a local order record. It does not collect or process payment details because DummyJSON has no persistent checkout service. Production payment and order fulfillment need a backend.

When the cart first becomes nonempty, Notifee schedules a local reminder one hour later. Clearing the cart or placing an order cancels it. The app requests notification permission when it schedules the reminder.

## API and offline behavior

The API base URL is https://dummyjson.com. The app uses /products, /products/categories, /products/category/{category}, /products/search, and /products/{id}. Product data from a successful home fetch is cached locally; the home screen can show the saved list after a restart if the network is unavailable. A retry gesture is available through pull-to-refresh.

## Tests

```sh
npm test -- --runInBand
```

Tests cover cart quantities and totals, query filtering and sorting helpers, debounce timing, similar-product exclusion, checkout validation, local persistence, order creation, and notification scheduling/cancellation. API calls and native notification/storage modules should be mocked when adding screen-level tests.

## Performance notes

Product collections use FlatList with stable product ID keys. Product cards are memoized, and the cart badge subscribes only to the cart count through Redux selection. Search waits for typing to pause and ignores responses from older search requests. Pagination is guarded by the current loading state.

No React DevTools Profiler capture or device measurement was produced in this environment. To record evidence, run the app on a representative Android device, open React DevTools Profiler, record a product-list scroll and a cart update, then note the device, build type, interaction, and observed commits. Do not treat the optimizations above as measured performance results.

## Native notification setup

Notifee is autolinked by React Native. Rebuild the Android app after installing it. On Android 13 and later, the app asks the user for notification permission at scheduling time. Scheduled reminders are local to the device and are not synced across devices.

## Known limitations

- Checkout and order history are local simulations; no account, payment, inventory reservation, or server order exists.
- The product catalog and images depend on network access unless the home catalog is already cached.
- Category names and images are supplied by DummyJSON.
- The Android build was attempted with Gradle 9.4.1, JDK 17, and Android SDK 37. It stopped while downloading Android Gradle Plugin and Kotlin dependencies because the host ran out of disk space. Retry .\gradlew.bat assembleDebug after freeing disk space.
- No Android device profiler capture is included. Follow the performance steps above to record it on a device.
