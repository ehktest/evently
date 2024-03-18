// https://clerk.com/docs/integrations/webhooks/sync-data#create-the-endpoint-in-your-application
// (ilgili linkten Create the endpoint in your application > next.js > app router secilmeli)
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  // const headerPayload = headers();
  // const svix_id = headerPayload.get("svix-id");
  // const svix_timestamp = headerPayload.get("svix-timestamp");
  // const svix_signature = headerPayload.get("svix-signature");
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  // const body = JSON.stringify(payload);
  // İşleme `payload` ile devam edin, `JSON.stringify()` kullanmanıza gerek yok.

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    // evt = wh.verify(body, {
    //   "svix-id": svix_id,
    //   "svix-timestamp": svix_timestamp,
    //   "svix-signature": svix_signature,
    // }) as WebhookEvent;
    evt = wh.verify(payload, {
      // `payload` burada doğrudan geçirilmeli, stringify olmadan
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    // https://developer.mozilla.org/en-US/docs/Web/API/Response
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  // ? evt.data ile gelen authentication verisini mongodb'deki User collection'ina bir document olarak ekle
  // * eventType === "user.created" kontrolüyle, eğer gelen webhook olayı bir kullanıcının oluşturulmasıyla ilgiliyse, bu kullanıcının bilgileri (ID, e-posta adresleri, resim URL'si, isim, soyisim, kullanıcı adı) evt.data'dan çıkarılıp bir kullanıcı objesi oluşturuluyor ve bu kullanıcı objesi createUser fonksiyonuna argüman olarak veriliyor. createUser fonksiyonu bu bilgileri alıp MongoDB'ye bir kullanıcı dokümanı olarak ekliyor.

  // https://clerk.com/docs/integrations/webhooks/overview#supported-webhook-events
  // https://clerk.com/docs/integrations/webhooks/overview#user
  // https://clerk.com/docs/integrations/webhooks/overview#payload-structure
  // The data property contains the actual payload sent by Clerk. The payload can be a different object depending on the event type. For example, for user.* events, the payload will always be the User object . For organization.* event type, the payload will always be an organization (except for when it is deleted).
  // https://clerk.com/docs/integrations/webhooks/overview#type-script-support
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data; // data user event payload, type'i da Clerk built-in UserJSON interface'i ile tanimli, burada deconstruct edilen payload, interface degil. zaten typescript'te interface'ler deconsturct edilemez, pick ile secilip type'ta saklanir ve boyle atama yapilabilir veya omit ile belirli alanlar atilip type'ta saklanip boyle atama yapilabilir.
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys

    // https://clerk.com/docs/references/javascript/user/user
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    const newUser = await createUser(user); // createUser action'i yazilmalidir.

    // https://clerk.com/docs/users/metadata#public-metadata
    // Public metadata'ya hem frontend hem de backend tarafından erişilebilir. Bu, frontend'e göstermek istediğiniz ancak kullanıcının değiştirmesini istemediğiniz verileri depolamak için kullanışlıdır. Örneğin, bir kullanıcı için özel bir rol depolayabilirsiniz.
    // https://clerk.com/docs/users/metadata#private-metadata
    // Private metadata'ya ise yalnızca backend tarafından erişilebilir; bu, frontend'te gösterilmesini istemediğiniz hassas verileri depolamak için bunu kullanışlı kılar. Örneğin, bir kullanıcının Stripe müşteri kimliğini saklayabilirsiniz.
    // * await clerkClient.users.updateUserMetadata(id, {...}) ile, Clerk tarafından yönetilen kullanıcıya ait metadata güncellenir. Burada id, Clerk tarafından yönetilen kullanıcının benzersiz kimliğidir (const { id } = evt.data; satırında alınmıştı). Bu ID, webhook olayı ile gelen ve Clerk tarafından atanan kullanıcı ID'sidir.
    // * publicMetadata: { userId: newUser._id, } ile, MongoDB'de yeni oluşturulan kullanıcıya ait dokümanın _id değeri, Clerk kullanıcısının public metadata'sına userId anahtarı altında eklenir. Bu, frontend tarafından erişilebilir bir metadata olup, sistemdeki farklı bölümlerin kullanıcının MongoDB'deki benzersiz ID'sine (örneğin, kullanıcı işlemleri için) erişebilmesini sağlar.
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    // finally return a response with created mongodb document of User collection(newUser)
    return NextResponse.json({ success: true, user: newUser });
  }

  // ? same things for user.updated and user.deleted clerk webhook events
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
