/**
 * 全局配置文件
 */
// export default {
//   oauth2:{
//     publicKey: "04105cc44bc6dec4dd1f7e55e8308dd35b66fefabc161b1b389d1d4f70e5f40c4529ba634133c9920191036b549d92f509f7ef6a31dfe7c91a5e1cb96bf824ef14",
//     privateKey:"04105cc44bc6dec4dd1f7e55e8308dd35b66fefabc161b1b389d1d4f70e5f40c4529ba634133c9920191036b549d92f509f7ef6a31dfe7c91a5e1cb96bf824ef14"
//   }

// }


export async function loadFonts() {
  const website = {
    oauth2:{
      publicKey: "04105cc44bc6dec4dd1f7e55e8308dd35b66fefabc161b1b389d1d4f70e5f40c4529ba634133c9920191036b549d92f509f7ef6a31dfe7c91a5e1cb96bf824ef14",
      privateKey:"04105cc44bc6dec4dd1f7e55e8308dd35b66fefabc161b1b389d1d4f70e5f40c4529ba634133c9920191036b549d92f509f7ef6a31dfe7c91a5e1cb96bf824ef14"
    }
  }
  return website;
}
export default defineNuxtPlugin(async (nuxtApp) => {
  const website = await loadFonts();
  nuxtApp.provide('website', website);
});
