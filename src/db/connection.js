
const DB_NAME = 'Storage';
const OBJECT_STORE_NAME = 'Pictures';


function openDatabasePromise( keyPath : string ) : Promise< IDBDatabase > {
  return new Promise(( resolve, reject ) => {
    const dbOpenRequest = window.indexedDB.open( DB_NAME, 1 );

    dbOpenRequest.onblocked = () => {
      reject("Что-то пошло не так.");
    };

    dbOpenRequest.onerror = err => {
      console.log( 'Unable to open indexedDB ' + DB_NAME );
      console.log( err );
      reject( 'Невозможно открыть базу данных.');
    };

    dbOpenRequest.onupgradeneeded = event => {
      const db = event.target.result;

      var objectStore = db.createObjectStore('Pictures', {keyPath:'id', autoIncrement: true});

            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("format", "format", { unique: false });
            objectStore.createIndex("height", "height", { unique: false });
            objectStore.createIndex("size", "size", { unique: false });
            objectStore.createIndex("type", "type", { unique: false });
            objectStore.createIndex("date", "date", { unique: false });
            objectStore.createIndex("desc", "desc", { unique: false });
            objectStore.createIndex("tags", "tags", { unique: false, multiEntry:true});
            objectStore.createIndex("value", "value", { unique: false });
            objectStore.createIndex("collection", "collection", { unique: false });
    };


    dbOpenRequest.onsuccess = () => {



      console.info( 'Successfully open indexedDB connection to ' + DB_NAME );
      resolve( dbOpenRequest.result );
    };

    dbOpenRequest.onerror = reject;
  } );
}

// Оборачиваем функции от ObjectStore, поддерживающие интерфейс IDBRequest
// в вызов с использованием Promise

function wrap( methodName ) {
  return function() {
    const [ objectStore, ...etc ] = arguments;
    return new Promise( ( resolve, reject ) => {


      const request = objectStore[ methodName ]( ...etc );

      request.onsuccess = () => resolve( request.result );
      request.onerror = reject;
    } );
  };
}

function wrapByID( methodName ) {
  return function() {
    const [ objectStore, index, ...etc ] = arguments;
    return new Promise( ( resolve, reject ) => {



      var myIndex = objectStore.index(index);
      const request =  myIndex[ methodName ]( ...etc );
      request.onsuccess = () => resolve( request.result );
      request.onerror = reject;
    } );
  };
}


const getByIDPromise = wrapByID( 'getAll' );

const deletePromise = wrap( 'delete' );
const getAllPromise = wrap( 'getAll' );
const getPromise = wrap( 'get' );
const putPromise = wrap( 'put' );

const countPromise = wrap( 'count' );

const clearPromise = wrap( 'clear' );

export default class IndexedDbRepository {

  dbConnection : ?IDBDatabase;
  error : ?any;
  openDatabasePromise : Promise< IDBDatabase >;

  constructor( keyPath : string ) {
    this.error = null;
    this.keyPath = keyPath;
    // конструктор нельзя объявить как async
    // поэтому вынесено в отдельную функцию
    this.openDatabasePromise = this._openDatabase( keyPath );
  }

  async _openDatabase( keyPath : string ) {
    try {
      this.dbConnection = await openDatabasePromise( keyPath );
    } catch ( error ) {
      this.error = error;
      throw error;
    }
  }

  async _tx( txMode : string, callback ) {
  await this.openDatabasePromise; // await db connection
  const transaction  = this.dbConnection.transaction( [ OBJECT_STORE_NAME ], txMode );
  const objectStore  = transaction.objectStore( OBJECT_STORE_NAME );
  return await callback( objectStore );
}


async save( item : any ) : Promise< any > {
  return this._tx( 'readwrite', objectStore => putPromise( objectStore, item ) );
}


async findById( key ) : Promise< any > {
    return this._tx( 'readonly', objectStore => getPromise( objectStore, key ) );
  }

  async findByIndex( index, key ) : Promise< any >
    {
      return this._tx( 'readonly', objectStore => getByIDPromise( objectStore, index, key ) );
    }


  async deleteById( key ) : Promise< any > {
    return this._tx( 'readwrite', objectStore => deletePromise( objectStore, key ) );
  }

async findAll() : Promise< any[] > {
   return this._tx( 'readonly', objectStore => getAllPromise( objectStore ) );
 }

 async countALL() : Promise< any[] > {
    return this._tx( 'readonly', objectStore => countPromise( objectStore ) );
  }

  async clear() : Promise< any[] > {
     return this._tx( 'readwrite', objectStore => clearPromise( objectStore ) );
   }

}
