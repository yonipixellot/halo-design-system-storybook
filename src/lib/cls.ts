/**
 * cls — verbatim port of the prototype's className helper.
 * Filters falsy values and joins the rest with spaces.
 */
export const cls = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(' ');
