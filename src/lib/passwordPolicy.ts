/**
 * Password rules, stated in the UI before submission rather than only as a
 * server error. The server remains the authority — this is the usability layer.
 */

export const MIN_PASSWORD_LENGTH = 12;

/** A short list of the passwords most often tried first. */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "123456789012",
  "qwertyuiop12",
  "administrator",
  "letmein12345",
  "welcome12345",
  "grain12345678",
  "graintechnik1",
]);

export type PasswordRule = {
  id: string;
  /** i18n key describing the rule, shown as a checklist. */
  labelKey: string;
  test: (password: string, username?: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    labelKey: "password_rule_length",
    test: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: "letter",
    labelKey: "password_rule_letter",
    test: (password) => /[a-z]/i.test(password),
  },
  {
    id: "number",
    labelKey: "password_rule_number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "not-common",
    labelKey: "password_rule_not_common",
    test: (password) => !COMMON_PASSWORDS.has(password.toLowerCase()),
  },
  {
    id: "no-username",
    labelKey: "password_rule_no_username",
    test: (password, username) =>
      !username ||
      username.length < 3 ||
      !password.toLowerCase().includes(username.toLowerCase()),
  },
];

/** Rules the password does not yet satisfy. */
export function failedPasswordRules(
  password: string,
  username?: string
): PasswordRule[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password, username));
}

export function isPasswordAcceptable(
  password: string,
  username?: string
): boolean {
  return failedPasswordRules(password, username).length === 0;
}
