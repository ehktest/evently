// bu function'larin cogu chatgpt ile hazirlanmistir, bu tarz islemler icin chatgpt kullanilabilir.

import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
// Parse and stringify URL query strings
// yarn add query-string
// console.log(location.search);
// //=> '?foo=bar'

// const parsed = queryString.parse(location.search);
// console.log(parsed);
// //=> {foo: 'bar'}

// console.log(location.hash);
// //=> '#token=bada55cafe'

// const parsedHash = queryString.parse(location.hash);
// console.log(parsedHash);
// //=> {token: 'bada55cafe'}

// parsed.foo = 'unicorn';
// parsed.ilike = 'pizza';

// const stringified = queryString.stringify(parsed);
// //=> 'foo=unicorn&ilike=pizza'

// location.search = stringified;
// // note that `location.search` automatically prepends a question mark
// console.log(location.search);
// //=> '?foo=unicorn&ilike=pizza'
import qs from "query-string";

import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
// Intl namespace object'i, çeşitli constructor'larin yanı sıra internationalization constructor'lari ve diğer dile duyarli function'lari için ortak işlevsellik içerir. Toplu olarak, dile duyarlı string comparison, number formatting, date and time formatting ve daha fazlasını sağlayan ECMAScript Internationalization API'sini oluştururlar.

// const count = 26254.39;
// const date = new Date("2012-05-24");

// function log(locale) {
//   console.log(
//     `${new Intl.DateTimeFormat(locale).format(date)} ${new Intl.NumberFormat(
//       locale,
//     ).format(count)}`,
//   );
// }

// log("en-US"); // 5/24/2012 26,254.39

// log("de-DE"); // 24.5.2012 26.254,39

// TypeScript de Intl namespace object'i icin built-in type'lar icerir.
// https://microsoft.github.io/PowerBI-JavaScript/modules/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.intl.html

// https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.intl.datetimeformatoptions.html
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// URL.createObjectURL() static method'u, parametrede verilen object'i temsil eden bir URL içeren bir string oluşturur. URL'nin ömrü, oluşturulduğu window'daki document'a bağlıdır. Yeni object URL'si belirtilen File object'ini veya Blob object'ini temsil eder. Bir object URL'i serbest bırakmak için revokeObjectURL() öğesi cagirilir.

// URL.createObjectURL() tarafından oluşturulan URL'ler geçicidir. Sayfa yenilendiğinde veya document silindiğinde URL'ler geçersiz hale gelir.
// URL.createObjectURL()'yi kullanırken bellek sızıntılarını önlemek için URL.revokeObjectURL()'yi kullanarak oluşturulan URL'leri serbest bırakmanız önemlidir.

// Diyelim ki bir resim yükleme uygulaması geliştiriyoruz. Kullanıcı resim seçtikten sonra, önizleme görüntüsünü göstermek istiyoruz. Bunu yapmak için URL.createObjectURL()'yi kullanabiliriz:

// const file = document.querySelector('#file-input').files[0];
// const objectUrl = URL.createObjectURL(file);

// const img = document.querySelector('#preview-image');
// img.src = objectUrl;

// // Kullanıcı resim seçmeyi bitirdiğinde URL'yi serbest bırakın
// document.querySelector('#file-submit').addEventListener('click', () => {
//   URL.revokeObjectURL(objectUrl);
// });

// file değişkeni, kullanıcı tarafından seçilen dosyayı temsil eder.
// objectUrl değişkeni, file nesnesini temsil eden bir URL içerir.
// img öğesinin src özniteliği, objectUrl değerine ayarlanır.
// file-submit düğmesine tıklandığında, URL.revokeObjectURL() kullanılarak objectUrl serbest bırakılır.

// URL.revokeObjectURL()'yi yalnızca URL'ye ihtiyacınız kalmadığında kullanın.
// Birden fazla URL oluşturuyorsanız, her birini ayrı ayrı serbest bırakmanız gerekir.
// Bellek sızıntılarını önlemek için URL.revokeObjectURL()'yi kullanmak önemlidir. Bu, web uygulamanızın daha hızlı ve daha güvenilir çalışmasını sağlar.

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  console.log("🔭 ~ formUrlQuery ~ params ➡ ➡ ", params);
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;
  console.log("🔭 ~ formUrlQuery ~ currentUrl ➡ ➡ ", currentUrl);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  console.log("🔭 ~ removeKeysFromQuery ~ params ➡ ➡ ", params);
  const currentUrl = qs.parse(params);
  console.log("🔭 ~ removeKeysFromQuery ~ currentUrl ➡ ➡ ", currentUrl);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};
