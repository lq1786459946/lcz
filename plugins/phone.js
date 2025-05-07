export async function prefix() {
	const data = [
		"+86",
		"+1",
		"+44",
		"+61",
		"+81",
		"+82",
		"+49",
		"+33",
		"+7",
		"+91",
		"+55",
		"+65",
		"+852",
		"+886",
		"+853",
		"+39",
		"+34",
		"+31",
		"+41",
	];
	return data;
}
export default defineNuxtPlugin(async nuxtApp => {
	const phonePrefix = await prefix();
	nuxtApp.provide("phonePrefix", phonePrefix);
});
