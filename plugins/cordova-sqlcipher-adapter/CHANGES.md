# Changes

## cordova-sqlcipher-adapter 0.1.8

- Android version with android-database-sqlcipher 3.5.4

### cordova-sqlite-storage 1.4.8

- selfTest function add string test and test of effects of location reload/change
- Support macOS ("osx" platform)
- Signal an error in case of SQL with too many parameter argument values on iOS (in addition to Android & Windows)
- Include proper SQL error code on Android (in certain cases)
- Fix reporting of SQL statement execution errors in Windows version
- Fix Windows version to report errors with a valid error code (0)
- Some doc fixes

### cordova-sqlite-storage 1.4.7

- Minor JavaScript fixes to pass @brodybits/Cordova-sql-test-app

### cordova-sqlite-storage 1.4.6

- Stop remaining transaction callback in case of an error with no error handler returning false
- Expand selfTest function to cover CRUD with unique record keys
- Fix readTransaction to reject ALTER, REINDEX, and REPLACE operations
- Fix Windows 10 ARM Release Build of SQLite3 by disabling SDL check (ARM Release only)
- Fix Windows 8.1/Windows Phone 8.1 Release Build of SQLite3 by disabling SDL check
- Some documentation fixes

### cordova-sqlite-storage 1.4.5

- Log/error message fixes; remove extra qid from internal JSON interface

### cordova-sqlite-storage 1.4.4

- Fix readTransaction to reject modification statements with extra semicolon(s) in the beginning
- Announce new Cordova-sqlite-evcore-extbuild-free version
- Additional tests
- Other doc fixes

### cordova-sqlite-storage 1.4.3

- Handle executeSql with object sql value (solves another possible crash on iOS)

### cordova-sqlite-storage 1.4.2

- Fix sqlitePlugin.openDatabase and sqlitePlugin.deleteDatabase to check location/iosDatabaseLocation values
- Fix sqlitePlugin.deleteDatabase to check that db name is really a string (prevents possible crash on iOS)
- Fix iOS version to use DLog macro to remove extra logging from release build
- Fix Lawnchair adapter to use new mandatory "location" parameter
- Remove special handling of Blob parameters, use toString for all non-value parameter objects
- Minor cleanup of Android version code

### cordova-sqlite-storage 1.4.1

- Minimum Cordova version no longer enforced in this version

### cordova-sqlite-storage 1.4.0

- Now using cordova-sqlite-storage-dependencies for SQLite 3.8.10.2 Android/iOS/Windows
- Android-sqlite-connector implementation supported by this version again
- Enforce minimum cordova-windows version (should be OK in Cordova 6.x)
- Support Windows 10 along with Windows 8.1/Windows Phone 8.1

### cordova-sqlite-storage 1.2.2

- Self-test function to verify ability to open/populate/read/delete a test database
- Read BLOB as Base-64 DISABLED in Android version (was already disabled for iOS)

## cordova-sqlcipher-adapter 0.1.7

- Fix Windows build
- SQLCipher prerelease fix to use append mode for cipher_profile
- SQLCipher for Android updates

## cordova-sqlcipher-adapter 0.1.6

- SQLCipher for Android with API 23 fixes from: https://github.com/litehelpers/android-database-sqlcipher-api-fix
- ICU-Unicode string manipulation no longer supported for Android
- REGEXP disabled for iOS
- Minimum Cordova version no longer enforced

## cordova-sqlcipher-adapter 0.1.5

- SQLCipher 3.4.0 with FTS5 (all platforms) and JSON1 (Android/iOS)
- Support Windows 10 UWP build along with Windows 8.1/Windows Phone 8.1 (WAL/MMAP disabled for Windows Phone 8.1)
- Renamed SQLiteProxy.js to sqlite-proxy.js in Windows version

### cordova-sqlite-storage 1.2.1

- Close Android SQLiteStatement after INSERT/UPDATE/DELETE
- Specify minimum Cordova version 6.0.0
- Lawnchair adapter fix: Changed remove method to work with key array

### x.x.x-common-dev

- Fix PCH issue with Debug Win32 UWP (Windows 10) build

### cordova-sqlite-storage 1.2.0

- Rename Lawnchair adapter to prevent clash with standard webkit-sqlite adapter
- Support location: 'default' setting in openDatabase & deleteDatabase

### cordova-sqlite-storage 0.8.5

- More explicit iosDatabaseLocation option
- iOS database location is now mandatory
- Split-up of some more spec test scripts

### cordova-sqlite-storage 0.8.2

- Split spec/www/spec/legacy.js into db-open-close-delete-test.js & tx-extended.js

### cordova-sqlite-storage 0.8.0

- Simple sql batch transaction function
- Echo test function
- Remove extra runInBackground: step from iOS version
- Java source of Android version now using io.sqlc package

### cordova-sqlite-storage 0.7.15-pre

- All iOS operations are now using background processing (reported to resolve intermittent problems with cordova-ios@4.0.1)

### cordova-sqlite-storage 0.7.13

- REGEXP support partially removed from this version branch
- Rename Windows C++ Database close function to closedb to resolve conflict for Windows Store certification
- Android version with sqlite `3.8.10.2` embedded (with error messages fixed)
- Pre-populated database support removed from this version branch
- Amazon Fire-OS support removed
- Fix conversion warnings in iOS version

### cordova-sqlite-storage 0.7.12

- Fix to Windows "Universal" version to support big integers
- Implement database close and delete operations for Windows "Universal"
- Fix readTransaction to skip BEGIN/COMMIT/ROLLBACK

### cordova-sqlite-storage 0.7.11

- Fix plugin ID in plugin.xml to match npm package ID
- Unpacked sqlite-native-driver.so libraries from jar
- Fix conversion of INTEGER type (iOS version)
- Disable code to read BLOB as Base-64 (iOS version) due to https://issues.apache.org/jira/browse/CB-9638

## cordova-sqlcipher-adapter 0.1.4-rc

- Workaround fix for empty readTransaction issue

## cordova-sqlcipher-adapter 0.1.4-pre

- Implement database close and delete operations for Windows "Universal"
- Fix conversion warnings in iOS version

### cordova-sqlite-storage 0.7.12

- Fix to Windows "Universal" version to support big integers
- Fix readTransaction to skip BEGIN/COMMIT/ROLLBACK

## cordova-sqlcipher-adapter 0.1.3-pre

- Update to SQLCipher v3.3.1 (all platforms)
- Check that the database name is a string, and throw exception otherwise

### cordova-sqlite-storage 0.7.11

- Fix conversion of INTEGER type (iOS version)

### cordova-sqlite-storage 0.7.8

- Build ARM target of Windows "Universal" version with Function Level Linking ref: http://www.monkey-x.com/Community/posts.php?topic=7739

## cordova-sqlcipher-adapter 0.1.2

- Update Android and iOS versions to use SQLCipher v3.3.0
- Windows Universal (8.1) including both Windows and Windows Phone 8.1 now supported
- insertId and rowsAffected longer missing for Windows (Universal) 8.1
- iOS and Windows Universal versions built with a close match to the sqlite4java sqlite compiler flags-for example: FTS3/FTS4 and R-TREE

## cordova-sqlcipher-adapter 0.1.1

- Abort initially pending transactions for db handle if db cannot be opened (due to incorrect password key, for example)
- Proper handling of transactions that may be requested before the database open operation is completed
- Report an error upon attempt to close a database handle object multiple times.
- Resolve issue with INSERT OR IGNORE (Android)
