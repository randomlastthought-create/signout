// Sanitizes a username as the user types. Only strips characters outside
// [a-z0-9-] and leading hyphens — a trailing hyphen is left alone so it
// isn't yanked out from under the cursor the instant it's typed (which
// made it impossible to type a hyphen in the middle of a username).
export const sanitizeUsernameInput = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+/, "").slice(0, 20);

// Fully cleans a username for submission/preview: same as above but also
// drops a trailing hyphen, since "user creates a username" is done typing.
export const finalizeUsername = (v: string) =>
  sanitizeUsernameInput(v).replace(/-+$/, "");
