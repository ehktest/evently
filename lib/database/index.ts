import mongoose from "mongoose";

const MONGODB_URI = process.env?.MONGODB_URI;

// Mongoose baglantisi cache'lenecek sekilde olusturulmaktadir cunku serverless function veya environment'lar tek bir surekli server islemiyle olmayacak sekilde kodu birden fazla kez calistirabilmektedir. Bu nedenle database connection'lari verimli bir sekilde yonetilmelidir. Cunku her serverless function cagrisinda database'e yeni bir baglanti olusturulabilir, bu da verimsiz olacaktir ve database kaynaklarini gereksiz yere tuketecektir. NextJS'te React server action'lari kullanilirken her server action'da connectToDatabase() cagrisi yapildigini dusundugumuzde eger cache'leme olmazsa pek cok kez database connection'i olusmus olacaktir. Bu da istenilen bir durum degildir ve bu nedenle database connection'i cache'lemeye ihtiyac duyulur.
// https://unicorn-utterances.com/posts/what-are-react-server-actions

// Global object'te(NodeJS) mongoose varsa bunu kullan yoksa belirtilen object'i kullan.
// Asagidaki algoritma yalnizca global'i kontrol edip mongoose key'i yoksa bir object atar cached'a ama global'e mongoose key'i eklemeyi handle etmez.
// let cached = (global as any).mongoose || { conn: null, promise: null };
// Bunun yerine asagidaki algoritma kullanilabilir. Bu algoritmada global.mongoose undefined ise cached ve global.mongoose belirtilen object'e esitlenmektedir.
// https://stackoverflow.com/questions/67607897/why-global-mongoose-for-caching-mongodb-connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  // mongoose.connect promise dondurur, catch ile chain'lenerek error handling yapilabilir.
  // https://mongoosejs.com/docs/connections.html#error-handling

  // https://mongoosejs.com/docs/connections.html#options
  // mongoose.connect(uri, options);
  // dbName - Hangi veritabanına bağlanılacağını belirtir ve connection string'te belirtilen herhangi bir veritabanını geçersiz kılar. Bazı mongodb+srv syntax connection'larinda olduğu gibi connection string'te varsayılan bir veritabanı belirleyemiyorsanız bu kullanışlıdır.
  // bufferCommands - Bu, Mongoose'un ara belleğe alma(buffering) mekanizmasını devre dışı bırakan, Mongoose'a özgü bir seçenektir (MongoDB sürücüsüne aktarılmaz)

  // https://mongoosejs.com/docs/faq.html#callback_never_executes
  // Mongoose, MongoDB'ye başarıyla bağlanana kadar tüm collection eylemleri (insert, remove, query vb.) sıraya alınır. Mesela save() callback'i calismiyorsa muhtemelen Mongoose'un connect() veya createConnection() işlevini henüz çağırilmadigindandir.
  // Mongoose 5.11'de, Mongoose'un bir işlemin error firlatmadan önce ne kadar süreyle arabellekte kalmasına(buffered) izin vereceğini yapılandıran bir bufferTimeoutMS option'i (varsayılan olarak 10000'e ayarlıdır) bulunmaktadır.
  // Uygulamanızın tamamında Mongoose'un ara belleğe alma(buffering) mekanizmasını devre dışı bırakmak istiyorsanız global bufferCommands seçeneğini false olarak ayarlayın: mongoose.set('bufferCommands', false);
  // Mongoose'un ara belleğe alma(buffering) mekanizmasını devre dışı bırakmak yerine, Mongoose'u yalnızca kısa bir süre için ara belleğe almak için bufferTimeoutMS'yi azaltmak isteyebilirsiniz.
  // If an operation is buffered for more than 500ms, throw an error.
  // mongoose.set('bufferTimeoutMS', 500);

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "evently",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

// Server actions
// connectToDatabase()...
