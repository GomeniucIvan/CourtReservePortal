import * as t from "react";
import { IntlService as o } from "../Intl/IntlService.mjs";
import { LocalizationService as e } from "../Localization/LocalizationService.mjs";
const r = t.createContext({
  intl: new o("en"),
  localization: new e()
});
export {
  r as GlobalizationContext
};
