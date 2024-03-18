import { authMiddleware } from "@clerk/nextjs";

// Clerk authMiddlewre Default behaviour
// If there is no afterAuth present in the middleware, then authMiddleware() will fall back to its default behavior:

// If the .env based settings for the sign-in and sign-up routes are present, add the sign-in and sign-up routes to any routes listed in publicRoutes.
// If the .env based settings are not present, add /sign-in and /sign-up to any routes listed in publicRoutes.
// Make all routes from publicRoutes public.
// Configure all routes from ignoredRoutes to be ignored and return no auth related information.
// Make all remaining routes protected.

// publicRoutes

// Amaç: Kullanıcı oturum açmamış olsa bile erişilmesi gereken rotaları belirtin.
// Davranış:
// Kullanıcı oturum açmamışsa, bu rotalar normal şekilde işlenir.
// Kullanıcı oturum açmışsa, authMiddleware kullanıcı bilgilerini (oturum bilgileri, profil verileri vb.) sağlayacaktır.
// Örnek Kullanım Durumları:

// Giriş/Kayıt sayfaları
// Genel pazarlama sayfaları
// Herkese açık içerik (ürün demoları, blog gönderileri gibi)
// ignoredRoutes

// Amaç: AuthMiddleware tarafından tamamen göz ardı edilecek rotaları belirtin.
// Davranış:
// Bu rotalar authMiddleware işleminden geçmez.
// Kullanıcılar oturum açmış olsalar bile authMiddleware hiçbir kullanıcı bilgisini sağlamaz.
// Örnek Kullanım Durumları:

// Webhook uç noktaları (Clerk ve Stripe tarafından tetiklenen webhook aramalarının doğru çalışmasını sağlamak için)
// Üçüncü taraf sağlayıcılar tarafından kullanılan uç noktalar.
// Herhangi bir kimlik doğrulaması gerektirmeyecek kadar önemsiz rotalar.

export default authMiddleware({
  // Routes that can be accessed while signed out
  // publicRoutes: ["/anyone-can-visit-this-route"],
  publicRoutes: [
    "/",
    "/events/:id",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  // ignoredRoutes: ["/no-auth-in-this-route"],
  // ignoredRoutes: [
  //   "/",
  //   "/api/webhook/clerk",
  //   "/api/webhook/stripe",
  //   "/api/uploadthing",
  // ],
});

// import { NextResponse } from "next/server";

// export function middleware(req) {
//   console.log("Middleware çalışıyor");
//   return NextResponse.next();
// }

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  // (?!.+\.\w+$|_next).* -> satir sonunda bir veya daha fazla herhangi bir karakter + . + bir veya daha fazla digit|lower/uppercase|underscore icermeyen. '.' dan sonra \w oldugu surece eslesme noktadan itibaren olur cunku satir sonundaki nXanyChar.nXwordChar icin en uzun eslesme .nXwordChar olur. veya baslangicta _next ile baslayip sonrasinda sinirsiz sayida herhangi bir karakter icermeyen. eslesme 'n' den itibaren olur cunku _next ile baslamamis olan en uzun patterni yakalar. Bu sekilde calismasinin nedeni greedy olmasidir, greedy olmazsa(js'de .*? ile, /U flag JS'de calismaz bunun yerine quantifier'larin sonuna ? koyulur) hic bir eslesme yaklamayacaktir.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"], // -> NextJS Path To Regexp
  // https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
  // matcher: [/\/(?!.+\.\w+$)|\/_next.*/, /\//, /\/(api|trpc).*/], // -> Regex karsiligi, NextJS buna izin vermez, yalnizca gosterim amaciyla yer verilmistir.
};

// NextJS Configured matchers:
// MUST start with /
// Can include named parameters: /about/:path matches /about/a and /about/b but not /about/a/c
// Can have modifiers on named parameters (starting with :): /about/:path* matches /about/a/b/c because * is zero or more. ? is zero or one and + one or more
// Can use regular expression enclosed in parenthesis: /about/(.*) is the same as /about/:path*

// NextJS matchers'ta Regex kullanmak icin () parantezler arasinda kullanim yapilmali ve capturing group kullanimi yapilmamalidir. Lookahead/lookbehind kullanilabilir bu karistirilmamalidir, cunku onlarin syntaxi capturing group gibidir ancak bunlar capture etmez, syntax’lari oyledir yalnizca. Lookahead syntax -> (?!...), (?=...) ve lookbehind syntax -> (?<!...), (?<=...).
